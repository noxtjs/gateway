import path from 'path'

import glob from 'glob'

import { analysisAdapters } from './analysis-adapters'

export const createManifest = async (adaptersDir: string) => {
  const files = glob.sync(`${adaptersDir}/**/*`)
  const manifests = (await Promise.all(
    files
      .map(filename => path.resolve(filename))
      .map(filename => analysisAdapters(filename)),
  ))
    .flat()
    .filter(m => !!m)

  return manifests
}
