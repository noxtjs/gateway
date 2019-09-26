import path from 'path'

import globby from 'globby'

import { analysisAdapters } from './analysis-adapters'

export const createManifest = async (dir: string) => {
  const files = await globby([`${dir}/**/*`, '!node_modules'])
  const manifests = (await Promise.all(
    files
      .map(filename => path.resolve(filename))
      .map(filename => analysisAdapters(filename)),
  ))
    .flat()
    .filter(m => !!m)

  return manifests
}
