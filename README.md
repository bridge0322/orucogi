# オルコギ（OruCogi） — じぶん専用トラッカー

楽天証券のオルカン（全世界株式インデックス）評価額・元本を手入力または CSV／スクショ OCR で記録する、自分専用のローカル投資トラッカーです。コーギーが積立金額に応じて育ち、暴落時には「ごはんイベント」で追加つみたてを楽しく後押しします。

`orucogi.html`（単一HTMLで完結するReact/Babelプロトタイプ）の挙動・見た目をそのまま、Vite + React + TypeScript の保守しやすい構成に移管したものです。

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで表示された localhost の URL を開いてください。

## ビルド

```bash
npm run build
```

`dist/` に静的ファイルが出力されます。`npm run preview` でビルド結果を確認できます。

## データについて

- データはこの端末のブラウザの **localStorage にのみ保存**されます（キー: `orucogi_personal_v1`）。
- サーバーへの送信・ログイン・アナリティクスは一切ありません。
- ブラウザのデータを消去するとリセットされます。

## 免責

※ 投資にはリスクがあります。元本は保証されません。

本アプリは特定の証券会社・ファンドの公式アプリではありません。「オルカン」は全世界株式インデックス（eMAXIS Slim 全世界株式など）を指す一般的な俗称として記載しているのみです。

---

# 食い倒れ選手権 〜やるかやられるか〜（`kuidaore.html`）

同じリポジトリに同梱している、独立した単一ファイルの React Web アプリ（`kuidaore.html`）です。オルコギ本体とは別物で、依存もビルドも不要です。

料理の写真を撮る（またはアップロードする）と、Anthropic の Claude（vision）が量とカロリーを推定し、オリジナルキャラ「ドン太郎」が関西弁で採点。1日の累計摂取カロリーが **5000kcal** に到達すると「食い倒れ認定」演出（紙吹雪＋認定証）が発火します。鰻（×1.5）・カレー（×1.3）・鰻カレー（×1.8）で特別加算。ドン太郎のリアクションは 100 パターン。

## 使い方

1. `kuidaore.html` をブラウザで直接開く（`file://` でも可・完全オフラインで動作）。
2. 右上の ⚙️ から Anthropic の API キー（`sk-ant-...`）を入力（初回のみ）。
3. 太鼓ボタンから料理写真を撮影 or アップロードすると採点開始。

`kuidaore.html` は React / ReactDOM をインライン内蔵した**完全自己完結の単一ファイル**です。外部 CDN もビルドも不要で、そのまま開けば動きます（採点時のみ Anthropic API へ通信）。

## データ・プライバシー

- 記録（日別の摂取kcal・ポイント・認定履歴）と API キーは、この端末の **localStorage にのみ保存**されます（キー: `kuidaore_v1` ほか）。
- 採点時、画像は端末から Anthropic API へ直接送信されます（`anthropic-dangerous-direct-browser-access`）。中継サーバーはありません。

## 技術・ソース

- React 18（インライン内蔵）による自己完結の単一 HTML。実行時の外部依存なし。使用モデル: Claude Sonnet（vision）。
- 配色は道頓堀ネオン風（赤×金×黒）。キャラ「ドン太郎」は実在の「くいだおれ太郎」（商標）とは配色・顔・衣装を変えたオリジナルです。
- アプリ本体の編集用ソースは `kuidaore.src.jsx`（JSX）。編集したら次の手順で `kuidaore.html` を再生成できます:

  ```bash
  # 一時ディレクトリで（node が必要）
  npm i @babel/standalone react@18 react-dom@18
  # kuidaore.src.jsx を Babel（preset: react, runtime: classic）で変換し、
  # react/react-dom の umd/*.production.min.js と結合して kuidaore.html を出力する
  ```

  ポイントは Babel を **classic ランタイム**（`{ runtime: 'classic' }`）で変換すること。既定の automatic ランタイムは `import ... from "react/jsx-runtime"` を吐き、`<script>` 直読み込みでは動きません。

## 免責（食い倒れ選手権）

※ 推定値はドン太郎の勘です。医療・栄養管理には使用しないでください。過食を推奨する実用アプリではなく、あくまでジョークアプリです。無理はしないでください。
