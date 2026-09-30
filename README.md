# Learn Code (JS & Python)

GitHub Pages でフロントを公開し、Cloudflare Workers + KV をログイン／進捗のバックエンドにできます。

## 構成

| 部分 | 役割 |
|------|------|
| `index.html` など | 静的サイト（GitHub Pages） |
| `worker/` | ログイン・登録・進捗 API（Cloudflare Workers） |
| `js/config.js` | Worker の URL 設定 |

API を設定しない場合は、これまで通りブラウザの localStorage のみで動作します。

---

## 1. Cloudflare Worker をデプロイ

### 準備
- [Cloudflare](https://dash.cloudflare.com/) アカウント
- Node.js が入った PC

```bash
cd worker
npm install
npx wrangler login
```

### KV を作成

```bash
npx wrangler kv namespace create LEARN_FP_USERS
```

表示された **id** を `wrangler.toml` の `id = "REPLACE_WITH_YOUR_KV_NAMESPACE_ID"` に貼る。

### CORS（GitHub Pages の URL）

`wrangler.toml` の `ALLOWED_ORIGINS` に自分の Pages オリジンを追加:

```toml
ALLOWED_ORIGINS = "http://localhost:8765,https://YOUR_USER.github.io"
```

リポジトリが `https://YOUR_USER.github.io/REPO/` の場合も、オリジンは `https://YOUR_USER.github.io` です。

### デプロイ

```bash
npx wrangler deploy
```

成功すると `https://learn-fp-api.<subdomain>.workers.dev` のような URL が出ます。

動作確認:

```bash
curl https://learn-fp-api.<subdomain>.workers.dev/api/health
```

---

## 2. フロントに API URL を設定

`js/config.js` を編集:

```js
window.LEARN_FP_API = "https://learn-fp-api.<subdomain>.workers.dev";
```

---





## ローカル確認

```bash
# フロント
python3 -m http.server 8765

# API（別ターミナル）
cd worker && npx wrangler dev
```

`js/config.js` を一時的に:

```js
window.LEARN_FP_API = "http://127.0.0.1:8787";
```

---

## Playground

判定なしの練習用エディター: `playground.html`
