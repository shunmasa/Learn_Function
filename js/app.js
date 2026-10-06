// ========== STATE ==========
let currentUser = null;
let currentLessonId = null;
let currentLang = "js"; // "html" | "js" | "py"
let completedByLang = { html: new Set(), js: new Set(), py: new Set() };

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function getLessons() {
  if (currentLang === "html") return LESSONS_HTML;
  if (currentLang === "py") return LESSONS_PY;
  return LESSONS_JS;
}

function getCompleted() {
  return completedByLang[currentLang];
}

// ========== AUTH ==========
const USERS_KEY = "learnfp_users";
const SESSION_KEY = "learnfp_session";
const TOKEN_KEY = "learnfp_token";

function apiBase() {
  const base = (window.LEARN_FP_API || "").replace(/\/+$/, "");
  return base;
}

function useRemoteAuth() {
  return !!apiBase();
}

function showAuthError(form, message) {
  const id = form === "login" ? "login-error" : "register-error";
  const el = document.getElementById(id);
  if (!el) return;
  if (!message) {
    el.classList.add("hidden");
    el.textContent = "";
    return;
  }
  el.textContent = message;
  el.classList.remove("hidden");
}

async function api(path, options = {}) {
  const base = apiBase();
  const headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = "Bearer " + token;
  const res = await fetch(base + path, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch (e) { data = {}; }
  if (!res.ok) {
    const err = new Error((data && data.error) || ("HTTP " + res.status));
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function getUsersMap() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveUsersMap(map) {
  localStorage.setItem(USERS_KEY, JSON.stringify(map));
}

function applyUserProgress(user) {
  completedByLang.html = new Set(user.completed_html || []);
  completedByLang.js = new Set(user.completed_js || user.completed || []);
  completedByLang.py = new Set(user.completed_py || []);
  if (user.lang === "html" || user.lang === "js" || user.lang === "py") currentLang = user.lang;
}

function setSessionUser(user, token) {
  currentUser = {
    email: user.email,
    name: user.name,
    isAdmin: !!user.isAdmin,
    completed_html: user.completed_html || [],
    completed_js: user.completed_js || [],
    completed_py: user.completed_py || [],
    lang: user.lang || "js",
  };
  applyUserProgress(currentUser);
  if (token) localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, user.email);
  localStorage.setItem(
    "learnfp_user",
    JSON.stringify({
      email: currentUser.email,
      name: currentUser.name,
      isAdmin: currentUser.isAdmin,
      completed_html: [...completedByLang.html],
      completed_js: [...completedByLang.js],
      completed_py: [...completedByLang.py],
      lang: currentLang,
    })
  );
}

async function persistCurrentUser() {
  if (!currentUser) return;
  currentUser.completed_html = [...completedByLang.html];
  currentUser.completed_js = [...completedByLang.js];
  currentUser.completed_py = [...completedByLang.py];
  currentUser.lang = currentLang;

  if (useRemoteAuth()) {
    try {
      await api("/api/progress", {
        method: "PUT",
        body: {
          completed_html: currentUser.completed_html,
          completed_js: currentUser.completed_js,
          completed_py: currentUser.completed_py,
          lang: currentLang,
        },
      });
    } catch (e) {
      console.warn("progress sync failed", e);
    }
  } else {
    const map = getUsersMap();
    const email = currentUser.email;
    map[email] = {
      ...(map[email] || {}),
      email: currentUser.email,
      name: currentUser.name,
      password: (map[email] && map[email].password) || currentUser.password || "",
      isAdmin: !!currentUser.isAdmin,
      completed_html: currentUser.completed_html,
      completed_js: currentUser.completed_js,
      completed_py: currentUser.completed_py,
      lang: currentLang,
    };
    saveUsersMap(map);
  }

  localStorage.setItem(SESSION_KEY, currentUser.email);
  localStorage.setItem(
    "learnfp_user",
    JSON.stringify({
      email: currentUser.email,
      name: currentUser.name,
      isAdmin: currentUser.isAdmin,
      completed_html: currentUser.completed_html,
      completed_js: currentUser.completed_js,
      completed_py: currentUser.completed_py,
      lang: currentLang,
    })
  );
}

function saveUser() {
  // fire-and-forget async persist
  persistCurrentUser();
}

async function loadUser() {
  if (useRemoteAuth()) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    try {
      const data = await api("/api/me");
      setSessionUser(data.user, token);
      return true;
    } catch (e) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
  }

  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return false;
  const map = getUsersMap();
  const user = map[email];
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    return false;
  }
  setSessionUser(user, null);
  return true;
}

