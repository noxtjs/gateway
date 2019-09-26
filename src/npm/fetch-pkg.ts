import zlib from 'zlib'
import { promisify } from 'util'

import fetch from 'node-fetch'
import JSZip from 'jszip'
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
        const { name } = headers
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

const extractZip = async (buf: ArrayBuffer) => {
  const tasks: Promise<{ buf: Buffer; name: string }>[] = []
  const zip = new JSZip()
  await zip.loadAsync(buf)
  zip.forEach((relPath, file) => {
    tasks.push(
      new Promise((resolve, reject) => {
        let buf = new Buffer('')
        const st = file.nodeStream()
        st.on('data', (data: any) => (buf = Buffer.concat(data)))
        st.on('error', err => reject(err))
        st.on('end', () => resolve({ buf, name: relPath }))
      }),
    )
  })
  return Promise.all(tasks)
}

export const fetchPkg = async (name: string, version?: string) => {
  const url = `https://registry.yarnpkg.com/${name}`
  const json = await fetch(url).then(res => res.json())

  let caches: { [props: string]: { info: any; data: any } } = {}

  if (!version) {
    const { latest } = json['dist-tags']
    version = latest
  }

  const info = json.versions[version!]
  if (info.dependencies) {
    await Promise.all(
      Object.keys(info.dependencies).map(async name => {
        caches = {
          ...caches,
          ...(await fetchPkg(name, info.dependencies[name])),
        }
      }),
    )
  }

  const tarball = await fetch(info.dist.tarball).then(res => res.body)
  const data = await extractTar(tarball)
  caches[name] = { info, data }

  return caches
}
