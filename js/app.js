// ========== STATE ==========
let currentUser = null;
let currentLessonId = null;
let currentLang = "js"; // "js" | "py"
let completedByLang = { js: new Set(), py: new Set() };

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function getLessons() {
  return currentLang === "py" ? LESSONS_PY : LESSONS_JS;
}

function getCompleted() {
  return completedByLang[currentLang];
}

// ========== AUTH ==========
const USERS_KEY = "learnfp_users";
const SESSION_KEY = "learnfp_session";
const TOKEN_KEY = "learnfp_token";

const ADMIN_EMAIL = "masashilandjob@gmail.com";
const ADMIN_PASSWORD = "1111";

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

function ensureAdminUserLocal() {
  const map = getUsersMap();
  if (!map[ADMIN_EMAIL]) {
    map[ADMIN_EMAIL] = {
      email: ADMIN_EMAIL,
      name: "Admin",
      password: ADMIN_PASSWORD,
      isAdmin: true,
      completed_js: [],
      completed_py: [],
    };
  } else {
    map[ADMIN_EMAIL].password = ADMIN_PASSWORD;
    map[ADMIN_EMAIL].isAdmin = true;
    map[ADMIN_EMAIL].name = map[ADMIN_EMAIL].name || "Admin";
  }
  saveUsersMap(map);
}

function applyUserProgress(user) {
  completedByLang.js = new Set(user.completed_js || user.completed || []);
  completedByLang.py = new Set(user.completed_py || []);
  if (user.lang === "js" || user.lang === "py") currentLang = user.lang;
}

function setSessionUser(user, token) {
  currentUser = {
    email: user.email,
    name: user.name,
    isAdmin: !!user.isAdmin,
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
      completed_js: [...completedByLang.js],
      completed_py: [...completedByLang.py],
      lang: currentLang,
    })
  );
}

