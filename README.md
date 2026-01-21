# IBM Bob Links

> ⚠️ **非公式のリンク集です** / This is an unofficial resource collection

IBM Bobに関するリソース、記事、チュートリアルを一箇所にまとめた非公式のコレクションです。

## 🌟 特徴

- **公式リソース**: IBM Bobの公式ページや発表へのリンク
- **自動記事収集**: Qiitaから「IBM Bob」に関する日本語記事を自動的に取得
- **キャッシュ機能**: 6時間のキャッシュで高速表示とAPI制限対策
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応

## 🚀 機能

### 自動記事収集
- Qiita APIを使用してIBM Bobに関する記事を自動検索
- 複数のキーワード（"IBM Bob", "IBMBob", "Project Bob"）で検索
- 重複記事を自動的に除外
- **関連度スコアリング**: IBM Bobがメイントピックの記事を優先表示
- 関連度の高い順にソート表示

### 関連度スコアリング（新機能）
記事の内容を分析し、IBM Bobとの関連度を0-10のスコアで評価：

**スコアリング基準**:
- タイトルに「IBM Bob」が含まれる: +5点
- タイトルが「IBM Bob」で始まる: +2点（追加）
- タグに「IBM Bob」が含まれる: +3点
- 本文冒頭（500文字）での言及: +2-3点
- 本文全体での言及頻度: +1-2点
- いいね数10以上: +1点
- 他のメイントピックがある場合: -2点

**フィルタリング**:
- スコア3未満の記事は表示されません
- スコア8以上: 🌟 高関連バッジ表示
- スコア5-7: ⭐ 関連バッジ表示

### キャッシュシステム
- LocalStorageを使用した6時間のキャッシュ
- 不要なAPI呼び出しを削減
- 手動更新ボタンで最新記事を取得可能

### ユーザーインターフェース
- ローディング表示
- エラーハンドリング
- 記事カード形式の見やすい表示
- 著者情報、いいね数、タグの表示

## 📁 プロジェクト構成

```
IBMBob/
├── index.html              # メインHTMLファイル
├── css/
│   └── articles.css       # 記事表示用スタイル
├── js/
│   ├── qiita-api.js       # Qiita API通信モジュール
│   ├── article-manager.js # 記事データ管理モジュール
│   └── ui-controller.js   # UI制御モジュール
├── IMPLEMENTATION_PLAN.md # 実装計画書
├── README.md              # このファイル
└── LICENSE                # ライセンス
```

## 🛠️ 技術スタック

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **API**: Qiita API v2
- **ストレージ**: LocalStorage
- **フォント**: IBM Plex Sans

## 📖 使い方

1. ブラウザで `index.html` を開く
2. ページ読み込み時に自動的にQiitaから記事を取得
3. 「🔄 更新」ボタンで最新記事を手動取得

## 🔧 開発

### ローカルで実行

```bash
# リポジトリをクローン
git clone https://github.com/ayatokura/IBMBob.git
cd IBMBob

# ブラウザで開く
open index.html
# または
python -m http.server 8000
```

### キャッシュのクリア

ブラウザの開発者ツールで以下を実行：

```javascript
localStorage.removeItem('ibmbob_articles_cache');
location.reload();
```

## 🚀 GitHub Pagesでの公開方法

このサイトは静的HTMLなので、GitHub Pagesで簡単に公開できます。

### 手順1: GitHubリポジトリの作成

```bash
# 既存のリポジトリがない場合
cd IBMBob
git init
git add .
git commit -m "Initial commit: IBM Bob Links site"

# GitHubで新しいリポジトリを作成後
git remote add origin https://github.com/YOUR_USERNAME/IBMBob.git
git branch -M main
git push -u origin main
```

### 手順2: GitHub Pagesの有効化

1. GitHubリポジトリページを開く
2. **Settings**（設定）タブをクリック
3. 左サイドバーの**Pages**をクリック
4. **Source**セクションで：
   - Branch: `main`を選択
   - Folder: `/ (root)`を選択
5. **Save**をクリック

### 手順3: 公開URLの確認

数分後、以下のURLでサイトが公開されます：

```
https://YOUR_USERNAME.github.io/IBMBob/
```

例: `https://ayatokura.github.io/IBMBob/`

### 更新方法

ファイルを変更した後：

```bash
git add .
git commit -m "Update: 変更内容の説明"
git push origin main
```

数分後に自動的にサイトが更新されます。

### 注意事項

- **無料**: GitHub Pagesは完全無料
- **HTTPS**: 自動的にHTTPS対応
- **制限**: 1GBまで、月間100GBの帯域幅
- **個人プロジェクト**: 個人アカウントで公開することを推奨

## � セキュリティ

- XSS対策: すべてのユーザー入力をHTMLエスケープ
- CORS対応: Qiita APIは公開APIでCORS対応済み
- レート制限対策: キャッシュ機能で不要なリクエストを削減

## 📊 API制限

Qiita API v2の制限：
- **認証なし**: 60リクエスト/時間
- **認証あり**: 1000リクエスト/時間

キャッシュ機能により、通常の使用では制限に達することはありません。

## 🤝 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## ⚠️ 免責事項

このサイトは非公式のリンク集であり、IBM Corporationとは一切関係ありません。IBM、IBM Bob、およびその他のIBM製品名は、IBM Corporationの商標または登録商標です。

## 📄 ライセンス

このプロジェクトのライセンスについては、[LICENSE](LICENSE)ファイルを参照してください。

## 👤 作成者

**Aya Tokura** ([@ayatokura](https://github.com/ayatokura))

## 🔗 関連リンク

- [IBM Bob 公式ページ](https://www.ibm.com/products/bob)
- [Qiita API ドキュメント](https://qiita.com/api/v2/docs)
- [実装計画書](IMPLEMENTATION_PLAN.md)

---

Made with ❤️ for the IBM Bob community
