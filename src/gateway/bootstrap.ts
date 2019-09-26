import { loadModule } from './load-module'
import { Manifest } from './manifest'
import { createManifest } from './create-manifest'

export const bootstrap = async (name: string, conf: any = {}) => {
  const manifests = await createManifest('./examples')

  return await loadModule(name, conf, manifests)
}
