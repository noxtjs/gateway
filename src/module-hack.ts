export const Module = require('module') as any

export const originalLoad = Module._load

export const originalExts: { [props: string]: any } = {}
Object.keys(Module._extensions).forEach(
  ext => (originalExts[ext] = Module._extensions[ext]),
)

type Hook = (m: any, filename: string) => any
export const hackExt = (ext: string, hook: Hook) => {
  Module._extensions[ext] = function(m: any, filename: string) {
    return hook(m, filename)
  }
}

export const builtinModules: string[] = Module.builtinModules

type Loader = (name: string, parent: any, isMain: boolean) => any

const loaders: Loader[] = []
export const hackLoader = (loader: Loader) => {
  loaders.push(loader)
  Module._load = function(name: string, parent: any, isMain: boolean) {
    for (const l of loaders) {
      const res = l(name, parent, isMain)
      if (res !== undefined) {
        return res
      }
    }
    return originalLoad(name, parent, isMain)
  }
}
