# noxt/gateway

あるディレクトリ以下にあるTypeScriptで書かれたソースコードをスキャンして、
低コストで依存性注入を行うライブラリです。

ports and adapters デザインパターンを支援するのが目的です。

正確には特定のルールで書かれたファクトリメソッドを探し出して、
必要なデータを初期化してからファクトリメソッドを実行し、その結果をアプリに引き渡すものです。

ポート（ports）は外部に見せるインターフェース定義（API）です。
このライブラリでは TypeScript で書かれた抽象的な型 `interface` か `type` になります。

アダプタ（adapters） はポートの仕様を満たす実装で、変換アダプタのような仕組みを提供します。

## 使いかた

```sh
$ yarn
$ yarn build
$ bin/gateway exec --dir examples examples/app/index.ts
```

`--dir`オプションで指定したディレクトリか、カレント以下（ただしnode_modulesは無視する）にある
TypeScript のソースコードをスキャンして、GatewayFactory 型の関数定義とジェネリクスの型指定をもとに、
必要な初期データを与えてファクトリメソッドを実行します。

### ファクトリメソッドの定義

GatewayFactoryのジェネリクス第1の型は自分の定義型（ポート）で、
第2の型は自分が実行するときに必要となる別のポートで、
第3の型は、自分が要求する設定項目です。

必須となる型は、第1の型のみです。

```ts
import { GatewayFactory } from '@noxt/gateway'

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

このソースならば、自分の定義型は `FileTodoPort` で、要求するポートは `FilesPort` です。
必要とする設定項目は`{ filename: string }`です。

このファクトリを実行する時点で、`FilesPort` のファクトリを実行したものと、
`filename` の設定データが渡されてきます。

```ts
export interface FileTodoPort {
  find: (searchPattern: string) => Promise<string[]>
}
```

ポートは抽象的な型定義であり、よそのモジュールから唯一アクセスして良いものです。

ここまでの説明で分かったかもしれませんが、これを `FilePort` およびそのファクトリメソッドに対しても行います。

### ルールについて

`GatewayFactory`型のファクトリメソッドを定義することと、ポート定義を分離することだけがルールです。
あとは勝手にディレクトリをスキャンして、必要なポートに応じて、ライブラリがファクトリメソッドを実行します。

不要なファクトリメソッドは実行されません。

## モチベーション

例えばファイルシステムをアクセスするモジュールを作る場合、
定義のためのポートと、実際にファイルシステムにアクセスするアダプタを実装します。

このときモジュールのAPIであるポートのみが公開されるべきです。
そのために、ポートとアダプタは明確に切り離されます。

ビジネスロジックと、詳細（ファイルシステムやデータベースやWeb APIやウェブGUIなど）を切り離すことができるようになります。

### DIP

ただし、モジュールを使うソフトはポート定義のみを参照したいのですが、
実際にはアダプタの実装を何かしらの方法で読み込む必要があり、
いわゆる依存性の逆転（DIP）をしないと実現できません。

そこでこのライブラリ（@noxt/gateway）がアダプタのファクトリメソッドを実行することで、
アプリケーション（ビジネスロジック）は、詳細な実装に触れる（汚染される）ことなく
実際のアダプタのオブジェクトを取得できます。

