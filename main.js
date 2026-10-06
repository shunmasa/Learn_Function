// Landing page: preview, authentication, lesson browser, and shared session state.
const previewDialog = document.getElementById('preview-dialog');
const previewTitle = document.getElementById('dialog-title');
const previewContent = document.getElementById('dialog-content');
const trailerButton = document.querySelector('.trailer');

if (trailerButton && previewDialog) {
  trailerButton.addEventListener('click', () => {
    previewTitle.textContent = '冒険の世界をプレビュー';
    previewContent.replaceChildren();
    const image = document.createElement('img');
    const landscape = document.querySelector('.landscape');
    image.src = getComputedStyle(landscape).backgroundImage.slice(5, -2);
    image.alt = '光る十字架、山とお城がある冒険の舞台';
    const note = document.createElement('p');
    note.textContent = 'この冒険の世界から、JavaScript と Python のレッスンへ進めます。';
    previewContent.append(image, note);
    previewDialog.showModal();
  });

  previewDialog.querySelector('.close-dialog').addEventListener('click', () => previewDialog.close());
  previewDialog.addEventListener('click', event => {
    if (event.target === previewDialog) {
      const rect = previewDialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        previewDialog.close();
      }
    }
  });
}

const TOKEN_KEY = 'learnfp_token';
const SESSION_KEY = 'learnfp_session';
const USER_KEY = 'learnfp_user';
let landingUser = null;
let landingLang = 'js';
let pendingRoute = '';

function apiBase() {
  return String(window.LEARN_FP_API || '').replace(/\/+$/, '');
}

async function landingApi(path, options = {}) {
  const base = apiBase();
  if (!base) throw new Error('ログインAPIが設定されていません。js/config.js を確認してください。');
  const headers = Object.assign({'Content-Type':'application/json'}, options.headers || {});
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = 'Bearer ' + token;
  const response = await fetch(base + path, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  let data = {};
  try { data = await response.json(); } catch (_) {}
  if (!response.ok) throw new Error(data.error || ('HTTP ' + response.status));
  return data;
}

function saveLandingSession(user, token) {
  landingUser = user;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, user.email);
  localStorage.setItem(USER_KEY, JSON.stringify({
    email:user.email,
    name:user.name,
    isAdmin:!!user.isAdmin,
    completed_js:user.completed_js || [],
    completed_py:user.completed_py || [],
    lang:user.lang || 'js',
  }));
  updateAuthUI();
  renderLandingLessons();
}

function clearLandingSession() {
  landingUser = null;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
  updateAuthUI();
  renderLandingLessons();
}

function updateAuthUI() {
  document.querySelectorAll('[data-auth-guest]').forEach(el => el.hidden = !!landingUser);
  document.querySelectorAll('[data-auth-user]').forEach(el => el.hidden = !landingUser);
  document.querySelectorAll('[data-user-name]').forEach(el => {
    el.textContent = landingUser ? (landingUser.name || landingUser.email) : '';
  });
}

async function restoreLandingSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || !apiBase()) {
    updateAuthUI();
    return;
  }
  try {
    const data = await landingApi('/api/me');
    saveLandingSession(data.user, token);
  } catch (_) {
    clearLandingSession();
  }
}

const authDialog = document.getElementById('auth-dialog');
const authTitle = document.getElementById('auth-dialog-title');
const authLead = authDialog ? authDialog.querySelector('[data-auth-lead]') : null;
const loginForm = document.getElementById('landing-login-form');
const signupForm = document.getElementById('landing-signup-form');

