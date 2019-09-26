import babel from '@babel/core'
import { Node, NodePath } from '@babel/traverse'

export const viewAst = (ast: babel.types.File | Node) => {
  const replacer = (key: string, value: any) => {
    if (['loc', 'start', 'end'].includes(key)) {
      return undefined
    } else {
      return value
    }
  }
  console.log(JSON.stringify(ast, replacer, '  '))
}

export const getNodePath = (
  nodePath: NodePath,
  path: string,
): NodePath<any> | null => {
  try {
    const res = nodePath.get(path)
    if (!Array.isArray(res)) {
      return res
    }
  } catch (e) {
    return null
  }
  throw new Error(`NodePath.get ${path} result is Array`)
}

export const getNodePathArray = (
  nodePath: NodePath,
  path: string,
): NodePath<any>[] => {
  try {
    const res = nodePath.get(path)
    if (Array.isArray(res)) {
      return res
    }
  } catch (e) {
    return []
  }
  throw new Error(`NodePath.get ${path} result is not Array`)
}
