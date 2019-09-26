import fs from 'fs'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)

//@ts-ignore
import { GatewayFactory } from '@noxt/gateway'

import { FilesPort } from './ports'

const createFiles: GatewayFactory<FilesPort> = () => {
  const read: FilesPort['read'] = async (filename: string) => {
    return readFile(filename, { encoding: 'utf-8' })
  }
  return { read }
}

export default createFiles
