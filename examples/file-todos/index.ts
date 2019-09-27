import { GatewayFactory } from '@noxt/gateway'

// import uuidv4 from 'uuidv4'

import { FilesPort } from '../files/ports'
import { FileTodoPort } from './ports'

const createFileTodos: GatewayFactory<
  FileTodoPort,
  { files: FilesPort },
  { filename: string }
> = (ports, { filename }) => {
  const find: FileTodoPort['find'] = async searchPattern => {
    const lines = (await ports.files.read(filename)).split('\n')
    return lines.filter(line => line.includes(searchPattern))
    // .map(line => `${line} ${uuidv4()}`)
  }
  return { find }
}

export default createFileTodos
