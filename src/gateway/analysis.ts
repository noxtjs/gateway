import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import { traverse, transformAsync } from '@babel/core'
import { NodePath } from '@babel/traverse'

import { Manifest } from './manifest'
import { getNodePath, getNodePathArray } from './babel/utils'
import { builtinModules } from '../module-hack'

const readFile = promisify(fs.readFile)

const gatewayPath = 'id.typeAnnotation.typeAnnotation.typeName.name'
const typeParamsPath = 'id.typeAnnotation.typeAnnotation.typeParameters.params'

export const analysis = async (filename: string) => {
  const manifests: Manifest[] = []
  const impl = await readFile(filename, {
    encoding: 'utf-8',
  }).catch<Error | null>(err => (err.code === 'EISDIR' ? null : err))

  if (impl === null) {
    return []
  }
  if (impl instanceof Error) {
    throw impl
  }

  const res = await transformAsync(impl, {
    ast: true,
    parserOpts: { plugins: ['typescript', 'jsx'] },
    babelrc: false,
  }).catch(e => null)
  if (!res || !res.ast) {
    return
  }

  const { ast } = res

  const importSources: { [props: string]: string } = {}
  const importPackages: string[] = []

  const rePackage = /^(@[^/]+\/)?([^/]+)$/
  traverse(ast, {
    ImportDeclaration: (nodePath: NodePath) => {
      const sourceNodePath = getNodePath(nodePath, 'source.value')
      if (!sourceNodePath) {
        return
      }
      const source = sourceNodePath.node

      const matched = rePackage.exec(source)
      if (
        matched &&
        source !== '@noxt/gateway' &&
        !builtinModules.includes(source)
      ) {
        importPackages.push(source)
      }
      const specs = getNodePathArray(nodePath, 'specifiers')
      specs.forEach((spec: any) => {
        importSources[spec.get('local.name').node] = source
      })
    },
    VariableDeclarator: (nodePath: NodePath) => {
      // viewAst(nodePath.node)
      const gt = getNodePath(nodePath, gatewayPath)
      if (!gt || gt.node !== 'GatewayFactory') {
        return
      }
      const typeParams = getNodePathArray(nodePath, typeParamsPath)

      const name = getNodePath(typeParams[0], 'typeName')!.node.name
      const requirePorts: Manifest['requirePorts'] = {}

      if (typeParams.length >= 2) {
        const ip = getNodePathArray(typeParams[1], 'members')
        ip.forEach(member => {
          const key = (member.get('key.name') as any).node
          requirePorts[key] = (member.get(
            'typeAnnotation.typeAnnotation.typeName.name',
          ) as any).node
        })
      }

      manifests.push({
        requirePorts,
        name,
        impl,
        portsDef: '',
        importPackages,
      })
    },
  })
  await Promise.all(
    manifests.map(async manifest => {
      const fn = importSources[manifest.name]
      const portInterfacePath = path.resolve(
        path.dirname(filename),
        path.dirname(fn),
        path.basename(fn),
      )
      manifest.portsDef = await readFile(require.resolve(portInterfacePath), {
        encoding: 'utf-8',
      })
    }),
  )

  return manifests
}
