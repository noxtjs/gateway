import path from 'path'

import { fetchPkg } from './fetch-pkg'
import { hackLoader, builtinModules, Module } from '../require-hack'

const exec = async () => {
  const pkgs = await fetchPkg('uuidv4')
  const pkgnames = Object.keys(pkgs)
  console.log(Object.keys(pkgs['uuid'].data))

  const requireStack: string[] = []

  hackLoader((name, parent, isMain) => {
    let [modname, modpath] = name.split('/', 2)
    console.log('load', name, modname, modpath)
    if (builtinModules.includes(modname)) {
      return
    }

    if (requireStack.length === 0) {
      if (name.startsWith('.') || name.startsWith('/')) {
        return
      }
    }

    if (name.startsWith('.') || name.startsWith('/')) {
      console.log('prev', requireStack[requireStack.length - 1])
      ;[modname, modpath] = requireStack[requireStack.length - 1].split('/', 2)
      modpath = path.join(path.dirname(modpath), name)
    }

    console.log('  hack:', modname, modpath)
    requireStack.push(`${modname}/${modpath}`)

    let filename: string = `package/${pkgs[modname].info.main}`
    if (modpath) {
      filename = `package/${modpath}`
    }

    const exts = ['.js', '.json', '.node']
    if (!exts.find(ext => filename.endsWith(ext))) {
      const files = Object.keys(pkgs[modname].data).filter(n =>
        exts.find(
          ext =>
            n === `${filename}${ext}` ||
            exts.find(ext => n === `${filename}/index${ext}`),
        ),
      )
      console.log(files)
      filename = files[0]
    }

    const code = pkgs[modname].data[filename].toString()
    const module = new Module()
    module.parent = parent
    const res = module._compile(code, filename)
    requireStack.pop()
    console.log('R', requireStack.length)
    return res || null
  })

  require('uuidv4')

  // Object.keys(pkgs).map(name => {
  //   console.log(name)
  //   const { data } = pkgs[name]
  //   Object.keys(data).forEach(filename => {
  //     console.log(filename, data[filename].length)
  //   })
  // })
}

exec()
