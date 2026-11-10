const LESSONS_JS = [
  {
    id: 1,
    title: "【レクチャー】プログラミングと JavaScript",
    description: "プログラムとは何か",
    content: "<p><strong>プログラミング</strong>とは、コンピュータにやらせたいことを手順として書き下すことです。その手順が<strong>プログラム</strong>です。</p>\n<p>プログラムは上から下へ順番に実行されます。</p>\n<h3>JavaScript とは</h3>\n<p>Web を動かす言語です。ブラウザに入っているので追加インストールなしで動かせます（参考: <a href=\"https://www.w3schools.com/js/\" target=\"_blank\">W3Schools JavaScript</a>）。</p>\n<ul><li>HTML … 内容</li><li>CSS … 見た目</li><li>JavaScript … 動きと計算</li></ul>\n<p>右のエディターに書いて「実行」→ Console に結果が出ます。</p>\n<div class=\"challenge-box\"><strong>問1</strong> // コメントで「はじめてのプログラム」<br><strong>問2</strong> console.log(\"Hello\");</div>",
    starterCode: "// 問1\n\n// 問2\n",
    solution: "// はじめてのプログラム\nconsole.log(\"Hello\");\n",
    explanation: "<p><strong>解説</strong></p><p>コメントは無視されます。console.log が表示の基本です。</p>",
    tests: [
      {
        description: "問1: コメントがある",
        run: function(code) {return /\/\//.test(code);
        }
      },
      {
        description: "問2: Hello を出力",
        run: function(code) {
          var ok = false;
          var o = console.log;
          console.log = function () {
            if (String(arguments[0]).indexOf("Hello") !== -1) ok = true;
          };
          try { new Function(code)(); } catch (e) {}
          console.log = o;
          return ok;
        }
      }
    ],
    hints: ["// はじめてのプログラム", "console.log(\"Hello\");"]
  },
  {
    id: 2,
    title: "【レクチャー】出力（console.log）",
    description: "結果を表示する",
    content: "<p>プログラムが正しく動いているか確認するには、<strong>出力</strong>が必要です。</p>\n<p>ブラウザやこの学習サイトでは <code>console.log()</code> が一番よく使われます（W3Schools: JS Output）。「コンソールに値を書き出す」命令です。</p>\n<h3>基本の使い方</h3>\n<pre>console.log(\"Hello World\");  // 文字列\nconsole.log(3 + 4);            // 計算結果 7\nconsole.log(\"合計\", 10);       // 複数の値を並べて出せる</pre>\n<p>このサイトでは、エディターに書くと <strong>Console</strong> に結果が出ます（入力中も自動更新）。「判定」ボタンはテスト用です。</p>\n<div class=\"bad-example\">\n<strong>よくある間違い</strong>\n<pre>console.log Hello;   // 括弧がない\nconsole.log(Hello);  // 引用符がない → 変数を探しにいく</pre>\n<p>文字列は必ず引用符で囲み、命令のあとに () が必要です。</p>\n</div>\n<h3>なぜ log するのか</h3>\n<ul>\n<li>変数に今何が入っているか確認する</li>\n<li>計算の途中経過を見る</li>\n<li>どこまで正しく動いているか切り分ける（デバッグ）</li>\n</ul>\n<div class=\"challenge-box\"><strong>問1</strong> \"JS\" を log<br><strong>問2</strong> 2+3 の結果を log</div>",
    starterCode: "// 問1\n\n// 問2\n",
    solution: "console.log(\"JS\");\nconsole.log(2 + 3);\n",
    explanation: "<p><strong>解説</strong></p><p>Console タブで確認してください。</p>",
    tests: [
      {
        description: "問1: JS",
        run: function(code) {
          var ok = false;
          var o = console.log;
          console.log = function () { if (String(arguments[0]) === "JS") ok = true; };
          try { new Function(code)(); } catch (e) {}
          console.log = o;
          return ok;
        }
      },
      {
        description: "問2: 5",
        run: function(code) {
          var ok = false;
          var o = console.log;
          console.log = function () { if (arguments[0] === 5) ok = true; };
          try { new Function(code)(); } catch (e) {}
          console.log = o;
          return ok;
        }
      }
    ],
    hints: ["console.log(\"JS\");", "console.log(2 + 3);"]
  },
  {
    id: 3,
    displayNumber: "3-1",
    title: "【レクチャー】変数（Variables）",
    description: "変数とは — データを入れる「箱」",
    content: `
      <div class="challenge-box">
        <strong>問1</strong> <code>const greeting = "Hello"</code> を宣言して <code>console.log(greeting)</code><br>
        <strong>問2</strong> <code>console.log(greeting)</code> と <code>console.log("greeting")</code> の結果の違いを確認
      </div>

      <section class="js-study-card js-study-card-blue">
        <div class="js-study-kicker">VARIABLES</div>
        <h3>変数とは — データを入れる「箱」</h3>
        <p>変数は、データを入れておく「箱」に名前を付けたものです。あとから、その名前で値を取り出して使えます。</p>
        <pre><code>const message = "Hello";
console.log(message);   // Hello</code></pre>
      </section>

      <section class="js-study-card">
        <h3>宣言と代入</h3>
        <div class="js-definition-grid">
          <div><strong>宣言</strong><p>箱を作って名前を付けること</p><code>const message</code></div>
          <div><strong>代入</strong><p>箱に値を入れること</p><code>= "Hello"</code></div>
        </div>
      </section>

      <section class="js-study-card">
        <h3>変数名のルール</h3>
        <ol class="js-rule-list">
          <li>英字・数字・<code>_</code>・<code>$</code> が使える。数字から始めるのはNG。</li>
          <li>大文字と小文字は区別される。<code>name</code> と <code>Name</code> は別物。</li>
          <li>意味が分かる名前にする。<code>x</code> より <code>price</code> の方が分かりやすい。</li>
        </ol>
      </section>

      <aside class="js-note js-note-info"><strong>宣言のキーワードは3種類</strong><p><code>var</code>、<code>let</code>、<code>const</code> の3つがあります。次のレッスンで、まず「スコープ」を学びます。</p></aside>
      <aside class="js-summary"><strong>まとめ</strong><span>変数 = 名前付きの箱。使う前に必ず宣言する。</span></aside>
    `,
    starterCode: `// 問1
const greeting = "Hello";
console.log(greeting);

// 問2
console.log("greeting");
`,
    solution: `const greeting = "Hello";
console.log(greeting);
console.log("greeting");`,
    explanation: `<p><strong>解説:</strong> <code>greeting</code> は変数の中身を読みます。<code>"greeting"</code> は引用符で囲まれているので、ただの文字列です。</p>`,
    tests: [
      { description: "問1: greeting に Hello が入っている", run: function(code) { try { var fn = new Function(code + "; return greeting;"); return fn() === "Hello"; } catch (e) { return false; } } },
      { description: "問2: Hello と greeting の両方を出力", run: function(code) { var values=[]; var old=console.log; console.log=function(v){values.push(String(v));}; try{new Function(code)();}catch(e){} console.log=old; return values.indexOf("Hello")!==-1 && values.indexOf("greeting")!==-1; } }
    ],
    hints: [`const greeting = "Hello";`, `console.log(greeting); は中身、console.log("greeting"); は文字そのもの`]
  },

  {
    id: 301,
    displayNumber: "3-2",
    title: "【レクチャー】変数（Variables）",
    description: "スコープ — 変数が「見える範囲」",
    content: `
      <div class="challenge-box">
        <strong>問1</strong> <code>function test() { const a = 1; console.log(a); }</code> を作って呼び出す<br>
        <strong>問2</strong> 関数の外の <code>console.log(a)</code> を一度試して、ReferenceErrorを確認する
      </div>

      <section class="js-study-card js-study-card-blue">
        <div class="js-study-kicker">SCOPE</div>
        <h3>スコープ — 変数が「見える範囲」</h3>
        <p>スコープとは、その変数を使える範囲のことです。箱が置いてある「部屋」のようなものです。部屋の外からは、中の箱は見えません。</p>
      </section>

      <section class="js-study-card">
        <h3>スコープの種類</h3>
        <div class="js-scope-list">
          <div><strong>1. グローバルスコープ</strong><span>一番外側。広い範囲から見える。</span></div>
          <div><strong>2. 関数スコープ</strong><span>関数の <code>{ }</code> の中で見える。</span></div>
          <div><strong>3. ブロックスコープ</strong><span><code>if</code> や <code>for</code> の <code>{ }</code> の中で見える。</span></div>
        </div>
        <pre><code>const global = "どこからでも見える";

function test() {
  const local = "関数の中だけ";
  console.log(global); // OK
  console.log(local);  // OK
}

test();
// console.log(local); // ReferenceError</code></pre>
      </section>

      <aside class="js-note js-note-good"><strong>内側から外は見える。外から内は見えない。</strong><pre><code>if (true) {
  const inner = "ブロックの中だけ";
}
// console.log(inner); // ReferenceError</code></pre></aside>

      <section class="js-study-card"><h3>なぜ大事？</h3><ul class="js-rule-list"><li>範囲が狭いほど、意図しない場所から変更される事故が減る。</li><li>同じ名前を別の場所で使っても、ぶつかりにくい。</li></ul></section>

      <aside class="js-note js-note-warning"><strong>エラーを確認するとき</strong><p>外側の <code>console.log(a)</code> を一度だけコメント解除して実行するとReferenceErrorを確認できます。<strong>「実行して判定」の前にはコメントへ戻してください。</strong></p></aside>
      <aside class="js-summary"><strong>まとめ</strong><span>ブロックスコープの変数は、宣言した <code>{ }</code> の内側で使う。</span></aside>
    `,
    starterCode: `function test() {
  const a = 1;
  console.log(a);
}

test();

// エラーを確認したい時だけ // を外す
// console.log(a);
`,
    solution: `function test() {
  const a = 1;
  console.log(a);
}

test();

// console.log(a);`,
    explanation: `<p><strong>解説:</strong> <code>a</code> は関数の中で宣言されているので、関数の外から直接読むことはできません。</p>`,
    tests: [
      { description: "問1: test関数の中で a = 1 を出力", run: function(code) { var values=[]; var old=console.log; console.log=function(v){values.push(v);}; try{new Function(code)();}catch(e){} console.log=old; return values.indexOf(1)!==-1; } },
      { description: "問1: 関数内で const a = 1 を宣言", run: function(code) { return /function\s+test\s*\([^)]*\)\s*\{[\s\S]*?const\s+a\s*=\s*1\s*;?[\s\S]*?\}/.test(code); } }
    ],
    hints: ["a は test() の中に置く", "判定するときは関数の外の console.log(a) をコメントに戻す"]
  },

  {
    id: 302,
    displayNumber: "3-3",
    title: "【レクチャー】変数（Variables）",
    description: "var — 古い宣言方法（使わない理由を知る）",
    content: `
      <div class="challenge-box"><strong>問1</strong> <code>var a = 1</code> を宣言して log<br><strong>問2</strong> <code>if (true) { var x = 10; }</code> のあと、外で <code>console.log(x)</code> して結果を確認</div>

      <section class="js-study-card js-study-card-blue"><div class="js-study-kicker">VAR</div><h3>var — 古い宣言方法</h3><p><code>var</code> は2015年（ES6）より前から使われている宣言方法です。今でも動きますが、新しいコードでは基本的に使いません。</p><pre><code>var name = "Masa";
console.log(name);</code></pre></section>

      <aside class="js-note js-note-warning"><strong>なぜ使わないのか ① スコープが広すぎる</strong><pre><code>if (true) {
  var x = 10;
}
console.log(x); // 10</code></pre><p><code>var</code> はブロック <code>{ }</code> を無視して関数スコープになります。</p></aside>

      <section class="js-study-card"><h3>ほかにも注意点</h3><ol class="js-rule-list"><li>同じ名前で何度でも宣言できるので、ミスに気づきにくい。</li><li>巻き上げ（hoisting）により、宣言より上で触ると <code>undefined</code> になることがある。</li><li><code>for</code> の <code>var i</code> がループの外まで見えることがある。</li></ol></section>
      <aside class="js-summary js-summary-red"><strong>まとめ</strong><span><code>var</code> は「読めればOK」。新しいコードでは自分から使わない。</span></aside>
    `,
    starterCode: `// 問1
var a = 1;
console.log(a);

// 問2
if (true) {
  var x = 10;
}
console.log(x);
`,
    solution: `var a = 1;
console.log(a);

if (true) {
  var x = 10;
}
console.log(x);`,
    explanation: `<p><strong>解説:</strong> <code>var</code> はブロックを無視するため、<code>if</code> の外からも <code>x</code> を読めます。これが新しいコードで避ける理由の1つです。</p>`,
    tests: [
      { description: "問1: var a = 1 がある", run: function(code) { return /\bvar\s+a\s*=\s*1\s*;?/.test(code); } },
      { description: "問2: ifの外から x = 10 を読める", run: function(code) { try { var fn=new Function(code+"; return x;"); return fn()===10; } catch(e){ return false; } } }
    ],
    hints: ["var x は if の中に書く", "var では if の外でも x が見えてしまうことを確認する"]
  },

  {
    id: 303,
    displayNumber: "3-4",
    title: "【レクチャー】変数（Variables）",
    description: "let — あとから変えられる変数",
    content: `
      <div class="challenge-box"><strong>問1</strong> <code>let n = 1</code> のあと <code>n = 2</code> にして log<br><strong>問2</strong> <code>if (true) { let y = 10; }</code> の外で <code>console.log(y)</code> を試し、エラーを確認</div>

      <section class="js-study-card js-study-card-blue"><div class="js-study-kicker">LET</div><h3>let — あとから変えられる変数</h3><pre><code>let count = 0;
count = 1;   // OK</code></pre><p><code>let</code> は、あとから値を変える必要があるときに使います。</p></section>

      <aside class="js-note js-note-good"><strong>let はブロックスコープ</strong><pre><code>if (true) {
  let y = 10;
}
// console.log(y); // ReferenceError</code></pre><p><code>{ }</code> の外からは <code>y</code> を使えません。</p></aside>

      <section class="js-study-card"><h3>使いどころ</h3><p>本当に値が変わるときだけ使います。たとえばカウンターやループ変数です。</p></section>
      <aside class="js-note js-note-warning"><strong>エラーを確認するとき</strong><p><code>console.log(y)</code> のコメントを一度外してReferenceErrorを確認できます。判定前にはコメントへ戻してください。</p></aside>
      <aside class="js-summary"><strong>まとめ</strong><span>値をあとから変える必要があるときだけ <code>let</code>。</span></aside>
    `,
    starterCode: `// 問1
let n = 1;
n = 2;
console.log(n);

// 問2
if (true) {
  let y = 10;
}

// エラーを確認したい時だけ // を外す
// console.log(y);
`,
    solution: `let n = 1;
n = 2;
console.log(n);

if (true) {
  let y = 10;
}

// console.log(y);`,
    explanation: `<p><strong>解説:</strong> <code>let</code> は再代入できますが、ブロックスコープなので <code>{ }</code> の外へは漏れません。</p>`,
    tests: [
      { description: "問1: n を 1 から 2 に変更", run: function(code) { try { var fn=new Function(code+"; return n;"); return fn()===2; } catch(e){ return false; } } },
      { description: "問2: ifの中で let y = 10 を宣言", run: function(code) { return /if\s*\(\s*true\s*\)\s*\{[\s\S]*?let\s+y\s*=\s*10\s*;?[\s\S]*?\}/.test(code); } }
    ],
    hints: ["let n = 1; のあと n = 2;", "y は if の中だけで使う"]
  },

  {
    id: 304,
    displayNumber: "3-5",
    title: "【レクチャー】変数（Variables）",
    description: "const — 基本はこれ",
    content: `
      <div class="challenge-box"><strong>問1</strong> <code>const appName = "LearnFP"</code> を宣言して log<br><strong>問2</strong> <code>appName = "X"</code> を一度試して、再代入エラーを確認</div>

      <section class="js-study-card js-study-card-blue"><div class="js-study-kicker">CONST</div><h3>const — 基本はこれ</h3><pre><code>const price = 100;
// price = 200; // TypeError</code></pre><p><code>const</code> は、あとから別の値を入れ直せない変数です。</p></section>

      <aside class="js-note js-note-good"><strong>const もブロックスコープ</strong><p><code>let</code> と同じように、宣言した <code>{ }</code> の範囲を守ります。違いは「再代入できない」ことです。</p></aside>
      <section class="js-study-card"><h3>迷ったら const</h3><p>最初は <code>const</code> を使い、あとで値を変える必要があると分かったときだけ <code>let</code> を使うと安全です。</p></section>
      <aside class="js-note js-note-warning"><strong>再代入エラーを確認するとき</strong><p><code>appName = "X"</code> のコメントを一度外して実行するとエラーを確認できます。判定前にはコメントへ戻してください。</p></aside>
      <aside class="js-summary"><strong>まとめ</strong><span>基本は <code>const</code>。値を変える必要があるときだけ <code>let</code>。</span></aside>
    `,
    starterCode: `// 問1
const appName = "LearnFP";
console.log(appName);

// 問2: エラーを確認したい時だけ // を外す
// appName = "X";
`,
    solution: `const appName = "LearnFP";
console.log(appName);

// appName = "X";`,
    explanation: `<p><strong>解説:</strong> <code>const</code> は同じ変数へ別の値を再代入できません。新しいコードでは、まず <code>const</code> を選ぶのが基本です。</p>`,
    tests: [
      { description: "問1: const appName = LearnFP", run: function(code) { try { var fn=new Function(code+"; return appName;"); return fn()==="LearnFP"; } catch(e){ return false; } } },
      { description: "問1: appName を出力", run: function(code) { var values=[]; var old=console.log; console.log=function(v){values.push(String(v));}; try{new Function(code)();}catch(e){} console.log=old; return values.indexOf("LearnFP")!==-1; } }
    ],
    hints: [`const appName = "LearnFP";`, "再代入の行はエラー確認後、判定前にコメントへ戻す"]
  },

  {
    id: 305,
    title: "PROJECT 1　買い物レシートを作ろう",
    description: "const と let を使って合計金額を出す",
    content: `
      <div class="challenge-box">
        <strong>1.</strong> <code>price</code> に <code>100</code> を入れる（変わらないので <code>const</code>）<br>
        <strong>2.</strong> <code>qty</code> を <code>1</code> で作り、<code>3</code> に変える（変わるので <code>let</code>）<br>
        <strong>3.</strong> <code>price * qty</code> の答えを <code>console.log()</code> する
      </div>

      <section class="js-study-card js-study-card-blue">
        <div class="js-study-kicker">PROJECT 1</div>
        <h3>買い物レシートを作ろう</h3>
        <p><strong>使うもの:</strong> <code>const</code>、<code>let</code>（Lesson 3-1・3-4・3-5）</p>
        <p><strong>ゴール:</strong> ノートの値段と個数から、合計金額を出します。</p>
      </section>

      <section class="js-study-card">
        <h3>見本：えんぴつの場合</h3>
        <p>えんぴつが50円で、2本買う場合です。課題とは数字が違います。</p>
        <pre><code>const price = 50;

let qty = 1;
qty = 2;

console.log(price * qty);</code></pre>
        <p>出力は <code>100</code> です。</p>
      </section>

      <aside class="js-note js-note-good">
        <strong>大事なポイント</strong>
        <p><code>qty = 3;</code> のときは、2回目なので <code>let</code> を付けません。</p>
      </aside>

      <aside class="js-summary">
        <strong>PROJECT GOAL</strong>
        <span><code>const</code> と <code>let</code> を使い分けて、最後に <code>300</code> を出力できればクリアです。</span>
      </aside>
    `,
    starterCode: `// 1. price に 100 を入れる（const）

// 2. qty を 1 で作り、3 に変える（let）

// 3. price * qty を log する
`,
    solution: `const price = 100;

let qty = 1;
qty = 3;

console.log(price * qty);`,
    explanation: `<p><strong>解説:</strong> 値段の <code>price</code> は変わらないので <code>const</code>、個数の <code>qty</code> は1から3へ変わるので <code>let</code> を使います。<code>100 × 3 = 300</code> です。</p>`,
    tests: [
      {
        description: "price は const で 100",
        run: function(code) {
          return /\bconst\s+price\s*=\s*100\s*;?/.test(code);
        }
      },
      {
        description: "qty は let で 1 から始める",
        run: function(code) {
          return /\blet\s+qty\s*=\s*1\s*;?/.test(code);
        }
      },
      {
        description: "qty を 3 に変更する（2回目に let を付けない）",
        run: function(code) {
          const hasAssignment = /(?:^|[;\n]\s*)qty\s*=\s*3\s*;?/m.test(code);
          const redeclared = /\blet\s+qty\s*=\s*3\b/.test(code) || /\bconst\s+qty\s*=\s*3\b/.test(code) || /\bvar\s+qty\s*=\s*3\b/.test(code);
          return hasAssignment && !redeclared;
        }
      },
      {
        description: "price * qty の結果 300 を出力",
        run: function(code) {
          var values = [];
          var old = console.log;
          console.log = function(v) { values.push(v); };
          try { new Function(code)(); } catch (e) {}
          console.log = old;
          return values.indexOf(300) !== -1;
        }
      }
    ],
    hints: [
      `const price = 100;`,
      `let qty = 1; のあと qty = 3;`,
      `console.log(price * qty);`
    ]
  },


  {
    id: 306,
    title: "PROJECT 2　ゲームのスコアを作ろう",
    description: "const と let だけでスコアを2回増やす",
    content: `
      <div class="challenge-box">
        <strong>1.</strong> <code>playerName</code> に <code>"Masa"</code> を入れる（変わらないので <code>const</code>）<br>
        <strong>2.</strong> <code>score</code> を <code>0</code> で作る（増えるので <code>let</code>）<br>
        <strong>3.</strong> <code>score = 10</code>、そのあと <code>score = 20</code> に変える<br>
        <strong>4.</strong> <code>playerName</code> と <code>score</code> を1行ずつ <code>console.log()</code> する
      </div>

      <section class="js-study-card js-study-card-blue">
        <div class="js-study-kicker">PROJECT 2</div>
        <h3>ゲームのスコアを作ろう</h3>
        <p><strong>使うもの:</strong> <code>const</code>、<code>let</code>（Lesson 3-1・3-4・3-5）</p>
        <p><strong>ゴール:</strong> スコアを2回増やして、プレイヤー名と最後のスコアを表示します。</p>
      </section>

      <section class="js-study-card">
        <h3>見本：ペットのレベルの場合</h3>
        <p>課題とは変数名と値が違います。</p>
        <pre><code>const petName = "Pochi";

let level = 1;
level = 2;
level = 3;

console.log(petName);
console.log(level);</code></pre>
        <p>出力は <code>Pochi</code> と <code>3</code> です。</p>
      </section>

      <aside class="js-note js-note-good">
        <strong>大事なポイント</strong>
        <p>2回目・3回目の代入では <code>let</code> を付けません。<code>score = 10;</code>、<code>score = 20;</code> と書きます。</p>
      </aside>

      <aside class="js-note js-note-warning">
        <strong>チャレンジ：const は再代入できる？</strong>
        <p>完成したあと、下のコメントを一度だけ外して実行してみましょう。</p>
        <pre><code>// playerName = "Taro";</code></pre>
        <p><code>TypeError</code> が出ればOKです。確認したら、もう一度コメントに戻してから判定してください。</p>
      </aside>

      <aside class="js-summary">
        <strong>PROJECT GOAL</strong>
        <span><code>Masa</code> と <code>20</code> が1行ずつ出力されればクリアです。</span>
      </aside>
    `,
    starterCode: `// 1. playerName に "Masa" を入れる（const）

// 2. score を 0 で作る（let）

// 3. score を 10、20 の順に変える

// 4. playerName と score を1行ずつ log する

// チャレンジ：完成後に一度だけコメントを外してTypeErrorを確認
// playerName = "Taro";
`,
    solution: `const playerName = "Masa";

let score = 0;
score = 10;
score = 20;

console.log(playerName);
console.log(score);

// playerName = "Taro";`,
    explanation: `<p><strong>解説:</strong> <code>playerName</code> は変わらないので <code>const</code>、<code>score</code> は0→10→20と変わるので <code>let</code> を使います。最後に入れた値 <code>20</code> が表示されます。</p>`,
    tests: [
      {
        description: "playerName は const で Masa",
        run: function(code) {
          return /\bconst\s+playerName\s*=\s*["']Masa["']\s*;?/.test(code);
        }
      },
      {
        description: "score は let で 0 から始める",
        run: function(code) {
          return /\blet\s+score\s*=\s*0\s*;?/.test(code);
        }
      },
      {
        description: "score を 10 に変更する",
        run: function(code) {
          const ok = /(?:^|[;\n]\s*)score\s*=\s*10\s*;?/m.test(code);
          const redeclared = /\b(?:let|const|var)\s+score\s*=\s*10\b/.test(code);
          return ok && !redeclared;
        }
      },
      {
        description: "score を 20 に変更する",
        run: function(code) {
          const ok = /(?:^|[;\n]\s*)score\s*=\s*20\s*;?/m.test(code);
          const redeclared = /\b(?:let|const|var)\s+score\s*=\s*20\b/.test(code);
          return ok && !redeclared;
        }
      },
      {
        description: "var を使っていない",
        run: function(code) {
          const withoutComments = code
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/\/\/.*$/gm, "");
          return !/\bvar\b/.test(withoutComments);
        }
      },
      {
        description: "Masa と 20 を1行ずつ出力",
        run: function(code) {
          var values = [];
          var old = console.log;
          console.log = function(v) { values.push(v); };
          try { new Function(code)(); } catch (e) {}
          console.log = old;
          return values.length >= 2 && String(values[0]) === "Masa" && values[1] === 20;
        }
      }
    ],
    hints: [
      `const playerName = "Masa";`,
      `let score = 0; のあと score = 10; → score = 20;`,
      `console.log(playerName); と console.log(score);`,
      `2回目以降の score に let は付けない`
    ]
  },

  {
    id: 4,
    title: "【レクチャー】データ型",
    description: "string / number / boolean",
    content: "<p>値には型があります（W3Schools: Data Types）。</p>\n<pre>typeof \"hello\"; // \"string\"\ntypeof 42;      // \"number\"（整数も小数も同じ）\ntypeof true;    // \"boolean\"</pre>\n<p>独立した「整数型」はありません。</p>\n<div class=\"bad-example\"><strong>注意</strong><pre>\"5\" + 1 // \"51\"（連結）</pre></div>\n<div class=\"challenge-box\"><strong>問1</strong> msg に文字列、num に数値<br><strong>問2</strong> typeof を log</div>",
    starterCode: "const msg = \"hi\";\nconst num = 10;\n// typeof を log\n",
    solution: "const msg = \"hi\";\nconst num = 10;\nconsole.log(typeof msg);\nconsole.log(typeof num);\n",
    explanation: "<p><strong>解説</strong></p><p>typeof は型名の文字列を返します。</p>",
    tests: [
      {
        description: "問1: 型",
        run: function(code) {var fn = new Function(code + "; return typeof msg === \"string\" && typeof num === \"number\";"); return fn() === true;
        }
      },
      {
        description: "問2: log",
        run: function(code) {var n=0; var o=console.log; console.log=function(){n++;}; try{new Function(code)();}catch(e){} console.log=o; return n>=1;
        }
      }
    ],
    hints: ["const msg = \"hi\";", "console.log(typeof msg);"]
  },
  {
    id: 5,
    title: "【レクチャー】数値",
    description: "計算",
    content: "<pre>10 + 3; 10 % 3;\nNumber.isInteger(10); // true</pre>\n<div class=\"challenge-box\"><strong>問1</strong> add(a,b)　<strong>問2</strong> isInt(n)</div>",
    starterCode: "function add(a, b) {\n}\nfunction isInt(n) {\n}\nconsole.log(add(10, 5));\nconsole.log(isInt(10));\n",
    solution: "function add(a, b) { return a + b; }\nfunction isInt(n) { return Number.isInteger(n); }\n",
    explanation: "<p><strong>解説</strong></p><p>return で結果を返します。</p>",
    tests: [
      {
        description: "問1",
        run: function(code) {var fn = new Function(code + "; return add(10, 5);"); return fn() === 15;
        }
      },
      {
        description: "問2",
        run: function(code) {var fn = new Function(code + "; return isInt(10) === true && isInt(3.14) === false;"); return fn() === true;
        }
      }
    ],
    hints: ["return a + b;", "return Number.isInteger(n);"]
  },
  {
    id: 6,
    title: "【レクチャー】文字列",
    description: "連結と length",
    content: "<pre>\"Hello, \" + name;\nname.length;</pre>\n<div class=\"challenge-box\"><strong>問1</strong> greet　<strong>問2</strong> len</div>",
    starterCode: "function greet(name) {\n}\nfunction len(s) {\n}\nconsole.log(greet(\"Taro\"));\nconsole.log(len(\"Hi\"));\n",
    solution: "function greet(name) { return \"Hi, \" + name; }\nfunction len(s) { return s.length; }\n",
    explanation: "<p><strong>解説</strong></p><p>length に括弧は不要です。</p>",
    tests: [
      {
        description: "問1",
        run: function(code) {var fn = new Function(code + "; return greet(\"Taro\");"); return fn() === "Hi, Taro";
        }
      },
      {
        description: "問2",
        run: function(code) {var fn = new Function(code + "; return len(\"Hi\");"); return fn() === 2;
        }
      }
    ],
    hints: ["return \"Hi, \" + name;", "return s.length;"]
  },
  {
    id: 7,
    title: "【レクチャー】真偽値と演算子",
    description: "=== と &&",
    content: "<pre>5 === 5; true && false;</pre>\n<div class=\"bad-example\"><strong>非推奨</strong> == より === を使う（W3Schools / 現代の作法）</div>\n<div class=\"challenge-box\"><strong>問1</strong> isAdult　<strong>問2</strong> and</div>",
    starterCode: "function isAdult(age) {\n}\nfunction and(a, b) {\n}\nconsole.log(isAdult(20));\n",
    solution: "function isAdult(age) { return age >= 18; }\nfunction and(a, b) { return a && b; }\n",
    explanation: "<p><strong>解説</strong></p><p>比較結果は boolean です。</p>",
    tests: [
      {
        description: "問1",
        run: function(code) {var fn = new Function(code + "; return isAdult(20) === true && isAdult(15) === false;"); return fn() === true;
        }
      },
      {
        description: "問2",
        run: function(code) {var fn = new Function(code + "; return and(true, true) === true && and(true, false) === false;"); return fn() === true;
        }
      }
    ],
    hints: ["return age >= 18;", "return a && b;"]
  },
  {
    id: 8,
    title: "【レクチャー】関数",
    description: "引数と return",
    content: "<p><strong>関数</strong>は、処理をまとめて名前を付け、何度でも呼び出せるブロックです（W3Schools: Functions）。</p>\n<h3>形のおさらい</h3>\n<pre>function add(a, b) {\n  return a + b;  // 呼び出し元に値を返す\n}\nconst x = add(2, 3); // x は 5</pre>\n<ul>\n<li><strong>引数</strong> … 入力（ここでは a, b）</li>\n<li><strong>return</strong> … 出力。値を返し、そこで関数を終了する</li>\n<li>呼び出すときは <code>名前(引数)</code>。定義しただけでは動きません</li>\n</ul>\n<div class=\"bad-example\">\n<strong>よくある間違い</strong>\n<pre>function add(a, b) {\n  a + b;  // return がない\n}\nconst x = add(2, 3); // undefined</pre>\n<p>計算しただけでは呼び出し元に届きません。return が必要です。</p>\n</div>\n<p>同じ処理をコピペせず関数にすると、修正が1か所で済み、読みやすくなります。</p>\n<div class=\"challenge-box\"><strong>問1</strong> area(w,h) 面積<br><strong>問2</strong> triple(n) 3倍</div>",
    starterCode: "function area(w, h) {\n}\nfunction triple(n) {\n}\nconsole.log(area(3, 4));\nconsole.log(triple(5));\n",
    solution: "function area(w, h) { return w * h; }\nfunction triple(n) { return n * 3; }\n",
    explanation: "<p><strong>解説</strong></p><p>return で値を返します。</p>",
    tests: [
      {
        description: "問1",
        run: function(code) {var fn = new Function(code + "; return area(3, 4);"); return fn() === 12;
        }
      },
      {
        description: "問2",
        run: function(code) {var fn = new Function(code + "; return triple(5);"); return fn() === 15;
        }
      }
    ],
    hints: ["return w * h;", "return n * 3;"]
  },
  {
    id: 9,
    title: "【レクチャー】オブジェクト",
    description: "プロパティ",
    content: "<pre>user.name; user[\"age\"];</pre>\n<div class=\"challenge-box\"><strong>問1</strong> getName　<strong>問2</strong> getAge</div>",
    starterCode: "function getName(obj) {\n}\nfunction getAge(obj) {\n}\nconsole.log(getName({name:\"Taro\",age:20}));\n",
    solution: "function getName(obj) { return obj.name; }\nfunction getAge(obj) { return obj.age; }\n",
    explanation: "<p><strong>解説</strong></p><p>ドット記法が基本です。</p>",
    tests: [
      {
        description: "問1",
        run: function(code) {var fn = new Function(code + "; return getName({name:\"Taro\",age:20});"); return fn() === "Taro";
        }
      },
      {
        description: "問2",
        run: function(code) {var fn = new Function(code + "; return getAge({name:\"Taro\",age:20});"); return fn() === 20;
        }
      }
    ],
    hints: ["return obj.name;", "return obj.age;"]
  },
  {
    id: 10,
    title: "【レクチャー】配列",
    description: "インデックスは0から",
    content: "<p><strong>配列（Array）</strong>は順番付きの値のリストです。複数のデータを1つにまとめられます（W3Schools: Arrays）。</p>\n<pre>const fruits = [\"Apple\", \"Banana\", \"Cherry\"];\nfruits[0];        // \"Apple\"（番号は 0 から）\nfruits[1];        // \"Banana\"\nfruits.length;    // 3\nfruits[fruits.length - 1]; // 最後</pre>\n<h3>ポイント</h3>\n<ul>\n<li>インデックスは <strong>0 から</strong>始まる</li>\n<li><code>length</code> で個数が分かる</li>\n<li>存在しない番号を読むと <code>undefined</code>（エラーにはならないので注意）</li>\n</ul>\n<div class=\"bad-example\">\n<strong>注意</strong>\n<pre>fruits[3];  // undefined（4個目は無い）</pre>\n<p>存在確認せずに使うと、あとでバグになりやすいです。</p>\n</div>\n<div class=\"challenge-box\"><strong>問1</strong> first(arr) 先頭<br><strong>問2</strong> size(arr) 要素数</div>",
    starterCode: "function first(arr) {\n}\nfunction size(arr) {\n}\nconsole.log(first([\"a\",\"b\"]));\n",
    solution: "function first(arr) { return arr[0]; }\nfunction size(arr) { return arr.length; }\n",
    explanation: "<p><strong>解説</strong></p><p>0 が最初です。</p>",
    tests: [
      {
        description: "問1",
        run: function(code) {var fn = new Function(code + "; return first([\"a\",\"b\"]);"); return fn() === "a";
        }
      },
      {
        description: "問2",
        run: function(code) {var fn = new Function(code + "; return size([10,20,30]);"); return fn() === 3;
        }
      }
    ],
    hints: ["return arr[0];", "return arr.length;"]
  },
  {
    id: 11,
    title: "【レクチャー】map と filter",
    description: "変換と絞り込み",
    content: "<pre>nums.map(function(n){ return n*2; });\nnums.filter(function(n){ return n%2===0; });</pre>\n<p>元の配列は変更しません。</p>\n<div class=\"challenge-box\"><strong>問1</strong> doubleAll　<strong>問2</strong> evens</div>",
    starterCode: "function doubleAll(nums) {\n}\nfunction evens(nums) {\n}\nconsole.log(doubleAll([1,2,3]));\n",
    solution: "function doubleAll(nums) { return nums.map(function(n){ return n*2; }); }\nfunction evens(nums) { return nums.filter(function(n){ return n%2===0; }); }\n",
    explanation: "<p><strong>解説</strong></p><p>map は変換、filter は条件で残します。</p>",
    tests: [
      {
        description: "問1",
        run: function(code) {var fn = new Function(code + "; return JSON.stringify(doubleAll([1,2,3]));"); return fn() === "[2,4,6]";
        }
      },
      {
        description: "問2",
        run: function(code) {var fn = new Function(code + "; return JSON.stringify(evens([1,2,3,4]));"); return fn() === "[2,4]";
        }
      }
    ],
    hints: ["map で2倍", "filter で偶数"]
  },
  {
    id: 12,
    title: "【レクチャー】reduce と不変更新",
    description: "合計と concat",
    content: "<pre>nums.reduce(function(s,n){ return s+n; }, 0);\narr.concat([v]);</pre>\n<div class=\"challenge-box\"><strong>問1</strong> sum　<strong>問2</strong> append</div>",
    starterCode: "function sum(nums) {\n}\nfunction append(arr, v) {\n}\nconsole.log(sum([1,2,3,4]));\n",
    solution: "function sum(nums) { return nums.reduce(function(s,n){ return s+n; }, 0); }\nfunction append(arr, v) { return arr.concat([v]); }\n",
    explanation: "<p><strong>解説</strong></p><p>初期値 0。concat は新配列です。</p>",
    tests: [
      {
        description: "問1",
        run: function(code) {var fn = new Function(code + "; return sum([1,2,3,4]) === 10 && sum([]) === 0;"); return fn() === true;
        }
      },
      {
        description: "問2",
        run: function(code) {var fn = new Function(code + "; var a=[1]; var r=append(a,2); return JSON.stringify(r) === \"[1,2]\" && a.length === 1;"); return fn() === true;
        }
      }
    ],
    hints: ["reduce", "concat"]
  },
  {
    id: 13,
    title: "練習：組み合わせ",
    description: "filter map reduce",
    content: "<div class=\"challenge-box\"><strong>問1</strong> positives　<strong>問2</strong> sumEvenDoubled</div>",
    starterCode: "function positives(nums) {\n}\nfunction sumEvenDoubled(nums) {\n}\nconsole.log(positives([-1,2,0,5]));\nconsole.log(sumEvenDoubled([1,2,3,4]));\n",
    solution: "function positives(nums) { return nums.filter(function(n){ return n>0; }); }\nfunction sumEvenDoubled(nums) {\n  return nums.filter(function(n){ return n%2===0; }).map(function(n){ return n*2; }).reduce(function(s,n){ return s+n; }, 0);\n}\n",
    explanation: "<p><strong>解説</strong></p><p>小さく分けてつなぎます。</p>",
    tests: [
      {
        description: "問1",
        run: function(code) {var fn = new Function(code + "; return JSON.stringify(positives([-1,2,0,5]));"); return fn() === "[2,5]";
        }
      },
      {
        description: "問2",
        run: function(code) {var fn = new Function(code + "; return sumEvenDoubled([1,2,3,4]);"); return fn() === 12;
        }
      }
    ],
    hints: ["filter n>0", "偶数を2倍して合計"]
  },
  {
    id: 14,
    title: "【レクチャー】if / if-else",
    description: "条件分岐",
    content: "<p>条件によって処理を分けるには <code>if</code> を使います。</p>\n<pre>if (age >= 18) {\n  console.log(\"成人\");\n} else if (age >= 13) {\n  console.log(\"ティーン\");\n} else {\n  console.log(\"子供\");\n}</pre>\n<p>条件式が <code>true</code> のときだけ、対応するブロックが実行されます。<code>else if</code> で追加の条件、<code>else</code> で「どれにも当てはまらないとき」を書けます。</p>\n<div class=\"bad-example\">\n<strong>注意</strong>\n<pre>if (x = 5) { }  // = は代入。比較は === や >= など</pre>\n<p>代入と間違えると、意図しない true 判定になることがあります。</p>\n</div>\n<div class=\"challenge-box\"><strong>問1</strong> grade(score) … 60以上 \"pass\"、未満 \"fail\"<br>\n<strong>問2</strong> sign(n) … 正 \"plus\"、負 \"minus\"、0 \"zero\"</div>",
    starterCode: "function grade(score) {\n  // 60以上 pass / 未満 fail\n}\n\nfunction sign(n) {\n  // plus / minus / zero\n}\n\nconsole.log(grade(80));\nconsole.log(grade(40));\nconsole.log(sign(5));\nconsole.log(sign(-2));\nconsole.log(sign(0));\n",
    solution: "function grade(score) {\n  if (score >= 60) {\n    return \"pass\";\n  } else {\n    return \"fail\";\n  }\n}\n\nfunction sign(n) {\n  if (n > 0) return \"plus\";\n  if (n < 0) return \"minus\";\n  return \"zero\";\n}\n",
    explanation: "<p><strong>解説</strong></p><p>if の条件が true のときブロックが実行されます。else でそれ以外を書けます。</p>",
    tests: [
      {
        description: "問1: grade",
        run: function(code) {
          var fn = new Function(code + "; return grade(80) === \"pass\" && grade(40) === \"fail\";"); return fn() === true;
        }
      },
      {
        description: "問2: sign",
        run: function(code) {
          var fn = new Function(code + "; return sign(5) === \"plus\" && sign(-2) === \"minus\" && sign(0) === \"zero\";"); return fn() === true;
        }
      }
    ],
    hints: ["if (score >= 60) return \"pass\"; else return \"fail\";", "n > 0 / n < 0 / else zero"]
  },
  {
    id: 15,
    title: "【レクチャー】for ループ",
    description: "決められた回数くり返す",
    content: "<p><code>for</code> は「初期化 → 条件 → 更新」の形でくり返します。</p>\n<pre>for (let i = 0; i < 3; i++) {\n  console.log(i);  // 0, 1, 2\n}\n\nconst arr = [\"a\", \"b\", \"c\"];\nfor (let i = 0; i < arr.length; i++) {\n  console.log(arr[i]);\n}</pre>\n<div class=\"challenge-box\"><strong>問1</strong> sumTo(n) … 1 から n までの合計<br>\n<strong>問2</strong> countDown(n) … [n, n-1, …, 1]</div>",
    starterCode: "function sumTo(n) {\n  // 1+2+...+n\n}\n\nfunction countDown(n) {\n  // [n, n-1, ..., 1]\n}\n\nconsole.log(sumTo(5));\nconsole.log(countDown(3));\n",
    solution: "function sumTo(n) {\n  let s = 0;\n  for (let i = 1; i <= n; i++) {\n    s += i;\n  }\n  return s;\n}\n\nfunction countDown(n) {\n  const arr = [];\n  for (let i = n; i >= 1; i--) {\n    arr.push(i);\n  }\n  return arr;\n}\n",
    explanation: "<p><strong>解説</strong></p><p>for の第1で開始、第2で条件、第3で更新です。</p>",
    tests: [
      {
        description: "問1: sumTo(5)→15",
        run: function(code) {
          var fn = new Function(code + "; return sumTo(5) === 15 && sumTo(1) === 1;"); return fn() === true;
        }
      },
      {
        description: "問2: countDown",
        run: function(code) {
          var fn = new Function(code + "; return JSON.stringify(countDown(3)) === \"[3,2,1]\";"); return fn() === true;
        }
      }
    ],
    hints: ["for (let i = 1; i <= n; i++) s += i;", "for (let i = n; i >= 1; i--) arr.push(i);"]
  },
  {
    id: 16,
    title: "【レクチャー】while ループ",
    description: "条件が true の間くり返す",
    content: "<p><code>while</code> は条件が true のあいだくり返します。</p>\n<pre>let n = 3;\nwhile (n > 0) {\n  console.log(n);\n  n = n - 1;\n}</pre>\n<div class=\"bad-example\"><strong>注意</strong>\n<pre>while (true) { }  // 終了条件を忘れると無限ループ</pre></div>\n<div class=\"challenge-box\"><strong>問1</strong> factorial(n) … while で階乗（5 → 120）<br>\n<strong>問2</strong> digits(n) … 桁数（123 → 3）</div>",
    starterCode: "function factorial(n) {\n  // while で階乗\n}\n\nfunction digits(n) {\n  // 桁数\n}\n\nconsole.log(factorial(5));\nconsole.log(digits(123));\n",
    solution: "function factorial(n) {\n  let result = 1;\n  let i = n;\n  while (i > 1) {\n    result *= i;\n    i--;\n  }\n  return result;\n}\n\nfunction digits(n) {\n  if (n === 0) return 1;\n  let count = 0;\n  let x = n;\n  while (x > 0) {\n    count++;\n    x = Math.floor(x / 10);\n  }\n  return count;\n}\n",
    explanation: "<p><strong>解説</strong></p><p>while の中で条件が false になるよう変数を更新します。</p>",
    tests: [
      {
        description: "問1: factorial",
        run: function(code) {
          var fn = new Function(code + "; return factorial(5) === 120 && factorial(1) === 1;"); return fn() === true;
        }
      },
      {
        description: "問2: digits",
        run: function(code) {
          var fn = new Function(code + "; return digits(123) === 3 && digits(7) === 1;"); return fn() === true;
        }
      }
    ],
    hints: ["while (i > 1) { result *= i; i--; }", "while (x > 0) { count++; x = Math.floor(x / 10); }"]
  },
  {
    id: 17,
    title: "【レクチャー】forEach と for...of",
    description: "配列を1つずつ処理",
    content: "<p>配列の各要素に同じ処理をする方法です。</p>\n<pre>const nums = [10, 20, 30];\n\nnums.forEach(function(n) {\n  console.log(n);\n});\n\nfor (const n of nums) {\n  console.log(n);\n}</pre>\n<div class=\"challenge-box\"><strong>問1</strong> sumForEach(arr) … forEach で合計<br>\n<strong>問2</strong> joinWithDash(arr) … for...of で \"a-b-c\"</div>",
    starterCode: "function sumForEach(arr) {\n  // forEach で合計\n}\n\nfunction joinWithDash(arr) {\n  // for...of で a-b-c\n}\n\nconsole.log(sumForEach([1, 2, 3, 4]));\nconsole.log(joinWithDash([\"a\", \"b\", \"c\"]));\n",
    solution: "function sumForEach(arr) {\n  let s = 0;\n  arr.forEach(function(n) {\n    s += n;\n  });\n  return s;\n}\n\nfunction joinWithDash(arr) {\n  let result = \"\";\n  let first = true;\n  for (const item of arr) {\n    if (!first) result += \"-\";\n    result += item;\n    first = false;\n  }\n  return result;\n}\n",
    explanation: "<p><strong>解説</strong></p><p>forEach は各要素で関数を呼びます。for...of は値が順番に取り出せます。</p>",
    tests: [
      {
        description: "問1: sumForEach",
        run: function(code) {
          var fn = new Function(code + "; return sumForEach([1,2,3,4]) === 10;"); return fn() === true;
        }
      },
      {
        description: "問2: joinWithDash",
        run: function(code) {
          var fn = new Function(code + "; return joinWithDash([\"a\",\"b\",\"c\"]) === \"a-b-c\" && joinWithDash([]) === \"\";"); return fn() === true;
        }
      }
    ],
    hints: ["arr.forEach(function(n){ s += n; });", "for (const item of arr) { ... }"]
  },
  {
    id: 18,
    title: "【変数①】宣言と代入",
    description: "const / let の基本",
    content: "<p>変数は値に<strong>名前</strong>を付ける箱です。</p>\n<pre>const name = \"Taro\";  // あとから変えられない\nlet count = 0;        // あとから変えられる\ncount = 1;</pre>\n<div class=\"challenge-box\"><strong>問1</strong> const city = \"Osaka\" を宣言して log<br>\n<strong>問2</strong> let x = 10 のあと x = 20 にして log</div>",
    starterCode: "// 問1\n\n// 問2\n",
    solution: "const city = \"Osaka\";\nconsole.log(city);\nlet x = 10;\nx = 20;\nconsole.log(x);\n",
    explanation: "<p><strong>解説</strong></p><p>変えない値は const、変える値は let です。</p>",
    tests: [
      {
        description: "問1: city",
        run: function(code) {
          var fn = new Function(code + "; return city === \"Osaka\";"); return fn() === true;
        }
      },
      {
        description: "問2: x===20",
        run: function(code) {
          var fn = new Function(code + "; return x === 20;"); return fn() === true;
        }
      }
    ],
    hints: ["const city = \"Osaka\";", "let x = 10; x = 20;"]
  },
  {
    id: 19,
    title: "【変数②】複数の変数と計算",
    description: "変数同士の計算",
    content: "<pre>const a = 10;\nconst b = 3;\nconst sum = a + b;\nconst product = a * b;</pre>\n<div class=\"challenge-box\"><strong>問1</strong> price=1000, tax=0.1 から taxAmount = price * tax を作る<br>\n<strong>問2</strong> total = price + taxAmount を log</div>",
    starterCode: "const price = 1000;\nconst tax = 0.1;\n// 問1: taxAmount\n\n// 問2: total を log\n",
    solution: "const price = 1000;\nconst tax = 0.1;\nconst taxAmount = price * tax;\nconst total = price + taxAmount;\nconsole.log(total);\n",
    explanation: "<p><strong>解説</strong></p><p>計算結果も変数に入れられます。</p>",
    tests: [
      {
        description: "問1: taxAmount",
        run: function(code) {
          var fn = new Function(code + "; return taxAmount === 100;"); return fn() === true;
        }
      },
      {
        description: "問2: total",
        run: function(code) {
          var fn = new Function(code + "; return total === 1100;"); return fn() === true;
        }
      }
    ],
    hints: ["const taxAmount = price * tax;", "const total = price + taxAmount;"]
  },
  {
    id: 20,
    title: "【変数③】文字列の組み立て",
    description: "テンプレートと連結",
    content: "<pre>const name = \"Hanako\";\nconst msg = \"Hello, \" + name;\nconst msg2 = `Hello, ${name}`;</pre>\n<div class=\"challenge-box\"><strong>問1</strong> first=\"Ada\", last=\"Lovelace\" から fullName を作る（空白区切り）<br>\n<strong>問2</strong> label = fullName + \" is a programmer\" を返す関数 makeLabel()</div>",
    starterCode: "const first = \"Ada\";\nconst last = \"Lovelace\";\n// 問1: fullName\n\nfunction makeLabel() {\n  // 問2\n}\n\nconsole.log(fullName);\nconsole.log(makeLabel());\n",
    solution: "const first = \"Ada\";\nconst last = \"Lovelace\";\nconst fullName = first + \" \" + last;\nfunction makeLabel() {\n  return fullName + \" is a programmer\";\n}\nconsole.log(fullName);\nconsole.log(makeLabel());\n",
    explanation: "<p><strong>解説</strong></p><p>文字列は + でつなげます。</p>",
    tests: [
      {
        description: "問1: fullName",
        run: function(code) {
          var fn = new Function(code + "; return fullName === \"Ada Lovelace\";"); return fn() === true;
        }
      },
      {
        description: "問2: makeLabel",
        run: function(code) {
          var fn = new Function(code + "; return makeLabel() === \"Ada Lovelace is a programmer\";"); return fn() === true;
        }
      }
    ],
    hints: ["fullName = first + \" \" + last;", "return fullName + \" is a programmer\";"]
  },
  {
    id: 21,
    title: "【配列①】作る・読む",
    description: "インデックスは 0 から",
    content: "<pre>const fruits = [\"Apple\", \"Banana\", \"Cherry\"];\nfruits[0];      // \"Apple\"\nfruits.length;  // 3</pre>\n<div class=\"challenge-box\"><strong>問1</strong> getFirst(arr)<br>\n<strong>問2</strong> getLast(arr)</div>",
    starterCode: "function getFirst(arr) {\n}\n\nfunction getLast(arr) {\n}\n\nconsole.log(getFirst([\"a\", \"b\", \"c\"]));\nconsole.log(getLast([\"a\", \"b\", \"c\"]));\n",
    solution: "function getFirst(arr) {\n  return arr[0];\n}\nfunction getLast(arr) {\n  return arr[arr.length - 1];\n}\n",
    explanation: "<p><strong>解説</strong></p><p>最後の要素は length - 1 番目です。</p>",
    tests: [
      {
        description: "問1",
        run: function(code) {
          var fn = new Function(code + "; return getFirst([\"a\",\"b\"]) === \"a\";"); return fn() === true;
        }
      },
      {
        description: "問2",
        run: function(code) {
          var fn = new Function(code + "; return getLast([\"a\",\"b\",\"c\"]) === \"c\";"); return fn() === true;
        }
      }
    ],
    hints: ["return arr[0];", "return arr[arr.length - 1];"]
  },
  {
    id: 22,
    title: "【配列②】追加・結合（不変）",
    description: "元を変えずに新しい配列",
    content: "<pre>const a = [1, 2];\nconst b = [...a, 3];     // [1,2,3]\nconst c = [0, ...a];     // [0,1,2]\nconst d = a.concat([3]); // [1,2,3]</pre>\n<div class=\"challenge-box\"><strong>問1</strong> append(arr, v) 末尾追加（新配列）<br>\n<strong>問2</strong> prepend(arr, v) 先頭追加（新配列）</div>",
    starterCode: "function append(arr, v) {\n}\n\nfunction prepend(arr, v) {\n}\n\nconsole.log(append([1, 2], 3));\nconsole.log(prepend([2, 3], 1));\n",
    solution: "function append(arr, v) {\n  return [...arr, v];\n}\nfunction prepend(arr, v) {\n  return [v, ...arr];\n}\n",
    explanation: "<p><strong>解説</strong></p><p>スプレッド ... でコピーしてから足します。</p>",
    tests: [
      {
        description: "問1",
        run: function(code) {
          var fn = new Function(code + "; const a=[1]; const r=append(a,2); return JSON.stringify(r)===\"[1,2]\" && a.length===1;"); return fn() === true;
        }
      },
      {
        description: "問2",
        run: function(code) {
          var fn = new Function(code + "; return JSON.stringify(prepend([2,3],1))===\"[1,2,3]\";"); return fn() === true;
        }
      }
    ],
    hints: ["return [...arr, v];", "return [v, ...arr];"]
  },
  {
    id: 23,
    title: "【配列③】検索と切り出し",
    description: "includes / indexOf / slice",
    content: "<pre>const nums = [10, 20, 30, 40];\nnums.includes(20);  // true\nnums.indexOf(30);   // 2\nnums.slice(1, 3);   // [20, 30] 元は変わらない</pre>\n<div class=\"challenge-box\"><strong>問1</strong> has(arr, value) … includes 相当<br>\n<strong>問2</strong> take2(arr) … 先頭2つ（slice）</div>",
    starterCode: "function has(arr, value) {\n}\n\nfunction take2(arr) {\n}\n\nconsole.log(has([10, 20, 30], 20));\nconsole.log(take2([10, 20, 30, 40]));\n",
    solution: "function has(arr, value) {\n  return arr.includes(value);\n}\nfunction take2(arr) {\n  return arr.slice(0, 2);\n}\n",
    explanation: "<p><strong>解説</strong></p><p>slice は元の配列を変更しません。</p>",
    tests: [
      {
        description: "問1",
        run: function(code) {
          var fn = new Function(code + "; return has([10,20],20)===true && has([10,20],99)===false;"); return fn() === true;
        }
      },
      {
        description: "問2",
        run: function(code) {
          var fn = new Function(code + "; return JSON.stringify(take2([10,20,30,40]))===\"[10,20]\";"); return fn() === true;
        }
      }
    ],
    hints: ["return arr.includes(value);", "return arr.slice(0, 2);"]
  }
];
