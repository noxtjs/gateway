import vm from 'vm'
import path from 'path'

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
  const context = vm.createContext({
    Buffer,
    __dirname: path.dirname(path.resolve(filename)),
    __filename: path.basename(path.resolve(filename)),
    clearImmediate,
    clearInterval,
    clearTimeout,
    console,
    exports: {},
    global,
    module,
    process,
    queueMicrotask,
    require,
    setImmediate,
    setInterval,
    setTimeout,
    TextDecoder,
    TextEncoder,
    URL,
    URLSearchParams,
    WebAssembly,
  })
  const res = vm.runInNewContext(transpile(code, filename), context, {
    displayErrors: true,
    timeout: undefined,
    lineOffset: 0,
    filename,
  })

  return res
}