function showApp() {
  $("#auth-screen").classList.add("hidden");
  $("#app-screen").classList.remove("hidden");
  $("#user-name").textContent = currentUser.name || currentUser.email;
  syncLangUI();
  renderLessonList();
  updateProgress();
}

function showAuth() {
  $("#app-screen").classList.add("hidden");
  $("#auth-screen").classList.remove("hidden");
  showAuthError("login", "");
  showAuthError("register", "");
}

$$(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    $$(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const isLogin = tab.dataset.tab === "login";
    $("#login-form").classList.toggle("hidden", !isLogin);
    $("#register-form").classList.toggle("hidden", isLogin);
    showAuthError("login", "");
    showAuthError("register", "");
  });
});

$("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  showAuthError("login", "");
  const email = $("#login-email").value.trim().toLowerCase();
  const password = $("#login-password").value;
  if (!email || !password) {
    showAuthError("login", "メールアドレスとパスワードを入力してください。");
    return;
  }

  try {
    if (useRemoteAuth()) {
      const data = await api("/api/login", { method: "POST", body: { email, password } });
      setSessionUser(data.user, data.token);
      showApp();
      applyRequestedRoute();
      return;
    }

      const map = getUsersMap();
    const user = map[email];
    if (!user) {
      showAuthError("login", "このメールアドレスのアカウントがありません。新規登録してください。");
      return;
    }
    if (user.password !== password) {
      showAuthError("login", "パスワードが正しくありません。");
      return;
    }
    setSessionUser(user, null);
    showApp();
  } catch (err) {
    showAuthError("login", err.message || "ログインに失敗しました。");
  }
});

$("#register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  showAuthError("register", "");
  const name = $("#reg-name").value.trim();
  const email = $("#reg-email").value.trim().toLowerCase();
  const password = $("#reg-password").value;
  const password2 = $("#reg-password2") ? $("#reg-password2").value : password;

  if (!name) return showAuthError("register", "表示名を入力してください。");
  if (!email || !email.includes("@")) return showAuthError("register", "有効なメールアドレスを入力してください。");
  if (password.length < 8) return showAuthError("register", "パスワードは8文字以上にしてください。");
  if (password !== password2) return showAuthError("register", "確認用パスワードが一致しません。");

  try {
    if (useRemoteAuth()) {
      const data = await api("/api/register", { method: "POST", body: { name, email, password } });
      setSessionUser(data.user, data.token);
      showApp();
      applyRequestedRoute();
      return;
    }

      const map = getUsersMap();
    if (map[email]) {
      showAuthError("register", "このメールアドレスはすでに登録されています。ログインしてください。");
      return;
    }
    map[email] = {
      email, name, password, isAdmin: false, completed_html: [], completed_js: [], completed_py: [],
    };
    saveUsersMap(map);
    setSessionUser(map[email], null);
    showApp();
  } catch (err) {
    showAuthError("register", err.message || "登録に失敗しました。");
  }
});

$("#logout-btn").addEventListener("click", async () => {
  if (currentUser) {
    try { await persistCurrentUser(); } catch (e) {}
  }
  if (useRemoteAuth()) {
    try { await api("/api/logout", { method: "POST" }); } catch (e) {}
  }
  currentUser = null;
  completedByLang = { html: new Set(), js: new Set(), py: new Set() };
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("learnfp_user");
  showAuth();
  const email = $("#login-email");
  const pass = $("#login-password");
  if (email) email.value = "";
  if (pass) pass.value = "";
  showAuthError("login", "");
  showAuthError("register", "");
});

// ========== LANGUAGE TABS ==========
function syncLangUI() {
  $$(".lang-tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.lang === currentLang);
  });
  const label = currentLang === "html" ? "HTML" : currentLang === "py" ? "Python" : "JavaScript";
  const heading = $("#lessons-heading");
  if (heading) heading.textContent = label + " レッスン";
  const badge = $("#lang-badge");
  if (badge) badge.textContent = label;
}

