# IBM Bob Links

<div align="center">

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success)](https://ayatokura.github.io/ibmbob-links/)
[![License: CC0-1.0](https://img.shields.io/badge/License-CC0%201.0-lightgrey.svg)](http://creativecommons.org/publicdomain/zero/1.0/)

**IBM Bobに関するリソース、記事、チュートリアルを一箇所にまとめた非公式のコレクション**

[🌐 サイトを見る](https://ayatokura.github.io/ibmbob-links/) | [📖 使い方](#-使い方) | [🤝 貢献](#-貢献)

</div>

---

> ⚠️ **非公式のリンク集です** / This is an unofficial resource collection
>
> このサイトは非公式のリンク集であり、IBM Corporationとは一切関係ありません。

## 📖 このサイトについて

IBM Bob Linksは、AI駆動の開発パートナー「IBM Bob」に関する情報を集約した非公式の個人プロジェクトです。

### 🌟 主な機能

- 📢 **公式リソース**: IBM Bobの公式ページや発表へのリンク
- 📰 **自動記事収集**: Qiitaから関連記事を自動的に取得・表示
- 🎯 **スマート検索**: 関連度の高い記事を優先表示
- 🔄 **自動更新**: 6時間ごとに最新記事を自動取得
- 📱 **レスポンシブ**: モバイル、タブレット、デスクトップに完全対応

## 🚀 使い方

### サイトにアクセス

**https://ayatokura.github.io/ibmbob-links/**

ブラウザで上記URLを開くだけで、すぐに利用できます。

### 記事の閲覧

1. **公式リソース**: IBM Bobの公式情報をチェック
2. **Qiita記事**: コミュニティが投稿した記事を閲覧
   - 🌟 高関連バッジ: IBM Bobがメイントピックの記事
   - ⭐ 関連バッジ: IBM Bobに関連する記事
3. **記事の更新**: 「🔄 更新」ボタンで最新記事を取得

### 記事の関連度について

記事は以下の基準で自動的にスコアリングされ、関連度の高い順に表示されます：

- タイトルやタグに「IBM Bob」が含まれる
- 本文でIBM Bobについて詳しく説明している
- コミュニティから高評価を受けている

スコア3未満の記事は自動的に除外され、質の高い情報のみが表示されます。

## 💡 よくある質問

### Q: 記事が表示されない

**A:** 以下を確認してください：
1. インターネット接続を確認
2. ブラウザのキャッシュをクリア（Ctrl+Shift+R / Cmd+Shift+R）
3. 数分待ってから再度アクセス

### Q: 記事を更新したい

**A:** ページ上部の「🔄 更新」ボタンをクリックしてください。最新の記事が取得されます。

### Q: 自分の記事が表示されない

**A:** 以下の条件を満たしているか確認してください：
- Qiitaで公開されている
- タイトルまたは本文に「IBM Bob」が含まれている
- 関連度スコアが3以上

### Q: モバイルでも使える？

**A:** はい、スマートフォンやタブレットでも快適に閲覧できます。

## 🔧 開発者向け情報

このサイトに貢献したい開発者の方は、以下のドキュメントを参照してください：

- [DEPLOY.md](DEPLOY.md) - デプロイ手順とトラブルシューティング
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) - 技術仕様と実装計画

### ローカルで実行

```bash
# リポジトリをクローン
git clone https://github.com/ayatokura/ibmbob-links.git
cd IBMBob

# 簡易サーバーを起動
python3 -m http.server 8000
# または
npx http-server -p 8000

# ブラウザで開く
open http://localhost:8000
```

### 技術スタック

- HTML5, CSS3, Vanilla JavaScript
- Qiita API v2（認証不要）
- LocalStorage（キャッシュ）
- GitHub Pages（ホスティング）

## 🚀 GitHub Pagesでの公開

このサイトは静的HTMLなので、GitHub Pagesで簡単に公開できます。

### 🌐 公開サイト

**URL**: https://ayatokura.github.io/ibmbob-links/

### 📦 デプロイ方法

詳細な手順は [DEPLOY.md](DEPLOY.md) を参照してください。

#### クイックスタート

```bash
# リポジトリをクローン（初回のみ）
git clone https://github.com/ayatokura/ibmbob-links.git
cd IBMBob

# 変更をコミット＆プッシュ
git add .
git commit -m "Update: 変更内容"
git push origin main
```

GitHub Actionsが自動的にデプロイを実行します（約1-3分）。

### ⚙️ 自動デプロイ

- **トリガー**: `main`ブランチへのプッシュ
- **ワークフロー**: `.github/workflows/deploy.yml`
- **デプロイ時間**: 約1-3分
- **状態確認**: リポジトリの**Actions**タブ

### 📋 必要なファイル

- `.nojekyll` - Jekyllビルドを無効化
- `.github/workflows/deploy.yml` - 自動デプロイ設定
- `index.html` - エントリーポイント

### 🔧 GitHub Pages設定

リポジトリの**Settings** > **Pages**で以下を確認：

- **Source**: GitHub Actions
- **Custom domain**: （オプション）独自ドメイン設定可能
- **Enforce HTTPS**: ✅ 有効

### 📊 制限事項

- リポジトリサイズ: 1GB推奨
- ファイルサイズ: 100MB以下
- 帯域幅: 月間100GB
- ビルド回数: 1時間あたり10回

通常の使用では問題ありません。

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

このプロジェクトへの貢献を歓迎します！

> ⚠️ **注意**: このプロジェクトは個人プロジェクトで運営されており、サポートはベストエフォートベースで提供されます。

### 貢献方法

1. **記事の追加提案**: [Issue](https://github.com/ayatokura/ibmbob-links/issues)で提案
2. **バグ報告**: 問題を発見した場合はIssueで報告
3. **機能提案**: 新機能のアイデアをIssueで共有
4. **プルリクエスト**: コードの改善や新機能の実装

詳細な貢献ガイドラインは [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

### クイックスタート

```bash
# フォークしてクローン
git clone https://github.com/YOUR_USERNAME/IBMBob.git
cd IBMBob

# ブランチを作成
git checkout -b feature/your-feature

# 変更をコミット
git add .
git commit -m "feat: add your feature"

# プッシュしてPRを作成
git push origin feature/your-feature
```

## 📞 コミュニティサポート

> ⚠️ **注意**: このプロジェクトは個人プロジェクトで運営されており、サポートはベストエフォートベースで提供されます。即座の対応や問題解決を保証するものではありません。

### 問題を報告

バグや問題を発見した場合：
1. [GitHub Issues](https://github.com/ayatokura/ibmbob-links/issues)で報告
2. 問題の詳細とスクリーンショットを添付
3. 再現手順を記載

**注**: Issueへの返信は時間がかかる場合があります。緊急の問題については、自己解決を試みるか、コミュニティに質問してください。

### 機能リクエスト

新機能のアイデアがある場合：
1. [GitHub Issues](https://github.com/ayatokura/ibmbob-links/issues)で提案
2. 「Feature Request」ラベルを付ける
3. 具体的なユースケースを説明

**注**: すべての機能リクエストが実装されるわけではありません。プルリクエストでの貢献を歓迎します。

### セルフヘルプリソース

問題解決のための参考資料：
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - よくある問題と解決方法
- [DEPLOY.md](DEPLOY.md) - デプロイ手順
- [GitHub Pages ドキュメント](https://docs.github.com/ja/pages)
- [Qiita API ドキュメント](https://qiita.com/api/v2/docs)

## 🔗 関連リンク

### IBM Bob公式

- [IBM Bob 公式ページ](https://www.ibm.com/products/bob)
- [IBM Bob 発表記事](https://www.ibm.com/new/announcements/ibm-project-bob)
- [IBM Think: Meet Bob](https://www.ibm.com/think/news/meet-bob-developer-productivity)

### コミュニティ

- [GitHub リポジトリ](https://github.com/ayatokura/ibmbob-links)
- [Qiita: IBM Bob タグ](https://qiita.com/tags/ibmbob)

## ⚠️ 免責事項

このサイトは非公式のリンク集であり、IBM Corporationとは一切関係ありません。IBM、IBM Bob、およびその他のIBM製品名は、IBM Corporationの商標または登録商標です。

## 📄 ライセンス

このプロジェクトは [CC0 1.0 Universal](LICENSE) ライセンスの下で公開されています。自由に使用、改変、配布できます。

## 👥 クレジット

- **メンテナー**: [Aya Tokura](https://github.com/ayatokura)
- **コントリビューター**: [貢献者一覧](https://github.com/ayatokura/ibmbob-links/graphs/contributors)
- **データソース**: [Qiita API](https://qiita.com/api/v2/docs)

---

<div align="center">

Made with ❤️ for the IBM Bob community

[⬆ トップに戻る](#ibm-bob-links)

</div>
