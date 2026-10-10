(() => {
  "use strict";

  const section = document.getElementById("quest-transition");
  if (!section) return;

  const stage = section.querySelector(".transition-stage");
  if (!stage) return;

  const background = section.querySelector(".transition-layer-background");
  const meadow = section.querySelector(".transition-layer-meadow");
  const deer = section.querySelector(".transition-layer-deer");
  const rabbit = section.querySelector(".transition-layer-rabbit");
  const birds = section.querySelector(".transition-layer-birds");
  const butterfly = section.querySelector(".transition-layer-butterfly");
  const runners = section.querySelector(".transition-runners");
  const message = section.querySelector(".transition-message");
  const next = section.querySelector(".transition-next");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (from, to, amount) => from + (to - from) * amount;
  const smoothstep = (edge0, edge1, value) => {
    const x = clamp((value - edge0) / Math.max(0.0001, edge1 - edge0), 0, 1);
    return x * x * (3 - 2 * x);
  };

  let rafId = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;
  let stageHeight = stage.clientHeight || window.innerHeight;

  function setLayer(element, x = 0, y = 0, scale = 1, flip = 1, opacity = 1, z = 0) {
    if (!element) return;
    element.style.setProperty("--move-x", `${x.toFixed(2)}px`);
    element.style.setProperty("--move-y", `${y.toFixed(2)}px`);
    element.style.setProperty("--move-z", `${z.toFixed(2)}px`);
    element.style.setProperty("--layer-scale", scale.toFixed(4));
    element.style.setProperty("--flip-x", String(flip));
    element.style.setProperty("--layer-opacity", clamp(opacity, 0, 1).toFixed(3));
  }

  function setRunner(x, y, scale, opacity = 1) {
    if (!runners) return;
    runners.style.setProperty("--runner-x", `${x.toFixed(2)}px`);
    runners.style.setProperty("--runner-y", `${y.toFixed(2)}px`);
    runners.style.setProperty("--runner-scale", scale.toFixed(4));
    runners.style.setProperty("--runner-opacity", clamp(opacity, 0, 1).toFixed(3));
  }

  function calculateTargetProgress() {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    stageHeight = stage.clientHeight || window.innerHeight;
    const travel = Math.max(1, section.offsetHeight - stageHeight);
    return clamp((window.scrollY - sectionTop) / travel, 0, 1);
  }

  function updateVisibility() {
    const rect = section.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.top < window.innerHeight;
    section.classList.toggle("is-unlocked", visible);
  }

  function updateTarget() {
    const nowY = window.scrollY;
    const deltaY = nowY - lastScrollY;
    lastScrollY = nowY;
    scrollVelocity = clamp(lerp(scrollVelocity, deltaY, 0.34), -28, 28);
    targetProgress = calculateTargetProgress();
    updateVisibility();
    requestRender();
  }

  function resetMotion() {
    setLayer(background, 0, 0, 1, 1, 1, 0);
    setLayer(meadow, 0, 0, 1, 1, 1, 0);
    setLayer(deer, 0, 0, 1, 1, 1, 0);
    setLayer(rabbit, 0, 0, 1, 1, 1, 0);
    setLayer(birds, 0, 0, 1, 1, 1, 0);
    setLayer(butterfly, 0, 0, 1, 1, 1, 0);
    setRunner(0, 0, 1.12, 1);

    if (message) {
      message.style.setProperty("--message-scale", "1");
      message.style.setProperty("--message-y", "0px");
      message.style.setProperty("--message-opacity", "1");
    }

    if (next) {
      next.style.setProperty("--next-opacity", "1");
      next.style.setProperty("--next-y", "0px");
    }
  }

  function applyFrame(progress, velocity) {
    if (reducedMotion.matches) {
      resetMotion();
      return;
    }

    const p = clamp(progress, 0, 1);

    // Fixed background: sky + lake + mountains + castle
    setLayer(background, 0, 0, 1, 1, 1, 0);

    // Meadow / road subtly descends to reveal more of the distant background.
    const hillProgress = smoothstep(0.02, 0.98, p);
    const meadowY = lerp(-18, 96, hillProgress) + velocity * 0.08;
    const meadowX = Math.sin(p * Math.PI * 1.3) * 3;
    const meadowScale = lerp(1.055, 0.995, hillProgress);
    setLayer(meadow, meadowX, meadowY, meadowScale, 1, 1, 28);

    // Deer wander gently left and right while staying tied to the hill motion.
    const deerPhase = p * Math.PI * 2;
    const deerX = Math.sin(deerPhase) * 56;
    const deerDirection = Math.cos(deerPhase) >= 0 ? 1 : -1;
    const deerY = meadowY * 0.58 - Math.abs(Math.sin(p * Math.PI * 8)) * 3 + velocity * 0.04;
    const deerScale = 1 + Math.sin(p * Math.PI) * 0.02;
    setLayer(deer, deerX, deerY, deerScale, deerDirection, 1, 36);

    // Rabbit moves in the opposite direction with a stronger hop.
    const rabbitPhase = p * Math.PI * 2 + Math.PI;
    const rabbitX = Math.sin(rabbitPhase) * 74;
    const rabbitDirection = Math.cos(rabbitPhase) >= 0 ? -1 : 1;
    const rabbitY = meadowY * 0.72 - Math.abs(Math.sin(p * Math.PI * 7)) * 10 + velocity * 0.05;
    const rabbitScale = 1 + Math.abs(Math.sin(p * Math.PI * 3)) * 0.03;
    setLayer(rabbit, rabbitX, rabbitY, rabbitScale, rabbitDirection, 1, 54);

    // Birds drift across the sky with a floating wave.
    const birdX = -120 + p * 250;
    const birdY = Math.sin(p * Math.PI * 3.2) * 14 - p * 8 + velocity * 0.07;
    const birdScale = 0.96 + p * 0.07;
    const birdOpacity = 0.84 + Math.sin(p * Math.PI) * 0.10;
    setLayer(birds, birdX, birdY, birdScale, 1, birdOpacity, 42);

    // Butterfly softly floats in a figure-eight.
    const butterflyX = Math.sin(p * Math.PI * 4.2) * 26 + p * 8;
    const butterflyY = Math.sin(p * Math.PI * 8.4) * 14 - p * 16 + velocity * 0.09;
    const butterflyScale = 0.96 + Math.sin(p * Math.PI * 2.4) * 0.055;
    setLayer(butterfly, butterflyX, butterflyY, butterflyScale, 1, 1, 68);

    // Adventurers start near the viewer and climb up the center road.
    const runnerProgress = smoothstep(0.04, 0.97, p);
    const runnerTravel = runnerProgress * Math.min(stageHeight * 0.43, 330);
    const runnerX = Math.sin(p * Math.PI * 2.2) * 5;
    const runnerStep = -Math.abs(Math.sin(p * Math.PI * 13)) * 3.5;
    const runnerY = -runnerTravel + runnerStep + velocity * 0.035;
    const runnerScale = lerp(1.08, 0.56, runnerProgress);
    const runnerOpacity = 0.96 - smoothstep(0.82, 1, p) * 0.14;
    setRunner(runnerX, runnerY, runnerScale, runnerOpacity);

    if (message) {
      const messageIn = smoothstep(0.02, 0.18, p);
      const messageOut = smoothstep(0.74, 0.98, p);
      const messageOpacity = messageIn * (1 - messageOut * 0.55);
      const messageScale = 0.94 + p * 0.44;
      const messageY = -p * 10;
      message.style.setProperty("--message-scale", messageScale.toFixed(4));
      message.style.setProperty("--message-y", `${messageY.toFixed(2)}px`);
      message.style.setProperty("--message-opacity", messageOpacity.toFixed(3));
    }

    if (next) {
      const nextOpacity = smoothstep(0.64, 0.9, p);
      const nextY = (1 - nextOpacity) * 12;
      next.style.setProperty("--next-opacity", nextOpacity.toFixed(3));
      next.style.setProperty("--next-y", `${nextY.toFixed(2)}px`);
    }
  }

  function render() {
    rafId = 0;
    const progressEase = Math.abs(targetProgress - currentProgress) > 0.12 ? 0.105 : 0.085;
    currentProgress = lerp(currentProgress, targetProgress, progressEase);
    scrollVelocity *= 0.86;
    applyFrame(currentProgress, scrollVelocity);
    const progressStillMoving = Math.abs(targetProgress - currentProgress) > 0.00035;
    const velocityStillMoving = Math.abs(scrollVelocity) > 0.08;
    if (progressStillMoving || velocityStillMoving) requestRender();
  }

  function requestRender() {
    if (rafId) return;
    rafId = window.requestAnimationFrame(render);
  }

  function handleResize() {
    stageHeight = stage.clientHeight || window.innerHeight;
    targetProgress = calculateTargetProgress();
    currentProgress = targetProgress;
    requestRender();
  }

  window.addEventListener("scroll", updateTarget, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });
  window.addEventListener("pageshow", () => {
    lastScrollY = window.scrollY;
    targetProgress = calculateTargetProgress();
    currentProgress = targetProgress;
    updateVisibility();
    requestRender();
  });

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", () => {
      targetProgress = calculateTargetProgress();
      currentProgress = targetProgress;
      requestRender();
    });
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(() => {
      targetProgress = calculateTargetProgress();
      currentProgress = targetProgress;
      requestRender();
    });
  }

  targetProgress = calculateTargetProgress();
  currentProgress = targetProgress;
  updateVisibility();
  requestRender();
})();