function setAuthTab(mode) {
  const signup = mode === 'signup';
  authTitle.textContent = signup ? 'サインアップ' : 'ログイン';
  document.querySelectorAll('[data-auth-tab]').forEach(button => {
    const active = button.dataset.authTab === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  loginForm.hidden = signup;
  signupForm.hidden = !signup;
}

function openAuth(mode = 'login', message = '続けるにはログインしてください。', route = '') {
  if (!authDialog) return;
  pendingRoute = route || '';
  setAuthTab(mode);
  authLead.textContent = message;
  document.getElementById('landing-login-error').hidden = true;
  document.getElementById('landing-signup-error').hidden = true;
  authDialog.showModal();
}

function finishAuth() {
  authDialog.close();
  const route = pendingRoute;
  pendingRoute = '';
  if (route) window.location.href = route;
}

function setFormError(id, message) {
  const el = document.getElementById(id);
  el.textContent = message || '';
  el.hidden = !message;
}

if (authDialog) {
  authDialog.querySelector('.close-auth-dialog').addEventListener('click', () => authDialog.close());
  authDialog.addEventListener('click', event => {
    if (event.target === authDialog) {
      const rect = authDialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) authDialog.close();
    }
  });
  document.querySelectorAll('[data-auth-tab]').forEach(button => button.addEventListener('click', () => setAuthTab(button.dataset.authTab)));
}

document.querySelectorAll('[data-open-auth]').forEach(button => {
  button.addEventListener('click', () => openAuth(button.dataset.openAuth, button.dataset.openAuth === 'signup' ? 'アカウントを作成して学習を始めましょう。' : 'ログインして学習を続けましょう。'));
});

document.querySelectorAll('[data-logout]').forEach(button => button.addEventListener('click', async () => {
  try { if (apiBase()) await landingApi('/api/logout', {method:'POST'}); } catch (_) {}
  clearLandingSession();
  showToast('ログアウトしました。');
}));

if (loginForm) loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  setFormError('landing-login-error', '');
  const email = document.getElementById('landing-login-email').value.trim().toLowerCase();
  const password = document.getElementById('landing-login-password').value;
  try {
    const data = await landingApi('/api/login', {method:'POST', body:{email,password}});
    saveLandingSession(data.user, data.token);
    finishAuth();
  } catch (error) {
    setFormError('landing-login-error', error.message || 'ログインに失敗しました。');
  }
});

if (signupForm) signupForm.addEventListener('submit', async event => {
  event.preventDefault();
  setFormError('landing-signup-error', '');
  const name = document.getElementById('landing-signup-name').value.trim();
  const email = document.getElementById('landing-signup-email').value.trim().toLowerCase();
  const password = document.getElementById('landing-signup-password').value;
  const password2 = document.getElementById('landing-signup-password2').value;
  if (password.length < 8) return setFormError('landing-signup-error', 'パスワードは8文字以上にしてください。');
  if (password !== password2) return setFormError('landing-signup-error', '確認用パスワードが一致しません。');
  try {
    const data = await landingApi('/api/register', {method:'POST', body:{name,email,password}});
    saveLandingSession(data.user, data.token);
    finishAuth();
  } catch (error) {
    setFormError('landing-signup-error', error.message || 'アカウント作成に失敗しました。');
  }
});

const toast = document.getElementById('site-toast');
let toastTimer = 0;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2600);
}

function lessonSource() {
  if (landingLang === 'html') return typeof LESSONS_HTML !== 'undefined' ? LESSONS_HTML : [];
  if (landingLang === 'py') return typeof LESSONS_PY !== 'undefined' ? LESSONS_PY : [];
  return typeof LESSONS_JS !== 'undefined' ? LESSONS_JS : [];
}

function completedForLanguage() {
  if (!landingUser) return new Set();
  if (landingLang === 'html') return new Set(landingUser.completed_html || []);
  if (landingLang === 'py') return new Set(landingUser.completed_py || []);
  return new Set(landingUser.completed_js || []);
}

function lessonUnlocked(id, completed) {
  if (!landingUser) return true;
  if (landingUser.isAdmin || id === 1) return true;
  return completed.has(id - 1);
}

