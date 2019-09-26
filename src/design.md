zero install や zero package.json を目指したい

```sh
$ gateway test .
$ gateway register .
$ gateway exec hoge.ts
```

## gateway test

指定したディレクトリにあるテストファイルをjestでテストする

## gateway register

指定したディレクトリにあるportsやGatewayFactoryを manifests.json に登録

## gateway init

最低限のファイルだけ用意

----

package.json その他がない状態で、VSCodeをだますことは出来るか？

* tsconfig.jsonでいけそうな気がするんだけど…？

* .vscode/ とか jsconfig.jsonとかがあればなんとかなる？？？
* node_modules/ に最低限のものだけいれておく

1. 普通に package.json と node_modules を用意する
2. .vscode/ とか jsconfig.json を用意してごまかす
3. そういうのなしでVSCode をだます

jsconfig.json でパッケージエイリアスは張れる

もっかい、やりたい事を考え直す

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

## ゼロセットアップとかの方向性

Module hackはできるから、module を require したら、オンメモリなりキャッシュなり、
あるいは他なり、何かしらをアプリに渡すことはできるので、ゼロセットアップは多分可能