$$(".lang-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    currentLessonId = null;
    saveUser();
    syncLangUI();
    $$(".view").forEach((v) => v.classList.add("hidden"));
    $("#lessons-view").classList.remove("hidden");
    $$(".nav-btn").forEach((b) => b.classList.remove("active"));
    $$(".nav-btn")[0].classList.add("active");
    renderLessonList();
    updateProgress();
  });
});

// ========== NAV ==========
$$(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".nav-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    $$(".view").forEach((v) => v.classList.add("hidden"));
    if (view === "lessons") {
      $("#lessons-view").classList.remove("hidden");
      renderLessonList();
    } else if (view === "progress") {
      $("#progress-view").classList.remove("hidden");
      updateProgress();
    }
  });
});

// ========== LESSON LIST ==========
function isUnlocked(id) {
  if (currentUser && currentUser.isAdmin) return true;
  if (id === 1) return true;
  return getCompleted().has(id - 1);
}

function renderLessonList() {
  const list = $("#lesson-list");
  list.innerHTML = "";
  const completed = getCompleted();
  getLessons().forEach((lesson) => {
    const unlocked = isUnlocked(lesson.id);
    const done = completed.has(lesson.id);
    const card = document.createElement("div");
    card.className = `lesson-card ${!unlocked ? "locked" : ""} ${done ? "completed" : ""}`;
    card.innerHTML = `
      <div class="num">LESSON ${lesson.id}</div>
      <h3>${lesson.title}</h3>
      <p>${lesson.description}</p>
      <span class="status">${done ? "✅" : unlocked ? "▶" : "🔒"}</span>
    `;
    if (unlocked) card.addEventListener("click", () => openLesson(lesson.id));
    list.appendChild(card);
  });
}

function openLesson(id) {
  currentLessonId = id;
  const lesson = getLessons().find((l) => l.id === id);
  if (!lesson) return;

  $$(".view").forEach((v) => v.classList.add("hidden"));
  $("#lesson-detail-view").classList.remove("hidden");

  $("#lesson-number").textContent = `LESSON ${lesson.id}`;
  $("#lesson-language").textContent = currentLang === "html" ? "HTML" : currentLang === "py" ? "PYTHON" : "JAVASCRIPT";
  $("#lesson-title").textContent = lesson.title;
  $("#lesson-description").textContent = lesson.description || "";
  $("#lesson-content").innerHTML = lesson.content;
  const challenge = $("#lesson-content .challenge-box");
  $("#lesson-task").replaceChildren();
  $("#lesson-task-section").classList.toggle("hidden", !challenge);
  if (challenge) $("#lesson-task").appendChild(challenge);
  $("#code-editor").value = lesson.starterCode;
  renderCodeHighlight();
  $("#hints").innerHTML = (lesson.hints || []).map((h) => `<p>• ${escapeHtml(h)}</p>`).join("");
  $("#hints").classList.add("hidden");
  $("#toggle-hints").textContent = "ヒントを見る";
  $("#toggle-hints").setAttribute("aria-expanded", "false");
  $("#result-message").textContent = "";
  $("#result-message").className = "";
  $("#next-lesson-btn").classList.add("hidden");
  $("#console-output").innerHTML = currentLang === "html"
    ? `<div class="info">HTML は VIEW タブにリアルタイム表示されます。</div>`
    : `<div class="info">入力すると、ここに console / print の結果がリアルタイム表示されます</div>`;
  $("#tests-output").innerHTML = "";
  $("#tests-count").textContent = "";
  $("#preview-output").textContent = "実行結果がここに表示されます";
  $("#editor-filename").textContent = currentLang === "html" ? "index.html" : currentLang === "py" ? "main.py" : "main.js";

  const htmlMode = currentLang === "html";
  const viewTab = $("#view-tab");
  const viewPanel = $("#view-panel");
  if (viewTab) viewTab.classList.toggle("hidden", !htmlMode);
  if (viewPanel) viewPanel.classList.toggle("hidden", !htmlMode);
  const previewPanel = $(".preview-panel");
  if (previewPanel) previewPanel.classList.toggle("hidden", htmlMode);

  if (htmlMode) {
    renderHtmlPreview($("#code-editor").value);
    switchEditorTab("view");
  } else {
    switchEditorTab("console");
  }
  scheduleLiveConsole();
}

