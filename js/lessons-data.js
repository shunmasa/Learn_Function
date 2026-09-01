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
    title: "【レクチャー】変数（Variables）",
    description: "let と const — var は使わない",
    content: "<p><strong>変数</strong>は、データを入れておく「箱」に名前を付けたものです。あとからその名前で値を使えます（W3Schools: containers for storing data）。</p>\n<h3>現代の書き方（これが基本）</h3>\n<pre>const price = 100;  // あとから変えられない（基本はこれ）\nlet count = 0;      // あとから変えられる\ncount = 1;          // OK</pre>\n<p><strong>迷ったら const</strong>。本当に値が変わるときだけ let にします。</p>\n<h3>推奨ルール（W3Schools など）</h3>\n<ol>\n<li>変数は使う前に必ず宣言する</li>\n<li>変えない値は <code>const</code></li>\n<li>変える値だけ <code>let</code></li>\n<li><code>var</code> は新しいコードでは使わない</li>\n</ol>\n<h3>var とは何か</h3>\n<p><code>var</code> は 2015年（ES6）より前の古い宣言方法です。今でも動きますが、W3Schools でも <strong>Not Recommended（非推奨）</strong> と書かれています。</p>\n<div class=\"bad-example\">\n<strong>なぜ var を使わないか — スコープ（見える範囲）が広すぎる</strong>\n<pre>if (true) {\n  var x = 10;\n}\nconsole.log(x); // 10 と表示される（ブロックの外なのに見える）</pre>\n<p><code>if (true) { ... }</code> の中で作ったのに、外の <code>console.log(x)</code> から見えてしまいます。</p>\n<p>多くの人は「{ } の中だけ見えるはず」と考えます。ところが <code>var</code> は <strong>ブロック（if や for の { }）を無視</strong>し、<strong>関数全体（またはスクリプト全体）</strong>で共有されます。これを「関数スコープ」と呼びます。</p>\n<p>たとえば for ループで <code>var i</code> を使うと、ループの外でも <code>i</code> が残ることがあり、「ループ変数が外に漏れる」バグの典型です。</p>\n</div>\n<div class=\"good-example\">\n<strong>let / const なら（ブロックスコープ）</strong>\n<pre>if (true) {\n  let y = 10;\n  const z = 20;\n}\n// console.log(y);  // ReferenceError（外からは見えない）\n// console.log(z);  // 同じくエラー</pre>\n<p><code>let</code> と <code>const</code> は <strong>書いた { } の中だけ</strong>有効です。意図しない場所から使われる事故が減ります。</p>\n</div>\n<h3>ほかにも var がややこしい点</h3>\n<ul>\n<li><strong>同じ名前で何度でも宣言できる</strong> … ミスに気づきにくい</li>\n<li><strong>巻き上げ（hoisting）</strong> … 宣言より上の行で触ると <code>undefined</code> になり、原因が分かりにくい</li>\n<li><strong>let / const</strong> は同じスコープで二重宣言するとエラーになり、間違いを早く見つけられる</li>\n</ul>\n<p><strong>まとめ：新しいコードでは let と const だけ使う。var はもう使わない。</strong>古い教材やコードに var が出てきたら「昔の書き方」と理解すれば十分です。</p>\n<div class=\"challenge-box\"><strong>問1</strong> const appName = \"LearnFP\" を宣言して log<br>\n<strong>問2</strong> let n = 1 のあと n = 2 にして log</div>",
    starterCode: "// 問1\n\n// 問2\n",
    solution: "const appName = \"LearnFP\";\nconsole.log(appName);\nlet n = 1;\nn = 2;\nconsole.log(n);\n",
    explanation: "<p><strong>解説</strong></p><p>const は再代入できません。let はできます。var は新規コードで使いません。</p>",
    tests: [
      {
        description: "問1: appName",
        run: function(code) {var fn = new Function(code + "; return typeof appName !== \"undefined\" && appName === \"LearnFP\";"); return fn() === true;
        }
      },
      {
        description: "問2: n === 2",
        run: function(code) {var fn = new Function(code + "; return n === 2;"); return fn() === true;
        }
      }
    ],
    hints: ["const appName = \"LearnFP\";", "let n = 1; n = 2;"]
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
