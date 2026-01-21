/**
 * Article Manager
 * 記事データの管理、キャッシュ、処理を行うモジュール
 */

class ArticleManager {
    constructor() {
        this.cacheKey = 'ibmbob_articles_cache';
        this.cacheVersion = '1.0.0';
        this.cacheExpiry = 6 * 60 * 60 * 1000; // 6時間（ミリ秒）
    }

    /**
     * 記事を取得（キャッシュまたはAPI）
     * @returns {Promise<Array>} 整形された記事の配列
     */
    async getArticles() {
        // キャッシュをチェック
        const cachedData = this._getCachedArticles();
        if (cachedData) {
            console.log('キャッシュから記事を読み込みました');
            return cachedData;
        }

        // APIから取得
        console.log('APIから記事を取得中...');
        try {
            const rawArticles = await qiitaAPI.searchArticles({ perPage: 20 });
            const processedArticles = this._processArticles(rawArticles);
            
            // キャッシュに保存
            this._cacheArticles(processedArticles);
            
            return processedArticles;
        } catch (error) {
            console.error('記事取得エラー:', error);
            throw this._handleError(error);
        }
    }

    /**
     * 記事を強制的に更新
     * @returns {Promise<Array>} 整形された記事の配列
     */
    async refreshArticles() {
        this._clearCache();
        return await this.getArticles();
    }

    /**
     * 記事データを処理・整形
     * @private
     */
    _processArticles(articles) {
        return articles
            .filter(article => this._isValidArticle(article))
            .map(article => {
                const processedArticle = {
                    id: article.id,
                    title: this._escapeHtml(article.title),
                    url: article.url,
                    author: this._escapeHtml(article.user.name || article.user.id),
                    authorUrl: `https://qiita.com/${article.user.id}`,
                    authorImage: article.user.profile_image_url,
                    publishedDate: this._formatDate(article.created_at),
                    likesCount: article.likes_count || 0,
                    tags: article.tags.map(tag => this._escapeHtml(tag.name)),
                    excerpt: this._createExcerpt(article.title, article.body || ''),
                    rawTitle: article.title,
                    rawBody: article.body || ''
                };
                
                // IBM Bob関連度スコアを計算
                processedArticle.relevanceScore = this._calculateRelevanceScore(processedArticle);
                
                return processedArticle;
            })
            .filter(article => article.relevanceScore >= 3) // 最低スコア3以上のみ表示
            .sort((a, b) => {
                // 関連度スコアで降順ソート、同じ場合は新しい順
                if (b.relevanceScore !== a.relevanceScore) {
                    return b.relevanceScore - a.relevanceScore;
                }
                const dateA = new Date(a.publishedDate);
                const dateB = new Date(b.publishedDate);
                return dateB - dateA;
            });
    }

    /**
     * IBM Bob関連度スコアを計算
     * @private
     * @returns {number} 0-10のスコア（高いほど関連度が高い）
     */
    _calculateRelevanceScore(article) {
        let score = 0;
        const title = article.rawTitle.toLowerCase();
        const body = article.rawBody.toLowerCase();
        const tags = article.tags.map(t => t.toLowerCase());

        // タイトルでの出現（最重要）
        if (title.includes('ibm bob') || title.includes('ibmbob')) {
            score += 5;
        } else if (title.includes('bob') && title.includes('ibm')) {
            score += 4;
        } else if (title.includes('project bob')) {
            score += 4;
        }

        // タイトルがIBM Bobで始まる場合はさらに加点
        if (title.startsWith('ibm bob') || title.startsWith('ibmbob')) {
            score += 2;
        }

        // タグでの出現
        if (tags.includes('ibm bob') || tags.includes('ibmbob')) {
            score += 3;
        } else if (tags.includes('ibm') && tags.includes('bob')) {
            score += 2;
        }

        // 本文での出現頻度（最初の500文字を重視）
        const bodyStart = body.substring(0, 500);
        const bodyRest = body.substring(500);
        
        const countInStart = (bodyStart.match(/ibm bob|ibmbob|project bob/gi) || []).length;
        const countInRest = (bodyRest.match(/ibm bob|ibmbob|project bob/gi) || []).length;
        
        // 冒頭での言及は重要
        if (countInStart >= 3) {
            score += 3;
        } else if (countInStart >= 1) {
            score += 2;
        }
        
        // 全体での言及
        if (countInRest >= 5) {
            score += 2;
        } else if (countInRest >= 2) {
            score += 1;
        }

        // IBM Bob以外のメイントピックがある場合は減点
        const otherTopics = [
            'claude', 'chatgpt', 'copilot', 'cursor', 'windsurf',
            'react', 'vue', 'angular', 'next.js', 'python', 'java',
            'docker', 'kubernetes', 'aws', 'azure', 'gcp'
        ];
        
        const titleHasOtherTopic = otherTopics.some(topic =>
            title.includes(topic) && !title.startsWith('ibm bob') && !title.startsWith('ibmbob')
        );
        
        if (titleHasOtherTopic) {
            score -= 2;
        }

        // いいね数による補正（人気記事は関連度が高い可能性）
        if (article.likesCount >= 10) {
            score += 1;
        }

        return Math.max(0, Math.min(10, score)); // 0-10の範囲に制限
    }

