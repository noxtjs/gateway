import { compile } from '../transpile'

import { Manifest } from './manifest'

const cache: { [props: string]: any } = {}

export const loadModule = async <T = any>(
  name: string,
  confs: any,
  manifests: Manifest[],
) => {
  console.log('loadModule', name, confs)
  const manifest = manifests.find(m => m.outputPort === name)
  if (!manifest) {
    throw new Error(`not found ${name} Module`)
  }

  const ports: { [props: string]: any } = {}
  Promise.all(
    Object.keys(manifest.inputPorts).map(async key => {
      const n = manifest.inputPorts[key]
      if (!(n in cache)) {
        cache[n] = await loadModule(n, confs, manifests)
      }
      ports[key] = cache[n]
    }),
  )

  console.log('createModule', manifest.outputPort)
  try {
    const module = compile(
      manifest.codeImplementation as string,
      `${manifest.outputPort}.ts`,
    )
    const factory = 'default' in module ? module.default : module

    const conf = name in confs ? confs[name] : {}
    const res: T = await factory(ports, conf)
    return res
  } catch (e) {
    console.log('------')
    console.error(e)
    console.log('------')
  }
}
