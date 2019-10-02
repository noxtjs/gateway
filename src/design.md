zero install や zero package.json を目指したい

```sh
$ gateway test .
$ gateway register .
$ gateway archive .
$ gateway exec hoge.ts
```

## gateway test

指定したディレクトリにあるテストファイルをjestでテストする

## gateway register

指定したディレクトリにあるportsやGatewayFactoryを manifests.json に登録

## geteway archive

指定したディレクトリにあるあれこれをarchiveに登録

（削除とかは別途自前で行う）

## gateway init

最低限のファイルだけ用意

## gateway watch

----

## zero install

まだまだ不完全とは思うがzero installの仕組みはできた。

ただし、package.jsonが既にあるなら（あるいはオプションによって）、zero install しないようにするべきか



----

## 型定義をだます方法

package.json その他がない状態で、VSCodeをだますことは出来るか？
問題は型定義。あとは動作時にhackでなんとかする。

### tsconfig.json

```json {filename="tsconfig.json"}
"compilerOptions": {
  "typeRoots" : ["./.gateway", "~/.gateway/"]
}
```

* 従来のやつをどうするか？ `["./node_modules/@types", "../node_modules/@types" ...]`

### node_modules...

* node_modules/@types/xxxx

----

* 「ゼロセットアップ or ワンストップセットアップ」で作った環境で実験
  - うまくいったらそれをregisterする
  - ダメなら戦いの歴史として archived にもっていきたい
* 何かしら本格的に作りたい時に
  - 既にあるports/adaptersを利用する
  - 良さそうなports/adaptersができあがったら register する
  - プロジェクトディレクトリ内でそれをいい感じにやっていきたい

* buildを少しサボれる
  - babelやbundlerを別途入れる必要はない
  - jest を別途入れる必要はない
  - それらの設定は不要
