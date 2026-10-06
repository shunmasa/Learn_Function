Learn Code (JS & Python)
GitHub Pages でフロントを公開し、Cloudflare Workers + KV をログイン・登録・進捗保存のバックエンドとして利用できます。
構成
部分	役割
index.html など	静的サイト（GitHub Pages）
js/app.js	フロントの認証・レッスン・進捗処理
js/config.js	Cloudflare Worker の API URL 設定
worker/	ログイン・登録・進捗 API（Cloudflare Workers）
Cloudflare KV	ユーザー情報・セッション・進捗・ログイン試行状態の保存


本番環境では Cloudflare Worker を設定して利用することを推奨します。
1. Cloudflare Worker をデプロイ
準備
- Cloudflare アカウント
- Node.js が入った PC
- Wrangler
cd worker
npm install
npx wrangler login
KV を作成
npx wrangler kv namespace create LEARN_FP_USERS
表示された id を wrangler.toml の KV 設定に追加します。
例:
[[kv_namespaces]]
binding = "USERS"
id = "YOUR_KV_NAMESPACE_ID"
Admin 情報を Secret に登録
Admin のメールアドレスやパスワードはソースコードへ直接書かず、Cloudflare Secret として設定します。
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
コマンド実行後、値の入力を求められます。
パスワードや個人情報を GitHub の公開リポジトリ、README、wrangler.toml などへ直接記載しないでください。

CORS
wrangler.toml の ALLOWED_ORIGINS に GitHub Pages のオリジンを設定します。
ALLOWED_ORIGINS = "http://localhost:8765,https://YOUR_USER.github.io"
リポジトリが https://YOUR_USER.github.io/REPO/ の場合も、オリジンは通常 https://YOUR_USER.github.io です。
デプロイ
npx wrangler deploy
成功すると、次のような Worker URL が表示されます。
https://learn-fp-api.<subdomain>.workers.dev
動作確認:
curl https://learn-fp-api.<subdomain>.workers.dev/api/health
2. フロントに API URL を設定
js/config.js を編集します。
window.LEARN_FP_API = "https://learn-fp-api.<subdomain>.workers.dev";
3. GitHub Pages に公開
1. GitHub リポジトリへファイルを push
2. GitHub の Settings → Pages を開く
3. Source を Deploy from a branch に設定
4. Branch を main、フォルダを / (root) に設定
公開URLの例:
https://YOUR_USER.github.io/REPO/
4. セキュリティ
パスワード
- 新規登録パスワードは 8文字以上
- パスワードは Worker 側で salt を使ったハッシュとして保存
- 生のパスワードは KV に保存しない
- Admin 情報は Cloudflare Secret から取得
JavaScript 実行環境
学習者が入力した JavaScript は Web Worker 内で実行します。
これにより、学習コードから親ページの以下へ直接アクセスできないようにします。
- localStorage
- ログイントークン
- DOM
- 親ページの JavaScript 状態
実行が長時間続いた場合はタイムアウトで停止します。
ログイン Rate Limit
ログイン失敗は IP 単位で記録します。
- 連続 5回失敗で一時ブロック
- ブロック時間は 15分
- ログイン成功時に失敗カウントをクリア
- 制限中は HTTP 429 を返す
より強い防御が必要な場合は、Cloudflare 側の Rate Limiting 機能も併用してください。
セッション
ログイン成功時にランダムなセッショントークンを発行し、KV に保存します。
API 一覧
Method	Path	説明
GET	/api/health	疎通確認
POST	/api/register	新規登録 { name, email, password }
POST	/api/login	ログイン { email, password } → { token, user }
POST	/api/logout	ログアウト（Bearer トークン）
GET	/api/me	現在のユーザー
PUT	/api/progress	進捗保存 { completed_js, completed_py, lang }


ローカル確認
フロント
python3 -m http.server 8765
API
別ターミナルで:
cd worker
npx wrangler dev
ローカル Worker を使う場合は js/config.js を一時的に変更します。
window.LEARN_FP_API = "http://127.0.0.1:8787";
Playground
判定なしの練習用エディター:
playground.html
公開前チェック
公開リポジトリへ push する前に、以下が含まれていないことを確認してください。
- 個人のメールアドレス
- 実際のパスワード
- API Key
- Cloudflare Token
- Secret
- セッショントークン
- その他の個人情報・認証情報