async function persistCurrentUser() {
  if (!currentUser) return;
  currentUser.completed_js = [...completedByLang.js];
  currentUser.completed_py = [...completedByLang.py];
  currentUser.lang = currentLang;

  if (useRemoteAuth()) {
    try {
      await api("/api/progress", {
        method: "PUT",
        body: {
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
      completed_js: currentUser.completed_js,
      completed_py: currentUser.completed_py,
      lang: currentLang,
    };
    if (email === ADMIN_EMAIL) {
      map[email].password = ADMIN_PASSWORD;
      map[email].isAdmin = true;
    }
    saveUsersMap(map);
  }

  localStorage.setItem(SESSION_KEY, currentUser.email);
  localStorage.setItem(
    "learnfp_user",
    JSON.stringify({
      email: currentUser.email,
      name: currentUser.name,
      isAdmin: currentUser.isAdmin,
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

  ensureAdminUserLocal();
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
      return;
    }

    ensureAdminUserLocal();
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
  if (password.length < 4) return showAuthError("register", "パスワードは4文字以上にしてください。");
  if (password !== password2) return showAuthError("register", "確認用パスワードが一致しません。");
  if (email === ADMIN_EMAIL) return showAuthError("register", "このメールアドレスは登録できません。");

  try {
    if (useRemoteAuth()) {
      const data = await api("/api/register", { method: "POST", body: { name, email, password } });
      setSessionUser(data.user, data.token);
      showApp();
      return;
    }

    ensureAdminUserLocal();
    const map = getUsersMap();
    if (map[email]) {
      showAuthError("register", "このメールアドレスはすでに登録されています。ログインしてください。");
      return;
    }
    map[email] = {
      email, name, password, isAdmin: false, completed_js: [], completed_py: [],
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
  completedByLang = { js: new Set(), py: new Set() };
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
  const label = currentLang === "py" ? "Python" : "JavaScript";
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
  $("#lesson-title").textContent = lesson.title;
  $("#lesson-content").innerHTML = lesson.content;
  $("#code-editor").value = lesson.starterCode;
  $("#hints").innerHTML = (lesson.hints || []).map((h) => `<p>• ${escapeHtml(h)}</p>`).join("");
  $("#hints").classList.add("hidden");
  $("#toggle-hints").textContent = "ヒントを見る";
  $("#result-message").textContent = "";
  $("#result-message").className = "";
  $("#next-lesson-btn").classList.add("hidden");
  $("#console-output").innerHTML = `<div class="info">入力すると、ここに console / print の結果がリアルタイム表示されます</div>`;
  $("#tests-output").innerHTML = "";
  switchEditorTab("code");
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
});

function switchEditorTab(name) {
  $$(".panel").forEach((p) => p.classList.remove("active"));
  $$(".editor-tab").forEach((t) => t.classList.remove("active"));
  const panel = document.getElementById(name + "-panel");
  if (panel) panel.classList.add("active");
  $$(`.editor-tab[data-panel="${name}"]`).forEach((t) => t.classList.add("active"));
}

$$(".editor-tab").forEach((tab) => {
  tab.addEventListener("click", () => switchEditorTab(tab.dataset.panel));
});

// ========== LIVE CONSOLE (入力中に反映) ==========
let liveTimer = null;
let liveRunning = false;

async function updateLiveConsole() {
  if (!currentLessonId) return;
  if (liveRunning) return;
  const code = $("#code-editor").value;
  const consoleEl = $("#console-output");
  if (!consoleEl) return;

  liveRunning = true;
  try {
    if (currentLang === "py") {
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
      const { logs, error } = captureConsole(() => {
        new Function(code)();
      });
      let html = logs.map((l) => `<div class="${l.type}">${escapeHtml(l.text)}</div>`).join("");
      if (error) {
        html += `<div class="error">${escapeHtml(error.message || String(error))}</div>`;
      }
      consoleEl.innerHTML = html || `<div class="info">（出力なし）— コードを書くとここに表示されます</div>`;
    }
  } catch (e) {
    consoleEl.innerHTML = `<div class="error">${escapeHtml(e.message || String(e))}</div>`;
  } finally {
    liveRunning = false;
  }
}

function scheduleLiveConsole() {
  if (liveTimer) clearTimeout(liveTimer);
  // JS は短め、Python は少し長め（重いため）
  const delay = currentLang === "py" ? 600 : 350;
  liveTimer = setTimeout(() => {
    updateLiveConsole();
  }, delay);
}

const codeEditorEl = $("#code-editor");
if (codeEditorEl) {
  codeEditorEl.addEventListener("input", scheduleLiveConsole);
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

// ========== JS CONSOLE CAPTURE ==========
function captureConsole(fn) {
  const logs = [];
  const original = { log: console.log, error: console.error, warn: console.warn, info: console.info };
  console.log = (...args) => { logs.push({ type: "log", text: args.map(String).join(" ") }); original.log(...args); };
  console.error = (...args) => { logs.push({ type: "error", text: args.map(String).join(" ") }); original.error(...args); };
  console.warn = (...args) => { logs.push({ type: "log", text: args.map(String).join(" ") }); original.warn(...args); };
  console.info = (...args) => { logs.push({ type: "info", text: args.map(String).join(" ") }); original.info(...args); };
  let error;
  try { fn(); } catch (e) { error = e; logs.push({ type: "error", text: e.message }); }
  Object.assign(console, original);
  return { logs, error };
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

  if (currentLang === "py") {
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
    const { logs, error } = captureConsole(() => { new Function(code)(); });
    consoleEl.innerHTML = logs.map((l) => `<div class="${l.type}">${escapeHtml(l.text)}</div>`).join("") ||
      `<div class="info">（出力なし）</div>`;
    if (error) {
      resultMsg.textContent = "実行エラーがあります。コンソールを確認してください。";
      resultMsg.className = "error";
      $("#next-lesson-btn").classList.add("hidden");
      switchEditorTab("console");
      return;
    }
  }

  let allPassed = true;
  const testResults = [];
  let passCount = 0;
  for (const test of lesson.tests) {
    let passed = false;
    let errMsg = "";
    try {
      const ret = test.run(code);
      passed = ret && typeof ret.then === "function" ? await ret : !!ret;
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

  for (let i = 0; i < passCount; i++) {
    setTimeout(() => {
      celebrateConfetti({
        count: allPassed ? 80 : 50,
        duration: 140,
        spreadX: window.innerWidth * (0.25 + Math.random() * 0.5),
        originY: -10
      });
    }, i * 250);
  }
  if (allPassed && passCount > 0) {
    setTimeout(() => celebrateConfetti({ count: 160, duration: 180 }), passCount * 250 + 80);
  }

  if (allPassed) {
    resultMsg.textContent = "🎉 全テスト通過！素晴らしい！";
    resultMsg.className = "success";
    getCompleted().add(lesson.id);
    saveUser();
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
    $("#result-message").textContent = "";
    $("#result-message").className = "";
    $("#console-output").innerHTML = "";
    $("#tests-output").innerHTML = "";
    $("#next-lesson-btn").classList.add("hidden");
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

function updateProgress() {
  const lessons = getLessons();
  const completed = getCompleted();
  const total = lessons.length;
  const done = lessons.filter((l) => completed.has(l.id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  $("#progress-bar").style.width = pct + "%";
  const label = currentLang === "py" ? "Python" : "JavaScript";
  $("#progress-text").textContent = `${label}: ${done} / ${total} 完了 (${pct}%)`;
  const list = $("#completed-list");
  if (list) {
    const names = lessons.filter((l) => completed.has(l.id)).map((l) => l.title);
    list.innerHTML = names.length
      ? "<p>完了:</p><ul>" + names.map((n) => `<li>${escapeHtml(n)}</li>`).join("") + "</ul>"
      : "<p>まだ完了したレッスンはありません。</p>";
  }
}

// ========== INIT ==========
(async function init() {
  try {
    if (await loadUser()) showApp();
    else showAuth();
  } catch (e) {
    console.warn(e);
    showAuth();
  }
})();
