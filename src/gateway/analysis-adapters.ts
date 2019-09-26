import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import babel, { traverse, transformAsync } from '@babel/core'
import { NodePath } from '@babel/traverse'

import { Manifest } from './manifest'
import { getNodePath, getNodePathArray } from '../utils'
import { viewAst } from './babel/utils'

const readFile = promisify(fs.readFile)

const gatewayPath = 'id.typeAnnotation.typeAnnotation.typeName.name'
const typeParamsPath = 'id.typeAnnotation.typeAnnotation.typeParameters.params'

export const analysisAdapters = async (filename: string) => {
  const manifests: Manifest[] = []
  const codeImplementation = await readFile(filename, {
    encoding: 'utf-8',
  }).catch<Error | null>(err => (err.code === 'EISDIR' ? null : err))

  if (codeImplementation === null) {
    return []
  }
  if (codeImplementation instanceof Error) {
    throw codeImplementation
  }

  const res = await transformAsync(codeImplementation, {
    ast: true,
    parserOpts: { plugins: ['typescript', 'jsx'] },
    babelrc: false,
  }).catch(e => null)
  if (!res) {
    return
  }

  const { ast } = res

  const importSources: { [props: string]: string } = {}

  // viewAst(ast!)
  traverse(ast!, {
    ImportDeclaration: (nodePath: NodePath) => {
      const source = (nodePath.get('source.value') as any).node
      const specs = nodePath.get('specifiers') as any[]
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

      const outputPort: string = (typeParams[0].get('typeName') as any).node
        .name
      const inputPorts: Manifest['inputPorts'] = {}

      if (typeParams.length >= 2) {
        const ip = typeParams[1].get('members') as NodePath[]
        ip.forEach(member => {
          const key = (member.get('key.name') as any).node
          inputPorts[key] = (member.get(
            'typeAnnotation.typeAnnotation.typeName.name',
          ) as any).node
        })
      }

      manifests.push({
        inputPorts,
        outputPort,
        codeImplementation,
        codePortsInterface: '',
      })

      // const outputPort = tp.node
      // const name = nodePath.get('id.name') as NodePath

      // const otuputPotrs =
    },
  })
  await Promise.all(
    manifests.map(async manifest => {
      const fn = importSources[manifest.outputPort]
      const portInterfacePath = path.resolve(
        path.dirname(filename),
        path.dirname(fn),
        path.basename(fn),
      )
      manifest.codePortsInterface = await readFile(
        require.resolve(portInterfacePath),
        {
          encoding: 'utf-8',
        },
      )
    }),
  )

  return manifests
}
