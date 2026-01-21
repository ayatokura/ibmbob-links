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
        this.allArticles = [];
        this.searchInput = null;
        this.showAllArticles = false;
        this.INITIAL_DISPLAY_COUNT = 6;
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

        // 検索ボックスを取得
        this.searchInput = document.getElementById('search-input');

        // 検索ボックスを取得
        this.searchInput = document.getElementById('search-input');

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

        // 検索機能
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this._handleSearch(e.target.value);
            });
        }

        // 「もっと見る」ボタン
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('show-more-btn')) {
                e.preventDefault();
                this.showAllArticles = !this.showAllArticles;
                this._displayArticles(this.allArticles);
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
            this.allArticles = articles;
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
            this.allArticles = articles;
            this.showAllArticles = false; // リセット
            this._displayArticles(articles);
            this._showCacheInfo();
            this._showSuccessMessage('記事を更新しました');
            
            // 検索ボックスをクリア
            if (this.searchInput) {
                this.searchInput.value = '';
                this._updateSearchResultsCount(articles.length, articles.length);
            }
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
            <div class="articles-grid" id="articles-grid">
                ${articlesHTML}
            </div>
        `;
        
        // 折りたたみ機能を初期化
        this._initializeCollapse();
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
                <div class="header-actions">
                    <button class="collapse-toggle-btn" id="collapse-toggle" title="すべて折りたたむ/展開">
                        📋 すべて折りたたむ
                    </button>
                    <button class="refresh-articles-btn" title="記事を更新">
                        🔄 更新
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 「もっと見る」ボタンを作成
     * @private
     */
    _createShowMoreButton(totalCount, displayedCount) {
        const isShowingAll = displayedCount === totalCount;
        const buttonText = isShowingAll
            ? `📋 最初の${this.INITIAL_DISPLAY_COUNT}件のみ表示`
            : `📋 すべて表示 (残り${totalCount - displayedCount}件)`;
        
        return `
            <div class="show-more-container">
                <button class="show-more-btn">
                    ${buttonText}
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
            <article class="article-card collapsible" data-relevance="${article.relevanceScore}">
                <div class="article-card-header" role="button" tabindex="0" aria-expanded="false">
                    <div class="article-header">
                        ${relevanceBadge}
                        <h4 class="article-title">
                            ${article.title}
                        </h4>
                    </div>
                    <span class="collapse-icon">▼</span>
                </div>
                
                <div class="article-card-content">
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
                </div>
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

    /**
     * 折りたたみ機能を初期化
     * @private
     */
    _initializeCollapse() {
        const grid = document.getElementById('articles-grid');
        const toggleBtn = document.getElementById('collapse-toggle');
        
        if (!grid || !toggleBtn) return;

        let allCollapsed = false;

        // 個別カードの折りたたみ
        grid.addEventListener('click', (e) => {
            const header = e.target.closest('.article-card-header');
            if (!header) return;

            const card = header.closest('.article-card');
            const content = card.querySelector('.article-card-content');
            const icon = header.querySelector('.collapse-icon');
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                content.style.maxHeight = '0';
                header.setAttribute('aria-expanded', 'false');
                icon.textContent = '▼';
                card.classList.remove('expanded');
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                header.setAttribute('aria-expanded', 'true');
                icon.textContent = '▲';
                card.classList.add('expanded');
            }
        });

        // キーボード対応
        grid.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const header = e.target.closest('.article-card-header');
                if (header) {
                    e.preventDefault();
                    header.click();
                }
            }
        });

        // すべて折りたたむ/展開ボタン
        toggleBtn.addEventListener('click', () => {
            const cards = grid.querySelectorAll('.article-card');
            
            cards.forEach(card => {
                const header = card.querySelector('.article-card-header');
                const content = card.querySelector('.article-card-content');
                const icon = header.querySelector('.collapse-icon');

                if (allCollapsed) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    header.setAttribute('aria-expanded', 'true');
                    icon.textContent = '▲';
                    card.classList.add('expanded');
                } else {
                    content.style.maxHeight = '0';
                    header.setAttribute('aria-expanded', 'false');
                    icon.textContent = '▼';
                    card.classList.remove('expanded');
                }
            });

            allCollapsed = !allCollapsed;
            toggleBtn.textContent = allCollapsed ? '📋 すべて展開' : '📋 すべて折りたたむ';
        });
    }

    /**
     * 検索処理
     * @private
     */
    _handleSearch(query) {
        if (!query.trim()) {
            // 検索クエリが空の場合、すべての記事を表示
            this._displayArticles(this.allArticles);
            return;
        }

        const searchTerm = query.toLowerCase().trim();
        
        // 記事をフィルタリング
        const filteredArticles = this.allArticles.filter(article => {
            return (
                article.title.toLowerCase().includes(searchTerm) ||
                article.author.toLowerCase().includes(searchTerm) ||
                article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        });

        if (filteredArticles.length === 0) {
            // 検索結果がない場合
            this.articlesContainer.innerHTML = `
                <div class="articles-header">
                    <div class="articles-info">
                        <h3>Qiitaの記事 (0件)</h3>
                        <p class="cache-info" id="cache-info"></p>
                    </div>
                    <div class="header-actions">
                        <button class="collapse-toggle-btn" id="collapse-toggle" title="すべて折りたたむ/展開" disabled style="opacity: 0.5;">
                            📋 すべて折りたたむ
                        </button>
                        <button class="refresh-articles-btn" title="記事を更新">
                            🔄 更新
                        </button>
                    </div>
                </div>
                <div class="no-results">
                    <p>🔍 「${this._escapeHtml(query)}」に一致する記事が見つかりませんでした</p>
                    <p>別のキーワードで検索してみてください</p>
                </div>
            `;
            this._showCacheInfo();
            this._updateSearchResultsCount(0, this.allArticles.length);
        } else {
            // 検索結果を表示（ハイライト付き）
            this._displayArticles(filteredArticles, searchTerm);
        }
    }

    /**
     * 検索結果カウントを更新
     * @private
     */
    _updateSearchResultsCount(displayed, total) {
        const countElement = document.getElementById('search-results-count');
        if (!countElement) return;

        if (displayed === total) {
            countElement.textContent = '';
        } else {
            countElement.textContent = `${displayed}件 / ${total}件の記事を表示中`;
        }
    }

    /**
     * 記事カードを作成（検索ハイライト対応）
     * @private
     */
    _createArticleCard(article, searchTerm = '') {
        const tagsHTML = article.tags
            .slice(0, 5)
            .map(tag => {
                const highlightedTag = searchTerm
                    ? this._highlightText(tag, searchTerm)
                    : tag;
                return `<span class="tag">${highlightedTag}</span>`;
            })
            .join('');

        // 関連度バッジを作成
        const relevanceBadge = this._createRelevanceBadge(article.relevanceScore);

        // タイトルと著者名をハイライト
        const highlightedTitle = searchTerm
            ? this._highlightText(article.title, searchTerm)
            : article.title;
        const highlightedAuthor = searchTerm
            ? this._highlightText(article.author, searchTerm)
            : article.author;

        return `
            <article class="article-card collapsible" data-relevance="${article.relevanceScore}">
                <div class="article-card-header" role="button" tabindex="0" aria-expanded="false">
                    <div class="article-header">
                        ${relevanceBadge}
                        <h4 class="article-title">
                            ${highlightedTitle}
                        </h4>
                    </div>
                    <span class="collapse-icon">▼</span>
                </div>
                
                <div class="article-card-content">
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
                                ${highlightedAuthor}
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
                </div>
            </article>
        `;
    }

    /**
     * テキストをハイライト
     * @private
     */
    _highlightText(text, searchTerm) {
        if (!searchTerm) return this._escapeHtml(text);
        
        const escapedText = this._escapeHtml(text);
        const escapedTerm = this._escapeHtml(searchTerm);
        const regex = new RegExp(`(${escapedTerm})`, 'gi');
        
        return escapedText.replace(regex, '<span class="highlight">$1</span>');
    }
}

// DOMContentLoadedイベントで初期化
document.addEventListener('DOMContentLoaded', () => {
    const uiController = new UIController();
    uiController.init();
});

// Made with Bob
