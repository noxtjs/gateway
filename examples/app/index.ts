// @ts-ignore
import { bootstrap } from 'gateway'

const run = async () => {
  const { find } = await bootstrap('FileTodoPort', {
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
