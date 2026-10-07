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
    title: "カードを2つ作ろう",
    description: "divとspanを繰り返し使う",
    content: `
      <p><strong>まず見本:</strong> 1つのdiv.cardの中にh2とpとspan。</p>

      <p><strong>練習課題:</strong> 今回はカードを2つ作ります。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li><code>div class="card"</code> が2つ</li>
        <li>1枚目h2「今日の天気」、span.red「雨」</li>
        <li>2枚目h2「明日の天気」、span.blue「晴れ」</li>
        <li>それぞれのcardにpがある</li>
      </ul>

      <div class="challenge-box">
        同じ構造を2回書くことで、divとspanの使い方を定着させます。
      </div>
    `,
    starterCode: `<!-- 今日のカード -->

<!-- 明日のカード -->`,
    solution: `<div class="card">
  <h2>今日の天気</h2>
  <p>今日は<span class="red">雨</span>です。</p>
</div>

<div class="card">
  <h2>明日の天気</h2>
  <p>明日は<span class="blue">晴れ</span>です。</p>
</div>`,
    explanation: `<p>同じ種類のまとまりには同じclassを使うことができます。</p>`,
    tests: [
      { description: "div.cardが2つ以上", run: code => htmlLessonDocument(code).querySelectorAll("div.card").length >= 2 },
      {
        description: "今日の天気カードが正しい",
        run: code => {
          const cards = [...htmlLessonDocument(code).querySelectorAll("div.card")];
          return cards.some(card =>
            normalizedText(card.querySelector("h2")?.textContent) === "今日の天気" &&
            normalizedText(card.querySelector("p span.red")?.textContent) === "雨"
          );
        }
      },
      {
        description: "明日の天気カードが正しい",
        run: code => {
          const cards = [...htmlLessonDocument(code).querySelectorAll("div.card")];
          return cards.some(card =>
            normalizedText(card.querySelector("h2")?.textContent) === "明日の天気" &&
            normalizedText(card.querySelector("p span.blue")?.textContent) === "晴れ"
          );
        }
      },
      {
        description: "各cardにpがある",
        run: code => [...htmlLessonDocument(code).querySelectorAll("div.card")].slice(0,2).every(card => !!card.querySelector("p"))
      }
    ],
    hints: ["cardを2回書く", "redとblueで別のspan"]
  },

  {
    id: 9,
    title: "2セクションのページを作ろう",
    description: "意味のある構造タグを増やす",
    content: `
      <p><strong>まず見本:</strong> header / nav / main / section / footer が1つずつ。</p>

      <p><strong>練習課題:</strong> 学校ニュースページを作ります。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li>headerのh1「学校ニュース」</li>
        <li>navに「ホーム」と「行事」のリンクを2つ</li>
        <li>mainの中にsectionが2つ</li>
        <li>sectionのh2は「今週のお知らせ」「来週の予定」</li>
        <li>footerに「© 2026 My School」</li>
      </ul>

      <div class="challenge-box">
        Lesson 8よりさらに要素数が増えます。構造を意識して組み立てましょう。
      </div>
    `,
    starterCode: `<!-- header -->

<!-- mainの中にsectionを2つ -->

<!-- footer -->`,
    solution: `<header>
  <h1>学校ニュース</h1>
  <nav>
    <a href="index.html">ホーム</a>
    <a href="events.html">行事</a>
  </nav>
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
    explanation: `<p>sectionを複数に増やしても、mainの中に整理して入れます。</p>`,
    tests: [
      {
        description: "headerのh1が「学校ニュース」",
        run: code => normalizedText(htmlLessonDocument(code).querySelector("header h1")?.textContent) === "学校ニュース"
      },
      {
        description: "navにリンクが2つ以上",
        run: code => htmlLessonDocument(code).querySelectorAll("header nav a").length >= 2
      },
      {
        description: "ホームと行事リンクがある",
        run: code => {
          const doc = htmlLessonDocument(code);
          const home = doc.querySelector('nav a[href="index.html"]');
          const events = doc.querySelector('nav a[href="events.html"]');
          return normalizedText(home?.textContent) === "ホーム" && normalizedText(events?.textContent) === "行事";
        }
      },
      { description: "main内にsectionが2つ", run: code => htmlLessonDocument(code).querySelectorAll("main > section").length >= 2 },
      {
        description: "2つのsection見出しが正しい",
        run: code => {
          const vals = [...htmlLessonDocument(code).querySelectorAll("main > section > h2")].map(x => normalizedText(x.textContent));
          return vals.includes("今週のお知らせ") && vals.includes("来週の予定");
        }
      },
      {
        description: "footerが正しい",
        run: code => normalizedText(htmlLessonDocument(code).querySelector("footer")?.textContent) === "© 2026 My School"
      }
    ],
    hints: ["navにaを2個", "main > sectionを2個"]
  },

  {
    id: 10,
    title: "入力項目の多いフォーム",
    description: "複数のフォーム部品を組み合わせる",
    content: `
      <p><strong>まず見本:</strong> 名前・学年・メッセージのフォーム。</p>

      <p><strong>練習課題:</strong> クラブ参加フォームを作ってください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li>名前: label/input text</li>
        <li>メール: label/input email</li>
        <li>学年: selectに1年・2年・3年</li>
        <li>参加理由: textarea</li>
        <li>確認チェック: input type="checkbox"</li>
        <li>送信button</li>
        <li>labelのforと各idを対応させる</li>
      </ul>

      <div class="challenge-box">
        これまでよりタグと属性が多いフォームです。1項目ずつ確認しましょう。
      </div>
    `,
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

  <label for="agree">内容を確認しました</label>
  <input type="checkbox" id="agree">

  <button type="submit">送信</button>
</form>`,
    explanation: `<p>フォームが長くなった時ほど、labelとidの対応が重要です。</p>`,
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
          const vals = [...htmlLessonDocument(code).querySelectorAll("select#grade option")].map(x => normalizedText(x.textContent));
          return ["1年","2年","3年"].every(v => vals.includes(v));
        }
      },
      { description: "参加理由textarea", run: code => !!htmlLessonDocument(code).querySelector("textarea#reason") },
      { description: "確認checkbox", run: code => !!htmlLessonDocument(code).querySelector('input#agree[type="checkbox"]') },
      {
        description: "送信button",
        run: code => {
          const b = htmlLessonDocument(code).querySelector('button[type="submit"]');
          return !!b && normalizedText(b.textContent) === "送信";
        }
      }
    ],
    hints: ["input type=email", "checkboxにもlabelを付けます"]
  },

  {
    id: 11,
    title: "3行の成績表を完成させよう",
    description: "表を少し大きくする",
    content: `
      <p><strong>まず見本:</strong> 見出し1行 + データ1行の表。</p>

      <p><strong>練習課題:</strong> 3教科の成績表を作ってください。</p>

      <h3>合格条件</h3>
      <ul class="lesson-requirements">
        <li>見出し行: 「教科」「点数」</li>
        <li>データ1: 国語 / 85</li>
        <li>データ2: 数学 / 92</li>
        <li>データ3: 情報 / 100</li>
        <li>trは合計4行以上</li>
        <li>見出しはth、データはtdを使う</li>
      </ul>

      <div class="challenge-box">
        ここまで学んだ表の作り方を使って、少し大きな表を完成させましょう。
      </div>
    `,
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
    explanation: `<p>行数が増えても、trの中にthまたはtdを入れる基本は同じです。</p>`,
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
    hints: ["見出し1行 + データ3行", "見出しはth、データはtd"]
  },

  {
    id: 12,
    title: "プロジェクト2: カフェのお店ページ",
    description: "HTML基礎10テーマを組み合わせる総まとめ",
    content: `
      <p><strong>プロジェクト:</strong> これまで学んだHTMLの基礎10テーマを組み合わせて、架空のカフェのお店ページを完成させましょう。</p>

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
        最終プロジェクトです。外側の構造から作り、そのあと画像・リスト・表・フォームを1つずつ追加しましょう。
      </div>
    `,
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
    explanation: `<p>Webページは、これまで学んだ小さなHTML部品の組み合わせです。最後は、構造・文章・リンク・画像・リスト・div・表・フォームを1ページにまとめます。</p>`,
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
      "最初に DOCTYPE / html / head / body を完成させる",
      "header → main → footer の大きな構造を先に作る",
      "お店についてのcardに画像・文章・ulをまとめる",
      "最後にtableとformを追加し、labelのforとidを確認する"
    ]
  }

];