function renderLandingLessons() {
  const list = document.getElementById('landing-lesson-list');
  const title = document.querySelector('[data-lessons-title]');
  if (!list || !title) return;
  title.textContent = (landingLang === 'html' ? 'HTML' : landingLang === 'py' ? 'Python' : 'JavaScript') + ' レッスン';
  const lessons = lessonSource();
  const completed = completedForLanguage();
  list.replaceChildren();

  lessons.forEach(lesson => {
    const done = completed.has(lesson.id);
    const unlocked = lessonUnlocked(lesson.id, completed);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'landing-lesson-card' + (done ? ' completed' : '') + (!unlocked ? ' locked' : '');
    card.dataset.lessonId = String(lesson.id);
    const status = !landingUser ? 'ログインして開始 →' : done ? '✓ 完了' : unlocked ? 'レッスンを開く →' : '🔒 前のレッスンを完了';
    card.innerHTML = `
      <span class="lesson-number">LESSON ${lesson.id}</span>
      <strong>${escapeLandingHtml(lesson.title)}</strong>
      <span class="lesson-description">${escapeLandingHtml(lesson.description || '')}</span>
      <span class="lesson-card-status">${status}</span>`;
    card.addEventListener('click', () => {
      const route = './learn.html?lang=' + landingLang + '&lesson=' + lesson.id;
      if (!landingUser) {
        openAuth('login', 'このレッスンを始めるにはログインしてください。ログイン後、自動で選んだレッスンへ進みます。', route);
        return;
      }
      if (!unlocked) {
        showToast('このレッスンを開くには、ひとつ前のレッスンを完了してください。');
        return;
      }
      window.location.href = route;
    });
    list.appendChild(card);
  });
}

