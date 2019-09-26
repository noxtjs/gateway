import babel from '@babel/core'
import { Node } from '@babel/traverse'

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
