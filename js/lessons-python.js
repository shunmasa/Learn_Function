const LESSONS_PY = [
  {
    id: 1,
    title: "【Python】プログラミングとは",
    description: "プログラムと Python の紹介",
    content: "<p><strong>プログラミング</strong>とは、コンピュータへの手順を文章（コード）で書くことです。</p>\n<p><strong>Python</strong> は読みやすく、初心者にも人気の言語です。データ分析・Web・自動化など幅広く使われます。</p>\n<p>このサイトでは右のエディターに Python を書き、「実行」すると下の Console に結果が出ます。</p>\n<div class=\"challenge-box\"><strong>問1</strong> コメントで「はじめてのPython」と書く（# を使う）<br><strong>問2</strong> print(\"Hello\") を実行する</div>",
    starterCode: "# 問1\n\n# 問2\n",
    solution: "# はじめてのPython\nprint(\"Hello\")\n",
    explanation: "<p><strong>解説</strong></p><p>Python のコメントは # です。表示には print を使います。</p>",
    tests: [
      {
        description: "問1: # コメント",
        run: async function(code) {return /#/.test(code);
        }
      },
      {
        description: "問2: Hello を print",
        run: async function(code) {
          var r = await runPython(code);
          if (r.error) return false;
          return r.stdout.indexOf("Hello") !== -1;

        }
      }
    ],
    hints: ["# はじめてのPython", "print(\"Hello\")"]
  },
  {
    id: 2,
    title: "【Python】print（出力）",
    description: "結果を表示する",
    content: "<p>結果を確認するには <code>print()</code> を使います。</p>\n<pre>print(\"Hello\")\nprint(3 + 4)\nprint(\"合計\", 10)</pre>\n<div class=\"bad-example\"><strong>よくある間違い</strong>\n<pre>print Hello   # 括弧が必要（Python 3）</pre></div>\n<div class=\"challenge-box\"><strong>問1</strong> print(\"Py\")<br><strong>問2</strong> print(2 + 3)</div>",
    starterCode: "# 問1\n\n# 問2\n",
    solution: "print(\"Py\")\nprint(2 + 3)\n",
    explanation: "<p><strong>解説</strong></p><p>文字列は引用符、計算はそのまま渡せます。</p>",
    tests: [
      {
        description: "問1: Py",
        run: async function(code) {
          var r = await runPython(code);
          return !r.error && r.stdout.indexOf("Py") !== -1;

        }
      },
      {
        description: "問2: 5",
        run: async function(code) {
          var r = await runPython(code);
          return !r.error && /\b5\b/.test(r.stdout);

        }
      }
    ],
    hints: ["print(\"Py\")", "print(2 + 3)"]
  },
  {
    id: 3,
    title: "【Python】変数",
    description: "名前を付けて値を覚える",
    content: "<p>変数は値に名前を付ける仕組みです。Python では型を書かずに代入できます。</p>\n<pre>name = \"Taro\"\ncount = 0\ncount = 1  # 再代入できる</pre>\n<p>定数用の専用キーワードはありませんが、変えない値は大文字で書く慣習があります（例: <code>MAX = 100</code>）。</p>\n<div class=\"challenge-box\"><strong>問1</strong> app = \"LearnPy\" を作って print<br><strong>問2</strong> n = 1 のあと n = 2 にして print</div>",
    starterCode: "# 問1\n\n# 問2\n",
    solution: "app = \"LearnPy\"\nprint(app)\nn = 1\nn = 2\nprint(n)\n",
    explanation: "<p><strong>解説</strong></p><p>Python は let/const がなく、代入だけで変数になります。</p>",
    tests: [
      {
        description: "問1: app",
        run: async function(code) {
          var r = await runPython(code + "\nprint('__APP__', app)");
          return !r.error && r.stdout.indexOf("LearnPy") !== -1;

        }
      },
      {
        description: "問2: n==2",
        run: async function(code) {
          var r = await runPython(code + "\nprint('__N__', n)");
          return !r.error && r.stdout.indexOf("__N__ 2") !== -1;

        }
      }
    ],
    hints: ["app = \"LearnPy\"", "n = 1; n = 2"]
  },
  {
    id: 4,
    title: "【Python】型と type()",
    description: "str / int / float / bool",
    content: "<pre>type(\"hi\")   # str\ntype(10)     # int\ntype(3.14)   # float\ntype(True)   # bool</pre>\n<p>Python では整数 <code>int</code> と小数 <code>float</code> が分かれています。</p>\n<div class=\"challenge-box\"><strong>問1</strong> msg に文字列、num に整数<br><strong>問2</strong> type(msg) と type(num) を print</div>",
    starterCode: "msg = \"hi\"\nnum = 10\n# type を print\n",
    solution: "msg = \"hi\"\nnum = 10\nprint(type(msg))\nprint(type(num))\n",
    explanation: "<p><strong>解説</strong></p><p>type() で型を確認できます。</p>",
    tests: [
      {
        description: "問1: 代入",
        run: async function(code) {
          var r = await runPython(code + "\nprint(type(msg).__name__, type(num).__name__)");
          return !r.error && r.stdout.indexOf("str") !== -1 && r.stdout.indexOf("int") !== -1;

        }
      },
      {
        description: "問2: type 出力",
        run: async function(code) {
          var r = await runPython(code);
          return !r.error && r.stdout.indexOf("str") !== -1;

        }
      }
    ],
    hints: ["msg = \"hi\"", "print(type(msg))"]
  },
  {
    id: 5,
    title: "【Python】数値と計算",
    description: "四則演算",
    content: "<pre>10 + 3\n10 // 3   # 整数の割り算 → 3\n10 % 3    # 余り → 1\n10 ** 2   # べき乗 → 100</pre>\n<div class=\"challenge-box\"><strong>問1</strong> add(a,b) で合計を return<br><strong>問2</strong> is_even(n) で偶数なら True</div>",
    starterCode: "def add(a, b):\n    # 合計\n    pass\n\ndef is_even(n):\n    # 偶数?\n    pass\n\nprint(add(10, 5))\nprint(is_even(4))\n",
    solution: "def add(a, b):\n    return a + b\n\ndef is_even(n):\n    return n % 2 == 0\n\nprint(add(10, 5))\nprint(is_even(4))\n",
    explanation: "<p><strong>解説</strong></p><p>def で関数を定義し、return で返します。</p>",
    tests: [
      {
        description: "問1: add",
        run: async function(code) {
          var r = await runPython(code + "\nprint('T1', add(10,5))");
          return !r.error && r.stdout.indexOf("T1 15") !== -1;

        }
      },
      {
        description: "問2: is_even",
        run: async function(code) {
          var r = await runPython(code + "\nprint('T2', is_even(4), is_even(3))");
          return !r.error && r.stdout.indexOf("T2 True False") !== -1;

        }
      }
    ],
    hints: ["return a + b", "return n % 2 == 0"]
  },
  {
    id: 6,
    title: "【Python】文字列",
    description: "連結と len",
    content: "<pre>name = \"Taro\"\n\"Hi, \" + name\nlen(name)  # 4</pre>\n<div class=\"challenge-box\"><strong>問1</strong> greet(name) → \"Hi, name\"<br><strong>問2</strong> length(s) → 文字数</div>",
    starterCode: "def greet(name):\n    pass\n\ndef length(s):\n    pass\n\nprint(greet(\"Taro\"))\nprint(length(\"Hi\"))\n",
    solution: "def greet(name):\n    return \"Hi, \" + name\n\ndef length(s):\n    return len(s)\n",
    explanation: "<p><strong>解説</strong></p><p>len() が組み込み関数です。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          var r = await runPython(code + "\nprint('G', greet('Taro'))");
          return !r.error && r.stdout.indexOf("G Hi, Taro") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          var r = await runPython(code + "\nprint('L', length('Hi'))");
          return !r.error && r.stdout.indexOf("L 2") !== -1;

        }
      }
    ],
    hints: ["return \"Hi, \" + name", "return len(s)"]
  },
  {
    id: 7,
    title: "【Python】真偽値と比較",
    description: "True / False",
    content: "<pre>5 > 3      # True\n5 == 5     # True\nTrue and False  # False</pre>\n<div class=\"challenge-box\"><strong>問1</strong> is_adult(age) 18以上<br><strong>問2</strong> both(a,b) 両方 True なら True</div>",
    starterCode: "def is_adult(age):\n    pass\n\ndef both(a, b):\n    pass\n\nprint(is_adult(20))\nprint(both(True, False))\n",
    solution: "def is_adult(age):\n    return age >= 18\n\ndef both(a, b):\n    return a and b\n",
    explanation: "<p><strong>解説</strong></p><p>Python の論理演算は and / or / not です。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          var r = await runPython(code + "\nprint(is_adult(20), is_adult(15))");
          return !r.error && r.stdout.indexOf("True") !== -1 && r.stdout.indexOf("False") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          var r = await runPython(code + "\nprint('B', both(True, True), both(True, False))");
          return !r.error && r.stdout.indexOf("B True False") !== -1;

        }
      }
    ],
    hints: ["return age >= 18", "return a and b"]
  },
  {
    id: 8,
    title: "【Python】関数",
    description: "def と return",
    content: "<pre>def add(a, b):\n    return a + b\n\nadd(2, 3)  # 5</pre>\n<div class=\"bad-example\"><strong>注意</strong>\n<pre>def add(a, b):\n    a + b  # return が無いと None</pre></div>\n<div class=\"challenge-box\"><strong>問1</strong> area(w,h)<br><strong>問2</strong> triple(n)</div>",
    starterCode: "def area(w, h):\n    pass\n\ndef triple(n):\n    pass\n\nprint(area(3, 4))\nprint(triple(5))\n",
    solution: "def area(w, h):\n    return w * h\n\ndef triple(n):\n    return n * 3\n",
    explanation: "<p><strong>解説</strong></p><p>インデント（字下げ）が Python のブロックです。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          var r = await runPython(code + "\nprint('A', area(3,4))");
          return !r.error && r.stdout.indexOf("A 12") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          var r = await runPython(code + "\nprint('T', triple(5))");
          return !r.error && r.stdout.indexOf("T 15") !== -1;

        }
      }
    ],
    hints: ["return w * h", "return n * 3"]
  },
  {
    id: 9,
    title: "【Python】リスト",
    description: "配列のようなもの",
    content: "<pre>fruits = [\"Apple\", \"Banana\"]\nfruits[0]       # Apple\nlen(fruits)     # 2</pre>\n<div class=\"challenge-box\"><strong>問1</strong> first(lst)<br><strong>問2</strong> size(lst)</div>",
    starterCode: "def first(lst):\n    pass\n\ndef size(lst):\n    pass\n\nprint(first([10, 20, 30]))\nprint(size([10, 20]))\n",
    solution: "def first(lst):\n    return lst[0]\n\ndef size(lst):\n    return len(lst)\n",
    explanation: "<p><strong>解説</strong></p><p>インデックスは 0 から。len で長さです。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          var r = await runPython(code + "\nprint('F', first([10,20,30]))");
          return !r.error && r.stdout.indexOf("F 10") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          var r = await runPython(code + "\nprint('S', size([10,20,30]))");
          return !r.error && r.stdout.indexOf("S 3") !== -1;

        }
      }
    ],
    hints: ["return lst[0]", "return len(lst)"]
  },
  {
    id: 10,
    title: "【Python】リスト内包と filter 的処理",
    description: "内包表記の基本",
    content: "<pre>nums = [1, 2, 3, 4]\n[n * 2 for n in nums]           # [2,4,6,8]\n[n for n in nums if n % 2 == 0] # [2,4]</pre>\n<div class=\"challenge-box\"><strong>問1</strong> double_all(nums)<br><strong>問2</strong> evens(nums)</div>",
    starterCode: "def double_all(nums):\n    pass\n\ndef evens(nums):\n    pass\n\nprint(double_all([1,2,3]))\nprint(evens([1,2,3,4]))\n",
    solution: "def double_all(nums):\n    return [n * 2 for n in nums]\n\ndef evens(nums):\n    return [n for n in nums if n % 2 == 0]\n",
    explanation: "<p><strong>解説</strong></p><p>リスト内包表記は map/filter に相当する短い書き方です。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          var r = await runPython(code + "\nprint(double_all([1,2,3]))");
          return !r.error && r.stdout.replace(/ /g,'').indexOf("[2,4,6]") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          var r = await runPython(code + "\nprint(evens([1,2,3,4]))");
          return !r.error && r.stdout.replace(/ /g,'').indexOf("[2,4]") !== -1;

        }
      }
    ],
    hints: ["[n*2 for n in nums]", "[n for n in nums if n%2==0]"]
  },
  {
    id: 11,
    title: "【Python】辞書",
    description: "キーと値",
    content: "<pre>user = {\"name\": \"Taro\", \"age\": 20}\nuser[\"name\"]  # Taro</pre>\n<div class=\"challenge-box\"><strong>問1</strong> get_name(d)<br><strong>問2</strong> get_age(d)</div>",
    starterCode: "def get_name(d):\n    pass\n\ndef get_age(d):\n    pass\n\nprint(get_name({\"name\":\"Taro\",\"age\":20}))\n",
    solution: "def get_name(d):\n    return d[\"name\"]\n\ndef get_age(d):\n    return d[\"age\"]\n",
    explanation: "<p><strong>解説</strong></p><p>辞書は [] でキーアクセスします。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          var r = await runPython(code + "\nprint(get_name({'name':'Taro','age':20}))");
          return !r.error && r.stdout.indexOf("Taro") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          var r = await runPython(code + "\nprint('A', get_age({'name':'Taro','age':20}))");
          return !r.error && r.stdout.indexOf("A 20") !== -1;

        }
      }
    ],
    hints: ["return d[\"name\"]", "return d[\"age\"]"]
  },
  {
    id: 12,
    title: "練習：合計と組み合わせ",
    description: "sum と内包",
    content: "<div class=\"challenge-box\"><strong>問1</strong> total(nums) 合計<br><strong>問2</strong> sum_even_doubled 偶数を2倍して合計</div>",
    starterCode: "def total(nums):\n    pass\n\ndef sum_even_doubled(nums):\n    pass\n\nprint(total([1,2,3,4]))\nprint(sum_even_doubled([1,2,3,4]))\n",
    solution: "def total(nums):\n    return sum(nums)\n\ndef sum_even_doubled(nums):\n    return sum(n * 2 for n in nums if n % 2 == 0)\n",
    explanation: "<p><strong>解説</strong></p><p>sum とジェネレータ式が便利です。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          var r = await runPython(code + "\nprint('S', total([1,2,3,4]))");
          return !r.error && r.stdout.indexOf("S 10") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          var r = await runPython(code + "\nprint('E', sum_even_doubled([1,2,3,4]))");
          return !r.error && r.stdout.indexOf("E 12") !== -1;

        }
      }
    ],
    hints: ["return sum(nums)", "sum(n*2 for n in nums if n%2==0)"]
  },
  {
    id: 13,
    title: "【Python】if / elif / else",
    description: "条件分岐",
    content: "<p>条件で処理を分けるには <code>if</code> を使います。</p>\n<pre>if age >= 18:\n    print(\"成人\")\nelif age >= 13:\n    print(\"ティーン\")\nelse:\n    print(\"子供\")</pre>\n<p>Python は <code>{ }</code> の代わりに<strong>インデント（字下げ）</strong>でブロックを表します。</p>\n<div class=\"challenge-box\"><strong>問1</strong> grade(score) … 60以上 \"pass\"、未満 \"fail\"<br>\n<strong>問2</strong> sign(n) … 正 \"plus\"、負 \"minus\"、0 \"zero\"</div>",
    starterCode: "def grade(score):\n    # pass / fail\n    pass\n\ndef sign(n):\n    # plus / minus / zero\n    pass\n\nprint(grade(80))\nprint(grade(40))\nprint(sign(5))\nprint(sign(-2))\nprint(sign(0))\n",
    solution: "def grade(score):\n    if score >= 60:\n        return \"pass\"\n    else:\n        return \"fail\"\n\ndef sign(n):\n    if n > 0:\n        return \"plus\"\n    elif n < 0:\n        return \"minus\"\n    else:\n        return \"zero\"\n",
    explanation: "<p><strong>解説</strong></p><p>elif は else if の意味です。インデントを揃えてください。</p>",
    tests: [
      {
        description: "問1: grade",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('G', grade(80), grade(40))");
          return !r.error && r.stdout.indexOf("G pass fail") !== -1;

        }
      },
      {
        description: "問2: sign",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('S', sign(5), sign(-2), sign(0))");
          return !r.error && r.stdout.indexOf("S plus minus zero") !== -1;

        }
      }
    ],
    hints: ["if score >= 60: return \"pass\"", "if / elif / else"]
  },
  {
    id: 14,
    title: "【Python】for ループ",
    description: "range とリストを回す",
    content: "<pre>for i in range(3):\n    print(i)  # 0, 1, 2\n\nfor x in [\"a\", \"b\", \"c\"]:\n    print(x)</pre>\n<p><code>range(n)</code> は 0 から n-1 までの整数です。<code>range(1, n+1)</code> で 1…n になります。</p>\n<div class=\"challenge-box\"><strong>問1</strong> sum_to(n) … 1 から n の合計<br>\n<strong>問2</strong> count_down(n) … [n, …, 1]</div>",
    starterCode: "def sum_to(n):\n    # 1..n の合計\n    pass\n\ndef count_down(n):\n    # [n, n-1, ..., 1]\n    pass\n\nprint(sum_to(5))\nprint(count_down(3))\n",
    solution: "def sum_to(n):\n    s = 0\n    for i in range(1, n + 1):\n        s += i\n    return s\n\ndef count_down(n):\n    arr = []\n    for i in range(n, 0, -1):\n        arr.append(i)\n    return arr\n",
    explanation: "<p><strong>解説</strong></p><p>range(start, stop, step) の stop は含まれません。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('S', sum_to(5))");
          return !r.error && r.stdout.indexOf("S 15") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint(count_down(3))");
          return !r.error && r.stdout.replace(/ /g,'').indexOf("[3,2,1]") !== -1;

        }
      }
    ],
    hints: ["for i in range(1, n+1):", "range(n, 0, -1)"]
  },
  {
    id: 15,
    title: "【Python】while ループ",
    description: "条件が真の間くり返す",
    content: "<pre>n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1</pre>\n<div class=\"bad-example\"><strong>注意</strong>\n<pre>while True:\n    pass  # 終了条件を忘れると無限ループ</pre></div>\n<div class=\"challenge-box\"><strong>問1</strong> factorial(n) … while で階乗<br>\n<strong>問2</strong> digits(n) … 桁数</div>",
    starterCode: "def factorial(n):\n    # while で階乗\n    pass\n\ndef digits(n):\n    # 桁数\n    pass\n\nprint(factorial(5))\nprint(digits(123))\n",
    solution: "def factorial(n):\n    result = 1\n    i = n\n    while i > 1:\n        result *= i\n        i -= 1\n    return result\n\ndef digits(n):\n    if n == 0:\n        return 1\n    count = 0\n    x = n\n    while x > 0:\n        count += 1\n        x = x // 10\n    return count\n",
    explanation: "<p><strong>解説</strong></p><p>while の中で条件が False になるよう更新します。// は整数除算です。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('F', factorial(5))");
          return !r.error && r.stdout.indexOf("F 120") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('D', digits(123), digits(7))");
          return !r.error && r.stdout.indexOf("D 3 1") !== -1;

        }
      }
    ],
    hints: ["while i > 1:", "while x > 0: x = x // 10"]
  },
  {
    id: 16,
    title: "【Python】for each（リストを1つずつ）",
    description: "for x in list",
    content: "<p>Python に forEach はありませんが、<code>for x in list</code> が同じ役割です。</p>\n<pre>nums = [10, 20, 30]\nfor n in nums:\n    print(n)</pre>\n<div class=\"challenge-box\"><strong>問1</strong> sum_each(lst) … for で合計<br>\n<strong>問2</strong> join_dash(lst) … \"a-b-c\" に連結</div>",
    starterCode: "def sum_each(lst):\n    # for で合計\n    pass\n\ndef join_dash(lst):\n    # a-b-c\n    pass\n\nprint(sum_each([1, 2, 3, 4]))\nprint(join_dash([\"a\", \"b\", \"c\"]))\n",
    solution: "def sum_each(lst):\n    s = 0\n    for n in lst:\n        s += n\n    return s\n\ndef join_dash(lst):\n    result = \"\"\n    first = True\n    for item in lst:\n        if not first:\n            result += \"-\"\n        result += str(item)\n        first = False\n    return result\n",
    explanation: "<p><strong>解説</strong></p><p>for 変数 in リスト: が for-each の基本形です。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('S', sum_each([1,2,3,4]))");
          return !r.error && r.stdout.indexOf("S 10") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('J', join_dash(['a','b','c']))");
          return !r.error && r.stdout.indexOf("J a-b-c") !== -1;

        }
      }
    ],
    hints: ["for n in lst:", "for item in lst:"]
  },
  {
    id: 17,
    title: "【変数①】代入の基本",
    description: "名前を付けて覚える",
    content: "<p>Python では代入するだけで変数ができます。</p>\n<pre>name = \"Taro\"\ncount = 0\ncount = 1</pre>\n<div class=\"challenge-box\"><strong>問1</strong> city = \"Osaka\" を print<br>\n<strong>問2</strong> x = 10 のあと x = 20 にして print</div>",
    starterCode: "# 問1\n\n# 問2\n",
    solution: "city = \"Osaka\"\nprint(city)\nx = 10\nx = 20\nprint(x)\n",
    explanation: "<p><strong>解説</strong></p><p>再代入はいつでもできます（const はありません）。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('C', city)");
          return !r.error && r.stdout.indexOf("Osaka") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('X', x)");
          return !r.error && r.stdout.indexOf("X 20") !== -1;

        }
      }
    ],
    hints: ["city = \"Osaka\"", "x = 10; x = 20"]
  },
  {
    id: 18,
    title: "【変数②】計算して代入",
    description: "変数同士の計算",
    content: "<pre>a = 10\nb = 3\ns = a + b\np = a * b</pre>\n<div class=\"challenge-box\"><strong>問1</strong> price=1000, tax=0.1 から tax_amount = price * tax<br>\n<strong>問2</strong> total = price + tax_amount を print</div>",
    starterCode: "price = 1000\ntax = 0.1\n# 問1 tax_amount\n\n# 問2 total\n",
    solution: "price = 1000\ntax = 0.1\ntax_amount = price * tax\ntotal = price + tax_amount\nprint(total)\n",
    explanation: "<p><strong>解説</strong></p><p>計算結果を別の変数に入れられます。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('T', tax_amount)");
          return !r.error && r.stdout.indexOf("T 100") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('TOT', total)");
          return !r.error && r.stdout.indexOf("TOT 1100") !== -1;

        }
      }
    ],
    hints: ["tax_amount = price * tax", "total = price + tax_amount"]
  },
  {
    id: 19,
    title: "【変数③】文字列の組み立て",
    description: "連結と f文字列",
    content: "<pre>name = \"Hanako\"\nmsg = \"Hello, \" + name\nmsg2 = f\"Hello, {name}\"</pre>\n<div class=\"challenge-box\"><strong>問1</strong> first, last から full_name（空白区切り）<br>\n<strong>問2</strong> make_label() で full_name + \" is a programmer\"</div>",
    starterCode: "first = \"Ada\"\nlast = \"Lovelace\"\n# 問1 full_name\n\ndef make_label():\n    # 問2\n    pass\n\nprint(full_name)\nprint(make_label())\n",
    solution: "first = \"Ada\"\nlast = \"Lovelace\"\nfull_name = first + \" \" + last\n\ndef make_label():\n    return full_name + \" is a programmer\"\n\nprint(full_name)\nprint(make_label())\n",
    explanation: "<p><strong>解説</strong></p><p>文字列は + でつなぎます。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('F', full_name)");
          return !r.error && r.stdout.indexOf("Ada Lovelace") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('L', make_label())");
          return !r.error && r.stdout.indexOf("is a programmer") !== -1;

        }
      }
    ],
    hints: ["full_name = first + \" \" + last", "return full_name + ..."]
  },
  {
    id: 20,
    title: "【リスト①】作る・読む",
    description: "インデックスは 0 から",
    content: "<pre>fruits = [\"Apple\", \"Banana\", \"Cherry\"]\nfruits[0]\nlen(fruits)\nfruits[-1]  # 最後</pre>\n<div class=\"challenge-box\"><strong>問1</strong> get_first(lst)<br>\n<strong>問2</strong> get_last(lst)</div>",
    starterCode: "def get_first(lst):\n    pass\n\ndef get_last(lst):\n    pass\n\nprint(get_first([\"a\", \"b\", \"c\"]))\nprint(get_last([\"a\", \"b\", \"c\"]))\n",
    solution: "def get_first(lst):\n    return lst[0]\n\ndef get_last(lst):\n    return lst[-1]\n",
    explanation: "<p><strong>解説</strong></p><p>Python では [-1] で最後の要素が取れます。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('F', get_first(['a','b']))");
          return !r.error && r.stdout.indexOf("F a") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint('L', get_last(['a','b','c']))");
          return !r.error && r.stdout.indexOf("L c") !== -1;

        }
      }
    ],
    hints: ["return lst[0]", "return lst[-1]"]
  },
  {
    id: 21,
    title: "【リスト②】追加・結合",
    description: "append と + / 新リスト",
    content: "<pre>a = [1, 2]\nb = a + [3]      # 新しいリスト [1,2,3]\nc = [0] + a     # [0,1,2]</pre>\n<p><code>a.append(3)</code> は元のリストを変更します。練習では<strong>新しいリストを返す</strong>書き方を使います。</p>\n<div class=\"challenge-box\"><strong>問1</strong> append_new(lst, v) 末尾追加した新リスト<br>\n<strong>問2</strong> prepend_new(lst, v) 先頭追加した新リスト</div>",
    starterCode: "def append_new(lst, v):\n    pass\n\ndef prepend_new(lst, v):\n    pass\n\nprint(append_new([1, 2], 3))\nprint(prepend_new([2, 3], 1))\n",
    solution: "def append_new(lst, v):\n    return lst + [v]\n\ndef prepend_new(lst, v):\n    return [v] + lst\n",
    explanation: "<p><strong>解説</strong></p><p>リスト + リスト で新しいリストができます。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          
          var r = await runPython(code + "\na=[1]\nr=append_new(a,2)\nprint(r, len(a))");
          return !r.error && r.stdout.replace(/ /g,'').indexOf("[1,2]") !== -1 && r.stdout.indexOf("1") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint(prepend_new([2,3],1))");
          return !r.error && r.stdout.replace(/ /g,'').indexOf("[1,2,3]") !== -1;

        }
      }
    ],
    hints: ["return lst + [v]", "return [v] + lst"]
  },
  {
    id: 22,
    title: "【リスト③】検索とスライス",
    description: "in / index / 切片",
    content: "<pre>nums = [10, 20, 30, 40]\n20 in nums       # True\nnums.index(30)   # 2\nnums[1:3]        # [20, 30]</pre>\n<div class=\"challenge-box\"><strong>問1</strong> has(lst, value) … in で判定<br>\n<strong>問2</strong> take2(lst) … 先頭2つ</div>",
    starterCode: "def has(lst, value):\n    pass\n\ndef take2(lst):\n    pass\n\nprint(has([10, 20, 30], 20))\nprint(take2([10, 20, 30, 40]))\n",
    solution: "def has(lst, value):\n    return value in lst\n\ndef take2(lst):\n    return lst[0:2]\n",
    explanation: "<p><strong>解説</strong></p><p>スライス lst[a:b] は a 以上 b 未満です。</p>",
    tests: [
      {
        description: "問1",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint(has([10,20],20), has([10,20],99))");
          return !r.error && r.stdout.indexOf("True") !== -1 && r.stdout.indexOf("False") !== -1;

        }
      },
      {
        description: "問2",
        run: async function(code) {
          
          var r = await runPython(code + "\nprint(take2([10,20,30,40]))");
          return !r.error && r.stdout.replace(/ /g,'').indexOf("[10,20]") !== -1;

        }
      }
    ],
    hints: ["return value in lst", "return lst[0:2]"]
  }
];
