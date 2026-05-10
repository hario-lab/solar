# SOLAR

**Structured Online Lateral Attack Reconnaissance**

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.19808360.svg)](https://doi.org/10.5281/zenodo.19808360)

MITRE ATT&CK® データを使用した脅威インテリジェンス可視化ツール。

> **SOLAR** は [SHOOT](https://github.com/hario-lab/shoot)（Structured Hunting of Online Threats）のスマートフォン・タブレット対応版です。  
> iPad・モバイル端末でのタッチ操作・ドラッグリサイズに最適化されています。

## 機能

- **KILL CHAIN** — グループごとのTTPをATT&CKフェーズ順に表示。テクニック詳細サイドパネル付き。
- **NETWORK GRAPH** — グループ間の共有テクニック数をD3フォースグラフで可視化。
- **IMPACT ANALYSIS** — 対象プラットフォームを選択し、リスクスコア順にグループをランキング。
- **DEFENSE GAP MAP** — テクニックごとに検知ステータス（未対応／一部／対応済）を管理。タクティクス単位の一括設定機能付き。CSVエクスポート対応。
- **AI BRIEFING** — Claude APIを使用して経営層向け・SOCアナリスト向けの脅威ブリーフィングを自動生成。

## デバイス対応

| デバイス | 対応状況 |
|----------|----------|
| iPad（縦・横） | ✅ タッチドラッグ・ハンバーガーメニュー対応 |
| スマートフォン | ✅ レスポンシブレイアウト |
| デスクトップ | ✅ 全機能対応 |

- ブレークポイント：768px（タブレット縦）/ 1024px（タブレット横・デスクトップ）
- 全パネルをタッチドラッグで幅調整可能（幅はlocalStorageに保存）
- `100dvh` によるiOS Safariのビューポートバグ回避

## セットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動（ポート5173）
npm run dev
```

## APIキーの設定

Claude APIを使用するAI機能（AI BRIEFINGタブ、GENERATE SCENARIO）を利用するには、Anthropic APIキーが必要です。

**アプリ内から設定（推奨）：**
1. 右上の ⚙ 設定 ボタンをタップ
2. APIキーを入力し「テスト接続」で確認
3. 「保存」をタップ（localStorageに保存されます）

**または `.env` ファイルで設定：**
```bash
cp .env.example .env
# .env を編集して VITE_ANTHROPIC_API_KEY にキーをセット
```

APIキーは [console.anthropic.com](https://console.anthropic.com) で取得できます。

## ビルド

```bash
# 本番ビルド（dist/index.html を生成）
npm run build

# GitHub Pages へのデプロイ用（リポジトリ名をbase pathに設定）
VITE_BASE_PATH=/solar/ npm run build:pages
```

生成される `dist/index.html` は全アセットをインライン化した単一ファイルで、`file://` でも直接開けます。

## データ更新

ATT&CK データは `public/data/` にバンドルされています。

```bash
# ローカルの enterprise-attack.json から再処理
npm run process-data

# MITRE GitHub から最新データを取得
npm run update-data
```

アプリ内の「↻ データ更新」ボタンからも更新できます（開発サーバー起動時のみ）。

## クレジット

本ツールはMITRE ATT&CK®データを使用しています。

© 2025 The MITRE Corporation. This work is reproduced and distributed with the permission of The MITRE Corporation.

- ATT&CK®: https://attack.mitre.org
- Terms of Use: https://attack.mitre.org/resources/legal-and-branding/terms-of-use/
- Data Source: https://github.com/mitre/cti

## Author

[hario-lab](https://hariolab.net)

## ライセンス

MIT
