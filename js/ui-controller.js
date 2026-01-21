/**
 * UI Controller
 * UIの更新、イベント処理、ユーザーインタラクションを管理するモジュール
 */

class UIController {
    constructor() {
        this.articlesContainer = null;
        this.loadingElement = null;
        this.errorElement = null;
        this.refreshButton = null;
        this.isLoading = false;
    }

    /**
     * 初期化
     */
    init() {
        // DOM要素を取得
        this.articlesContainer = document.getElementById('qiita-articles');
        
        if (!this.articlesContainer) {
            console.error('記事コンテナが見つかりません');
            return;
        }

        // イベントリスナーを設定
        this._setupEventListeners();

        // 記事を読み込み
        this.loadArticles();
    }

    /**
     * イベントリスナーを設定
     * @private
     */
    _setupEventListeners() {
        // 更新ボタンのイベント
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('refresh-articles-btn')) {
                e.preventDefault();
                this.refreshArticles();
            }
            
            if (e.target.classList.contains('retry-button')) {
                e.preventDefault();
                this.loadArticles();
            }
        });
    }

    /**
     * 記事を読み込んで表示
     */
    async loadArticles() {
        if (this.isLoading) return;

        this.isLoading = true;
        this._showLoading();

        try {
            const articles = await articleManager.getArticles();
            this._displayArticles(articles);
            this._showCacheInfo();
        } catch (error) {
            console.error('記事読み込みエラー:', error);
            this._showError(error.message);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * 記事を強制的に更新
     */
    async refreshArticles() {
        if (this.isLoading) return;

        this.isLoading = true;
        this._showLoading('記事を更新中...');

        try {
            const articles = await articleManager.refreshArticles();
            this._displayArticles(articles);
            this._showCacheInfo();
            this._showSuccessMessage('記事を更新しました');
        } catch (error) {
            console.error('記事更新エラー:', error);
            this._showError(error.message);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * ローディング表示
     * @private
     */
    _showLoading(message = '記事を読み込み中...') {
        this.articlesContainer.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>🔄 ${message}</p>
            </div>
        `;
    }

    /**
     * エラー表示
     * @private
     */
    _showError(message) {
        this.articlesContainer.innerHTML = `
            <div class="error-state">
                <p>⚠️ ${this._escapeHtml(message)}</p>
                <button class="retry-button">再試行</button>
            </div>
        `;
    }

    /**
     * 成功メッセージを表示
     * @private
     */
    _showSuccessMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'success-message';
        messageEl.textContent = `✓ ${message}`;
        
        this.articlesContainer.insertBefore(messageEl, this.articlesContainer.firstChild);
        
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }

    /**
     * 記事を表示
     * @private
     */
    _displayArticles(articles) {
        if (!articles || articles.length === 0) {
            this.articlesContainer.innerHTML = `
                <div class="empty-state">
                    <p>📭 記事が見つかりませんでした</p>
                    <p>後ほど再度お試しください</p>
                </div>
            `;
            return;
        }

        // ヘッダーを作成
        const header = this._createHeader(articles.length);
        
        // 記事カードを作成
        const articlesHTML = articles.map(article => this._createArticleCard(article)).join('');
        
        this.articlesContainer.innerHTML = header + `
            <div class="articles-grid">
                ${articlesHTML}
            </div>
        `;
    }

    /**
     * ヘッダーを作成
     * @private
     */
    _createHeader(count) {
        return `
            <div class="articles-header">
                <div class="articles-info">
                    <h3>Qiitaの記事 (${count}件)</h3>
                    <p class="cache-info" id="cache-info"></p>
                </div>
                <button class="refresh-articles-btn" title="記事を更新">
                    🔄 更新
                </button>
            </div>
        `;
    }

    /**
     * 記事カードを作成
     * @private
     */
    _createArticleCard(article) {
        const tagsHTML = article.tags
            .slice(0, 5)
            .map(tag => `<span class="tag">${tag}</span>`)
            .join('');

        // 関連度バッジを作成
        const relevanceBadge = this._createRelevanceBadge(article.relevanceScore);

        return `
            <article class="article-card" data-relevance="${article.relevanceScore}">
                <div class="article-header">
                    ${relevanceBadge}
                    <h4 class="article-title">
                        <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                            ${article.title}
                        </a>
                    </h4>
                </div>
                
                <div class="article-meta">
                    <div class="author-info">
                        <img src="${article.authorImage}"
                             alt="${article.author}"
                             class="author-avatar"
                             loading="lazy">
                        <a href="${article.authorUrl}"
                           target="_blank"
                           rel="noopener noreferrer"
                           class="author-name">
                            ${article.author}
                        </a>
                    </div>
                    <div class="article-stats">
                        <span class="stat">📅 ${article.publishedDate}</span>
                        <span class="stat">❤️ ${article.likesCount}</span>
                    </div>
                </div>
                
                ${tagsHTML ? `<div class="article-tags">${tagsHTML}</div>` : ''}
                
                <a href="${article.url}"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="read-more">
                    記事を読む →
                </a>
            </article>
        `;
    }

    /**
     * 関連度バッジを作成
     * @private
     */
    _createRelevanceBadge(score) {
        if (score >= 8) {
            return '<span class="relevance-badge high">🌟 高関連</span>';
        } else if (score >= 5) {
            return '<span class="relevance-badge medium">⭐ 関連</span>';
        }
        return ''; // スコア5未満はバッジなし
    }

    /**
     * キャッシュ情報を表示
     * @private
     */
    _showCacheInfo() {
        const cacheInfo = articleManager.getCacheInfo();
        const infoElement = document.getElementById('cache-info');
        
        if (!infoElement || !cacheInfo) return;

        const ageText = cacheInfo.ageMinutes === 0 
            ? 'たった今' 
            : `${cacheInfo.ageMinutes}分前`;
        
        infoElement.textContent = `最終更新: ${ageText}`;
    }

    /**
     * HTMLエスケープ
     * @private
     */
    _escapeHtml(text) {
        const map = {
            '&': '&',
            '<': '<',
            '>': '>',
            '"': '"',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }
}

// DOMContentLoadedイベントで初期化
document.addEventListener('DOMContentLoaded', () => {
    const uiController = new UIController();
    uiController.init();
});

// Made with Bob
