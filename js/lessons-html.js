// HTML course — progressive practice lessons + 2 projects
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
    id: 20,
    displayNumber: 9,
    title: "いちばん小さいフォーム（名前だけ）",
    description: "form・label・input・buttonの基本",
    content: `
      <p><strong>まず見本:</strong> 「ニックネーム」を1つ入力して登録する、小さなフォームです。</p>
      <p>見本は練習問題とは<strong>別の内容</strong>です。タグの形を参考にしてください。</p>

      <pre>&lt;form&gt;
  &lt;label&gt;ニックネーム&lt;/label&gt;
  &lt;input type="text"&gt;

  &lt;button type="submit"&gt;登録する&lt;/button&gt;
&lt;/form&gt;</pre>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <h3>4つだけ覚えます</h3>
      <ul>
        <li><code>form</code> … 入力欄をまとめる箱</li>
        <li><code>label</code> … 入力欄の名前</li>
        <li><code>input type="text"</code> … 文字を入力する場所</li>
        <li><code>button type="submit"</code> … 送信するボタン</li>
      </ul>

      <p><code>label</code> に入力欄の名前を書き、その下に <code>input</code> を置きます。</p>

      <p><strong>練習課題:</strong> 見本と同じ「名前だけのフォーム」を作ってください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li><code>form</code> がある</li>
        <li><code>label</code> の文字が「名前」</li>
        <li><code>input type="text"</code> がある</li>
        <li><code>button type="submit"</code> の文字が「申し込む」</li>
      </ul>

      <div class="challenge-box">
        最初は名前だけでOKです。form → label → input → button の順番を覚えましょう。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ニックネームフォーム</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 28px; font-family: sans-serif; background: #f3f7fb; color: #1f2937; }
    form { max-width: 380px; margin: auto; padding: 22px; background: white; border: 1px solid #d9e2ef; border-radius: 12px; }
    label { display: block; margin-bottom: 7px; font-weight: bold; }
    input { width: 100%; padding: 10px; border: 1px solid #b8c5d8; border-radius: 8px; font: inherit; }
    button { width: 100%; margin-top: 16px; padding: 10px; border: 0; border-radius: 8px; background: #2563eb; color: white; font-weight: bold; }
  </style>
</head>
<body>
  <form>
    <label>ニックネーム</label>
    <input type="text">

    <button type="submit">登録する</button>
  </form>
</body>
</html>`,
    starterCode: `<form>
  <!-- 名前 -->


  <!-- 送信ボタン -->

</form>`,
    solution: `<form>
  <label>名前</label>
  <input type="text">

  <button type="submit">申し込む</button>
</form>`,
    explanation: `<p><code>form</code> の中に入力欄を入れます。<code>label</code> は入力欄の名前、<code>input type="text"</code> は文字を入力する場所です。</p>`,
    tests: [
      { description: "form がある", run: code => !!htmlLessonDocument(code).querySelector("form") },
      {
        description: "名前の label と text入力がある",
        run: code => {
          const doc = htmlLessonDocument(code);
          const labels = [...doc.querySelectorAll("form label")].map(x => normalizedText(x.textContent));
          return labels.includes("名前") && !!doc.querySelector('form input[type="text"]');
        }
      },
      {
        description: "申し込むボタンがある",
        run: code => {
          const button = htmlLessonDocument(code).querySelector('button[type="submit"]');
          return !!button && normalizedText(button.textContent) === "申し込む";
        }
      }
    ],
    hints: [
      "label に「名前」と書く",
      "その下に input type=\"text\" を書く",
      "最後に button type=submit を書く"
    ]
  },

  {
    id: 21,
    displayNumber: 10,
    title: "メールをつけたす",
    description: "名前フォームにemail入力を1つ追加する",
    content: `
      <p><strong>Lesson 9から1つだけ増やします:</strong> text入力に加えて、メール入力も使います。</p>
      <p>見本は「保護者名＋連絡先メール」です。練習問題とは別の内容を使っています。</p>

      <pre>&lt;form&gt;
  &lt;label&gt;保護者名&lt;/label&gt;
  &lt;input type="text"&gt;

  &lt;!-- メールをつけたす --&gt;
  &lt;label&gt;連絡先メール&lt;/label&gt;
  &lt;input type="email"&gt;

  &lt;button type="submit"&gt;登録する&lt;/button&gt;
&lt;/form&gt;</pre>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <h3>今回の新しいところ</h3>
      <p><code>type="email"</code> はメールアドレスを入力するためのinputです。</p>

      <pre>&lt;label&gt;連絡先メール&lt;/label&gt;
&lt;input type="email"&gt;</pre>

      <p><code>label</code> の下に <code>input type="email"</code> を置きます。</p>

      <p><strong>練習課題:</strong> Lesson 9の「名前だけのフォーム」に、今度は「メール」入力をつけ足してください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li>名前の <code>label</code> と <code>input type="text"</code> がある</li>
        <li>メールは <code>label</code> と <code>input type="email"</code> を使う</li>
                <li>「申し込む」送信ボタンがある</li>
      </ul>

      <div class="challenge-box">
        Lesson 9で覚えた形はそのままです。今回はメールの2行だけを追加します。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>保護者連絡フォーム</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 28px; font-family: sans-serif; background: #f3f7fb; color: #1f2937; }
    form { max-width: 400px; margin: auto; padding: 22px; background: white; border: 1px solid #d9e2ef; border-radius: 12px; }
    label { display: block; margin: 13px 0 6px; font-weight: bold; }
    label:first-child { margin-top: 0; }
    input { width: 100%; padding: 10px; border: 1px solid #b8c5d8; border-radius: 8px; font: inherit; }
    button { width: 100%; margin-top: 18px; padding: 10px; border: 0; border-radius: 8px; background: #2563eb; color: white; font-weight: bold; }
  </style>
</head>
<body>
  <form>
    <label>保護者名</label>
    <input type="text">

    <label>連絡先メール</label>
    <input type="email">

    <button type="submit">登録する</button>
  </form>
</body>
</html>`,
    starterCode: `<form>
  <label>名前</label>
  <input type="text">

  <!-- ここにメールをつけたす -->


  <button type="submit">申し込む</button>
</form>`,
    solution: `<form>
  <label>名前</label>
  <input type="text">

  <label>メール</label>
  <input type="email">

  <button type="submit">申し込む</button>
</form>`,
    explanation: `<p><code>input</code> は <code>type</code> を変えると役割が変わります。今回は <code>type="text"</code> に加えて <code>type="email"</code> を1つ追加しました。</p>`,
    tests: [
      {
        description: "名前の label と text入力がある",
        run: code => {
          const doc = htmlLessonDocument(code);
          const labels = [...doc.querySelectorAll("form label")].map(x => normalizedText(x.textContent));
          return labels.includes("名前") && !!doc.querySelector('form input[type="text"]');
        }
      },
      {
        description: "メールの label と email入力がある",
        run: code => {
          const doc = htmlLessonDocument(code);
          const labels = [...doc.querySelectorAll("form label")].map(x => normalizedText(x.textContent));
          return labels.includes("メール") && !!doc.querySelector('form input[type="email"]');
        }
      },
      {
        description: "申し込むボタンがある",
        run: code => {
          const button = htmlLessonDocument(code).querySelector('button[type="submit"]');
          return !!button && normalizedText(button.textContent) === "申し込む";
        }
      }
    ],
    hints: [
      "Lesson 9のコードを参考にする",
      "メールは input type=\"email\"",
      "label の下に input type=\"email\" を追加する"
    ]
  },

  {
    id: 26,
    displayNumber: 11,
    title: "optionを使おう",
    description: "selectの中にoptionを並べて選択肢を作る",
    content: `
      <p><strong>今回は <code>option</code> を覚えます。</strong></p>
      <p><code>select</code> の中に <code>option</code> を書くと、選べる項目を増やせます。</p>

      <p><strong>まず見本:</strong> 車を選ぶメニューです。</p>

      <pre>&lt;label&gt;車を選んでください:&lt;/label&gt;
&lt;select name="cars"&gt;
  &lt;option value=""&gt;--選択してください--&lt;/option&gt;
  &lt;option value="volvo"&gt;ボルボ&lt;/option&gt;
  &lt;option value="saab" selected&gt;サーブ&lt;/option&gt;
  &lt;option value="mercedes" disabled&gt;メルセデス（選択不可）&lt;/option&gt;
  &lt;option value="audi"&gt;アウディ&lt;/option&gt;
&lt;/select&gt;</pre>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <h3>optionとは？</h3>
      <ul>
        <li><code>option</code> … メニューの中の<strong>1つの選択肢</strong></li>
        <li><code>selected</code> … 最初から選ばれている項目</li>
        <li><code>disabled</code> … 選べない項目</li>
      </ul>

      <p><code>value</code> は今回は覚えなくてOKです。</p>

      <p><strong>練習課題:</strong> 見本とは違う内容で「好きな飲み物」を選ぶメニューを作ってください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li><code>select</code> がある</li>
        <li><code>option</code> を4つ使う</li>
        <li>選択肢は「--選択してください--」「水」「お茶」「ジュース」</li>
        <li>「お茶」に <code>selected</code> をつける</li>
        <li>「ジュース」に <code>disabled</code> をつける</li>
      </ul>

      <div class="challenge-box">
        optionを1つずつ追加して、選択肢を作りましょう。今回はvalueは判定しません。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>車を選ぶ</title>
  <style>
    body { margin: 0; padding: 28px; font-family: sans-serif; background: #f3f7fb; color: #1f2937; }
    .box { max-width: 420px; margin: auto; padding: 22px; background: white; border: 1px solid #d9e2ef; border-radius: 12px; }
    label { display: block; margin-bottom: 8px; font-weight: bold; }
    select { width: 100%; padding: 10px; border: 1px solid #b8c5d8; border-radius: 8px; font: inherit; background: white; }
  </style>
</head>
<body>
  <div class="box">
    <label>車を選んでください:</label>
    <select name="cars">
      <option value="">--選択してください--</option>
      <option value="volvo">ボルボ</option>
      <option value="saab" selected>サーブ</option>
      <option value="mercedes" disabled>メルセデス（選択不可）</option>
      <option value="audi">アウディ</option>
    </select>
  </div>
</body>
</html>`,
    starterCode: `<label>好きな飲み物:</label>
<select>
  <!-- optionを4つ書こう -->

</select>`,
    solution: `<label>好きな飲み物:</label>
<select>
  <option>--選択してください--</option>
  <option>水</option>
  <option selected>お茶</option>
  <option disabled>ジュース</option>
</select>`,
    explanation: `<p><code>option</code> は、<code>select</code> の中に入れる1つの選択肢です。<code>selected</code> をつけると最初から選ばれ、<code>disabled</code> をつけると選べなくなります。今回は <code>value</code> は使わなくても合格できます。</p>`,
    tests: [
      {
        description: "select がある",
        run: code => !!htmlLessonDocument(code).querySelector("select")
      },
      {
        description: "option が4つある",
        run: code => htmlLessonDocument(code).querySelectorAll("select option").length === 4
      },
      {
        description: "4つの選択肢が正しい",
        run: code => {
          const vals = [...htmlLessonDocument(code).querySelectorAll("select option")]
            .map(x => normalizedText(x.textContent));
          return JSON.stringify(vals) === JSON.stringify(["--選択してください--", "水", "お茶", "ジュース"]);
        }
      },
      {
        description: "お茶が selected",
        run: code => {
          const option = [...htmlLessonDocument(code).querySelectorAll("select option")]
            .find(x => normalizedText(x.textContent) === "お茶");
          return !!option && option.hasAttribute("selected");
        }
      },
      {
        description: "ジュースが disabled",
        run: code => {
          const option = [...htmlLessonDocument(code).querySelectorAll("select option")]
            .find(x => normalizedText(x.textContent) === "ジュース");
          return !!option && option.hasAttribute("disabled");
        }
      }
    ],
    hints: [
      "select の中に option を4つ書く",
      "お茶は <option selected>お茶</option>",
      "ジュースは <option disabled>ジュース</option>",
      "value は今回は書かなくてもOK"
    ]
  },

  {
    id: 22,
    displayNumber: 12,
    title: "1行だけのテーブル",
    description: "table・tr・tdのいちばん基本",
    content: `
      <p><strong>まず見本:</strong> 「理科 / 95」の1行だけの小さな表です。</p>
      <p>練習問題では別の教科と点数を使います。</p>

      <pre>&lt;table&gt;
  &lt;tr&gt;
    &lt;td&gt;理科&lt;/td&gt;
    &lt;td&gt;95&lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;</pre>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <h3>3つだけ覚えます</h3>
      <ul>
        <li><code>table</code> … 表全体</li>
        <li><code>tr</code> … 表の<strong>1行</strong></li>
        <li><code>td</code> … 1つの<strong>マス</strong></li>
      </ul>

      <p>この見本は、<code>tr</code> が1つ、その中に <code>td</code> が2つあります。</p>

      <p><strong>練習課題:</strong> 「国語」「80」の1行だけの表を作ってください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li><code>table</code> がある</li>
        <li><code>tr</code> が1行以上ある</li>
        <li>1行の中に <code>td</code> が2つある</li>
        <li>マスの文字が「国語」「80」</li>
      </ul>

      <div class="challenge-box">
        まだ見出しは使いません。まずは tr＝1行、td＝1マスだけ覚えましょう。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>理科の1行表</title>
  <style>
    body { padding: 28px; font-family: sans-serif; background: #f5f7fb; color: #1f2937; }
    table { border-collapse: collapse; background: white; }
    td { min-width: 110px; padding: 12px 16px; border: 1px solid #94a3b8; }
  </style>
</head>
<body>
  <table>
    <tr>
      <td>理科</td>
      <td>95</td>
    </tr>
  </table>
</body>
</html>`,
    starterCode: `<table>
  <!-- 1行だけ作ろう -->

</table>`,
    solution: `<table>
  <tr>
    <td>国語</td>
    <td>80</td>
  </tr>
</table>`,
    explanation: `<p><code>table</code> の中に <code>tr</code> を書くと1行できます。その <code>tr</code> の中に <code>td</code> を書くと、横にマスが増えます。</p>`,
    tests: [
      { description: "table がある", run: code => !!htmlLessonDocument(code).querySelector("table") },
      { description: "tr が1行以上ある", run: code => htmlLessonDocument(code).querySelectorAll("table tr").length >= 1 },
      {
        description: "国語 / 80 の2マスがある",
        run: code => {
          const row = htmlLessonDocument(code).querySelector("table tr");
          const vals = row ? [...row.querySelectorAll("td")].map(x => normalizedText(x.textContent)) : [];
          return vals.length >= 2 && vals[0] === "国語" && vals[1] === "80";
        }
      }
    ],
    hints: [
      "table の中に tr を1つ書く",
      "tr の中に td を2つ書く",
      "1つ目は国語、2つ目は80"
    ]
  },

  {
    id: 23,
    displayNumber: 13,
    title: "見出し ＋ 1行 ＋ bgcolor",
    description: "th・tdとbgcolorで表に色をつける",
    content: `
      <p><strong>Lesson 12から2つ増やします:</strong> 見出しの <code>th</code> と、行に色をつける <code>bgcolor</code> を使います。</p>
      <p>見本では「商品 / 値段」の表を使います。練習問題は別の内容です。</p>

      <pre>&lt;table&gt;
  &lt;!-- 見出しの行を灰色にする --&gt;
  &lt;tr bgcolor="grey"&gt;
    &lt;th&gt;商品&lt;/th&gt;
    &lt;th&gt;値段&lt;/th&gt;
  &lt;/tr&gt;

  &lt;!-- データの行を薄い灰色にする --&gt;
  &lt;tr bgcolor="lightgrey"&gt;
    &lt;td&gt;パン&lt;/td&gt;
    &lt;td&gt;150&lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;</pre>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <h3>bgcolor とは？</h3>
      <p><code>&lt;tr bgcolor="grey"&gt;</code> のように <code>tr</code> に書くと、その<strong>行全体の背景色</strong>が変わります。</p>
      <p><code>grey</code> は灰色、<code>lightgrey</code> は薄い灰色です。</p>
      <p><small>※ <code>bgcolor</code> は古いHTMLの書き方です。今のWeb制作では通常CSSを使いますが、このレッスンでは表の仕組みを分かりやすく練習するために使います。</small></p>

      <p><strong>練習課題:</strong> 「教科 / 点数」の見出しと「国語 / 80」の1行を作ります。見本とは色を変えて、見出し行を <code>lightblue</code>、データ行を <code>lightyellow</code> にしてください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li><code>tr</code> が2行ある</li>
        <li>1行目は <code>bgcolor="lightblue"</code></li>
        <li>1行目は <code>th</code> で「教科」「点数」</li>
        <li>2行目は <code>bgcolor="lightyellow"</code></li>
        <li>2行目は <code>td</code> で「国語」「80」</li>
      </ul>

      <div class="challenge-box">
        tr は「1行」です。bgcolor は、その tr の行全体に色をつけます。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>商品の表</title>
  <style>
    body { padding: 28px; font-family: sans-serif; background: #f5f7fb; color: #1f2937; }
    table { border-collapse: collapse; background: white; }
    th, td { min-width: 110px; padding: 12px 16px; border: 1px solid #64748b; text-align: left; }
  </style>
</head>
<body>
  <table>
    <tr bgcolor="grey">
      <th>商品</th>
      <th>値段</th>
    </tr>
    <tr bgcolor="lightgrey">
      <td>パン</td>
      <td>150</td>
    </tr>
  </table>
</body>
</html>`,
    starterCode: `<table>
  <!-- 見出し：lightblue -->の行：grey -->


  <!-- 国語の行：lightgrey -->

</table>`,
    solution: `<table>
  <tr bgcolor="lightblue">
    <th>教科</th>
    <th>点数</th>
  </tr>

  <tr bgcolor="lightyellow">
    <td>国語</td>
    <td>80</td>
  </tr>
</table>`,
    explanation: `<p><code>tr</code> は1行、<code>th</code> は見出しのマス、<code>td</code> は普通のマスです。<code>bgcolor</code> を <code>tr</code> に付けると、その行全体の背景色を変えられます。</p>`,
    tests: [
      {
        description: "tr が2行ある",
        run: code => htmlLessonDocument(code).querySelectorAll("table tr").length === 2
      },
      {
        description: "1行目が bgcolor=grey",
        run: code => {
          const row = htmlLessonDocument(code).querySelectorAll("table tr")[0];
          return String(row?.getAttribute("bgcolor") || "").toLowerCase() === "lightblue";
        }
      },
      {
        description: "見出しが 教科 / 点数",
        run: code => {
          const row = htmlLessonDocument(code).querySelectorAll("table tr")[0];
          const vals = row ? [...row.querySelectorAll("th")].map(x => normalizedText(x.textContent)) : [];
          return vals.length === 2 && vals[0] === "教科" && vals[1] === "点数";
        }
      },
      {
        description: "2行目が bgcolor=lightgrey",
        run: code => {
          const row = htmlLessonDocument(code).querySelectorAll("table tr")[1];
          return String(row?.getAttribute("bgcolor") || "").toLowerCase() === "lightyellow";
        }
      },
      {
        description: "国語 / 80 の行がある",
        run: code => {
          const row = htmlLessonDocument(code).querySelectorAll("table tr")[1];
          const vals = row ? [...row.querySelectorAll("td")].map(x => normalizedText(x.textContent)) : [];
          return vals.length === 2 && vals[0] === "国語" && vals[1] === "80";
        }
      }
    ],
    hints: [
      "1行目は <tr bgcolor=\"grey\">",
      "1行目の中は th を2つ",
      "2行目は <tr bgcolor=\"lightgrey\">",
      "2行目の中は td を2つ"
    ]
  },

  {
    id: 24,
    displayNumber: 14,
    title: "営業時間の表を作ろう",
    description: "曜日の見出しと営業時間を2行の表にする",
    content: `
      <p><strong>Lesson 13の応用:</strong> 今度は横にマスを増やして、曜日と時間の表を作ります。</p>
      <p>見本は「図書館の開館時間」です。練習問題では英語の曜日と別の時間を使います。</p>

      <pre>&lt;table&gt;
  &lt;!-- 曜日の見出し --&gt;
  &lt;tr bgcolor="grey"&gt;
    &lt;th&gt;日曜日&lt;/th&gt;
    &lt;th&gt;月曜日&lt;/th&gt;
    &lt;th&gt;火曜日&lt;/th&gt;
    &lt;th&gt;水曜日&lt;/th&gt;
    &lt;th&gt;木曜日&lt;/th&gt;
    &lt;th&gt;金曜日&lt;/th&gt;
    &lt;th&gt;土曜日&lt;/th&gt;
  &lt;/tr&gt;

  &lt;!-- 開館時間 --&gt;
  &lt;tr bgcolor="lightgrey"&gt;
    &lt;td&gt;休館&lt;/td&gt;
    &lt;td&gt;10-4&lt;/td&gt;
    &lt;td&gt;10-4&lt;/td&gt;
    &lt;td&gt;10-4&lt;/td&gt;
    &lt;td&gt;10-4&lt;/td&gt;
    &lt;td&gt;10-4&lt;/td&gt;
    &lt;td&gt;休館&lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;</pre>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <h3>今回のポイント</h3>
      <ul>
        <li><code>tr</code> は<strong>2行だけ</strong></li>
        <li>1行目は曜日なので <code>th</code></li>
        <li>2行目は営業時間なので <code>td</code></li>
        <li>1行目は <code>bgcolor="grey"</code></li>
        <li>2行目は <code>bgcolor="lightgrey"</code></li>
      </ul>

      <p>横にマスを増やしたいときは、新しい <code>tr</code> を作るのではなく、同じ <code>tr</code> の中に <code>th</code> や <code>td</code> を追加します。</p>

      <p><strong>練習課題:</strong> Sunday〜Saturdayまでの7曜日と、営業時間を2行の表で作ってください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li><code>tr</code> は2行</li>
        <li>1行目は <code>bgcolor="grey"</code></li>
        <li>1行目に Sunday〜Saturday の <code>th</code> が7つ</li>
        <li>2行目は <code>bgcolor="lightgrey"</code></li>
        <li>2行目に <code>td</code> が7つ</li>
        <li>Sunday と Saturday は「Closed」</li>
        <li>Monday〜Friday は「9-5」</li>
      </ul>

      <div class="challenge-box">
        行は増やしません。同じ1行の中に7つのマスを横に並べるのがポイントです。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>図書館の開館時間</title>
  <style>
    body { padding: 28px; font-family: sans-serif; background: #f5f7fb; color: #1f2937; }
    .wrap { overflow-x: auto; }
    table { border-collapse: collapse; white-space: nowrap; }
    th, td { min-width: 105px; padding: 12px 14px; border: 1px solid #64748b; text-align: center; }
  </style>
</head>
<body>
  <h1>図書館の開館時間</h1>
  <div class="wrap">
    <table>
      <tr bgcolor="grey">
        <th>日曜日</th>
        <th>月曜日</th>
        <th>火曜日</th>
        <th>水曜日</th>
        <th>木曜日</th>
        <th>金曜日</th>
        <th>土曜日</th>
      </tr>
      <tr bgcolor="lightgrey">
        <td>休館</td>
        <td>10-4</td>
        <td>10-4</td>
        <td>10-4</td>
        <td>10-4</td>
        <td>10-4</td>
        <td>休館</td>
      </tr>
    </table>
  </div>
</body>
</html>`,
    starterCode: `<table>
  <!-- 1行目：曜日 / grey -->
  <tr bgcolor="grey">

  </tr>

  <!-- 2行目：営業時間 / lightgrey -->
  <tr bgcolor="lightgrey">

  </tr>
</table>`,
    solution: `<table>
  <tr bgcolor="grey">
    <th>Sunday</th>
    <th>Monday</th>
    <th>Tuesday</th>
    <th>Wednesday</th>
    <th>Thursday</th>
    <th>Friday</th>
    <th>Saturday</th>
  </tr>

  <tr bgcolor="lightgrey">
    <td>Closed</td>
    <td>9-5</td>
    <td>9-5</td>
    <td>9-5</td>
    <td>9-5</td>
    <td>9-5</td>
    <td>Closed</td>
  </tr>
</table>`,
    explanation: `<p>この表は <code>tr</code> が2つだけです。1行目の中に7つの <code>th</code>、2行目の中に7つの <code>td</code> を横に並べます。<code>bgcolor</code> は行の背景色を変えます。</p>`,
    tests: [
      {
        description: "tr が2行ある",
        run: code => htmlLessonDocument(code).querySelectorAll("table tr").length === 2
      },
      {
        description: "1行目が bgcolor=grey",
        run: code => {
          const row = htmlLessonDocument(code).querySelectorAll("table tr")[0];
          return String(row?.getAttribute("bgcolor") || "").toLowerCase() === "grey";
        }
      },
      {
        description: "Sunday〜Saturday の見出しが7つある",
        run: code => {
          const row = htmlLessonDocument(code).querySelectorAll("table tr")[0];
          const vals = row ? [...row.querySelectorAll("th")].map(x => normalizedText(x.textContent)) : [];
          return JSON.stringify(vals) === JSON.stringify(["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]);
        }
      },
      {
        description: "2行目が bgcolor=lightgrey",
        run: code => {
          const row = htmlLessonDocument(code).querySelectorAll("table tr")[1];
          return String(row?.getAttribute("bgcolor") || "").toLowerCase() === "lightgrey";
        }
      },
      {
        description: "営業時間が正しい",
        run: code => {
          const row = htmlLessonDocument(code).querySelectorAll("table tr")[1];
          const vals = row ? [...row.querySelectorAll("td")].map(x => normalizedText(x.textContent)) : [];
          return JSON.stringify(vals) === JSON.stringify(["Closed","9-5","9-5","9-5","9-5","9-5","Closed"]);
        }
      }
    ],
    hints: [
      "1行目の tr に bgcolor=\"grey\"",
      "Sunday〜Saturday は th を7つ",
      "2行目の tr に bgcolor=\"lightgrey\"",
      "Closed / 9-5 は td を7つ",
      "tr は2つだけです"
    ]
  },

  {
    id: 25,
    title: "プロジェクト2: CMCSスクール お問い合わせフォーム",
    description: "フォームと表を組み合わせるHTML総まとめ",
    content: `
      <p><strong>最終プロジェクト:</strong> これまで学んだHTMLを使って、CMCSスクールのお問い合わせページを作ります。</p>

      <p>
        <button type="button" class="btn primary small" data-view-example>▶ EXAMPLEをVIEWで見る</button>
        <button type="button" class="btn ghost small" data-view-work>↩ 自分のVIEWへ戻る</button>
      </p>

      <h3>今回つくるもの</h3>
      <pre>CMCSスクール お問い合わせ
├ お問い合わせ受付時間の表
│  ├ th → 曜日 / 受付時間
│  └ td → 月〜金 / 9:00〜16:00
└ お問い合わせフォーム
   ├ 名前
   ├ メール
   ├ お問い合わせ内容
   └ 送信するボタン</pre>

      <h3>ポイント1：受付時間の表</h3>
      <p>Lesson 13・14で使った <code>table</code>、<code>tr</code>、<code>th</code>、<code>td</code>、<code>bgcolor</code> をもう一度使います。</p>

      <pre>&lt;table&gt;
  &lt;tr bgcolor="grey"&gt;
    &lt;th&gt;曜日&lt;/th&gt;
    &lt;th&gt;受付時間&lt;/th&gt;
  &lt;/tr&gt;
  &lt;tr bgcolor="lightgrey"&gt;
    &lt;td&gt;月〜金&lt;/td&gt;
    &lt;td&gt;9:00〜16:00&lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;</pre>

      <h3>ポイント2：お問い合わせフォーム</h3>
      <p><code>label</code> で項目名を書き、その下に対応する <code>input</code> を置きます。</p>

      <pre>&lt;label&gt;名前&lt;/label&gt;
&lt;input type="text"&gt;</pre>

      <p><strong>練習課題:</strong> 「CMCSスクール お問い合わせ」ページを完成させてください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li><code>&lt;!DOCTYPE html&gt;</code>、<code>lang="ja"</code>、UTF-8を使う</li>
        <li><code>title</code> は「CMCSスクール お問い合わせ」</li>
        <li><code>h1</code> は「CMCSスクール お問い合わせ」</li>
        <li>表の見出しは「曜日」「受付時間」</li>
        <li>見出し行に <code>bgcolor="grey"</code> を使う</li>
        <li>データ行は「月〜金」「9:00〜16:00」</li>
        <li>データ行に <code>bgcolor="lightgrey"</code> を使う</li>
        <li>名前: <code>label</code> + <code>input type="text"</code></li>
        <li>メール: <code>label</code> + <code>input type="email"</code></li>
        <li>お問い合わせ内容: <code>label</code> + <code>input type="text"</code></li>
        <li><code>button type="submit"</code> の文字は「送信する」</li>
        <li><code>footer</code> は「© 2026 CMCS School」</li>
      </ul>

      <div class="challenge-box">
        まず表を完成させて、そのあとフォームを上から1項目ずつ作りましょう。
      </div>
    `,
    exampleCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ひかりスクール お問い合わせ</title>
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 28px 16px;
      font-family: Arial, "Noto Sans JP", sans-serif;
      background: #eef4fb;
      color: #1f2937;
    }

    .contact-card {
      max-width: 620px;
      margin: 0 auto;
      padding: 26px;
      background: white;
      border: 1px solid #d8e3ef;
      border-radius: 14px;
      box-shadow: 0 10px 30px rgba(30, 64, 175, .08);
    }

    h1 {
      margin: 0 0 8px;
      color: #1d4ed8;
      font-size: 26px;
    }

    .lead {
      margin: 0 0 24px;
      color: #64748b;
    }

    h2 {
      margin-top: 26px;
      font-size: 19px;
      color: #0f3b74;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }

    th, td {
      padding: 10px 12px;
      border: 1px solid #9ca3af;
      text-align: left;
    }

    form {
      display: grid;
      gap: 8px;
    }

    label {
      margin-top: 8px;
      font-weight: bold;
    }

    input {
      width: 100%;
      padding: 10px 11px;
      border: 1px solid #b9c7d8;
      border-radius: 8px;
      font: inherit;
    }

    button {
      margin-top: 12px;
      padding: 11px 16px;
      border: 0;
      border-radius: 8px;
      background: #2563eb;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }

    footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #dbe3ef;
      color: #64748b;
      text-align: center;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <main class="contact-card">
    <h1>ひかりスクール お問い合わせ</h1>
    <p class="lead">学校についてのご質問はこちらからお送りください。</p>

    <h2>受付時間</h2>
    <table>
      <tr bgcolor="grey">
        <th>曜日</th>
        <th>受付時間</th>
      </tr>
      <tr bgcolor="lightgrey">
        <td>月〜金</td>
        <td>9:00〜16:00</td>
      </tr>
    </table>

    <h2>お問い合わせフォーム</h2>
    <form>
      <label>名前</label>
      <input type="text">

      <label>メール</label>
      <input type="email">

      <label>お問い合わせ内容</label>
      <input type="text">

      <button type="submit">送信する</button>
    </form>

    <footer>© 2026 Hikari School</footer>
  </main>
</body>
</html>`,
    starterCode: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <h1></h1>

  <!-- お問い合わせ受付時間の表 -->
  <table>

  </table>

  <!-- お問い合わせフォーム -->
  <form>

  </form>

  <footer></footer>
</body>
</html>`,
    solution: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>CMCSスクール お問い合わせ</title>
</head>
<body>
  <h1>CMCSスクール お問い合わせ</h1>

  <table>
    <tr bgcolor="grey">
      <th>曜日</th>
      <th>受付時間</th>
    </tr>
    <tr bgcolor="lightgrey">
      <td>月〜金</td>
      <td>9:00〜16:00</td>
    </tr>
  </table>

  <form>
    <label>名前</label>
    <input type="text">

    <label>メール</label>
    <input type="email">

    <label>お問い合わせ内容</label>
    <input type="text">

    <button type="submit">送信する</button>
  </form>

  <footer>© 2026 CMCS School</footer>
</body>
</html>`,
    explanation: `<p>このプロジェクトでは、フォームと表を1つのページにまとめます。<code>label</code>、<code>input</code>、表の <code>tr / th / td</code>、そして <code>bgcolor</code> を確認しながら作りましょう。</p>`,
    tests: [
      {
        description: "DOCTYPE / lang=ja / UTF-8 が正しい",
        run: code => {
          const doc = htmlLessonDocument(code);
          const meta = doc.querySelector("meta[charset]");
          return hasHtmlDoctype(code) &&
            doc.documentElement.getAttribute("lang") === "ja" &&
            !!meta &&
            String(meta.getAttribute("charset")).toUpperCase() === "UTF-8";
        }
      },
      {
        description: "title が「CMCSスクール お問い合わせ」",
        run: code => htmlLessonDocument(code).title.trim() === "CMCSスクール お問い合わせ"
      },
      {
        description: "h1 が「CMCSスクール お問い合わせ」",
        run: code => normalizedText(htmlLessonDocument(code).querySelector("h1")?.textContent) === "CMCSスクール お問い合わせ"
      },
      {
        description: "表の見出しが「曜日」「受付時間」",
        run: code => {
          const row = htmlLessonDocument(code).querySelector("table tr");
          const vals = row ? [...row.querySelectorAll("th")].map(x => normalizedText(x.textContent)) : [];
          return vals[0] === "曜日" && vals[1] === "受付時間";
        }
      },
      {
        description: "見出し行の bgcolor が grey",
        run: code => {
          const row = htmlLessonDocument(code).querySelector("table tr");
          return !!row && String(row.getAttribute("bgcolor") || "").toLowerCase() === "grey";
        }
      },
      {
        description: "データ行が「月〜金 / 9:00〜16:00」",
        run: code => {
          const rows = [...htmlLessonDocument(code).querySelectorAll("table tr")];
          return rows.slice(1).some(row => {
            const vals = [...row.querySelectorAll("td")].map(x => normalizedText(x.textContent));
            return vals[0] === "月〜金" && vals[1] === "9:00〜16:00";
          });
        }
      },
      {
        description: "データ行の bgcolor が lightgrey",
        run: code => {
          const rows = [...htmlLessonDocument(code).querySelectorAll("table tr")];
          return rows.slice(1).some(row =>
            String(row.getAttribute("bgcolor") || "").toLowerCase() === "lightgrey"
          );
        }
      },
      {
        description: "名前の label と text入力がある",
        run: code => {
          const doc = htmlLessonDocument(code);
          const labels = [...doc.querySelectorAll("form label")].map(x => normalizedText(x.textContent));
          return labels.includes("名前") && !!doc.querySelector('form input[type="text"]');
        }
      },
      {
        description: "メールの label と email入力がある",
        run: code => {
          const doc = htmlLessonDocument(code);
          const labels = [...doc.querySelectorAll("form label")].map(x => normalizedText(x.textContent));
          return labels.includes("メール") && !!doc.querySelector('form input[type="email"]');
        }
      },
      {
        description: "お問い合わせ内容の label と text入力がある",
        run: code => {
          const doc = htmlLessonDocument(code);
          const labels = [...doc.querySelectorAll("form label")].map(x => normalizedText(x.textContent));
          const textInputs = doc.querySelectorAll('form input[type="text"]');
          return labels.includes("お問い合わせ内容") && textInputs.length >= 2;
        }
      },
      {
        description: "送信ボタンが「送信する」",
        run: code => {
          const button = htmlLessonDocument(code).querySelector('button[type="submit"]');
          return !!button && normalizedText(button.textContent) === "送信する";
        }
      },
      {
        description: "footer が「© 2026 CMCS School」",
        run: code => normalizedText(htmlLessonDocument(code).querySelector("footer")?.textContent) === "© 2026 CMCS School"
      }
    ],
    hints: [
      "まず title と h1 に CMCSスクール お問い合わせ と書く",
      "表は Lesson 13・14 と同じように tr の中へ th / td を入れる",
      "見出し行は bgcolor=\"grey\"、データ行は bgcolor=\"lightgrey\"",
      "最後に送信するボタンと footer を書く"
    ]
  }

];