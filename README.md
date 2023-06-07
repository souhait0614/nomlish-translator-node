# nomlish-translator-node

文字列を[ノムリッシュ翻訳](https://racing-lagoon.info/nomu/translate.php)します。
Webスクレイピングしているためブラウザ上では動作しません。

<a href="/LICENSE" target="_blank">
  <img
    src="https://img.shields.io/github/license/souhait0614/nomlish-translator-node"
    alt="license"
  >
</a>
<a href="https://www.npmjs.com/package/nomlish-translator-node" target="_blank">
  <img src="https://img.shields.io/npm/v/nomlish-translator-node" alt="npm">
</a>
<a href="https://packagephobia.com/result?p=nomlish-translator-node" target="_blank">
  <img
    src="https://packagephobia.com/badge?p=nomlish-translator-node"
    alt="install size"
  >
</a>

## Features

- TypeScript製
- HTML(XML)パーサー不使用
- Translatorクラスでの複数回翻訳の最適化
- Token失効時などのエラー時に自動でリトライ

## Requirement

- Node.js (>=14.21.3, 18以上推奨)

## Example

### Single translation

```typescript
import { translate } from "nomlish-translator-node"

const input = "文字列をノムリッシュ翻訳します。"
const output = await translate(input)
console.log(output) // "聖刻文字《ヒエログリフ》戦列をノムリッシュ翻訳し…すなわち、闇へと葬られた真実なのです。"
```

### Multiple translations

一回の実行で複数回の翻訳を実行する場合、`Translator`を使用すると2回目以降の翻訳を高速化できます。

```typescript
import { Translator } from "nomlish-translator-node"

const translator = new Translator()

const input = "文字列をノムリッシュ翻訳します。"
const output1 = await translator.translate(input)
console.log(output1) // "聖刻文字《ヒエログリフ》戦列をノムリッシュ翻訳し…すなわち、闇へと葬られた真実なのです。"
const output2 = await translator.translate(input1)
console.log(output2) // "聖ヒストリアクロスモジュラ《ヒエログリフ》戦列をヴェノム公用語翻訳し…アナザーに歴史を乗っ取られたんだ…この世界はアイツに支配されるな…すなわち、闇へと葬られ、世界は混乱と慟哭の渦に叩き込まれた真実なのです。"
```

### Types

```typescript
interface Parameter {
  level?: 1 | 2 | 3 | 4
  options?: "nochk" | "p0chk" | "p100chk"
}

Translator(defaultParameter?: Parameter)

Translator.translate(input: string, param?: Parameter): Promise<string>

translate(input: string, param?: Parameter): Promise<string>
```
