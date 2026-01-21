/**
 * Qiita API Client
 * Qiita APIとの通信を管理するモジュール
 */

class QiitaAPIClient {
    constructor() {
        this.baseURL = 'https://qiita.com/api/v2';
        this.timeout = 10000; // 10秒
        this.maxRetries = 3;
    }

    /**
     * IBM Bobに関する記事を検索
     * @param {Object} options - 検索オプション
     * @param {number} options.page - ページ番号（デフォルト: 1）
     * @param {number} options.perPage - 1ページあたりの記事数（デフォルト: 20）
     * @returns {Promise<Array>} 記事の配列
     */
    async searchArticles(options = {}) {
        const { page = 1, perPage = 20 } = options;
        
        // 検索キーワードのバリエーション
        const keywords = ['IBM Bob', 'IBMBob', 'Project Bob'];
        const allArticles = [];
        const seenIds = new Set();

        for (const keyword of keywords) {
            try {
                const articles = await this._fetchWithRetry(
                    `/items?query=${encodeURIComponent(keyword)}&page=${page}&per_page=${perPage}`
                );

                // 重複を除外して追加
                articles.forEach(article => {
                    if (!seenIds.has(article.id)) {
                        seenIds.add(article.id);
                        allArticles.push(article);
                    }
                });
            } catch (error) {
                console.warn(`キーワード "${keyword}" での検索に失敗:`, error.message);
                // 他のキーワードでの検索を続行
            }
        }

        return allArticles;
    }

    /**
     * リトライ機能付きのFetch
     * @private
     */
    async _fetchWithRetry(endpoint, retryCount = 0) {
        const url = `${this.baseURL}${endpoint}`;
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // レート制限チェック
            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After') || 60;
                throw new Error(`RATE_LIMIT:${retryAfter}`);
            }

            if (!response.ok) {
                throw new Error(`API_ERROR:${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            // タイムアウトエラー
            if (error.name === 'AbortError') {
                if (retryCount < this.maxRetries) {
                    const delay = Math.pow(2, retryCount) * 1000; // 指数バックオフ
                    await this._sleep(delay);
                    return this._fetchWithRetry(endpoint, retryCount + 1);
                }
                throw new Error('TIMEOUT_ERROR');
            }

            // レート制限エラー
            if (error.message.startsWith('RATE_LIMIT:')) {
                throw error;
            }

            // その他のエラーでリトライ
            if (retryCount < this.maxRetries) {
                const delay = Math.pow(2, retryCount) * 1000;
                await this._sleep(delay);
                return this._fetchWithRetry(endpoint, retryCount + 1);
            }

            throw error;
        }
    }

    /**
     * 指定時間待機
     * @private
     */
    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * APIの状態をチェック
     * @returns {Promise<boolean>} APIが利用可能かどうか
     */
    async checkAPIStatus() {
        try {
            await this._fetchWithRetry('/items?page=1&per_page=1');
            return true;
        } catch (error) {
            console.error('API状態チェック失敗:', error);
            return false;
        }
    }
}

// シングルトンインスタンスをエクスポート
const qiitaAPI = new QiitaAPIClient();

// Made with Bob
