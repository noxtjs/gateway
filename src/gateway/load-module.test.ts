import { loadModule } from './load-module'
import { Manifest } from './manifest'

const filesImpl = `
export default () => ({read: (filename) => '* [ ] ' + filename})
`

const fileManifest: Manifest = {
  inputPorts: {},
  outputPort: 'FilesPort',
  codeImplementation: filesImpl,
  codePortsInterface: '',
}

const fileTodoImpl = `
const createFileTodos = (ports, { filename }) => {
  const find = async searchPatterns => {
    console.log(ports)
    const results = ports.FilesPort.read(filename)
    console.log(results)
    return results
  }
  return { find }
}

export default createFileTodos
`

const fileTodoManifest: Manifest = {
  inputPorts: { files: 'FilesPort' },
  outputPort: 'FileTodoPort',
  codeImplementation: fileTodoImpl,
  codePortsInterface: '',
}

test('', async () => {
  const manifests: Manifest[] = [fileManifest, fileTodoManifest]

  const result = await loadModule(
    'FileTodoPort',
    { config: { FileTodoPort: { filename: 'hoge.md' } } },
    manifests,
  )
  expect(await result.find()).toEqual('* [ ] hoge.md')
})
