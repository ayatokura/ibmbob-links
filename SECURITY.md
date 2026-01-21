# セキュリティポリシー

## 🔒 セキュリティ対策

このプロジェクトでは、以下のセキュリティ対策を実施しています。

### 1. XSS（クロスサイトスクリプティング）対策

すべてのユーザー入力とAPIから取得したデータは、HTMLエスケープ処理を行っています。

**実装箇所**:
- [`js/article-manager.js`](js/article-manager.js) - `_escapeHtml()` メソッド
- [`js/ui-controller.js`](js/ui-controller.js) - `_escapeHtml()` メソッド

**エスケープ対象**:
- 記事タイトル
- 著者名
- タグ名
- エラーメッセージ

### 2. API認証情報

このプロジェクトでは、**APIキーや認証情報を一切使用していません**。

- Qiita API v2の公開エンドポイントのみを使用
- 認証不要のリクエストのみ実行
- 環境変数や設定ファイルに機密情報なし

### 3. CORS（Cross-Origin Resource Sharing）

Qiita APIは公式にCORSに対応しており、ブラウザから直接APIを呼び出すことができます。

- 追加のプロキシサーバー不要
- サーバーサイドの実装不要

### 4. レート制限対策

APIの過度な使用を防ぐため、以下の対策を実施：

- **キャッシュ機能**: 6時間のLocalStorageキャッシュ
- **リトライ制限**: 最大3回まで
- **指数バックオフ**: リトライ間隔を段階的に増加

### 5. データ検証

APIレスポンスの妥当性を検証：

- 必須フィールドの存在確認
- データ型のチェック
- URLの妥当性検証

## 🔐 個人情報保護

### 収集しない情報

このサイトは以下の情報を**一切収集しません**：

- ユーザーの個人情報
- メールアドレス
- IPアドレス
- 位置情報
- Cookie（必須のもの以外）

### LocalStorageの使用

以下の目的でのみLocalStorageを使用：

- 記事データのキャッシュ（6時間）
- キャッシュのタイムスタンプ

**保存データ**:
```javascript
{
  "ibmbob_articles_cache": {
    "version": "1.0.0",
    "timestamp": 1234567890,
    "articles": [...]
  }
}
```

ユーザーはいつでもブラウザの設定からLocalStorageをクリアできます。

## 🛡️ 外部サービス

### 使用している外部サービス

1. **Qiita API**
   - 用途: 記事データの取得
   - エンドポイント: `https://qiita.com/api/v2/items`
   - 認証: 不要
   - プライバシーポリシー: [Qiita利用規約](https://qiita.com/terms)

2. **Google Fonts**
   - 用途: IBM Plex Sansフォントの読み込み
   - プライバシーポリシー: [Google Fonts FAQ](https://developers.google.com/fonts/faq/privacy)

3. **GitHub Pages**
   - 用途: サイトのホスティング
   - プライバシーポリシー: [GitHub Privacy Statement](https://docs.github.com/ja/site-policy/privacy-policies/github-privacy-statement)

## 🚨 脆弱性の報告

セキュリティ上の問題を発見した場合は、以下の手順で報告してください。

### 報告方法

1. **公開Issueは作成しない**（セキュリティリスクのため）
2. GitHubの[Security Advisories](https://github.com/ayatokura/IBMBob/security/advisories)を使用
3. または、リポジトリメンテナーに直接連絡

### 報告に含める情報

- 脆弱性の詳細な説明
- 再現手順
- 影響範囲
- 可能であれば、修正案

### 対応プロセス

1. **確認**: 24時間以内に受領確認
2. **調査**: 脆弱性の検証と影響範囲の特定
3. **修正**: パッチの開発とテスト
4. **公開**: 修正版のリリースと脆弱性情報の公開

## ✅ セキュリティチェックリスト

公開前に以下を確認済み：

- [x] APIキーや認証情報が含まれていない
- [x] 個人情報（メール、電話番号、住所）が含まれていない
- [x] すべてのユーザー入力がエスケープされている
- [x] 外部APIの使用が適切に制限されている
- [x] エラーメッセージに機密情報が含まれていない
- [x] HTTPS経由でのみアクセス可能（GitHub Pages）
- [x] 依存関係に既知の脆弱性がない

## 📋 コンプライアンス

### ライセンス

このプロジェクトは [CC0 1.0 Universal](LICENSE) ライセンスの下で公開されています。

### 商標

IBM、IBM Bob、およびその他のIBM製品名は、IBM Corporationの商標または登録商標です。このプロジェクトはIBM Corporationとは一切関係ありません。

## 🔄 更新履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2026-01-21 | 1.0.0 | 初版作成 |

## 📞 お問い合わせ

セキュリティに関する質問や懸念事項がある場合：

- [GitHub Issues](https://github.com/ayatokura/IBMBob/issues)（一般的な質問）
- [Security Advisories](https://github.com/ayatokura/IBMBob/security/advisories)（セキュリティ問題）

---

最終更新: 2026年1月21日