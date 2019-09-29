import zlib from 'zlib'

import fetch from 'node-fetch'
import tar from 'tar-stream'

const extractTar = (tarball: NodeJS.ReadableStream) => {
  return new Promise((resolve, reject) => {
    const files: { [props: string]: string } = {}
    const gunzip = zlib.createGunzip({})
    tarball
      .pipe(gunzip)
      .on('error', err => reject(err))
      .pipe(tar.extract())
      .on('error', err => reject(err))
      .on('finish', () => resolve(files))
      .on('entry', (headers, stream, next) => {
        let { name } = headers
        name = name.replace(/^package\//, '')
        if (!(name in files)) {
          files[name] = ''
        }
        stream.on('data', data => {
          files[name] += data.toString()
        })
        stream.on('error', err => reject(err))
        stream.on('end', () => next())
      })
  })
}

export const fetchPkg = async (name: string, version?: string) => {
  const url = `https://registry.yarnpkg.com/${name}`
  const json = await fetch(url).then(res => res.json())

  let pkgs: { [props: string]: { info: any; data: any } } = {}

  if (!version) {
    const { latest } = json['dist-tags']
    version = latest
  }

  const info = json.versions[version!]
  if (info.dependencies) {
    await Promise.all(
      Object.keys(info.dependencies).map(async name => {
        pkgs = {
          ...pkgs,
          ...(await fetchPkg(name, info.dependencies[name])),
        }
      }),
    )
  }

  const tarball = await fetch(info.dist.tarball).then(res => res.body)
  const data = await extractTar(tarball)
  pkgs[name] = { info, data }

  return pkgs
}
