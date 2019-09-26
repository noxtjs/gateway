manifest的なのを生成

* ルールに沿ってディレクトリを読み込む＆AST読み込み
* JSONか何かにためておく

ports
* ディレクトリにあるファイル全部のASTを読み込んで HogePorts を全部チェック
  - HogePorts 定義のあるファイルの一覧を作成しておく or
  - HogePorts 定義に必要なヤツを全部 bundle した AST を保存

implements
* GetewayFactoryをimplしてるファイルを全部探す
  - implする対象 Port が明らかになる
  - 利用する Port が明らかになる
  - 利用する config が明らかになる

```ts
GatewayFactory<FileTodoPort, { files: FilesPort }, { filename: string }>
```

```ts
type Bootsrap<S> = (configs: any) => S
```

bootstrapで、指定したPortを満たす実装を取得する。その時に使用するconfigの集合体だけ渡す。

bootstrapなり他でソースコードを自由に加工できる立場だから、型定義だろうが何だろうが好き勝手に使えてしまうのでは？？？

zero installどころか zero pacakge.json も可能では？？？まぁ node_modules/ 以下に最低限のファイルは欲しいけど

----

ports で必要なこと、VSCodeから見える位置に定義ファイルが存在しなければいけない

* 書く時は別にどういう書き方 -> 登録の仕方でもかまわない

impl で必要なこと、JSONなり実ファイルなりで、どこかに、Manifest が生成されれば良い
* 書く時は何かしら
* 使う時は、Manifest を読み込んだ上で、bootstrap するだけの話
* 使う時、ports が VSCode から見える位置に定義ファイルがあれば良い

つまり、使う時に、ports をどこに展開するのが最良か？

import {HogePorts} from '~/noxt-gateway/HogePorts'

いったんそれでやってみる？

```sh
$ gateway test .
$ gateway register .
$ gateway exec hoge.ts
```
## gateway test

指定したディレクトリにあるテストファイルをjestでテストする

## gateway register

指定したディレクトリにある Ports と GatewayFactory を manifests.json に登録

## gateway init

最低限のファイルだけ用意

----

package.json その他がない状態で、VSCodeをだますことは出来るか？

* .vscode/ とか jsconfig.jsonとかがあればなんとかなる？？？
* remtote 専用にしてしまう
* node_modules/ に最低限のものだけいれておく

dev-navi 方式も…


1. 普通に package.json と node_modules を用意する
2. .vscode/ とか jsconfig.json を用意してごまかす
3. そういうのなしでVSCode をだます




jsconfig.json でパッケージエイリアスは張れる

もっかい、やりたい事を考え直す

* 「ゼロセットアップ or ワンストップセットアップ」で作った環境で実験
  - うまくいったらそれをregisterする
  - ダメなら戦いの歴史として archived にもっていきたい
* noxtとかのように、何かしら本格的に作りたい時に
  - 既にあるports/adaptersを利用する
  - 良さそうなports/adaptersができあがったら register する
  - プロジェクトディレクトリ内でそれをいい感じにやっていきたい

* buildは少しサボれる
  - babelやbundlerを別途入れる必要はない
  - jest を別途入れる必要はない
  - それらの設定は不要

## ゼロセットアップとかの方向性

## 最低限のファイルを用意する

* 最低限の node_modules/ を用意する
  - ports をそちらから読み込める
