// @ts-ignore
import { GatewayFactory } from 'gateway'

import { FilesPort } from '../files/ports'
import { FileTodoPort } from './ports'

const createFileTodos: GatewayFactory<
  FileTodoPort,
  { files: FilesPort },
  { filename: string }
> = (ports, { filename }) => {
  const find: FileTodoPort['find'] = async searchPattern => {
    const lines: string[] = (await ports.files.read(filename)).split('\n')
    return lines.filter(line => line.includes(searchPattern))
  }
  return { find }
}

export default createFileTodos
