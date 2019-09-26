import path from 'path'

import { bootstrap } from './gateway/bootstrap'
import { hackExt, hackLoader, originalExts } from './module-hack'
import { transpile } from './transpile'

export const execWithGateway = async (entrypoint: string, basePath: string) => {
  hackLoader(name => {
    if (name === '@noxt/gateway') {
      return {
        bootstrap: (name: string, conf: any) => {
          return bootstrap(name, basePath, conf)
        },
      }
    }
  })

  hackExt('.ts', (m, filename) => {
    const _compile = m._compile
    m._compile = function(code: string) {
      m._compile = _compile
      return m._compile(transpile(code, filename), filename)
    }
    originalExts['.js'](m, filename)
  })

  hackExt('.tsx', (m, filename) => {
    const _compile = m._compile
    m._compile = function(code: string) {
      m._compile = _compile
      return m._compile(transpile(code, filename), filename)
    }
    originalExts['.js'](m, filename)
  })

  require(path.resolve(entrypoint))
}
