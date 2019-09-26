import { loadModule } from './load-module'
import { createManifest } from './create-manifest'

export const bootstrap = async <T>(
  moduleName: string,
  basepath: string,
  conf: any = {},
): Promise<T> => {
  const manifests = await createManifest(basepath)

  return loadModule<T>(moduleName, conf, manifests)
}