    /**
     * 記事の妥当性をチェック
     * @private
     */
    _isValidArticle(article) {
        return article &&
               article.id &&
               article.title &&
               article.url &&
               article.user &&
               !article.private; // 非公開記事を除外
    }

    /**
     * 日付をフォーマット
     * @private
     */
    _formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    }

    /**
     * 記事の抜粋を作成
     * @private
     */
    _createExcerpt(title, body, maxLength = 100) {
        // Markdown記号を削除
        const cleanBody = body
            .replace(/[#*`>\[\]]/g, '')
            .replace(/\n+/g, ' ')
            .trim();
        
        if (cleanBody.length <= maxLength) {
            return cleanBody;
        }
        
        return cleanBody.substring(0, maxLength) + '...';
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
     * キャッシュから記事を取得
     * @private
     */
    _getCachedArticles() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;

            const data = JSON.parse(cached);
            
            // バージョンチェック
            if (data.version !== this.cacheVersion) {
                console.log('キャッシュバージョンが古いため削除します');
                this._clearCache();
                return null;
            }

            // 有効期限チェック
            const now = Date.now();
            if (now - data.timestamp > this.cacheExpiry) {
                console.log('キャッシュの有効期限が切れています');
                this._clearCache();
                return null;
            }

            return data.articles;
        } catch (error) {
            console.error('キャッシュ読み込みエラー:', error);
            this._clearCache();
            return null;
        }
    }

    /**
     * 記事をキャッシュに保存
     * @private
     */
    _cacheArticles(articles) {
        try {
            const cacheData = {
                version: this.cacheVersion,
                timestamp: Date.now(),
                lastUpdate: new Date().toISOString(),
                articles: articles
            };
            
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
            console.log(`${articles.length}件の記事をキャッシュしました`);
        } catch (error) {
            console.error('キャッシュ保存エラー:', error);
            // LocalStorageが満杯の場合は古いキャッシュを削除
            if (error.name === 'QuotaExceededError') {
                this._clearCache();
            }
        }
    }

    /**
     * キャッシュをクリア
     * @private
     */
    _clearCache() {
        try {
            localStorage.removeItem(this.cacheKey);
            console.log('キャッシュをクリアしました');
        } catch (error) {
            console.error('キャッシュクリアエラー:', error);
        }
    }

    /**
     * キャッシュ情報を取得
     * @returns {Object|null} キャッシュ情報
     */
    getCacheInfo() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;

            const data = JSON.parse(cached);
            const now = Date.now();
            const age = now - data.timestamp;
            const remaining = this.cacheExpiry - age;

            return {
                version: data.version,
                lastUpdate: data.lastUpdate,
                articleCount: data.articles.length,
                ageMinutes: Math.floor(age / 60000),
                remainingMinutes: Math.floor(remaining / 60000),
                isExpired: remaining <= 0
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * エラーハンドリング
     * @private
     */
    _handleError(error) {
        const errorMessage = error.message || String(error);

        if (errorMessage.includes('RATE_LIMIT')) {
            const retryAfter = errorMessage.split(':')[1] || 60;
            return new Error(`レート制限に達しました。${retryAfter}秒後に再試行してください。`);
        }

        if (errorMessage.includes('TIMEOUT')) {
            return new Error('接続がタイムアウトしました。ネットワーク接続を確認してください。');
        }

        if (errorMessage.includes('API_ERROR')) {
            return new Error('Qiita APIでエラーが発生しました。しばらく待ってから再試行してください。');
        }

        return new Error('記事の取得に失敗しました。後ほど再試行してください。');
    }
}

// シングルトンインスタンスをエクスポート
const articleManager = new ArticleManager();

// Made with Bob
