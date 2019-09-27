import path from 'path'

import { bootstrap } from '@noxt/gateway'

import { FileTodoPort } from '../file-todos/ports'

const run = async () => {
  const { find } = await bootstrap<FileTodoPort>(
    'FileTodoPort',
    path.join(__dirname, '..'),
    {
      FileTodoPort: {
        filename: 'examples/todo.md',
      },
    },
  )
  const res = await find('hoge')
  console.log(res)
}

run()
