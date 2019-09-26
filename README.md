# noxt/gateway

ports and adpters パターンを、TypeScriptでメタプロを駆使して、特殊な設定無く自動で実現する仕組みです（日本語になってない）。

あとでREADMEも、ソースも真面目に書き直す。

```sh
$ yarn
$ yarn build
$ bin/gateway exec examples/app/index.ts
```

examples以下のTypeScriptのコードをあさって、Portで終わるインターフェース定義と、GatewayFactory型の関数をスキャンして、GatewayFactory型の関数を実行します。

GatewayFactory型のgenericsの第1の型は自分の定義型で、第2の型は要求するPortで、第3の型は、自分が要求する設定項目です。

```ts
export interface FileTodoPort {
  find: (searchPattern: string) => Promise<string[]>
}
```

`FileTodoPort`は、`FileTodo`を定義するポート（ports and adapters デザインパターンのports）です。

ポートは抽象的な型定義であり、よそのモジュールから唯一アクセスして良いものです。

```ts
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
```

`createFileTodos`関数は、`FileTodoPort`の実装を返すファクトリーメソッドです。

このファクトリーメソッドが実行される時点で、`ports.files`には、`FilePort`のオブジェクトが入った状態で呼び出されます。また、`filename` は、実行時にポートごとの設定が渡されます。

ここまでの説明で分かったかもしれませんが、これを`FilePort`およびそのファクトリメソッドに対しても行います。

現時点ではまだコンセプトコード段階なので、色々と不完全ですが、クリーンアーキテクチャのうち、ports and adapters デザインパターンを、最小限のコードで実現する為のライブラリが、`@noxt/gateway` というモジュールになる予定です。