$("#back-to-list").addEventListener("click", () => {
  $$(".view").forEach((v) => v.classList.add("hidden"));
  $("#lessons-view").classList.remove("hidden");
  $$(".nav-btn").forEach((b) => b.classList.remove("active"));
  $$(".nav-btn")[0].classList.add("active");
  renderLessonList();
});

$("#toggle-hints").addEventListener("click", () => {
  const hints = $("#hints");
  const isHidden = hints.classList.contains("hidden");
  hints.classList.toggle("hidden");
  $("#toggle-hints").textContent = isHidden ? "ヒントを隠す" : "ヒントを見る";
  $("#toggle-hints").setAttribute("aria-expanded", String(isHidden));
});

function switchEditorTab(name) {
  $$(".output-section .panel").forEach((p) => p.classList.remove("active"));
  $$(".editor-tab").forEach((t) => t.classList.remove("active"));
  const panel = document.getElementById(name + "-panel");
  if (panel) panel.classList.add("active");
  $$(".editor-tab").forEach((t) => {
    const active = t.dataset.panel === name;
    t.classList.toggle("active", active);
    t.setAttribute("aria-selected", String(active));
  });
}

$$(".editor-tab").forEach((tab) => {
  tab.addEventListener("click", () => switchEditorTab(tab.dataset.panel));
});


// ========== JAVASCRIPT SANDBOX ==========
// User-written JavaScript and JavaScript lesson tests run in a dedicated Web Worker.
// A Web Worker has no access to this page's DOM or localStorage, so auth tokens remain
// outside the learner-code execution environment.
const JS_SANDBOX_TIMEOUT_MS = 2000;

function runInJavaScriptSandbox(payload) {
  return new Promise((resolve) => {
    const workerSource = `
      function formatValue(value) {
        if (typeof value === "string") return value;
        try {
          const json = JSON.stringify(value);
          return json === undefined ? String(value) : json;
        } catch (e) {
          return String(value);
        }
      }

      self.onmessage = async (event) => {
        const data = event.data || {};
        const logs = [];
        const push = (type, args) => {
          logs.push({ type, text: Array.from(args).map(formatValue).join(" ") });
        };

        console.log = (...args) => push("log", args);
        console.error = (...args) => push("error", args);
        console.warn = (...args) => push("log", args);
        console.info = (...args) => push("info", args);

        try {
          if (data.mode === "test") {
            const testFn = (0, eval)("(" + data.testSource + ")");
            const result = await testFn(data.code);
            self.postMessage({ ok: true, result: !!result, logs, error: null });
            return;
          }

          const fn = new Function(data.code);
          const result = fn();
          if (result && typeof result.then === "function") await result;
          self.postMessage({ ok: true, logs, error: null });
        } catch (error) {
          self.postMessage({
            ok: false,
            logs,
            error: error && error.message ? error.message : String(error),
          });
        }
      };
    `;

    const blob = new Blob([workerSource], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const sandboxWorker = new Worker(url);

    let finished = false;
    const finish = (result) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      sandboxWorker.terminate();
      URL.revokeObjectURL(url);
      resolve(result);
    };

    sandboxWorker.onmessage = (event) => {
      finish(event.data || { ok: false, logs: [], error: "Sandbox returned no data." });
    };

    sandboxWorker.onerror = (event) => {
      finish({
        ok: false,
        logs: [],
        error: event.message || "JavaScript sandbox error.",
      });
    };

    const timer = setTimeout(() => {
      finish({
        ok: false,
        logs: [],
        error: "実行時間が長すぎるため停止しました。",
        timedOut: true,
      });
    }, JS_SANDBOX_TIMEOUT_MS);

    sandboxWorker.postMessage(payload);
  });
}

async function runJavaScript(code) {
  return runInJavaScriptSandbox({ mode: "execute", code });
}

