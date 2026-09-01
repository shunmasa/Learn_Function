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

## 3. GitHub Pages に公開

1. GitHub に新しいリポジトリを作る（例: `learn-fp`）
2. このフォルダの中身を push

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USER/learn-fp.git
git push -u origin main
```

3. GitHub → **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: `main` / `/ (root)`
4. 数分後: `https://YOUR_USER.github.io/learn-fp/`

（リポジトリ名が `YOUR_USER.github.io` ならルートで公開されます）

---

## 4. Admin アカウント

| 項目 | 値 |
|------|-----|
| メール | `masashilandjob@gmail.com` |
| パスワード | `1111` |

Worker 初回アクセス時に Admin が自動作成されます。全レッスン開放。

---

## API 一覧

| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/health` | 疎通確認 |
| POST | `/api/register` | 新規登録 `{ name, email, password }` |
| POST | `/api/login` | ログイン `{ email, password }` → `{ token, user }` |
| POST | `/api/logout` | ログアウト（Bearer トークン） |
| GET | `/api/me` | 現在のユーザー |
| PUT | `/api/progress` | 進捗保存 `{ completed_js, completed_py, lang }` |

パスワードは Worker 側で salt + SHA-256 ハッシュ保存です。

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
