import { compile } from '../transpile'

import { Manifest } from './manifest'
import { fetchPkg } from '../npm/fetch-pkg'
import { hackZeroinstall } from '../npm/zero-install'

const cache: { [props: string]: any } = {}

const preparePackages = async (importPackages: string[]) => {
  const pkgs: {
    [props: string]: {
      info: any
      data: any
    }
  } = {}
  if (importPackages.length === 0) {
    return
  }
  await Promise.all(
    importPackages.map(async pkgName => {
      const res = await fetchPkg(pkgName)
      console.log(2, Object.keys(res))
      Object.keys(res).forEach(key => (pkgs[key] = res[key]))
    }),
  )
  hackZeroinstall(pkgs)
}

export const loadModule = async <T = any>(
  name: string,
  confs: any,
  manifests: Manifest[],
) => {
  console.log('loadModule', name, confs)
  const manifest = manifests.find(m => m.name === name)
  if (!manifest) {
    throw new Error(`not found ${name} Module`)
  }

  const ports: { [props: string]: any } = {}
  Promise.all(
    Object.keys(manifest.requirePorts).map(async key => {
      const n = manifest.requirePorts[key]
      if (!(n in cache)) {
        cache[n] = await loadModule(n, confs, manifests)
      }
      ports[key] = cache[n]
    }),
  )

  console.log('createModule', manifest.name)

  await preparePackages(manifest.importPackages)

  try {
    const module = compile(manifest.impl as string, `${manifest.name}.ts`)
    const factory = 'default' in module ? module.default : module

    const conf = name in confs ? confs[name] : {}
    const res: T = await factory(ports, conf)
    return res
  } catch (e) {
    console.log('------')
    console.error(e)
    console.log('------')
    throw e
  }
}