async function runJavaScriptTest(testFn, code) {
  return runInJavaScriptSandbox({
    mode: "test",
    code,
    testSource: testFn.toString(),
  });
}

// ========== LIVE CONSOLE (入力中に反映) ==========
let liveTimer = null;
let liveRunning = false;

function renderHtmlPreview(code) {
  const frame = $("#html-preview-frame");
  if (!frame) return;

  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src http: https: data:; style-src 'unsafe-inline'; font-src data:;">`;
  const source = String(code || "");
  const safeSource = /<head[\s>]/i.test(source)
    ? source.replace(/<head([^>]*)>/i, `<head$1>${csp}`)
    : csp + source;

  frame.srcdoc = safeSource;
}

function syncPreview() {
  if (currentLang === "html") {
    renderHtmlPreview($("#code-editor").value);
    return;
  }
  const output = $("#console-output").textContent.trim();
  $("#preview-output").textContent = output || "出力はありません";
}

function renderCodeHighlight() {
  const editor = $("#code-editor");
  const mirror = $("#code-highlight");
  const code = editor.value;
  const fragment = document.createDocumentFragment();
  let plainStart = 0;
  let i = 0;

  while (i < code.length) {
    let end = i;
    const quote = code[i];
    if (currentLang === "js" && code.startsWith("//", i)) {
      end = code.indexOf("\n", i);
      if (end === -1) end = code.length;
    } else if (currentLang === "js" && code.startsWith("/*", i)) {
      const close = code.indexOf("*/", i + 2);
      end = close === -1 ? code.length : close + 2;
    } else if (currentLang === "py" && quote === "#") {
      end = code.indexOf("\n", i);
      if (end === -1) end = code.length;
    } else if (quote === "'" || quote === '"' || (currentLang === "js" && quote === "`")) {
      const triple = currentLang === "py" && code.startsWith(quote.repeat(3), i);
      const delimiter = triple ? quote.repeat(3) : quote;
      end = i + delimiter.length;
      while (end < code.length) {
        if (code[end] === "\\") {
          end = Math.min(end + 2, code.length);
        } else if (code.startsWith(delimiter, end)) {
          end += delimiter.length;
          break;
        } else if (!triple && quote !== "`" && code[end] === "\n") {
          break;
        } else {
          end++;
        }
      }
    }

    if (end > i) {
      if (plainStart < i) fragment.append(document.createTextNode(code.slice(plainStart, i)));
      const span = document.createElement("span");
      span.className = "syntax-green";
      span.textContent = code.slice(i, end);
      fragment.append(span);
      i = end;
      plainStart = i;
    } else {
      i++;
    }
  }
  if (plainStart < code.length) fragment.append(document.createTextNode(code.slice(plainStart)));
  fragment.append(document.createTextNode("\u200b"));
  mirror.replaceChildren(fragment);
  mirror.scrollTop = editor.scrollTop;
  mirror.scrollLeft = editor.scrollLeft;
}

async function updateLiveConsole() {
  if (!currentLessonId) return;
  if (liveRunning) return;
  const code = $("#code-editor").value;
  const consoleEl = $("#console-output");
  if (!consoleEl) return;

  liveRunning = true;
  try {
    if (currentLang === "html") {
      renderHtmlPreview(code);
      consoleEl.innerHTML = `<div class="info">VIEW タブを更新しました。</div>`;
    } else if (currentLang === "py") {
      const r = await runPython(code);
      if (r.error) {
        consoleEl.innerHTML =
          (r.stdout
            ? r.stdout.split("\n").filter(Boolean).map((l) => `<div class="log">${escapeHtml(l)}</div>`).join("")
            : "") +
          `<div class="error">${escapeHtml(r.error)}</div>`;
      } else {
        consoleEl.innerHTML = r.stdout
          ? r.stdout.split("\n").filter(Boolean).map((l) => `<div class="log">${escapeHtml(l)}</div>`).join("")
          : `<div class="info">（出力なし）— コードを書くとここに表示されます</div>`;
      }
    } else {
      const { logs = [], error } = await runJavaScript(code);
      let html = logs.map((l) => `<div class="${l.type}">${escapeHtml(l.text)}</div>`).join("");
      if (error) {
        html += `<div class="error">${escapeHtml(error)}</div>`;
      }
      consoleEl.innerHTML = html || `<div class="info">（出力なし）— コードを書くとここに表示されます</div>`;
    }
  } catch (e) {
    consoleEl.innerHTML = `<div class="error">${escapeHtml(e.message || String(e))}</div>`;
  } finally {
    syncPreview();
    liveRunning = false;
  }
}

