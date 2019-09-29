const Module = require('module')

const originalLoad = Module._load

Module._load = function(name, parent, isMain) {
  if (name === 'hoge') {
    return { hoge: () => console.log('hoge') }
  }
  return originalLoad(name, parent, isMain)
}

const { hoge } = require('hoge')
hoge()
