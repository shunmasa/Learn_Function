// HTML course — 10 progressive practice lessons + 2 projects
// Examples and practice assignments intentionally use different text/content.

function htmlLessonDocument(code) {
  return new DOMParser().parseFromString(String(code || ""), "text/html");
}

function hasHtmlDoctype(code) {
  return /^\s*<!doctype\s+html\s*>/i.test(String(code || ""));
}

function normalizedText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function headingHierarchyIsValid(code) {
  const doc = htmlLessonDocument(code);
  const headings = [...doc.querySelectorAll("h1,h2,h3,h4,h5,h6")];
  if (!headings.length) return false;

  let previous = Number(headings[0].tagName.slice(1));
  for (let i = 1; i < headings.length; i++) {
    const current = Number(headings[i].tagName.slice(1));
    if (current > previous + 1) return false;
    previous = current;
  }
  return true;
}

const LESSONS_HTML = [
  {
    id: 1,
    title: "HTMLページの骨組み",
    description: "ページの基本構造を作る",
    content: `
      <p><strong>まず見本:</strong></p>
      <pre>&lt;!DOCTYPE html&gt;
&lt;html lang="ja"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;title&gt;海のページ&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;p&gt;青い海が好きです。&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <p><strong>練習課題:</strong> 見本とは違う内容で「わたしの学校」というページを作ってください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li><code>&lt;!DOCTYPE html&gt;</code> がある</li>
        <li><code>&lt;html lang="ja"&gt;</code> を使う</li>
        <li><code>&lt;meta charset="UTF-8"&gt;</code> がある</li>
        <li><code>&lt;title&gt;</code> の文章は「わたしの学校」</li>
        <li><code>body</code> の中に <code>p</code> で「学校へようこそ。」と書く</li>
      </ul>

      <div class="challenge-box">
        見本をコピーせず、指定された別の文章でページを完成させましょう。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>海のページ</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 28px; background: #eef7ff; color: #17324d; }
    .box { max-width: 520px; margin: auto; padding: 24px; background: white; border: 1px solid #c9dfef; border-radius: 12px; }
    h1 { margin-top: 0; color: #2563eb; }
  </style>
</head>
<body>
  <div class="box">
    <h1>海のページ</h1>
    <p>青い海が好きです。</p>
  </div>
</body>
</html>`,
    starterCode: `<!DOCTYPE html>
<html lang="ja">
<head>

</head>
<body>

</body>
</html>`,
    solution: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>わたしの学校</title>
</head>
<body>
  <p>学校へようこそ。</p>
</body>
</html>`,
    explanation: `<p>HTMLの骨組みは同じでも、中の文章を変えて何度も書くことで形を覚えます。</p>`,
    tests: [
      { description: "DOCTYPE html がある", run: code => hasHtmlDoctype(code) },
      { description: "html の lang が ja", run: code => htmlLessonDocument(code).documentElement.getAttribute("lang") === "ja" },
      {
        description: "UTF-8 が設定されている",
        run: code => {
          const meta = htmlLessonDocument(code).querySelector("meta[charset]");
          return !!meta && String(meta.getAttribute("charset")).toUpperCase() === "UTF-8";
        }
      },
      { description: "title が「わたしの学校」", run: code => htmlLessonDocument(code).title.trim() === "わたしの学校" },
      {
        description: "p に「学校へようこそ。」",
        run: code => {
          const p = htmlLessonDocument(code).querySelector("body p");
          return !!p && normalizedText(p.textContent) === "学校へようこそ。";
        }
      }
    ],
    hints: ["title は head の中", "画面に見える文章は body の中"]
  },

  {
    id: 2,
    title: "見出しを階層で書こう",
    description: "h1・h2・h3を使い分ける",
    content: `
      <p><strong>まず見本:</strong></p>
      <pre>&lt;h1&gt;動物図鑑&lt;/h1&gt;
&lt;h2&gt;哺乳類&lt;/h2&gt;
&lt;h3&gt;犬&lt;/h3&gt;
&lt;h2&gt;鳥類&lt;/h2&gt;
&lt;h3&gt;すずめ&lt;/h3&gt;</pre>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <p><strong>練習課題:</strong> 「春の楽しみ」という別テーマの見出し構造を作ってください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li><code>h1</code> は「春の楽しみ」</li>
        <li><code>h2</code> は「花」と「食べ物」の2つ</li>
        <li><code>h3</code> は「桜」「チューリップ」「いちご」の3つ</li>
      </ul>

      <div class="challenge-box">
        Lesson 1よりタグ数が増えます。h1 → h2 → h3 の順番を意識しましょう。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>動物図鑑</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 28px; color: #1f2937; }
    h1 { color: #1d4ed8; border-bottom: 3px solid #bfdbfe; padding-bottom: 8px; }
    h2 { margin-top: 24px; color: #166534; }
    h3 { margin-left: 18px; color: #475569; }
  </style>
</head>
<body>
  <h1>動物図鑑</h1>
  <h2>哺乳類</h2>
  <h3>犬</h3>
  <h2>鳥類</h2>
  <h3>すずめ</h3>
</body>
</html>`,
    starterCode: `<!-- 春の楽しみを見出しで整理しよう -->`,
    solution: `<h1>春の楽しみ</h1>

<h2>花</h2>
<h3>桜</h3>
<h3>チューリップ</h3>

<h2>食べ物</h2>
<h3>いちご</h3>`,
    explanation: `<p>同じ種類の情報は同じレベルの見出しにそろえます。</p>`,
    tests: [
      {
        description: "h1 が「春の楽しみ」",
        run: code => {
          const h1s = [...htmlLessonDocument(code).querySelectorAll("h1")];
          return h1s.length === 1 && normalizedText(h1s[0].textContent) === "春の楽しみ";
        }
      },
      {
        description: "h2 に「花」「食べ物」",
        run: code => {
          const vals = [...htmlLessonDocument(code).querySelectorAll("h2")].map(x => normalizedText(x.textContent));
          return vals.length >= 2 && vals.includes("花") && vals.includes("食べ物");
        }
      },
      {
        description: "h3 に3項目",
        run: code => {
          const vals = [...htmlLessonDocument(code).querySelectorAll("h3")].map(x => normalizedText(x.textContent));
          return ["桜","チューリップ","いちご"].every(v => vals.includes(v));
        }
      },],
    hints: ["花と食べ物は同じh2", "桜・チューリップ・いちごはh3"]
  },

  {
    id: 3,
    title: "文章を2段落で書こう",
    description: "p・strong・br・emを練習する",
    content: `
      <p><strong>まず見本:</strong></p>
      <pre>&lt;p&gt;こんにちは。&lt;strong&gt;Masa&lt;/strong&gt;です。&lt;br&gt;よろしくお願いします。&lt;/p&gt;</pre>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <p><strong>練習課題:</strong> 図書館へ行った日の文章を、2つの段落に分けて書いてください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li><code>p</code> を2つ使う</li>
        <li>1つ目のpに「今日は図書館に行きました。」</li>
        <li>「図書館」を <code>strong</code> で囲む</li>
        <li>1つ目のpに <code>br</code> を1つ入れる</li>
        <li>2つ目のpで「また行きたいです。」を <code>em</code> で囲む</li>
      </ul>

      <div class="challenge-box">
        文章の内容もタグの使い方も、見本とは変えて練習します。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>文章の見本</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 28px; background: #fafafa; }
    p { max-width: 560px; padding: 16px; background: white; border-left: 4px solid #60a5fa; line-height: 1.8; }
    strong { color: #dc2626; }
    em { color: #2563eb; }
  </style>
</head>
<body>
  <p>こんにちは。<strong>Masa</strong>です。<br><em>よろしくお願いします。</em></p>
</body>
</html>`,
    starterCode: `<!-- 2つのpを書こう -->`,
    solution: `<p>今日は<strong>図書館</strong>に行きました。<br>本を3冊読みました。</p>
<p><em>また行きたいです。</em></p>`,
    explanation: `<p>複数の段落を使うと、文章のまとまりが分かりやすくなります。</p>`,
    tests: [
      { description: "p が2つ以上", run: code => htmlLessonDocument(code).querySelectorAll("p").length >= 2 },
      {
        description: "1つ目のpに指定文",
        run: code => {
          const p = htmlLessonDocument(code).querySelector("p");
          return !!p && normalizedText(p.textContent).includes("今日は図書館に行きました。");
        }
      },
      {
        description: "strong が「図書館」",
        run: code => {
          const el = htmlLessonDocument(code).querySelector("p strong");
          return !!el && normalizedText(el.textContent) === "図書館";
        }
      },
      { description: "1つ目のpにbr", run: code => !!htmlLessonDocument(code).querySelector("p br") },
      {
        description: "em が「また行きたいです。」",
        run: code => [...htmlLessonDocument(code).querySelectorAll("p em")].some(x => normalizedText(x.textContent) === "また行きたいです。")
      }
    ],
    hints: ["pを2個書く", "図書館だけstrong", "2つ目のpにem"]
  },

  {
    id: 4,
    title: "リンクを2つ作ろう",
    description: "外部リンクとページ内リンク",
    content: `
      <p><strong>まず見本:</strong></p>
      <pre>&lt;a href="https://www.example.com"&gt;サンプルサイトへ&lt;/a&gt;</pre>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <p><strong>練習課題:</strong> 今回はリンクを2つ作ります。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li>1つ目は <code>href="https://www.nhk.or.jp/school/"</code>、文字は「NHK for Schoolを見る」</li>
        <li>2つ目は <code>href="about.html"</code>、文字は「このサイトについて」</li>
        <li>両方とも <code>a</code> タグを使う</li>
      </ul>

      <div class="challenge-box">
        URLの種類が違っても、aタグとhrefの基本は同じです。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>リンクの見本</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 32px; }
    a { display: inline-block; padding: 10px 16px; border-radius: 8px; background: #2563eb; color: white; text-decoration: none; }
  </style>
</head>
<body>
  <a href="https://www.example.com">サンプルサイトへ</a>
</body>
</html>`,
    starterCode: `<!-- 外部サイトへのリンク -->

<!-- 自分のページへのリンク -->`,
    solution: `<a href="https://www.nhk.or.jp/school/">NHK for Schoolを見る</a>
<a href="about.html">このサイトについて</a>`,
    explanation: `<p>絶対URLと相対URLの両方を練習します。</p>`,
    tests: [
      {
        description: "NHK for Schoolリンクが正しい",
        run: code => {
          const a = htmlLessonDocument(code).querySelector('a[href="https://www.nhk.or.jp/school/"]');
          return !!a && normalizedText(a.textContent) === "NHK for Schoolを見る";
        }
      },
      {
        description: "about.htmlリンクが正しい",
        run: code => {
          const a = htmlLessonDocument(code).querySelector('a[href="about.html"]');
          return !!a && normalizedText(a.textContent) === "このサイトについて";
        }
      },
      { description: "aタグが2つ以上", run: code => htmlLessonDocument(code).querySelectorAll("a").length >= 2 }
    ],
    hints: ["外部URLはhttps://から", "同じサイト内ならabout.htmlのように書けます"]
  },

  {
    id: 5,
    title: "画像を3枚並べよう",
    description: "srcとaltを3セット書く",
    content: `
      <p><strong>まず見本:</strong></p>
      <pre>&lt;img src="cat.svg" alt="ソファで寝ている猫"&gt;</pre>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <p><strong>練習課題:</strong> 今度は3枚の画像を書きます。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li><code>assets/dog.svg</code> / alt「公園を走る犬」</li>
        <li><code>assets/flower.svg</code> / alt「黄色い花」</li>
        <li><code>assets/ocean.svg</code> / alt「青い海」</li>
        <li>imgタグを3つ以上使う</li>
      </ul>

      <p><strong>画像について:</strong> 実際に
      <code>assets/dog.svg</code>、<code>assets/flower.svg</code>、<code>assets/ocean.svg</code>
      をリポジトリの <code>assets/</code> フォルダに置けば、右側の <strong>VIEW</strong> で実際に画像が表示されます。</p>

      <div class="challenge-box">
        画像が増えても、1枚ずつsrcとaltをセットで書きましょう。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>画像の見本</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 28px; background: #f8fafc; }
    img { display: block; width: min(320px, 100%); padding: 12px; background: white; border: 1px solid #dbe3ef; border-radius: 12px; }
  </style>
</head>
<body>
  <img src="assets/dog.svg" alt="公園を走る犬">
</body>
</html>`,
    starterCode: `<!-- 画像を3枚書こう -->`,
    solution: `<img src="assets/dog.svg" alt="公園を走る犬">
<img src="assets/flower.svg" alt="黄色い花">
<img src="assets/ocean.svg" alt="青い海">`,
    explanation: `<p>altは画像ごとに、その画像の内容に合った文章を書きます。</p>`,
    tests: [
      { description: "imgが3つ以上", run: code => htmlLessonDocument(code).querySelectorAll("img").length >= 3 },
      {
        description: "犬の画像が正しい",
        run: code => {
          const img = htmlLessonDocument(code).querySelector('img[src="assets/dog.svg"]');
          return !!img && img.getAttribute("alt") === "公園を走る犬";
        }
      },
      {
        description: "花の画像が正しい",
        run: code => {
          const img = htmlLessonDocument(code).querySelector('img[src="assets/flower.svg"]');
          return !!img && img.getAttribute("alt") === "黄色い花";
        }
      },
      {
        description: "海の画像が正しい",
        run: code => {
          const img = htmlLessonDocument(code).querySelector('img[src="assets/ocean.svg"]');
          return !!img && img.getAttribute("alt") === "青い海";
        }
      }
    ],
    hints: ["imgは3つ", "それぞれaltの文章が違います"]
  },


  {
    id: 6,
    title: "プロジェクト1: 自己紹介ページ",
    description: "Lesson 1〜5の内容を組み合わせて1ページ作る",
    content: `
      <p><strong>プロジェクト:</strong> Lesson 1〜5 で学んだ内容を使って、自己紹介ページを1枚完成させましょう。</p>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <h3>ページの設計図</h3>
      <pre>ページ全体
├ title「わたしの自己紹介」
├ h1「わたしの自己紹介」
├ h2「わたしについて」 → p(strong / br / em)
├ h2「好きな場所」 → img + p
└ a「友だちのページ」</pre>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li><code>&lt;!DOCTYPE html&gt;</code> と <code>lang="ja"</code> を使う</li>
        <li><code>title</code> は「わたしの自己紹介」</li>
        <li><code>h1</code> は「わたしの自己紹介」の1つだけ</li>
        <li><code>h2</code> は「わたしについて」「好きな場所」</li>
        <li>「わたしについて」の文章は自由。<code>p</code> の中に <code>strong</code>、<code>br</code>、<code>em</code> のどれか1つを使う</li>
        <li><code>assets/ocean.svg</code> の画像を使い、<code>alt</code> は「青い海」</li>
        <li><code>a</code> で <code>https://www.example.com</code> へのリンク「サンプルサイトへ」を作る</li>
      </ul>

      <div class="challenge-box">
        Lesson 1〜5 の内容だけを使います。上から1つずつ作って、テストを確認しましょう。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>わたしのプロフィール</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #eef4fb; color: #1f2937; }
    main { max-width: 680px; margin: 32px auto; padding: 26px; background: white; border-radius: 14px; }
    h1 { color: #1d4ed8; }
    h2 { margin-top: 26px; color: #0f766e; }
    img { width: min(280px, 100%); border-radius: 10px; }
    a { color: #2563eb; font-weight: bold; }
  </style>
</head>
<body>
  <main>
    <h1>わたしのプロフィール</h1>
    <h2>わたしについて</h2>
    <p>こんにちは。<strong>Ken</strong>です。<br><em>プログラミングを勉強中です。</em></p>
    <h2>好きな場所</h2>
    <img src="assets/flower.svg" alt="黄色い花">
    <p>公園が好きです。</p>
    <a href="https://www.example.com">おすすめサイトへ</a>
  </main>
</body>
</html>`,
    starterCode: `<!DOCTYPE html>
<html lang="ja">
<head>

</head>
<body>

</body>
</html>`,
    solution: `<!DOCTYPE html>
<html lang="ja">
<head>
  <title>わたしの自己紹介</title>
</head>
<body>
  <h1>わたしの自己紹介</h1>

  <h2>わたしについて</h2>
  <p>
    こんにちは。<strong>Masa</strong>です。<br>
    <em>よろしくお願いします。</em>
  </p>

  <h2>好きな場所</h2>
  <img src="assets/ocean.svg" alt="青い海">
  <p>わたしは海が好きです。</p>

  <a href="https://www.example.com">サンプルサイトへ</a>
</body>
</html>`,
    explanation: `<p>Lesson 1〜5で学んだ、ページの骨組み・見出し・文章・リンク・画像を組み合わせると、1枚のWebページになります。</p>`,
    tests: [
      {
        description: "DOCTYPE と lang=ja がある",
        run: code => {
          const doc = htmlLessonDocument(code);
          return hasHtmlDoctype(code) && doc.documentElement.getAttribute("lang") === "ja";
        }
      },
      {
        description: "title が「わたしの自己紹介」",
        run: code => {
          const doc = htmlLessonDocument(code);
          return doc.title.trim() === "わたしの自己紹介";
        }
      },
      {
        description: "h1 が1つで「わたしの自己紹介」",
        run: code => {
          const h1s = [...htmlLessonDocument(code).querySelectorAll("h1")];
          return h1s.length === 1 &&
            normalizedText(h1s[0].textContent) === "わたしの自己紹介";
        }
      },
      {
        description: "h2 に「わたしについて」「好きな場所」がある",
        run: code => {
          const vals = [...htmlLessonDocument(code).querySelectorAll("h2")]
            .map(x => normalizedText(x.textContent));
          return vals.includes("わたしについて") && vals.includes("好きな場所");
        }
      },
      {
        description: "自己紹介文で strong / br / em のどれか1つを使っている",
        run: code => {
          const doc = htmlLessonDocument(code);
          const aboutHeading = [...doc.querySelectorAll("h2")]
            .find(x => normalizedText(x.textContent) === "わたしについて");
          if (!aboutHeading) return false;
          const p = aboutHeading.nextElementSibling;
          return !!p &&
            p.tagName === "P" &&
            (
              !!p.querySelector("strong") ||
              !!p.querySelector("br") ||
              !!p.querySelector("em")
            );
        }
      },
      {
        description: "ocean.svg と alt「青い海」が正しい",
        run: code => {
          const img = htmlLessonDocument(code)
            .querySelector('img[src="assets/ocean.svg"]');
          return !!img && img.getAttribute("alt") === "青い海";
        }
      },
      {
        description: "サンプルサイトへのリンクが正しい",
        run: code => {
          const a = htmlLessonDocument(code)
            .querySelector('a[href="https://www.example.com"]');
          return !!a && normalizedText(a.textContent) === "サンプルサイトへ";
        }
      }
    ],
    hints: [
      "まず Lesson 1 の骨組みを完成させる",
      "h1 の下に h2 を2つ置く",
      "自己紹介の文章は自由。strong / br / em のどれか1つを入れればOK",
      "画像は src と alt、リンクは href を確認する"
    ]
  },

  {
    id: 7,
    title: "3項目ずつのリスト",
    description: "ulとolを少し長くする",
    content: `
      <p><strong>まず見本:</strong></p>

      <pre>&lt;ul&gt;
  &lt;li&gt;りんご&lt;/li&gt;
  &lt;li&gt;みかん&lt;/li&gt;
&lt;/ul&gt;

&lt;ol&gt;
  &lt;li&gt;手を洗う&lt;/li&gt;
  &lt;li&gt;材料を切る&lt;/li&gt;
&lt;/ol&gt;</pre>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <h3>見本の表示</h3>
      <div class="html-demo-result">
        <ul>
          <li>りんご</li>
          <li>みかん</li>
        </ul>
        <ol>
          <li>手を洗う</li>
          <li>材料を切る</li>
        </ol>
      </div>

      <p><strong>練習課題:</strong> 見本とは違う内容で、それぞれ3項目に増やして作ってください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li>ulに「パン」「牛乳」「たまご」</li>
        <li>olに「材料を準備する」「混ぜる」「焼く」</li>
        <li><code>ul</code> と <code>ol</code> のそれぞれに <code>li</code> が3つ以上</li>
      </ul>

      <div class="challenge-box">
        リストが長くなっても、ul/olの使い分けは同じです。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>リストの見本</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 28px; background: #f8fafc; }
    .list-box { max-width: 520px; padding: 20px 28px; background: white; border: 1px solid #dbe3ef; border-radius: 12px; }
    ul { color: #166534; }
    ol { color: #1d4ed8; }
    li { margin: 7px 0; }
  </style>
</head>
<body>
  <div class="list-box">
    <ul>
      <li>りんご</li>
      <li>みかん</li>
    </ul>
    <ol>
      <li>手を洗う</li>
      <li>材料を切る</li>
    </ol>
  </div>
</body>
</html>`,
    starterCode: `<!-- 買い物リスト -->

<!-- 作る手順 -->`,
    solution: `<ul>
  <li>パン</li>
  <li>牛乳</li>
  <li>たまご</li>
</ul>

<ol>
  <li>材料を準備する</li>
  <li>混ぜる</li>
  <li>焼く</li>
</ol>`,
    explanation: `<p>項目数が増えても、liを追加していけばOKです。</p>`,
    tests: [
      {
        description: "ulの3項目が正しい",
        run: code => {
          const vals = [...htmlLessonDocument(code).querySelectorAll("ul > li")].map(x => normalizedText(x.textContent));
          return ["パン","牛乳","たまご"].every(v => vals.includes(v));
        }
      },
      {
        description: "olの3項目が正しい",
        run: code => {
          const vals = [...htmlLessonDocument(code).querySelectorAll("ol > li")].map(x => normalizedText(x.textContent));
          return ["材料を準備する","混ぜる","焼く"].every(v => vals.includes(v));
        }
      },
      { description: "ulにliが3つ以上", run: code => htmlLessonDocument(code).querySelectorAll("ul > li").length >= 3 },
      { description: "olにliが3つ以上", run: code => htmlLessonDocument(code).querySelectorAll("ol > li").length >= 3 }
    ],
    hints: ["買い物はul", "手順はol"]
  },

  {
    id: 8,
    title: "span・div・classを使おう",
    description: "spanにclassをつけて、divでまとめる",
    content: `
      <p><strong>今回は3つだけ覚えます:</strong> <code>span</code> → <code>class</code> → <code>div</code></p>

      <h3>1. まず span</h3>
      <pre>&lt;span&gt;雨&lt;/span&gt;</pre>
      <p><code>span</code> は、文字の一部分をまとめるタグです。</p>

      <h3>2. class をつける</h3>
      <pre>&lt;span class="red"&gt;雨&lt;/span&gt;</pre>
      <p><code>class="red"</code> のように名前をつけると、CSSで見た目を変えられます。</p>

      <h3>3. div でまとめる</h3>
      <pre>&lt;div class="card"&gt;
  &lt;span class="red"&gt;雨&lt;/span&gt;
&lt;/div&gt;</pre>

      <p><strong>CSSは最初から入っています。</strong> 今回はHTMLだけ書いてください。</p>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <pre>&lt;style&gt;
.card {
  border: 2px solid #cbd5e1;
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
}
.red {
  color: red;
  font-weight: bold;
}
.blue {
  color: blue;
  font-weight: bold;
}
&lt;/style&gt;</pre>

      <p><strong>練習課題:</strong> cardを2つ作り、1つ目に「雨」、2つ目に「晴れ」を入れます。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li><code>div class="card"</code> が2つ</li>
        <li>1つ目のcardに <code>span class="red"</code> で「雨」</li>
        <li>2つ目のcardに <code>span class="blue"</code> で「晴れ」</li>
        <li><code>.card</code>、<code>.red</code>、<code>.blue</code> のCSSがある</li>
      </ul>

      <div class="challenge-box">
        h2やpは使いません。今回は span・div・class の3つに集中します。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>天気カード</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      font-family: Arial, sans-serif;
      background: #f4f7fb;
    }

    .card {
      max-width: 340px;
      border: 2px solid #cbd5e1;
      padding: 16px;
      margin: 10px auto;
      border-radius: 10px;
      background: white;
    }

    .red {
      color: red;
      font-weight: bold;
    }

    .blue {
      color: blue;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="red">雨</span>
  </div>

  <div class="card">
    <span class="blue">晴れ</span>
  </div>
</body>
</html>`,
    starterCode: `<style>
.card {
  border: 2px solid #cbd5e1;
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
}

.red {
  color: red;
  font-weight: bold;
}

.blue {
  color: blue;
  font-weight: bold;
}
</style>

<!-- 1つ目のcard -->


<!-- 2つ目のcard -->
`,
    solution: `<style>
.card {
  border: 2px solid #cbd5e1;
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
}

.red {
  color: red;
  font-weight: bold;
}

.blue {
  color: blue;
  font-weight: bold;
}
</style>

<div class="card">
  <span class="red">雨</span>
</div>

<div class="card">
  <span class="blue">晴れ</span>
</div>`,
    explanation: `<p><code>span</code> は文字の一部分、<code>div</code> はまとまり全体、<code>class</code> はCSSで見た目を指定するための名前です。</p>`,
    tests: [
      {
        description: "div.card が2つある",
        run: code => htmlLessonDocument(code).querySelectorAll("div.card").length >= 2
      },
      {
        description: "1つ目のcardに span.red「雨」",
        run: code => {
          const cards = [...htmlLessonDocument(code).querySelectorAll("div.card")];
          const span = cards[0]?.querySelector("span.red");
          return !!span && normalizedText(span.textContent) === "雨";
        }
      },
      {
        description: "2つ目のcardに span.blue「晴れ」",
        run: code => {
          const cards = [...htmlLessonDocument(code).querySelectorAll("div.card")];
          const span = cards[1]?.querySelector("span.blue");
          return !!span && normalizedText(span.textContent) === "晴れ";
        }
      },
      {
        description: "card / red / blue のCSSが設定されている",
        run: code => {
          const css = [...htmlLessonDocument(code).querySelectorAll("style")]
            .map(style => style.textContent)
            .join("\\n")
            .replace(/\\s+/g, " ");

          return /\\.card\\s*\\{[^}]*border\\s*:/i.test(css) &&
                 /\\.red\\s*\\{[^}]*color\\s*:\\s*red\\b/i.test(css) &&
                 /\\.blue\\s*\\{[^}]*color\\s*:\\s*blue\\b/i.test(css);
        }
      }
    ],
    hints: [
      "まず <span class=\"red\">雨</span> を書く",
      "そのspanを <div class=\"card\">...</div> で囲む",
      "2つ目は red を blue にして「晴れ」と書く",
      "CSSは最初から入っているので変更しなくてOK"
    ]
  },

  {
    id: 9,
    title: "2セクションのページを作ろう",
    description: "header・main・section・footerを組み合わせる",
    content: `
      <p><strong>まず見本:</strong> 「部活動ニュース」という簡単なページを見てみましょう。</p>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <pre>&lt;header&gt;
  &lt;h1&gt;部活動ニュース&lt;/h1&gt;
&lt;/header&gt;

&lt;main&gt;
  &lt;section&gt;
    &lt;h2&gt;今日のお知らせ&lt;/h2&gt;
  &lt;/section&gt;

  &lt;section&gt;
    &lt;h2&gt;今月の予定&lt;/h2&gt;
  &lt;/section&gt;
&lt;/main&gt;

&lt;footer&gt;© 2026 Green School&lt;/footer&gt;</pre>

      <p><strong>練習課題:</strong> 見本と同じ形で「学校ニュース」ページを作ります。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li><code>header</code> の <code>h1</code> は「学校ニュース」</li>
        <li><code>main</code> の中に <code>section</code> が2つ</li>
        <li>1つ目の <code>h2</code> は「今週のお知らせ」</li>
        <li>2つ目の <code>h2</code> は「来週の予定」</li>
        <li><code>footer</code> に「© 2026 My School」</li>
      </ul>

      <div class="challenge-box">
        header → main → section → footer の順番を見ながら作りましょう。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>部活動ニュース</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f4f7fb;
      color: #1f2937;
    }

    header {
      padding: 22px;
      background: #2563eb;
      color: white;
    }

    header h1 {
      margin: 0;
    }

    main {
      padding: 22px;
    }

    section {
      margin-bottom: 16px;
      padding: 18px;
      background: white;
      border: 1px solid #dbe3ef;
      border-radius: 10px;
    }

    section h2 {
      margin: 0;
      font-size: 20px;
    }

    footer {
      padding: 16px 22px;
      background: #1e293b;
      color: white;
      text-align: center;
    }
  </style>
</head>
<body>
  <header>
    <h1>部活動ニュース</h1>
  </header>

  <main>
    <section>
      <h2>今日のお知らせ</h2>
    </section>

    <section>
      <h2>今月の予定</h2>
    </section>
  </main>

  <footer>© 2026 Green School</footer>
</body>
</html>`,
    starterCode: `<!-- header -->


<!-- main の中に section を2つ -->


<!-- footer -->
`,
    solution: `<header>
  <h1>学校ニュース</h1>
</header>

<main>
  <section>
    <h2>今週のお知らせ</h2>
  </section>

  <section>
    <h2>来週の予定</h2>
  </section>
</main>

<footer>© 2026 My School</footer>`,
    explanation: `<p><code>header</code> はページの上、<code>main</code> は中心の内容、<code>section</code> は内容のまとまり、<code>footer</code> はページの下です。</p>`,
    tests: [
      {
        description: "header の h1 が「学校ニュース」",
        run: code => normalizedText(htmlLessonDocument(code).querySelector("header h1")?.textContent) === "学校ニュース"
      },
      {
        description: "main の中に section が2つ",
        run: code => htmlLessonDocument(code).querySelectorAll("main > section").length >= 2
      },
      {
        description: "1つ目の section は「今週のお知らせ」",
        run: code => {
          const sections = [...htmlLessonDocument(code).querySelectorAll("main > section")];
          return normalizedText(sections[0]?.querySelector("h2")?.textContent) === "今週のお知らせ";
        }
      },
      {
        description: "2つ目の section は「来週の予定」",
        run: code => {
          const sections = [...htmlLessonDocument(code).querySelectorAll("main > section")];
          return normalizedText(sections[1]?.querySelector("h2")?.textContent) === "来週の予定";
        }
      },
      {
        description: "footer が「© 2026 My School」",
        run: code => normalizedText(htmlLessonDocument(code).querySelector("footer")?.textContent) === "© 2026 My School"
      }
    ],
    hints: [
      "まず header と h1 を書く",
      "main の中に section を2つ書く",
      "最後に footer を書く"
    ]
  },

  {
    id: 10,
    title: "入力フォームを作ろう",
    description: "label・input・select・textarea・buttonを使う",
    content: `
      <p><strong>まず見本:</strong> シンプルな「イベント申込フォーム」を見てみましょう。</p>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <pre>&lt;form&gt;
  &lt;label for="student"&gt;名前&lt;/label&gt;
  &lt;input type="text" id="student"&gt;

  &lt;label for="email-example"&gt;メール&lt;/label&gt;
  &lt;input type="email" id="email-example"&gt;

  &lt;label for="classroom"&gt;クラス&lt;/label&gt;
  &lt;select id="classroom"&gt;
    &lt;option&gt;A組&lt;/option&gt;
    &lt;option&gt;B組&lt;/option&gt;
  &lt;/select&gt;

  &lt;label for="message"&gt;メッセージ&lt;/label&gt;
  &lt;textarea id="message"&gt;&lt;/textarea&gt;

  &lt;input type="checkbox" id="news"&gt;
  &lt;label for="news"&gt;お知らせを受け取る&lt;/label&gt;

  &lt;button type="submit"&gt;申し込む&lt;/button&gt;
&lt;/form&gt;</pre>

      <h3>label と id</h3>

      <pre>&lt;label for="student"&gt;名前&lt;/label&gt;
&lt;input type="text" id="student"&gt;</pre>

      <p><code>for="student"</code> と <code>id="student"</code> を同じ名前にします。</p>

      <p><strong>練習課題:</strong> 「クラブ参加フォーム」を作ってください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li>名前: <code>label</code> + <code>input type="text"</code></li>
        <li>メール: <code>label</code> + <code>input type="email"</code></li>
        <li>学年: <code>select</code> に1年・2年・3年</li>
        <li>参加理由: <code>textarea</code></li>
        <li>確認チェック: <code>input type="checkbox"</code></li>
        <li>送信 <code>button</code></li>
        <li><code>label</code> の <code>for</code> と各入力欄の <code>id</code> を合わせる</li>
      </ul>

      <div class="challenge-box">
        1項目ずつ書きましょう。label の for と入力欄の id が同じか確認します。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>イベント申込フォーム</title>
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 28px;
      font-family: Arial, sans-serif;
      background: #eef3f9;
      color: #1f2937;
    }

    form {
      max-width: 460px;
      margin: 0 auto;
      padding: 24px;
      background: white;
      border: 1px solid #d7e0ec;
      border-radius: 14px;
    }

    label {
      display: block;
      margin: 14px 0 6px;
      font-weight: bold;
    }

    input[type="text"],
    input[type="email"],
    select,
    textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #b8c5d8;
      border-radius: 8px;
      font: inherit;
    }

    textarea {
      min-height: 80px;
    }

    .check {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 16px 0;
    }

    .check label {
      margin: 0;
    }

    button {
      width: 100%;
      padding: 11px;
      border: 0;
      border-radius: 8px;
      background: #2563eb;
      color: white;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <form>
    <label for="student">名前</label>
    <input type="text" id="student">

    <label for="email-example">メール</label>
    <input type="email" id="email-example">

    <label for="classroom">クラス</label>
    <select id="classroom">
      <option>A組</option>
      <option>B組</option>
    </select>

    <label for="message">メッセージ</label>
    <textarea id="message"></textarea>

    <div class="check">
      <input type="checkbox" id="news">
      <label for="news">お知らせを受け取る</label>
    </div>

    <button type="submit">申し込む</button>
  </form>
</body>
</html>`,
    starterCode: `<form>
  <!-- 名前 -->

  <!-- メール -->

  <!-- 学年 -->

  <!-- 参加理由 -->

  <!-- 確認チェック -->

  <!-- 送信 -->
</form>`,
    solution: `<form>
  <label for="name">名前</label>
  <input type="text" id="name">

  <label for="email">メール</label>
  <input type="email" id="email">

  <label for="grade">学年</label>
  <select id="grade">
    <option>1年</option>
    <option>2年</option>
    <option>3年</option>
  </select>

  <label for="reason">参加理由</label>
  <textarea id="reason"></textarea>

  <input type="checkbox" id="agree">
  <label for="agree">内容を確認しました</label>

  <button type="submit">送信</button>
</form>`,
    explanation: `<p>フォームは、labelと入力欄を1組ずつ作ると分かりやすくなります。forとidは同じ名前にします。</p>`,
    tests: [
      {
        description: "名前入力が正しい",
        run: code => {
          const doc = htmlLessonDocument(code);
          return normalizedText(doc.querySelector('label[for="name"]')?.textContent) === "名前" &&
                 !!doc.querySelector('input#name[type="text"]');
        }
      },
      {
        description: "メール入力が正しい",
        run: code => {
          const doc = htmlLessonDocument(code);
          return normalizedText(doc.querySelector('label[for="email"]')?.textContent) === "メール" &&
                 !!doc.querySelector('input#email[type="email"]');
        }
      },
      {
        description: "学年が1・2・3年",
        run: code => {
          const vals = [...htmlLessonDocument(code).querySelectorAll("select#grade option")]
            .map(x => normalizedText(x.textContent));
          return ["1年","2年","3年"].every(v => vals.includes(v));
        }
      },
      {
        description: "参加理由のlabelとtextareaが対応",
        run: code => {
          const doc = htmlLessonDocument(code);
          return normalizedText(doc.querySelector('label[for="reason"]')?.textContent) === "参加理由" &&
                 !!doc.querySelector("textarea#reason");
        }
      },
      {
        description: "確認checkboxのlabelとinputが対応",
        run: code => {
          const doc = htmlLessonDocument(code);
          return normalizedText(doc.querySelector('label[for="agree"]')?.textContent) === "内容を確認しました" &&
                 !!doc.querySelector('input#agree[type="checkbox"]');
        }
      },
      {
        description: "送信button",
        run: code => {
          const b = htmlLessonDocument(code).querySelector('button[type="submit"]');
          return !!b && normalizedText(b.textContent) === "送信";
        }
      }
    ],
    hints: [
      "label の for と入力欄の id を同じ名前にする",
      "名前は text、メールは email",
      "学年は select、参加理由は textarea",
      "最後に checkbox と送信buttonを書く"
    ]
  },

  {
    id: 11,
    title: "3行の成績表を完成させよう",
    description: "table・tr・th・tdを使って表を作る",
    content: `
      <p><strong>まず見本:</strong> 練習課題とほぼ同じ形の「ミニ成績表」を見てみましょう。</p>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>自分のコードをVIEWに戻す</button>
      </p>

      <pre>&lt;table&gt;
  &lt;tr&gt;
    &lt;th&gt;教科&lt;/th&gt;
    &lt;th&gt;点数&lt;/th&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td&gt;英語&lt;/td&gt;
    &lt;td&gt;88&lt;/td&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td&gt;理科&lt;/td&gt;
    &lt;td&gt;95&lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;</pre>

      <h3>表の作り方</h3>
      <ul>
        <li><code>table</code> … 表全体</li>
        <li><code>tr</code> … 表の1行</li>
        <li><code>th</code> … 見出しのセル</li>
        <li><code>td</code> … データのセル</li>
      </ul>

      <p><strong>練習課題:</strong> 見本と同じ構造で、3教科の成績表を作ってください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li>見出し行: 「教科」「点数」</li>
        <li>データ1: 国語 / 85</li>
        <li>データ2: 数学 / 92</li>
        <li>データ3: 情報 / 100</li>
        <li><code>tr</code> は合計4行以上</li>
        <li>見出しは <code>th</code>、データは <code>td</code> を使う</li>
      </ul>

      <div class="challenge-box">
        まず見本をVIEWで確認してから、「見出し1行 + データ3行」の形をまねして作りましょう。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ミニ成績表</title>
  <style>
    body {
      margin: 0;
      padding: 28px;
      font-family: sans-serif;
      background: #f5f7fb;
      color: #1f2937;
    }
    .report-card {
      max-width: 520px;
      margin: 0 auto;
      padding: 24px;
      background: white;
      border: 1px solid #d9e2ef;
      border-radius: 14px;
      box-shadow: 0 10px 26px rgba(30, 64, 175, .08);
    }
    h1 {
      margin: 0 0 18px;
      color: #1d4ed8;
      font-size: 24px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px 14px;
      border: 1px solid #cbd5e1;
      text-align: left;
    }
    th {
      background: #dbeafe;
      color: #1e3a8a;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
  </style>
</head>
<body>
  <div class="report-card">
    <h1>ミニ成績表</h1>

    <table>
      <tr>
        <th>教科</th>
        <th>点数</th>
      </tr>
      <tr>
        <td>英語</td>
        <td>88</td>
      </tr>
      <tr>
        <td>理科</td>
        <td>95</td>
      </tr>
    </table>
  </div>
</body>
</html>`,
    starterCode: `<table>
  <!-- 見出し -->

  <!-- 国語 -->

  <!-- 数学 -->

  <!-- 情報 -->
</table>`,
    solution: `<table>
  <tr><th>教科</th><th>点数</th></tr>
  <tr><td>国語</td><td>85</td></tr>
  <tr><td>数学</td><td>92</td></tr>
  <tr><td>情報</td><td>100</td></tr>
</table>`,
    explanation: `<p><code>tr</code>を1行ずつ増やし、見出しには<code>th</code>、普通のデータには<code>td</code>を使います。</p>`,
    tests: [
      { description: "trが4行以上", run: code => htmlLessonDocument(code).querySelectorAll("table tr").length >= 4 },
      {
        description: "見出しが教科・点数",
        run: code => {
          const row = htmlLessonDocument(code).querySelector("table tr");
          const vals = row ? [...row.querySelectorAll("th")].map(x => normalizedText(x.textContent)) : [];
          return vals[0] === "教科" && vals[1] === "点数";
        }
      },
      {
        description: "国語85",
        run: code => [...htmlLessonDocument(code).querySelectorAll("table tr")].some(row => {
          const vals = [...row.querySelectorAll("td")].map(x => normalizedText(x.textContent));
          return vals[0] === "国語" && vals[1] === "85";
        })
      },
      {
        description: "数学92",
        run: code => [...htmlLessonDocument(code).querySelectorAll("table tr")].some(row => {
          const vals = [...row.querySelectorAll("td")].map(x => normalizedText(x.textContent));
          return vals[0] === "数学" && vals[1] === "92";
        })
      },
      {
        description: "情報100",
        run: code => [...htmlLessonDocument(code).querySelectorAll("table tr")].some(row => {
          const vals = [...row.querySelectorAll("td")].map(x => normalizedText(x.textContent));
          return vals[0] === "情報" && vals[1] === "100";
        })
      }
    ],
    hints: [
      "まず見本の表をVIEWで見る",
      "1行目は th を2つ使う",
      "2行目以降は td を2つずつ使う",
      "見出し1行 + データ3行 = trは合計4行"
    ]
  },

  {
    id: 12,
    title: "プロジェクト2: カフェのお店ページ",
    description: "HTML基礎10テーマを組み合わせる総まとめ",
    content: `
      <p><strong>まず見本:</strong> 最終プロジェクトとほぼ同じ部品を使った「カフェ・アオゾラ」の完成例を見てみましょう。</p>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>自分のコードをVIEWに戻す</button>
      </p>

      <h3>見本で確認するポイント</h3>
      <pre>ページ全体
├ head → title / UTF-8
├ header → h1 + nav
└ main
   ├ section「お店について」
   │  └ div.card → img + p + ul
   ├ section「おすすめ」
   │  └ table
   └ section「予約」
      └ form
└ footer</pre>

      <p>VIEWでは、<strong>header / nav / card / 画像 / リスト / table / form / footer</strong> が1つのページになる様子を確認できます。</p>

      <h3>見本の一部</h3>
      <pre>&lt;section&gt;
  &lt;h2&gt;お店について&lt;/h2&gt;
  &lt;div class="card"&gt;
    &lt;img src="assets/ocean.svg" alt="青い海"&gt;
    &lt;p&gt;&lt;strong&gt;人気席&lt;/strong&gt;は窓側です。&lt;br&gt;
      &lt;em&gt;ゆっくりお過ごしください。&lt;/em&gt;
    &lt;/p&gt;
    &lt;ul&gt;
      &lt;li&gt;窓辺の席&lt;/li&gt;
      &lt;li&gt;無料Wi-Fi&lt;/li&gt;
      &lt;li&gt;手作りケーキ&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/div&gt;
&lt;/section&gt;</pre>

      <p><strong>プロジェクト:</strong> 見本の構造を参考に、今度は「カフェ・サクラ」のページを完成させましょう。</p>

      <h3>ページの設計図</h3>
      <pre>ページ全体
├ head → title / UTF-8
├ header → h1 + nav
└ main
   ├ section「お店について」
   │  └ div.card → img + p(strong / br / em) + ul
   ├ section「メニュー」
   │  └ table
   └ section「予約」
      └ form
└ footer</pre>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li>DOCTYPE、<code>lang="ja"</code>、UTF-8、title「カフェ・サクラ」</li>
        <li><code>header</code> の <code>h1</code> は「カフェ・サクラ」</li>
        <li><code>nav</code> に <code>index.html</code>(ホーム)と <code>menu.html</code>(メニュー)のリンク</li>
        <li><code>main</code> の中に「お店について」「メニュー」「予約」の3つの <code>section</code></li>
        <li>「お店について」に <code>div class="card"</code> を使う</li>
        <li><code>assets/flower.svg</code> の画像、alt「黄色い花」</li>
        <li>紹介文で <code>strong</code>、<code>br</code>、<code>em</code> を使う</li>
        <li><code>ul</code> に「静かな店内」「無料Wi-Fi」「季節の花」の3項目</li>
        <li>メニュー表: 品名・値段 / コーヒー400 / 紅茶350</li>
        <li>予約フォーム: 名前、人数(1人・2人・3人)、送信ボタン「予約する」</li>
        <li>名前と人数の <code>label for</code> と入力欄の <code>id</code> を対応させる</li>
        <li><code>footer</code> は「© 2026 Cafe Sakura」</li>
      </ul>

      <div class="challenge-box">
        最初に見本カフェをVIEWで確認し、外側の構造 → card → table → form の順に作ると分かりやすいです。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>カフェ・アオゾラ</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: sans-serif;
      color: #243247;
      background: #f5f9fc;
    }
    header {
      padding: 26px 7%;
      background: linear-gradient(135deg, #0f6f8d, #49a8be);
      color: white;
    }
    header h1 { margin: 0 0 12px; }
    nav { display: flex; gap: 10px; }
    nav a {
      color: white;
      text-decoration: none;
      padding: 7px 12px;
      border: 1px solid rgba(255,255,255,.55);
      border-radius: 999px;
    }
    main {
      max-width: 900px;
      margin: auto;
      padding: 26px 18px;
      display: grid;
      gap: 22px;
    }
    section {
      padding: 20px;
      background: white;
      border: 1px solid #d9e6ec;
      border-radius: 14px;
    }
    section h2 { margin-top: 0; color: #0f6f8d; }
    .card {
      display: grid;
      grid-template-columns: 170px 1fr;
      gap: 18px;
      align-items: start;
    }
    .card img {
      width: 100%;
      border-radius: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 10px 12px;
      border: 1px solid #cbd9e0;
      text-align: left;
    }
    th { background: #e7f5f8; }
    form {
      display: grid;
      gap: 10px;
      max-width: 420px;
    }
    input, select, button {
      padding: 9px 10px;
      border: 1px solid #b9cbd3;
      border-radius: 7px;
      font: inherit;
    }
    button {
      border: 0;
      background: #0f6f8d;
      color: white;
      font-weight: bold;
    }
    footer {
      padding: 18px;
      background: #18394a;
      color: white;
      text-align: center;
    }
    @media (max-width: 560px) {
      .card { grid-template-columns: 1fr; }
      .card img { max-width: 240px; }
    }
  </style>
</head>
<body>
  <header>
    <h1>カフェ・アオゾラ</h1>
    <nav>
      <a href="home.html">ホーム</a>
      <a href="drinks.html">ドリンク</a>
    </nav>
  </header>

  <main>
    <section>
      <h2>お店について</h2>
      <div class="card">
        <img src="assets/ocean.svg" alt="青い海">
        <div>
          <p>
            <strong>人気席</strong>は窓側です。<br>
            <em>ゆっくりお過ごしください。</em>
          </p>
          <ul>
            <li>窓辺の席</li>
            <li>無料Wi-Fi</li>
            <li>手作りケーキ</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h2>おすすめ</h2>
      <table>
        <tr><th>品名</th><th>値段</th></tr>
        <tr><td>レモネード</td><td>450</td></tr>
        <tr><td>ココア</td><td>380</td></tr>
      </table>
    </section>

    <section>
      <h2>予約</h2>
      <form>
        <label for="guest">名前</label>
        <input type="text" id="guest">

        <label for="seats">人数</label>
        <select id="seats">
          <option>1人</option>
          <option>2人</option>
          <option>4人</option>
        </select>

        <button type="submit">予約する</button>
      </form>
    </section>
  </main>

  <footer>© 2026 Cafe Aozora</footer>
</body>
</html>`,
    starterCode: `<!DOCTYPE html>
<html lang="ja">
<head>

</head>
<body>
  <header>

  </header>

  <main>

  </main>

  <footer>

  </footer>
</body>
</html>`,
    solution: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>カフェ・サクラ</title>
</head>
<body>
  <header>
    <h1>カフェ・サクラ</h1>
    <nav>
      <a href="index.html">ホーム</a>
      <a href="menu.html">メニュー</a>
    </nav>
  </header>

  <main>
    <section>
      <h2>お店について</h2>

      <div class="card">
        <img src="assets/flower.svg" alt="黄色い花">
        <p>
          <strong>おすすめ</strong>はコーヒーです。<br>
          <em>ゆっくりお過ごしください。</em>
        </p>

        <ul>
          <li>静かな店内</li>
          <li>無料Wi-Fi</li>
          <li>季節の花</li>
        </ul>
      </div>
    </section>

    <section>
      <h2>メニュー</h2>
      <table>
        <tr><th>品名</th><th>値段</th></tr>
        <tr><td>コーヒー</td><td>400</td></tr>
        <tr><td>紅茶</td><td>350</td></tr>
      </table>
    </section>

    <section>
      <h2>予約</h2>
      <form>
        <label for="name">名前</label>
        <input type="text" id="name">

        <label for="people">人数</label>
        <select id="people">
          <option>1人</option>
          <option>2人</option>
          <option>3人</option>
        </select>

        <button type="submit">予約する</button>
      </form>
    </section>
  </main>

  <footer>© 2026 Cafe Sakura</footer>
</body>
</html>`,
    explanation: `<p>最終プロジェクトでは、これまで別々に練習した構造・リンク・画像・リスト・div・表・フォームを1ページにまとめます。見本と同じ「組み立て方」を使い、内容は指定されたカフェ・サクラに変えて完成させます。</p>`,
    tests: [
      {
        description: "DOCTYPE / lang=ja / UTF-8 / title が正しい",
        run: code => {
          const doc = htmlLessonDocument(code);
          const meta = doc.querySelector("meta[charset]");
          return hasHtmlDoctype(code) &&
            doc.documentElement.getAttribute("lang") === "ja" &&
            !!meta &&
            String(meta.getAttribute("charset")).toUpperCase() === "UTF-8" &&
            doc.title.trim() === "カフェ・サクラ";
        }
      },
      {
        description: "header の h1 が「カフェ・サクラ」",
        run: code => {
          const h1 = htmlLessonDocument(code).querySelector("header h1");
          return !!h1 && normalizedText(h1.textContent) === "カフェ・サクラ";
        }
      },
      {
        description: "nav にホームとメニューのリンク",
        run: code => {
          const doc = htmlLessonDocument(code);
          const home = doc.querySelector('nav a[href="index.html"]');
          const menu = doc.querySelector('nav a[href="menu.html"]');
          return normalizedText(home?.textContent) === "ホーム" &&
            normalizedText(menu?.textContent) === "メニュー";
        }
      },
      {
        description: "main 内に3つのsectionと指定見出し",
        run: code => {
          const doc = htmlLessonDocument(code);
          const sections = [...doc.querySelectorAll("main > section")];
          const headings = sections
            .map(section => normalizedText(section.querySelector("h2")?.textContent));
          return sections.length >= 3 &&
            ["お店について", "メニュー", "予約"]
              .every(value => headings.includes(value));
        }
      },
      {
        description: "お店についてに div.card がある",
        run: code => {
          const doc = htmlLessonDocument(code);
          const section = [...doc.querySelectorAll("main > section")]
            .find(s => normalizedText(s.querySelector("h2")?.textContent) === "お店について");
          return !!section && !!section.querySelector("div.card");
        }
      },
      {
        description: "flower.svg と alt「黄色い花」が正しい",
        run: code => {
          const img = htmlLessonDocument(code)
            .querySelector('img[src="assets/flower.svg"]');
          return !!img && img.getAttribute("alt") === "黄色い花";
        }
      },
      {
        description: "紹介文で strong / br / em を使っている",
        run: code => {
          const card = htmlLessonDocument(code).querySelector("div.card");
          const p = card?.querySelector("p");
          return !!p &&
            !!p.querySelector("strong") &&
            !!p.querySelector("br") &&
            !!p.querySelector("em");
        }
      },
      {
        description: "ul に3つの指定項目",
        run: code => {
          const vals = [...htmlLessonDocument(code).querySelectorAll("div.card ul > li")]
            .map(x => normalizedText(x.textContent));
          return ["静かな店内", "無料Wi-Fi", "季節の花"]
            .every(value => vals.includes(value));
        }
      },
      {
        description: "表の見出しが品名・値段",
        run: code => {
          const row = htmlLessonDocument(code).querySelector("table tr");
          const vals = row
            ? [...row.querySelectorAll("th")].map(x => normalizedText(x.textContent))
            : [];
          return vals[0] === "品名" && vals[1] === "値段";
        }
      },
      {
        description: "コーヒー400 と 紅茶350 の行がある",
        run: code => {
          const rows = [...htmlLessonDocument(code).querySelectorAll("table tr")]
            .map(row => [...row.querySelectorAll("td")]
              .map(x => normalizedText(x.textContent)));
          return rows.some(v => v[0] === "コーヒー" && v[1] === "400") &&
            rows.some(v => v[0] === "紅茶" && v[1] === "350");
        }
      },
      {
        description: "名前の label と input が対応",
        run: code => {
          const doc = htmlLessonDocument(code);
          return normalizedText(doc.querySelector('label[for="name"]')?.textContent) === "名前" &&
            !!doc.querySelector('input#name[type="text"]');
        }
      },
      {
        description: "人数の label / select / option が正しい",
        run: code => {
          const doc = htmlLessonDocument(code);
          const label = doc.querySelector('label[for="people"]');
          const vals = [...doc.querySelectorAll("select#people option")]
            .map(x => normalizedText(x.textContent));
          return normalizedText(label?.textContent) === "人数" &&
            ["1人", "2人", "3人"].every(value => vals.includes(value));
        }
      },
      {
        description: "送信ボタンが「予約する」",
        run: code => {
          const button = htmlLessonDocument(code)
            .querySelector('button[type="submit"]');
          return !!button && normalizedText(button.textContent) === "予約する";
        }
      },
      {
        description: "footer が正しい",
        run: code => {
          const footer = htmlLessonDocument(code).querySelector("footer");
          return !!footer &&
            normalizedText(footer.textContent) === "© 2026 Cafe Sakura";
        }
      }
    ],
    hints: [
      "最初に見本カフェをVIEWで見て、ページ全体の形を確認する",
      "DOCTYPE / html / head / body を最初に完成させる",
      "header → main → footer の大きな構造を先に作る",
      "お店についてのcardに画像・文章・ulをまとめる",
      "最後にtableとformを追加し、labelのforとidを確認する"
    ]
  }

];