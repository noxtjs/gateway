import path from 'path'

import { fetchPkg } from './fetch-pkg'
import { hackLoader, builtinModules, Module } from '../module-hack'
import { compile } from '../transpile'

const exec = async () => {
  const pkgs = await fetchPkg('uuidv4')

  const requireStack: [string, string][] = []

  hackLoader((name, parent, isMain) => {
    let [modname, modpath] = name.split('/', 2)
    if (builtinModules.includes(modname)) {
      return
    }

    console.log('load', name, modname, modpath)

    const isRelative = name.startsWith('.') || name.startsWith('/')
    if (requireStack.length === 0) {
      if (isRelative) {
        return
      }
    }

    if (isRelative) {
      const prev = requireStack[requireStack.length - 1]
      console.log('prev', prev)
      modname = prev[0]
      modpath = path.join(path.dirname(prev[1]), name)
    }

    console.log('  hack:', modname, modpath)

    let filename: string = pkgs[modname].info.main
    if (modpath) {
      filename = modpath
    }

    const exts = ['.js', '.json', '.node']
    if (!exts.find(ext => filename.endsWith(ext))) {
      const files = Object.keys(pkgs[modname].data).filter(n =>
        exts.find(
          ext => n === `${filename}${ext}` || n === `${filename}/index${ext}`,
        ),
      )
      console.log(files)
      filename = files[0]
    }

    if (!filename) {
      console.log('------------------------')
      console.log(modpath)
      console.log(Object.keys(pkgs[modname].data))
      console.log('------------------------')
    }
    requireStack.push([modname, filename])
    console.log('PUSH', [modname, filename])

    const code = pkgs[modname].data[filename].toString()
    const module = new Module()
    module._compile(code, filename)
    requireStack.pop()
    console.log('R', requireStack.length, name, module.exports)
    return module.exports || null
  })

  const uuidv4 = require('uuidv4').default
  console.log(uuidv4())

  // Object.keys(pkgs).map(name => {
  //   console.log(name)
  //   const { data } = pkgs[name]
  //   Object.keys(data).forEach(filename => {
  //     console.log(filename, data[filename].length)
  //   })
  // })
}

exec()
