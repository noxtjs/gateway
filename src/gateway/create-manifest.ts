import path from 'path'

import globby from 'globby'

import { analysis } from './analysis'

export const createManifest = async (dir: string) => {
  const files = await globby([`${dir}/**/*`, '!node_modules'])
  const manifests = (await Promise.all(
    files
      .map(filename => path.resolve(filename))
      .map(filename => analysis(filename)),
  ))
    .flat()
    .filter(m => !!m)

  return manifests
}