function scheduleLiveConsole() {
  if (liveTimer) clearTimeout(liveTimer);
  // JS は短め、Python は少し長め（重いため）
  const delay = currentLang === "html" ? 180 : currentLang === "py" ? 600 : 350;
  liveTimer = setTimeout(() => {
    updateLiveConsole();
  }, delay);
}

const codeEditorEl = $("#code-editor");
if (codeEditorEl) {
  codeEditorEl.addEventListener("input", () => {
    renderCodeHighlight();
    $("#result-message").textContent = "";
    $("#result-message").className = "";
    $("#tests-output").innerHTML = "";
    $("#tests-count").textContent = "";
    $("#next-lesson-btn").classList.add("hidden");
    switchEditorTab(currentLang === "html" ? "view" : "console");
    scheduleLiveConsole();
  });
  codeEditorEl.addEventListener("scroll", () => {
    $("#code-highlight").scrollTop = codeEditorEl.scrollTop;
    $("#code-highlight").scrollLeft = codeEditorEl.scrollLeft;
  });
  codeEditorEl.addEventListener("change", scheduleLiveConsole);
}

// ========== CONFETTI ==========
function celebrateConfetti(options = {}) {
  const { count = 120, duration = 150, spreadX = null, originY = -20 } = options;
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const colors = ["#2563eb", "#16a34a", "#ca8a04", "#dc2626", "#7c3aed", "#0891b2"];
  const pieces = [];
  for (let i = 0; i < count; i++) {
    const x = spreadX != null ? spreadX + (Math.random() - 0.5) * window.innerWidth * 0.4 : Math.random() * window.innerWidth;
    pieces.push({
      x, y: originY + Math.random() * 40,
      w: 5 + Math.random() * 7, h: 7 + Math.random() * 9,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 8, vy: 2 + Math.random() * 5,
      rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.25,
      opacity: 1
    });
  }
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    frame++;
    for (const p of pieces) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.rot += p.vr;
      if (frame > duration - 30) p.opacity = Math.max(0, p.opacity - 0.04);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (frame < duration) requestAnimationFrame(draw);
    else canvas.remove();
  }
  requestAnimationFrame(draw);
}

// ========== PYTHON (Skulpt) ==========
function runPython(code) {
  return new Promise((resolve) => {
    if (typeof Sk === "undefined") {
      resolve({ stdout: "", error: "Python エンジンを読み込めませんでした（ネット接続を確認）" });
      return;
    }
    let stdout = "";
    Sk.configure({
      output: (text) => { stdout += text; },
      read: (x) => {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
          throw "File not found: '" + x + "'";
        }
        return Sk.builtinFiles["files"][x];
      },
      __future__: Sk.python3
    });
    Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true))
      .then(() => resolve({ stdout, error: null }))
      .catch((e) => {
        const msg = e.toString();
        resolve({ stdout, error: msg });
      });
  });
}

