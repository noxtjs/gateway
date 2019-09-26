//@ts-ignore
import { bootstrap } from '@noxt/gateway'
import { FileTodoPort } from '../file-todos/ports'

const run = async () => {
  const { find } = await bootstrap<FileTodoPort>('FileTodoPort', {
    FileTodoPort: {
      filename: 'examples/todo.md',
    },
  })
  console.log(find)
  try {
    console.log(1)
    const res = await find(['hoge'])
    console.log(2)
    console.log(res)
  } catch (e) {
    console.log(e)
  }
}

run()
