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

`.github/workflows/pages.yml` は3つのジョブに分かれている。

- `check` — ページが壊れていないかを見る本来のゲート。push でも PR でも回る。
- `pages_status` — Pages が有効かどうかだけを調べる。
- `deploy` — GitHub Pages への公開。`pages_status` が有効と答えたときだけ走る。

判定を `deploy` の中ではなく手前のジョブに置いてあるのは、
`environment: github-pages` を宣言したジョブは走った時点でデプロイ記録を
作ってしまうため。中のステップを全部スキップしても「デプロイ済み・Active」と
して残り、実際には何も公開されていないのに公開済みに見える。

リポジトリ側で一度だけ **Settings → Pages → Source を「GitHub Actions」** に
設定する必要がある。Pages サイトの新規作成は admin 権限を要求する操作で、
ワークフローの `GITHUB_TOKEN` では `Resource not accessible by integration`
になるため自動化できない（`configure-pages` の `enablement: true` も同様）。

設定が済むまでの間、`deploy` はエラーではなく警告を出して自分を飛ばすので、
CI は緑のまま。設定を入れれば次の push からそのまま公開が始まる。

## Artifact 版との関係

`index.html` が唯一の原本。Artifact は doctype/head/body を自前のスケルトンで
包むので、`<!-- ARTIFACT:START -->` 〜 `<!-- ARTIFACT:END -->` の区間だけを
`./build.sh` で切り出して `dist/artifact.html` として公開する。

## 配点の出典

配点は[令和9年度 京都大学 入学者選抜要項](https://www.kyoto-u.ac.jp/sites/default/files/inline-files/senbatsuyokoR9_all-22d87b752c22c5b9d7bcb8ef94505625.pdf)の
学部別配点表・第1段階選抜の配点等と1対1で照合済み（9学部すべて配点合計が一致）。

判定の基準点と学科内順位は河合塾「2027年度第1回京大入試オープン
合格学力評価基準」「志望別得点順位表」「志望別成績表」から取り込んだ実測値。

- A/B/C基準点: 19募集単位 × 3区分（共テ／二次／総合）＝171点。
  すべて `基準点 ÷ 配点 = 得点率` を満たすことを検算済み。
- 得点→順位の対応表: 19募集単位 × 3区分 × 2母集団（第1志望／総志望）＝114表。
  先頭順位=1・得点降順・順位の狭義単調増加を全表で検査済み。
  36進差分で圧縮して埋め込んである。

合格可能性のパーセンテージだけは公表値がなく、A=80 / B=65 / C=50 / D=35% を
基準点に当てはめた推定値。順位は実測なのでこちらのほうが信用できる。
