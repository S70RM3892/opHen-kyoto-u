# 京大理系 合格可能性シミュレータ

2027年度 第1回 京大入試オープン（河合塾）の素点から、京大理系19募集単位それぞれの
配点に当てはめて得点率・判定・第1段階選抜の位置・科目別の伸ばしどころを出す
単一ファイルのWebアプリ。ライブラリ依存なし、外部リクエストはGoogle Fontsのみ。

## 動かす

ブラウザで `index.html` を開けばそれだけで動く。ビルドもサーバも要らない。

ローカルでPWA（ホーム画面追加・オフライン）まで含めて確認するときは、
Service Worker が secure context を要求するので http で配信する：

```sh
python3 -m http.server 8765   # → http://127.0.0.1:8765/
```

## ファイル

| ファイル | 役割 |
|---|---|
| `index.html` | ページ本体。CSS/JSインラインの独立したHTMLドキュメント |
| `sw.js` | オフラインキャッシュ。ページはネットワーク優先、フォント等はキャッシュ優先 |
| `manifest.webmanifest` / `icon*.svg` | ホーム画面に追加したときの名前とアイコン |
| `build.sh` | `index.html` から Artifact 用フラグメント `dist/artifact.html` を切り出す |
| `.github/workflows/pages.yml` | GitHub Pages へのデプロイ |

## 公開

`.github/workflows/pages.yml` が push のたびに検査してデプロイする。
リポジトリ側で一度だけ **Settings → Pages → Source を「GitHub Actions」** に
設定する必要がある（APIからは設定できない）。

## Artifact 版との関係

`index.html` が唯一の原本。Artifact は doctype/head/body を自前のスケルトンで
包むので、`<!-- ARTIFACT:START -->` 〜 `<!-- ARTIFACT:END -->` の区間だけを
`./build.sh` で切り出して `dist/artifact.html` として公開する。

## 配点の出典

配点は[令和9年度 京都大学 入学者選抜要項](https://www.kyoto-u.ac.jp/sites/default/files/inline-files/senbatsuyokoR9_all-22d87b752c22c5b9d7bcb8ef94505625.pdf)の
学部別配点表・第1段階選抜の配点等と1対1で照合済み（9学部すべて配点合計が一致）。

判定の基準点は河合塾「2027年度第1回京大入試オープン 合格学力評価基準」。
合格可能性のパーセンテージは公表値がなく、A=80 / B=65 / C=50 / D=35% を
基準点に当てはめた推定値。
