import vm from 'vm'

import { transformSync, TransformOptions } from '@babel/core'

export const transpile = (code: string, filename: string) => {
  const opts: TransformOptions = {
    filename,
    presets: [
      [require.resolve('@babel/preset-env'), { targets: { node: 'current' } }],
      require.resolve('@babel/preset-typescript'),
    ],
    sourceType: 'module',
  }
  const res = transformSync(code, opts) || { code: '' }
  return res.code || ''
}

export const compile = (code: string, filename: string) => {
  const context = vm.createContext({ ...global, require, console, exports: {} })
  const res = vm.runInNewContext(transpile(code, filename), context, {
    displayErrors: true,
    timeout: undefined,
    lineOffset: 0,
    filename,
  })

  return res
}
