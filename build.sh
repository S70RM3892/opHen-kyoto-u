#!/bin/sh
# index.html（独立したHTMLドキュメント）から Artifact 用のフラグメントを切り出す。
# Artifact は doctype/html/head/body を自前のスケルトンで包むため、その区間だけを渡す。
#
#   ./build.sh          → dist/artifact.html を生成
#   公開:  Artifact ツールに dist/artifact.html を渡し、url で既存の artifact を更新する。
set -e
cd "$(dirname "$0")"
mkdir -p dist
sed -n '/ARTIFACT:START/,/ARTIFACT:END/p' index.html | sed '1d;$d' > dist/artifact.html
echo "dist/artifact.html  ($(wc -l < dist/artifact.html) 行)"
