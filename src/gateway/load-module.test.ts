import { loadModule } from './load-module'
import { Manifest } from './manifest'

const filesImpl = `
export default () => ({read: (filename) => '* [ ] ' + filename})
`

const fileManifest: Manifest = {
  requirePorts: {},
  name: 'FilesPort',
  impl: filesImpl,
  portsDef: '',
}

const fileTodoImpl = `
const createFileTodos = (ports, { filename }) => {
  const find = async searchPatterns => {
    return ports.files.read(filename)
  }
  return { find }
}

export default createFileTodos
`

const fileTodoManifest: Manifest = {
  requirePorts: { files: 'FilesPort' },
  name: 'FileTodoPort',
  impl: fileTodoImpl,
  portsDef: '',
}

test('loadModule', async () => {
  const manifests: Manifest[] = [fileManifest, fileTodoManifest]

  const result = await loadModule(
    'FileTodoPort',
    { FileTodoPort: { filename: 'hoge.md' } },
    manifests,
  )
  expect(await result.find()).toEqual('* [ ] hoge.md')
})
