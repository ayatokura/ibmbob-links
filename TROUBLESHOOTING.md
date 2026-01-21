# GitHub Pages 404エラー トラブルシューティング

> ⚠️ **免責事項**: このドキュメントは個人によって作成されたセルフヘルプガイドです。問題解決を保証するものではありません。サポートはベストエフォートベースで提供されます。

## 🚨 現在の状況

- ✅ ファイルはGitHubにプッシュ済み
- ✅ `.nojekyll`、`index.html`、GitHub Actionsワークフローが存在
- ❌ https://ayatokura.github.io/ibmbob-links/ で404エラー

## 🔧 解決手順

### ステップ1: GitHub Pagesの設定を確認

1. **GitHubリポジトリにアクセス**
   ```
   https://github.com/ayatokura/ibmbob-links
   ```

2. **Settings タブをクリック**

3. **左サイドバーの Pages をクリック**

4. **現在の設定を確認**

### ステップ2: GitHub Pagesを有効化

#### 方法A: GitHub Actions経由（推奨）

1. **Settings** > **Pages** で以下を設定：
   - **Source**: `GitHub Actions` を選択
   
2. **Actions タブに移動**
   ```
   https://github.com/ayatokura/ibmbob-links/actions
   ```

3. **ワークフローの状態を確認**
   - 🟡 黄色の丸: 実行中（待つ）
   - ✅ 緑のチェック: 成功
   - ❌ 赤のX: 失敗（詳細を確認）

4. **ワークフローが実行されていない場合**
   - 「pages build and deployment」ワークフローを探す
   - なければ、手動でトリガー：
     ```bash
     cd /Users/ayatokura/IBMBob
     git commit --allow-empty -m "Trigger GitHub Pages deployment"
     git push origin main
     ```

#### 方法B: ブランチ経由（シンプル）

1. **Settings** > **Pages** で以下を設定：
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
   - **Save** をクリック

2. **5-10分待つ**

3. **ページを更新して確認**

### ステップ3: デプロイ状況を確認

#### GitHub Actionsの場合

1. **Actions タブを開く**
   ```
   https://github.com/ayatokura/ibmbob-links/actions
   ```

2. **最新のワークフロー実行をクリック**

3. **ログを確認**
   - エラーがあれば詳細を確認
   - 成功していれば、デプロイURLが表示される

#### ブランチデプロイの場合

1. **Settings** > **Pages** を開く

2. **上部に表示されるメッセージを確認**
   - 「Your site is live at...」: デプロイ成功
   - 「Your site is ready to be published」: デプロイ中
   - エラーメッセージ: 問題あり

### ステップ4: サイトにアクセス

1. **ブラウザで開く**
   ```
   https://ayatokura.github.io/ibmbob-links/
   ```

2. **キャッシュをクリア**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. **シークレットモードで確認**
   - キャッシュの影響を排除

## 🔍 よくある問題と解決策

### 問題1: GitHub Pagesの設定が見つからない

**原因**: リポジトリがプライベート、または設定が無効

**解決策**:
1. リポジトリを公開に変更
   - **Settings** > **General** > **Danger Zone**
   - **Change repository visibility** > **Make public**

2. GitHub Pagesを有効化（上記の手順）

### 問題2: ワークフローが実行されない

**原因**: GitHub Actionsが無効、または権限不足

**解決策**:
1. **Settings** > **Actions** > **General**
2. **Actions permissions** を確認
3. 「Allow all actions and reusable workflows」を選択
4. **Save** をクリック

### 問題3: ワークフローが失敗する

**原因**: 権限設定の問題

**解決策**:
1. **Settings** > **Actions** > **General**
2. **Workflow permissions** セクションで
3. 「Read and write permissions」を選択
4. 「Allow GitHub Actions to create and approve pull requests」にチェック
5. **Save** をクリック

### 問題4: デプロイは成功するが404エラー

**原因**: index.htmlの場所が間違っている

**解決策**:
```bash
# index.htmlの場所を確認
cd /Users/ayatokura/IBMBob
ls -la index.html

# ルートディレクトリにない場合は移動
# （通常は既に正しい場所にあるはず）
```

### 問題5: 長時間待っても変わらない

**原因**: デプロイが停止している

**解決策**:
```bash
# 空コミットでデプロイを再トリガー
cd /Users/ayatokura/IBMBob
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

## 📋 チェックリスト

デプロイ前に以下を確認：

- [ ] リポジトリが公開されている
- [ ] `index.html` がルートディレクトリにある
- [ ] `.nojekyll` ファイルが存在する
- [ ] GitHub Pagesが有効化されている
- [ ] GitHub Actionsが有効化されている
- [ ] ワークフローに必要な権限がある
- [ ] 最新のコミットがプッシュされている

## 🆘 それでも解決しない場合

### 手動デプロイを試す

GitHub Actionsを使わず、ブランチから直接デプロイ：

1. **Settings** > **Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `main`、**Folder**: `/ (root)`
4. **Save**
5. 5-10分待つ

### サポートに連絡

以下の情報を含めて報告：

1. **リポジトリURL**: https://github.com/ayatokura/ibmbob-links
2. **エラーメッセージ**: スクリーンショット
3. **Actions ログ**: エラーがあれば全文
4. **試した手順**: 上記のどの手順を試したか

## 📞 次のステップ

1. **上記の手順を順番に実行**
2. **各ステップの結果を記録**
3. **問題が解決しない場合は、詳細を報告**

---

最終更新: 2026年1月21日