// ========== RUN ==========
async function runCode() {
  const lesson = getLessons().find((l) => l.id === currentLessonId);
  if (!lesson) return;

  const code = $("#code-editor").value;
  const consoleEl = $("#console-output");
  const testsEl = $("#tests-output");
  const resultMsg = $("#result-message");

  if (currentLang === "html") {
    renderHtmlPreview(code);
    consoleEl.innerHTML = `<div class="info">HTML を VIEW タブに表示しました。</div>`;
  } else if (currentLang === "py") {
    const r = await runPython(code);
    if (r.error) {
      consoleEl.innerHTML = `<div class="error">${escapeHtml(r.error)}</div>` +
        (r.stdout ? `<div class="log">${escapeHtml(r.stdout)}</div>` : "");
      resultMsg.textContent = "実行エラーがあります。コンソールを確認してください。";
      resultMsg.className = "error";
      $("#next-lesson-btn").classList.add("hidden");
      switchEditorTab("console");
      // still try tests for partial credit
    } else {
      consoleEl.innerHTML = r.stdout
        ? r.stdout.split("\n").filter(Boolean).map((l) => `<div class="log">${escapeHtml(l)}</div>`).join("")
        : `<div class="info">（出力なし）</div>`;
    }
  } else {
    const { logs = [], error } = await runJavaScript(code);
    consoleEl.innerHTML = logs.map((l) => `<div class="${l.type}">${escapeHtml(l.text)}</div>`).join("") ||
      `<div class="info">（出力なし）</div>`;
    if (error) {
      consoleEl.innerHTML += `<div class="error">${escapeHtml(error)}</div>`;
      resultMsg.textContent = "実行エラーがあります。コンソールを確認してください。";
      resultMsg.className = "error";
      $("#next-lesson-btn").classList.add("hidden");
      switchEditorTab("console");
      syncPreview();
      return;
    }
  }

  syncPreview();

  let allPassed = true;
  const testResults = [];
  let passCount = 0;
  for (const test of lesson.tests) {
    let passed = false;
    let errMsg = "";
    try {
      if (currentLang === "js") {
        const sandboxResult = await runJavaScriptTest(test.run, code);
        passed = !!sandboxResult.result;
        if (sandboxResult.error) errMsg = sandboxResult.error;
      } else {
        const ret = test.run(code);
        passed = ret && typeof ret.then === "function" ? await ret : !!ret;
      }
    } catch (e) {
      errMsg = e.message || String(e);
      passed = false;
    }
    if (!passed) allPassed = false;
    if (passed) passCount++;
    testResults.push({ description: test.description, passed, errMsg });
  }

  testsEl.innerHTML = testResults.map((t) => `
    <div class="test-item ${t.passed ? "pass" : "fail"}">
      <span class="icon">${t.passed ? "✅" : "❌"}</span>
      <div>
        <div class="desc">${escapeHtml(t.description)}</div>
        ${t.errMsg ? `<div class="actual">Error: ${escapeHtml(t.errMsg)}</div>` : ""}
      </div>
    </div>`).join("");
  $("#tests-count").textContent = `${passCount}/${lesson.tests.length}`;

  if (allPassed) {
    const completed = getCompleted();
    const alreadyCompleted = completed.has(lesson.id);
    const levelBefore = getPlayerLevel();

    if (passCount > 0) celebrateConfetti({ count: 160, duration: 180 });
    completed.add(lesson.id);

    const levelAfter = getPlayerLevel();
    if (!alreadyCompleted && levelAfter > levelBefore) {
      celebrateConfetti({ count: 240, duration: 220 });
      resultMsg.textContent = `🎉 LEVEL UP! Level ${levelAfter} になりました！`;
    } else {
      resultMsg.textContent = "🎉 全条件クリア！合格です！";
    }
    resultMsg.className = "success";
    saveUser();
    updateProgress();
    $("#next-lesson-btn").classList.remove("hidden");
    switchEditorTab("tests");
    if (lesson.explanation) {
      const expDiv = document.createElement("div");
      expDiv.className = "explanation-box";
      expDiv.innerHTML = lesson.explanation;
      testsEl.appendChild(expDiv);
    }
  } else {
    if (passCount > 0) {
      resultMsg.textContent = `✨ ${passCount} / ${lesson.tests.length} テスト通過！もう少し！`;
      resultMsg.className = "success";
    } else {
      resultMsg.textContent = "いくつかテストが失敗しています。修正して再実行してください。";
      resultMsg.className = "error";
    }
    $("#next-lesson-btn").classList.add("hidden");
    switchEditorTab("tests");
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

$("#run-btn").addEventListener("click", () => runCode());
$("#reset-btn").addEventListener("click", () => {
  const lesson = getLessons().find((l) => l.id === currentLessonId);
  if (lesson) {
    $("#code-editor").value = lesson.starterCode;
    renderCodeHighlight();
    $("#result-message").textContent = "";
    $("#result-message").className = "";
    $("#console-output").innerHTML = "";
    $("#tests-output").innerHTML = "";
    $("#tests-count").textContent = "";
    $("#preview-output").textContent = "実行結果がここに表示されます";
    $("#next-lesson-btn").classList.add("hidden");
    if (currentLang === "html") renderHtmlPreview($("#code-editor").value);
    switchEditorTab(currentLang === "html" ? "view" : "console");
    scheduleLiveConsole();
  }
});

$("#next-lesson-btn").addEventListener("click", () => {
  const nextId = currentLessonId + 1;
  if (getLessons().find((l) => l.id === nextId)) {
    openLesson(nextId);
  } else {
    $$(".view").forEach((v) => v.classList.add("hidden"));
    $("#lessons-view").classList.remove("hidden");
    $$(".nav-btn").forEach((b) => b.classList.remove("active"));
    $$(".nav-btn")[0].classList.add("active");
    renderLessonList();
  }
});

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    runCode();
  }
});


