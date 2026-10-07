(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);

  let resourcesData = null;
  let resourcesCategory = "all";
  let resourcesQuery = "";

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ensureStylesheet() {
    if (document.querySelector('link[href$="css/resources-view.css"]')) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./css/resources-view.css";
    document.head.appendChild(link);
  }

  function ensureResourcesButton() {
    let button = document.querySelector('.nav-btn[data-view="resources"]');
    if (button) return button;

    const nav = document.querySelector(".app-header nav");
    if (!nav) return null;

    button = document.createElement("button");
    button.className = "nav-btn";
    button.dataset.view = "resources";
    button.textContent = "リソース";
    nav.appendChild(button);

    return button;
  }

  function ensureResourcesView() {
    let view = document.getElementById("resources-view");
    if (view) return view;

    const main = document.querySelector("#app-screen main");
    if (!main) return null;

    view = document.createElement("section");
    view.id = "resources-view";
    view.className = "view hidden";

    view.innerHTML = `
      <div class="page-header resources-view-header">
        <div>
          <span class="resources-view-kicker">RESOURCES</span>
          <h2>リソース</h2>
          <p>レッスンで使ったタグや書き方を、ここですぐ確認できます。</p>
        </div>
      </div>

      <div class="resources-view-toolbar">
        <label class="resources-view-search" for="resources-search">
          <span aria-hidden="true">⌕</span>
          <input
            id="resources-search"
            type="search"
            placeholder="タグ・属性・説明を検索  例: img / href / 表"
            autocomplete="off"
          >
        </label>

        <span id="resources-language-badge" class="resources-view-language-badge">
          HTML
        </span>
      </div>

      <div class="resources-view-layout">
        <aside class="resources-view-sidebar">
          <div class="resources-view-sidebar-title">カテゴリ</div>
          <div id="resources-category-list" class="resources-view-category-list"></div>
        </aside>

        <div class="resources-view-content">
          <div id="resources-status" class="resources-view-status"></div>
          <div id="resources-entry-list"></div>

          <section id="resources-walkthrough" class="resources-view-walkthrough hidden">
            <div class="resources-walkthrough-head">
              <h3 id="resources-walkthrough-title">見本コードの読み方</h3>
              <button
                class="resources-copy-btn"
                id="resources-walkthrough-copy"
                type="button"
              >コピー</button>
            </div>

            <div class="resources-walkthrough-grid">
              <pre class="resources-walkthrough-code"><code id="resources-walkthrough-code"></code></pre>
              <div id="resources-walkthrough-lines" class="resources-walkthrough-lines"></div>
            </div>

            <div id="resources-walkthrough-summary" class="resources-walkthrough-summary"></div>
          </section>
        </div>
      </div>
    `;

    main.appendChild(view);
    return view;
  }

  function resourceSearchText(entry) {
    const attrs = (entry.attributes || [])
      .map(attr => `${attr.name} ${attr.meaning}`)
      .join(" ");

    return [
      entry.tag,
      entry.displayName,
      entry.summary,
      entry.example,
      attrs,
      ...(entry.searchKeywords || [])
    ].join(" ").toLowerCase();
  }

  async function loadResourcesData() {
    if (resourcesData) return resourcesData;

    const status = $("#resources-status");
    if (status) status.textContent = "読み込み中...";

    const response = await fetch("./resources.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`resources.json を読み込めませんでした (${response.status})`);
    }

    const data = await response.json();

    if (!Array.isArray(data.resources) || !data.resources.length) {
      throw new Error("resources.json に resources データがありません。");
    }

    resourcesData = data.resources[0];

    if (status) status.textContent = "";
    return resourcesData;
  }

  function renderCategories() {
    const list = $("#resources-category-list");
    if (!list || !resourcesData) return;

    list.replaceChildren();

    const categories = [
      { id: "all", name: "すべて" },
      ...(resourcesData.categories || [])
    ];

    categories.forEach(category => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "resources-view-category";
      button.textContent = category.name;
      button.classList.toggle("active", resourcesCategory === category.id);

      button.addEventListener("click", () => {
        resourcesCategory = category.id;
        renderCategories();
        renderEntries();
      });

      list.appendChild(button);
    });
  }

  function renderEntries() {
    const root = $("#resources-entry-list");
    if (!root || !resourcesData) return;

    const query = resourcesQuery.trim().toLowerCase();

    const entries = (resourcesData.entries || []).filter(entry => {
      const categoryOK =
        resourcesCategory === "all" ||
        entry.category === resourcesCategory;

      const searchOK =
        !query ||
        resourceSearchText(entry).includes(query);

      return categoryOK && searchOK;
    });

    root.replaceChildren();

    if (!entries.length) {
      root.innerHTML = `
        <div class="resources-view-empty">
          <strong>見つかりませんでした</strong>
          <p>別のキーワードやカテゴリで探してみてください。</p>
        </div>
      `;
      return;
    }

    const grouped = new Map();

    entries.forEach(entry => {
      if (!grouped.has(entry.category)) grouped.set(entry.category, []);
      grouped.get(entry.category).push(entry);
    });

    const order = (resourcesData.categories || []).map(c => c.id);

    [...grouped.entries()]
      .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
      .forEach(([categoryId, categoryEntries]) => {
        const category = resourcesData.categories
          .find(c => c.id === categoryId);

        const section = document.createElement("section");
        section.className = "resources-view-section";

        section.innerHTML = `
          <div class="resources-view-section-head">
            <h3>${escapeHtml(category?.name || categoryId)}</h3>
            <span>${categoryEntries.length}</span>
          </div>
          <div class="resources-view-grid"></div>
        `;

        const grid = section.querySelector(".resources-view-grid");

        categoryEntries.forEach(entry => {
          const lessonLabel = entry.lessons?.length
            ? `LESSON ${entry.lessons.join(", ")}`
            : "REFERENCE";

          const attrs = (entry.attributes || []).map(attr => `
            <div class="resources-view-attribute">
              <code>${escapeHtml(attr.name)}</code>
              <span>${escapeHtml(attr.meaning)}</span>
            </div>
          `).join("");

          const card = document.createElement("article");
          card.className = "resources-view-card";

          card.innerHTML = `
            <div class="resources-view-card-head">
              <code class="resources-view-tag">
                ${escapeHtml(entry.displayName || entry.tag)}
              </code>

              <span class="resources-view-html-badge">
                ${escapeHtml(resourcesData.badge || resourcesData.language || "HTML")}
              </span>

              <span class="resources-view-lesson">
                ${escapeHtml(lessonLabel)}
              </span>
            </div>

            <p class="resources-view-summary">
              ${escapeHtml(entry.summary)}
            </p>

            ${attrs
              ? `<div class="resources-view-attributes">${attrs}</div>`
              : ""
            }

            <div class="resources-view-example">
              <div class="resources-view-example-head">
                <span>EXAMPLE</span>
                <button
                  class="resources-copy-btn"
                  type="button"
                  data-resource-copy="${encodeURIComponent(entry.example || "")}"
                >コピー</button>
              </div>
              <pre><code>${escapeHtml(entry.example)}</code></pre>
            </div>
          `;

          grid.appendChild(card);
        });

        root.appendChild(section);
      });
  }

  function renderWalkthrough() {
    const section = $("#resources-walkthrough");
    if (!section || !resourcesData) return;

    const walkthrough = resourcesData.walkthroughs?.[0];

    if (!walkthrough) {
      section.classList.add("hidden");
      return;
    }

    section.classList.remove("hidden");

    $("#resources-walkthrough-title").textContent = walkthrough.title;
    $("#resources-walkthrough-code").textContent = walkthrough.code;

    const lines = $("#resources-walkthrough-lines");
    lines.replaceChildren();

    (walkthrough.lines || []).forEach(line => {
      const item = document.createElement("div");
      item.className = "resources-walkthrough-line";
      item.innerHTML = `
        <code>${escapeHtml(line.code)}</code>
        <p>${escapeHtml(line.meaning)}</p>
      `;
      lines.appendChild(item);
    });

    $("#resources-walkthrough-summary").innerHTML = `
      <strong>ポイント</strong>
      <p>${escapeHtml(walkthrough.summary || "")}</p>
      <pre>${escapeHtml(walkthrough.structure || "")}</pre>
    `;
  }

  async function copyResourceText(text, button) {
    const originalLabel = button ? button.textContent : "";

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      if (button) {
        button.textContent = "コピー済み";
        button.classList.add("copied");
        setTimeout(() => {
          button.textContent = originalLabel || "コピー";
          button.classList.remove("copied");
        }, 1200);
      }
    } catch (error) {
      console.error(error);

      if (button) {
        button.textContent = "失敗";
        setTimeout(() => {
          button.textContent = originalLabel || "コピー";
        }, 1200);
      }
    }
  }

  function bindResourceCopyButtons() {
    const view = document.getElementById("resources-view");
    if (!view || view.dataset.copyBound) return;

    view.dataset.copyBound = "1";

    view.addEventListener("click", (event) => {
      const button = event.target.closest("[data-resource-copy]");
      if (!button) return;

      const encoded = button.dataset.resourceCopy || "";
      copyResourceText(decodeURIComponent(encoded), button);
    });

    const walkthroughButton =
      document.getElementById("resources-walkthrough-copy");

    if (walkthroughButton) {
      walkthroughButton.addEventListener("click", () => {
        const code =
          document.getElementById("resources-walkthrough-code")?.textContent || "";
        copyResourceText(code, walkthroughButton);
      });
    }
  }

  async function showResourcesView() {
    const view = ensureResourcesView();
    if (!view) return;

    document.querySelectorAll(".view").forEach(item => {
      item.classList.add("hidden");
    });

    view.classList.remove("hidden");

    document.querySelectorAll(".nav-btn").forEach(item => {
      item.classList.toggle(
        "active",
        item.dataset.view === "resources"
      );
    });

    try {
      await loadResourcesData();

      const badge = $("#resources-language-badge");
      if (badge) {
        badge.textContent =
          resourcesData.badge ||
          resourcesData.language ||
          "HTML";
      }

      renderCategories();
      renderEntries();
      renderWalkthrough();

      const search = $("#resources-search");

      if (search && !search.dataset.bound) {
        search.dataset.bound = "1";
        search.addEventListener("input", () => {
          resourcesQuery = search.value;
          renderEntries();
        });
      }
    } catch (error) {
      console.error(error);

      const status = $("#resources-status");
      if (status) {
        status.innerHTML = `
          <div class="resources-view-error">
            ${escapeHtml(error.message)}
          </div>
        `;
      }
    }
  }

  function bindResourcesButton() {
    const button = ensureResourcesButton();
    if (!button || button.dataset.resourcesBound) return;

    button.dataset.resourcesBound = "1";

    button.addEventListener("click", () => {
      // Let app.js finish its normal nav click first,
      // then show the Resources view.
      setTimeout(showResourcesView, 0);
    });
  }

  function init() {
    ensureStylesheet();
    ensureResourcesView();
    bindResourcesButton();
    bindResourceCopyButtons();

    const params = new URLSearchParams(location.search);
    if (params.get("view") === "resources") {
      setTimeout(showResourcesView, 0);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
