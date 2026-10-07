(() => {
  "use strict";

  let lang = "js";
  let timer = null;
  let running = false;

  const samples = {
    html: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>HTML Playground</title>

  <style>
    body {
      font-family: sans-serif;
      padding: 32px;
      background: #eef6ff;
    }

    h1 {
      color: #2563eb;
    }

    .card {
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 22px rgba(0,0,0,.10);
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>こんにちは！</h1>
    <p>HTMLとCSSを自由に書いてみよう。</p>
  </div>
</body>
</html>
`,
    js: 'console.log("Hello");\n',
    py: 'print("Hello")\n'
  };

  const editor = document.getElementById("editor");
  const consoleEl = document.getElementById("console");
  const htmlView = document.getElementById("html-view");
  const consoleTab = document.getElementById("console-tab");
  const viewTab = document.getElementById("view-tab");
  const consolePanel = document.getElementById("console-panel");
  const viewPanel = document.getElementById("view-panel");
  const viewNote = document.getElementById("html-view-note");
  const codeLabel = document.getElementById("code-label");

  editor.value = samples.js;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function setOutputPanel(name) {
    const isView = name === "view";

    consolePanel.classList.toggle("active", !isView);
    viewPanel.classList.toggle("active", isView);
    consoleTab.classList.toggle("active", !isView);
    viewTab.classList.toggle("active", isView);
  }

  function syncOutputUI() {
    const htmlMode = lang === "html";

    viewTab.classList.toggle("hidden", !htmlMode);
    consoleTab.classList.toggle("hidden", htmlMode);
    viewNote.classList.toggle("hidden", !htmlMode);

    setOutputPanel(htmlMode ? "view" : "console");
  }

  function setLang(next) {
    lang = next;

    document.querySelectorAll(".lang-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.lang === lang);
    });

    const labels = {
      html: "HTML",
      js: "JavaScript",
      py: "Python"
    };

    codeLabel.textContent = "CODE · " + labels[lang];
    editor.value = samples[lang];

    syncOutputUI();
    updateOutput();
    editor.focus();
  }

  document.querySelectorAll(".lang-tab").forEach((button) => {
    button.addEventListener("click", () => {
      setLang(button.dataset.lang);
    });
  });

  function captureConsole(fn) {
    const logs = [];
    const original = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    };

    console.log = (...args) => {
      logs.push({ type: "log", text: args.map(String).join(" ") });
      original.log(...args);
    };

    console.error = (...args) => {
      logs.push({ type: "error", text: args.map(String).join(" ") });
      original.error(...args);
    };

    console.warn = (...args) => {
      logs.push({ type: "log", text: args.map(String).join(" ") });
      original.warn(...args);
    };

    console.info = (...args) => {
      logs.push({ type: "log", text: args.map(String).join(" ") });
      original.info(...args);
    };

    let error = null;

    try {
      fn();
    } catch (err) {
      error = err;
    } finally {
      Object.assign(console, original);
    }

    return { logs, error };
  }

  function runPython(code) {
    return new Promise((resolve) => {
      if (typeof Sk === "undefined") {
        resolve({
          stdout: "",
          error: "Python engine not loaded"
        });
        return;
      }

      let stdout = "";

      Sk.configure({
        output: (text) => {
          stdout += text;
        },
        read: (path) => {
          if (!Sk.builtinFiles || !Sk.builtinFiles.files[path]) {
            throw new Error("File not found: " + path);
          }
          return Sk.builtinFiles.files[path];
        },
        __future__: Sk.python3
      });

      Sk.misceval
        .asyncToPromise(() => {
          return Sk.importMainWithBody("<stdin>", false, code, true);
        })
        .then(() => {
          resolve({ stdout, error: null });
        })
        .catch((err) => {
          resolve({ stdout, error: err.toString() });
        });
    });
  }

  function renderHtmlPreview(code) {
    const parsed = new DOMParser().parseFromString(
      String(code || ""),
      "text/html"
    );

    // Relative paths such as style.css and assets/ocean.svg
    // resolve from playground.html.
    const base = parsed.createElement("base");
    base.href = document.baseURI;
    parsed.head.prepend(base);

    // HTML/CSS preview only: remove scripts and inline JS handlers.
    parsed.querySelectorAll("script").forEach((node) => {
      node.remove();
    });

    parsed.querySelectorAll("*").forEach((element) => {
      [...element.attributes].forEach((attribute) => {
        if (/^on/i.test(attribute.name)) {
          element.removeAttribute(attribute.name);
        }
      });
    });

    const csp = parsed.createElement("meta");
    csp.httpEquiv = "Content-Security-Policy";
    csp.content = [
      "default-src 'none'",
      "script-src 'none'",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "media-src 'self' data: blob: https:"
    ].join("; ");

    parsed.head.prepend(csp);

    htmlView.srcdoc =
      "<!DOCTYPE html>\n" +
      parsed.documentElement.outerHTML;
  }

  async function updateOutput() {
    if (running) return;

    running = true;
    const code = editor.value;

    try {
      if (lang === "html") {
        renderHtmlPreview(code);
        return;
      }

      if (lang === "py") {
        const result = await runPython(code);
        let output = "";

        if (result.stdout) {
          output += result.stdout
            .split("\n")
            .filter((line) => line.length)
            .map((line) => {
              return '<div class="line">' +
                escapeHtml(line) +
                "</div>";
            })
            .join("");
        }

        if (result.error) {
          output +=
            '<div class="line error">' +
            escapeHtml(result.error) +
            "</div>";
        }

        consoleEl.innerHTML =
          output || '<div class="muted">（出力なし）</div>';

        return;
      }

      const result = captureConsole(() => {
        new Function(code)();
      });

      let output = result.logs
        .map((line) => {
          return '<div class="line' +
            (line.type === "error" ? " error" : "") +
            '">' +
            escapeHtml(line.text) +
            "</div>";
        })
        .join("");

      if (result.error) {
        output +=
          '<div class="line error">' +
          escapeHtml(result.error.message || String(result.error)) +
          "</div>";
      }

      consoleEl.innerHTML =
        output || '<div class="muted">（出力なし）</div>';

    } catch (error) {
      consoleEl.innerHTML =
        '<div class="line error">' +
        escapeHtml(error.message || String(error)) +
        "</div>";

    } finally {
      running = false;
    }
  }

  function scheduleUpdate() {
    if (timer) {
      clearTimeout(timer);
    }

    const delay =
      lang === "html"
        ? 180
        : lang === "py"
          ? 500
          : 300;

    timer = setTimeout(updateOutput, delay);
  }

  editor.addEventListener("input", scheduleUpdate);

  document.getElementById("run-btn").addEventListener("click", () => {
    updateOutput();
  });

  document.getElementById("clear-btn").addEventListener("click", () => {
    editor.value = "";

    if (lang === "html") {
      renderHtmlPreview("");
    } else {
      consoleEl.innerHTML =
        '<div class="muted">（出力なし）</div>';
    }

    editor.focus();
  });

  document.addEventListener("keydown", (event) => {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === "Enter"
    ) {
      event.preventDefault();
      updateOutput();
    }
  });

  syncOutputUI();
  updateOutput();
})();