function escapeLandingHtml(value) {
  return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function setLandingLanguage(lang, shouldScroll = false) {
  if (lang !== 'html' && lang !== 'js' && lang !== 'py') return;
  landingLang = lang;
  document.querySelectorAll('[data-lang-switch]').forEach(button => {
    const active = button.dataset.langSwitch === lang;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('[data-header-lang]').forEach(button => button.classList.toggle('active', button.dataset.headerLang === lang));
  renderLandingLessons();
  if (shouldScroll) document.getElementById('lessons')?.scrollIntoView({behavior:'smooth', block:'start'});
}

document.querySelectorAll('[data-lang-switch]').forEach(button => button.addEventListener('click', () => setLandingLanguage(button.dataset.langSwitch)));
document.querySelectorAll('[data-header-lang]').forEach(button => button.addEventListener('click', () => setLandingLanguage(button.dataset.headerLang, true)));

document.querySelectorAll('[data-progress-link]').forEach(link => link.addEventListener('click', event => {
  if (landingUser) return;
  event.preventDefault();
  openAuth('login', '進捗を見るにはログインしてください。', './learn.html?view=progress');
}));

setLandingLanguage('js');
restoreLandingSession();

// Scroll quest, enemy patrol, dialogue and three-hit combat
(() => {
'use strict';
const WORLD_WIDTH = 2033, WORLD_HEIGHT = 773;
const COIN_X = [1443, 1503, 1563];
const ENEMY_X = 1860;
const HIT_TIMES = [320, 970, 1620];
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

function questFrame(progress, width, height, reducedMotion = false) {
  const p = clamp(Number.isFinite(progress) ? progress : 0, 0, 1);
  const compact = width <= 680;
  const scale = Math.max(width / WORLD_WIDTH, height / WORLD_HEIGHT);
  const runnerWidth = compact ? 230 : 350;
  const startX = compact ? 720 : 665;
  const endX = ENEMY_X - runnerWidth - 8;
  const runnerX = startX + (endX - startX) * p;
  const thresholds = COIN_X.map(x => (x - runnerWidth * .82 - startX) / (endX - startX));
  const count = thresholds.filter(t => p >= t).length;
  const minCameraX = width - WORLD_WIDTH * scale;
  const cameraX = width / (WORLD_WIDTH * scale) < .82
    ? clamp(width * (compact ? .2 : .38) - (runnerX + runnerWidth * .25) * scale, minCameraX, 0)
    : minCameraX / 2;
  let jump = 0;
  if (!reducedMotion) thresholds.forEach(t => {
    const phase = (p - (t - .035)) / .07;
    if (phase > 0 && phase < 1) jump = Math.max(jump, Math.sin(phase * Math.PI) * 23);
  });
  const coins = thresholds.map(t => {
    const fade = clamp((p - t) / .035, 0, 1);
    return {collected:p >= t, opacity:1 - fade, rise:reducedMotion ? 0 : fade * 65, fade};
  });
  return {progress:p, compact, scale, runnerWidth, runnerX, cameraX,
    cameraY:height - WORLD_HEIGHT * scale, jump, thresholds, count, coins};
}

function enemyFloor(x) {
  return 658 - clamp((x - 1800) / 60, 0, 1) * 52;
}
function enemyPatrol(elapsed, baseX, reducedMotion = false, compact = false) {
  const stepTime = 260;
  const phase = ((Math.max(0, elapsed) / stepTime) % 8);
  const distance = phase <= 4 ? phase : 8 - phase;
  return {
    x:baseX - (reducedMotion ? 0 : distance * (compact ? 12 : 24)),
    facing:phase < 4 ? 1 : -1,
    bob:reducedMotion ? 0 : Math.abs(Math.sin(phase * Math.PI)) * 4,
    speechVisible:elapsed % 2000 < 1450,
    utterance:Math.floor(elapsed / 2000)
  };
}
function combatFrame(elapsed, reducedMotion = false) {
  const time = Math.max(0, Number.isFinite(elapsed) ? elapsed : 0);
  const hits = HIT_TIMES.filter(t => time >= t).length;
  const swingTime = HIT_TIMES.find(t => time >= t - 140 && time < t + 210);
  const swing = swingTime === undefined ? null : (time - (swingTime - 140)) / 350;
  const sinceHit = hits ? time - HIT_TIMES[hits - 1] : Infinity;
  const fade = clamp((time - 1740) / 440, 0, 1);
  return {
    hits, remaining:3 - hits, complete:time >= 2180, fade,
    approach:clamp(time / 220, 0, 1),
    swordVisible:swing !== null && !reducedMotion,
    bladeAngle:swing === null ? -65 : -65 + swing * 150,
    lunge:swing === null || reducedMotion ? 0 : Math.sin(swing * Math.PI) * 15,
    slashOpacity:sinceHit < 180 && !reducedMotion ? 1 - sinceHit / 180 : 0,
    flash:sinceHit < 120 && !reducedMotion,
    knockback:sinceHit < 180 && !reducedMotion ? Math.sin(sinceHit / 180 * Math.PI) * 8 : 0
  };
}

const stage = document.getElementById('adventure');
if (!stage) return;
const transitionStage = document.getElementById('quest-transition');
const transitionRunners = transitionStage ? transitionStage.querySelector('.transition-runners') : null;
const hero = stage.querySelector('.hero');
const world = stage.querySelector('.world');
const runners = stage.querySelector('.runners');
const enemy = stage.querySelector('.enemy-actor');
const speech = stage.querySelector('.enemy-comment');
const pauseButton = stage.querySelector('[data-pause-enemy]');
const health = [...stage.querySelectorAll('.enemy-hp span')];
const coinElements = [...stage.querySelectorAll('.world-coin')];
const coinCount = stage.querySelector('[data-coin-count]');
const questCount = stage.querySelector('[data-quest-coins]');
const xp = stage.querySelector('[data-xp]');
const fill = stage.querySelector('.fill');
const badge = stage.querySelector('[data-badge]');
const cue = stage.querySelector('.scroll-cue');
const live = stage.querySelector('[data-quest-announcement]');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
let geometry = {top:0, distance:1, width:1, height:1};
let transitionGeometry = {top:0, height:1, width:1};
let rafId = 0, lastProgress = null, lastStatus = '', stopWalking = 0;
let activeTime = 0, lastTick = window.performance.now(), previousActive = false, paused = false;
let battle = {phase:'patrol'};

function measure() {
  geometry.top = stage.getBoundingClientRect().top + window.scrollY;
  geometry.height = hero.clientHeight;
  geometry.width = hero.clientWidth;
  const available = document.documentElement.scrollHeight - window.innerHeight - geometry.top;
  geometry.distance = Math.max(1, Math.min(stage.offsetHeight - geometry.height, available));

  if (transitionStage) {
    const rect = transitionStage.getBoundingClientRect();
    transitionGeometry.top = rect.top + window.scrollY;
    transitionGeometry.height = transitionStage.offsetHeight || 1;
    transitionGeometry.width = transitionStage.clientWidth || window.innerWidth;
  }

}
function requestRender() {
  if (!rafId) rafId = window.requestAnimationFrame(render);
}
function renderQuestTransition() {
  if (!transitionStage || !transitionRunners) return false;

  const viewportTop = window.scrollY;
  const viewportBottom = viewportTop + window.innerHeight;
  const visible = viewportBottom > transitionGeometry.top
    && viewportTop < transitionGeometry.top + transitionGeometry.height;

  const unlocked = battle.phase === 'defeated';
  transitionStage.classList.toggle('is-unlocked', unlocked);

  if (!unlocked) {
    transitionRunners.style.opacity = '0';
    return visible;
  }

  /*
   * Scroll progress through the card-free transition area.
   * This is intentionally a simple translation, not a walking animation.
   */
  const travel = Math.max(1, transitionGeometry.height - Math.min(window.innerHeight * .55, 420));
  const raw = (viewportTop - transitionGeometry.top + window.innerHeight * .18) / travel;
  const p = clamp(raw, 0, 1);

  // Grow QUEST CLEAR / 次の冒険へ as the user scrolls down.
  const transitionMessage = transitionStage.querySelector('.transition-message');
  if (transitionMessage) {
    const messageScale = 1 + p * 1.0;
    transitionMessage.style.setProperty('--message-scale', messageScale.toFixed(3));
  }

  const compact = transitionGeometry.width <= 680;
  const spriteWidth = compact ? 230 : 345;
  const spriteHeight = spriteWidth * 778 / 2021;

  // In scene 2 the adventurers do not move downward.
  // They appear and remain at the very bottom-center of the road.
  const x = transitionGeometry.width / 2 - spriteWidth / 2;
  const y = transitionGeometry.height - spriteHeight - (compact ? 12 : 18);

  // Slightly larger because the foreground road is wider.
  const scale = compact ? 1.08 : 1.12;

  transitionRunners.style.opacity = '1';
  transitionRunners.style.transform =
    `translate3d(${x}px,${y}px,0) scale(${scale})`;

  return visible;
}

function render(now = window.performance.now()) {
  rafId = 0;
  const visible = window.scrollY + window.innerHeight > geometry.top
    && window.scrollY < geometry.top + stage.offsetHeight;
  const transitionVisibleNow = transitionStage
    ? window.scrollY + window.innerHeight > transitionGeometry.top
      && window.scrollY < transitionGeometry.top + transitionGeometry.height
    : false;
  const active = visible && !document.hidden && !paused;
  const timeActive = !document.hidden && !paused
    && (active || (transitionVisibleNow && battle.phase === 'fighting'));
  if (timeActive && previousActive) activeTime += clamp(now - lastTick, 0, 120);
  lastTick = now;
  previousActive = timeActive;
  const frame = questFrame((window.scrollY - geometry.top) / geometry.distance,
    geometry.width, geometry.height, motion.matches);
  if (frame.progress < .84 && battle.phase !== 'patrol') battle = {phase:'patrol'};
  const visibleRight = (geometry.width - frame.cameraX) / frame.scale;
  const baseEnemyX = Math.min(ENEMY_X, visibleRight - (frame.compact ? 60 : 80));
  const patrol = enemyPatrol(activeTime, baseEnemyX, motion.matches, frame.compact);
  if (battle.phase === 'patrol' && frame.progress >= .94 && frame.count === 3 && active) {
    battle = {phase:'fighting', start:activeTime, enemyX:baseEnemyX,
      startEnemyX:patrol.x, approachGap:Math.max(0, baseEnemyX - frame.runnerWidth - 12 - frame.runnerX)};
    runners.classList.remove('is-walking');
  }
  let fight = null, runnerX = frame.runnerX, enemyX = patrol.x;
  let enemyFacing = patrol.facing, enemyBob = patrol.bob, cameraX = frame.cameraX;
  if (battle.phase !== 'patrol') {
    fight = combatFrame(activeTime - battle.start, motion.matches);
    if (fight.complete) battle.phase = 'defeated';
    const target = battle.enemyX - frame.runnerWidth - 12;
    const halfEnemy = (frame.compact ? 86 : 118) / 2;
    const roomForApproach = Math.max(0, (geometry.width - 24) / frame.scale - frame.runnerWidth - 12 - halfEnemy);
    const approachGap = Math.min(battle.approachGap, roomForApproach);
    runnerX = target - approachGap * (1 - fight.approach) + fight.lunge;
    enemyX = battle.startEnemyX + (battle.enemyX - battle.startEnemyX) * fight.approach + fight.knockback;
    enemyFacing = 1;
    enemyBob = 0;
    if (geometry.width / (WORLD_WIDTH * frame.scale) < .82) {
      const actionRight = enemyX + halfEnemy;
      cameraX = clamp((geometry.width - (actionRight - runnerX) * frame.scale) / 2 - runnerX * frame.scale,
        geometry.width - WORLD_WIDTH * frame.scale, 0);
    }
  }
  world.style.transform = 'translate3d(' + cameraX + 'px,' + frame.cameraY + 'px,0) scale(' + frame.scale + ')';
  runners.style.width = frame.runnerWidth + 'px';
  runners.style.transform = 'translate3d(' + runnerX + 'px,' + (battle.phase === 'patrol' ? -frame.jump : 0) + 'px,0)';
  runners.style.setProperty('--blade-angle', (fight ? fight.bladeAngle : -65) + 'deg');
  runners.style.setProperty('--blade-opacity', fight && fight.swordVisible ? 1 : 0);
  runners.style.setProperty('--slash-opacity', fight ? fight.slashOpacity : 0);
  if (battle.phase === 'patrol' && lastProgress !== null
      && Math.abs(frame.progress - lastProgress) > .0001 && !motion.matches) {
    runners.classList.add('is-walking');
    window.clearTimeout(stopWalking);
    stopWalking = window.setTimeout(() => runners.classList.remove('is-walking'), 160);
  }
  lastProgress = frame.progress;
  const enemyWidth = frame.compact ? 86 : 118;
  const enemyHeight = enemyWidth * 1138 / 1382;
  const floor = enemyFloor(enemyX);
  enemy.style.width = enemyWidth + 'px';
  enemy.style.transform = 'translate3d(' + (enemyX - enemyWidth / 2) + 'px,' + (floor - enemyHeight - enemyBob) + 'px,0)';
  enemy.style.setProperty('--enemy-facing', enemyFacing);
  enemy.style.setProperty('--enemy-opacity', fight ? 1 - fight.fade : 1);
  enemy.style.setProperty('--enemy-fall', (fight && !motion.matches ? fight.fade * 80 : 0) + 'deg');
  enemy.style.setProperty('--enemy-drop', (fight && !motion.matches ? fight.fade * 35 : 0) + 'px');
  enemy.style.setProperty('--puff-opacity', fight ? Math.sin(fight.fade * Math.PI) : 0);
  enemy.style.setProperty('--puff-scale', fight ? 1 + fight.fade * 2 : 1);
  enemy.classList.toggle('is-hit', Boolean(fight && fight.flash));
  enemy.classList.toggle('is-defeated', battle.phase === 'defeated');
  health.forEach((heart, i) => heart.classList.toggle('is-lost', Boolean(fight && i >= fight.remaining)));
  const bubbleWidth = Math.min(270, geometry.width - 24);
  const bubbleX = clamp(cameraX + enemyX * frame.scale - bubbleWidth + 38, 12, geometry.width - bubbleWidth - 12);
  const bubbleY = Math.max(12, frame.cameraY + (floor - enemyHeight) * frame.scale - 79);
  speech.style.width = bubbleWidth + 'px';
  speech.style.transform = 'translate3d(' + bubbleX + 'px,' + bubbleY + 'px,0)';
  speech.style.opacity = battle.phase === 'patrol' && (motion.matches || patrol.speechVisible) ? 1 : 0;
  speech.dataset.utterance = String(patrol.utterance);
  coinElements.forEach((coin, i) => {
    const state = frame.coins[i];
    coin.classList.toggle('is-collected', state.collected);
    coin.style.setProperty('--coin-opacity', state.opacity);
    coin.style.setProperty('--coin-rise', (-state.rise) + 'px');
    coin.style.setProperty('--coin-scale', 1 - state.fade * .65);
    coin.style.setProperty('--spark-opacity', Math.sin(state.fade * Math.PI));
  });
  const hits = fight ? fight.hits : 0;
  const won = battle.phase === 'defeated';
  const status = frame.count + ':' + battle.phase + ':' + hits;
  if (status !== lastStatus) {
    coinCount.textContent = frame.count + ' / 3';
    questCount.textContent = frame.count + '/3';
    const experience = 120 + frame.count * 20 + (won ? 60 : 0);
    xp.textContent = experience + ' / 300 XP';
    fill.style.width = (experience / 3) + '%';
    fill.setAttribute('aria-valuenow', String(experience));
    badge.textContent = (won ? 1 : 0) + '/1';
    cue.textContent = won ? 'QUEST CLEAR! 敵を倒した！ ↓'
      : battle.phase === 'fighting' ? '剣で攻撃 ' + hits + ' / 3'
      : frame.count === 3 ? 'コインGET! 敵のところへ ↓' : 'スクロールで冒険する ↓';
    live.textContent = won ? '剣で3回攻撃して敵を倒しました。クエストクリア！'
      : battle.phase === 'fighting' ? '敵と戦闘中。攻撃 ' + hits + '回、3回中。'
      : 'コイン ' + frame.count + '枚、3枚中。';
    lastStatus = status;
  }
  stage.classList.toggle('quest-complete', won);
  stage.classList.toggle('in-battle', battle.phase === 'fighting');

  const transitionVisible = renderQuestTransition();
  if (active || transitionVisible
      || (battle.phase === 'fighting' && transitionVisibleNow)) {
    requestRender();
  }
}
pauseButton.addEventListener('click', () => {
  paused = !paused;
  pauseButton.setAttribute('aria-pressed', String(paused));
  pauseButton.textContent = paused ? '演出を再開 ▶' : '演出を一時停止 Ⅱ';
  previousActive = false;
  requestRender();
});
window.addEventListener('scroll', requestRender, {passive:true});
window.addEventListener('resize', () => {measure(); requestRender();}, {passive:true});
window.addEventListener('pageshow', () => {measure(); previousActive = false; requestRender();});
window.addEventListener('pagehide', () => {
  if (rafId) window.cancelAnimationFrame(rafId);
  rafId = 0; previousActive = false;
});
document.addEventListener('visibilitychange', () => {previousActive = false; requestRender();});
motion.addEventListener('change', requestRender);
document.querySelectorAll('[data-start-quest]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  measure();
  window.scrollTo({top:geometry.top + geometry.distance, behavior:motion.matches ? 'auto' : 'smooth'});
}));
measure();
render();
})();