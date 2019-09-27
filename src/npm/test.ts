import { fetchPkg } from './fetch-pkg'

import { hackZeroinstall } from './zero-install'

const exec = async () => {
  const pkgs = await fetchPkg('uuidv4')

  hackZeroinstall(pkgs)

  const uuidv4 = require('uuidv4').default
  console.log(uuidv4())
}

exec()
