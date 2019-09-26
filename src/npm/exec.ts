import path from 'path'

import { fetchPkg } from './fetch-pkg'
import { hackLoader, builtinModules, Module } from '../module-hack'

const resolveRelative = (requireStack: [string, string][], name: string) => {
  const prev = requireStack[requireStack.length - 1]
  console.log('prev', prev)
  return [prev[0], path.join(path.dirname(prev[1]), name)]
}

const resolveFile = (pkg: any, modpath: string) => {
  let name = modpath || pkg.info.main

  const exts = ['.js', '.json', '.node']

  if (exts.find(ext => name.endsWith(ext))) {
    return name
  }

  const files = Object.keys(pkg.data).filter(n =>
    exts.find(ext => n === `${name}${ext}` || n === `${name}/index${ext}`),
  )
  console.log(files)
  if (files.length > 0) {
    return files[0]
  }

  console.log('------------------------')
  console.log(modpath)
  console.log(Object.keys(pkg.data))
  console.log('------------------------')
  throw new Error(`not found ${modpath}`)
}

export const hackZeroinstall = (pkgs: any) => {
  const requireStack: [string, string][] = []

  hackLoader((name, parent, isMain) => {
    let [modname, modpath] = name.split('/', 2)
    if (builtinModules.includes(modname)) {
      return
    }

    const isRelative = name.startsWith('.') || name.startsWith('/')
    if (requireStack.length === 0 && isRelative) {
      return
    }

    if (isRelative) {
      ;[modname, modpath] = resolveRelative(requireStack, name)
    }

    console.log('load hack:', name, modname, modpath)

    const filename = resolveFile(pkgs[modname], modpath)

    requireStack.push([modname, filename])
    console.log('PUSH', [modname, filename])

    const code = pkgs[modname].data[filename].toString()
    const module = new Module()
    module._compile(code, filename)
    requireStack.pop()
    console.log('R', requireStack.length, name, module.exports)
    return module.exports || null
  })
}

const exec = async () => {
  const pkgs = await fetchPkg('uuidv4')

  hackZeroinstall(pkgs)

  const uuidv4 = require('uuidv4').default
  console.log(uuidv4())
}

exec()