const LESSONS_PER_LEVEL = 10;

function getTotalCompletedCount() {
  return Object.values(completedByLang).reduce((total, set) => total + set.size, 0);
}

function getPlayerLevel() {
  return 1 + Math.floor(getTotalCompletedCount() / LESSONS_PER_LEVEL);
}

function updatePlayerLevelUI() {
  const totalCompleted = getTotalCompletedCount();
  const level = getPlayerLevel();
  const progressInLevel = totalCompleted % LESSONS_PER_LEVEL;
  const pct = (progressInLevel / LESSONS_PER_LEVEL) * 100;
  const remaining = LESSONS_PER_LEVEL - progressInLevel;

  const levelEl = $("#player-level");
  const levelTitle = $("#player-level-title");
  const totalEl = $("#player-total-completed");
  const bar = $("#level-progress-bar");
  const text = $("#level-progress-text");

  if (levelEl) levelEl.textContent = String(level);
  if (levelTitle) levelTitle.textContent = `Level ${level}`;
  if (totalEl) totalEl.textContent = `${totalCompleted} lessons completed`;
  if (bar) bar.style.width = pct + "%";
  if (text) text.textContent = `次のLevelまであと${remaining}レッスン`;
}

function updateProgress() {
  updatePlayerLevelUI();
  const lessons = getLessons();
  const completed = getCompleted();
  const total = lessons.length;
  const done = lessons.filter((l) => completed.has(l.id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  $("#progress-bar").style.width = pct + "%";
  const label = currentLang === "html" ? "HTML" : currentLang === "py" ? "Python" : "JavaScript";
  $("#progress-text").textContent = `${label}: ${done} / ${total} 完了 (${pct}%)`;
  const list = $("#completed-list");
  if (list) {
    const names = lessons.filter((l) => completed.has(l.id)).map((l) => l.title);
    list.innerHTML = names.length
      ? "<p>完了:</p><ul>" + names.map((n) => `<li>${escapeHtml(n)}</li>`).join("") + "</ul>"
      : "<p>まだ完了したレッスンはありません。</p>";
  }
}


function applyRequestedRoute() {
  const params = new URLSearchParams(window.location.search);
  const requestedLang = params.get("lang");
  if (requestedLang === "html" || requestedLang === "js" || requestedLang === "py") {
    currentLang = requestedLang;
    syncLangUI();
    renderLessonList();
    updateProgress();
  }

  if (params.get("view") === "progress") {
    $$(".view").forEach((v) => v.classList.add("hidden"));
    $("#progress-view").classList.remove("hidden");
    $$(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === "progress"));
    updateProgress();
    return;
  }

  const requestedLesson = Number(params.get("lesson"));
  if (Number.isInteger(requestedLesson) && requestedLesson > 0) {
    const exists = getLessons().some((lesson) => lesson.id === requestedLesson);
    if (exists && isUnlocked(requestedLesson)) {
      openLesson(requestedLesson);
    }
  }
}

// ========== INIT ==========
(async function init() {
  try {
    if (await loadUser()) {
      const requestedLang = new URLSearchParams(window.location.search).get("lang");
      if (requestedLang === "html" || requestedLang === "js" || requestedLang === "py") {
        currentLang = requestedLang;
      }
      showApp();
      applyRequestedRoute();
    } else {
      showAuth();
    }
  } catch (e) {
    console.warn(e);
    showAuth();
  }
})();