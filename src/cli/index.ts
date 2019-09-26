import arg from 'arg'

import { execWithGateway } from '../exec'

const usage = () => {
  const messages = [
    'Usage: gateway <subcommand> [...options]',
    '',
    'sub commands:',
    '  exec:',
    '  serve:',
  ]

  process.stderr.write(messages.join('\n'))
  process.stderr.write('\n')
  process.exit(1)
}

const exec = async () => {
  const entrypoint = process.argv[3]
  console.log('exec', entrypoint)
  execWithGateway(entrypoint)
}

const subcommands: { [props: string]: Function } = {
  exec,
}

export const cli = () => {
  if (process.argv.length < 3) {
    usage()
  }

  const subcommand = process.argv[2]
  if (subcommand in subcommands) {
    subcommands[subcommand]()
  } else {
    usage()
  }
}
