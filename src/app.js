import { races, categories, projectInfo } from "./data.js";

const app = document.querySelector("#app");
let selectedCategory = "全部";
let searchTerm = "";

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const raceById = (id) => races.find((race) => race.id === id);

function topLabel(kicker, title, copy = "") {
  return `<div class="section-heading"><div><p class="eyebrow">${kicker}</p><h2>${title}</h2></div>${copy ? `<p class="section-copy">${copy}</p>` : ""}</div>`;
}

function renderHome() {
  const query = searchTerm.trim().toLowerCase();
  const visible = races.filter((race) => {
    const matchesCategory = selectedCategory === "全部" || race.family.includes(selectedCategory);
    const searchable = `${race.name} ${race.romanized} ${race.modName} ${race.summary} ${race.tags.join(" ")}`.toLowerCase();
    return matchesCategory && (!query || searchable.includes(query));
  });

  app.innerHTML = `
    <section class="hero">
      <div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div>
      <div class="hero-copy">
        <p class="eyebrow hero-eyebrow"><span class="status-dot"></span> 社区模组资料计划 · 中文首发</p>
        <h1>在边缘世界，<br /><em>遇见新的族群。</em></h1>
        <p class="hero-description">从六个广受玩家喜爱的种族模组开始，整理玩法特色、前置依赖与相关扩展。由玩家共同维护，持续核对版本。</p>
        <a class="button button-primary" href="#index">浏览种族档案 <span>↓</span></a>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="planet-ring ring-a"></div><div class="planet-ring ring-b"></div>
        <div class="planet-core"><span>R</span></div>
        <div class="orbit-label label-a"><i></i> 六个种族专题</div>
        <div class="orbit-label label-b"><i></i> 玩家协作档案</div>
        <span class="star star-a">✳</span><span class="star star-b">✦</span><span class="star star-c">·</span>
      </div>
      <div class="hero-meta"><span>资料状态 <b>持续整理</b></span><span>收录范围 <b>社区种族模组</b></span><span>游戏版本 <b>${projectInfo.gameVersion}</b></span></div>
    </section>

    <section class="index-section" id="index">
      ${topLabel("RACE INDEX / 01", "种族档案", "先从六个代表性种族开始。打开专题，查看本体内容、依赖条件与扩展模组。")}
      <div class="filter-row">
        <div class="category-filters" role="group" aria-label="按种族类别筛选">${categories.map((category) => `<button class="filter-chip ${selectedCategory === category ? "selected" : ""}" data-category="${category}">${category}</button>`).join("")}</div>
        <label class="search-box"><span aria-hidden="true">⌕</span><input id="race-search" type="search" placeholder="搜索种族、模组或特色" value="${escapeHtml(searchTerm)}" /><kbd>↵</kbd></label>
      </div>
      <div class="race-grid">${visible.length ? visible.map(renderRaceCard).join("") : `<div class="empty-state"><strong>没有找到匹配的种族</strong><span>试试其他关键词或清除筛选条件。</span></div>`}</div>
      <div class="results-note"><span class="tiny-dot"></span> 显示 ${visible.length} / ${races.length} 个种族专题</div>
    </section>

    <section class="principles-section">
      ${topLabel("HOW WE DOCUMENT / 02", "资料有据，版本清楚", "模组会持续更新，Wiki 也需要清晰说明资料来自哪里、适用于什么版本。")}
      <div class="principle-grid">
        <article class="principle-card"><span class="principle-number">01</span><h3>以作者页面为准</h3><p>功能、DLC 与前置要求优先引用模组作者的工坊页面，并标明来源。</p></article>
        <article class="principle-card"><span class="principle-number">02</span><h3>区分确认与反馈</h3><p>把已核实信息和玩家报告分开记录，避免把单次体验当作确定结论。</p></article>
        <article class="principle-card"><span class="principle-number">03</span><h3>记录版本日期</h3><p>页面显示适用版本与核对时间，版本变化后方便贡献者复查。</p></article>
      </div>
    </section>

    <section class="contribute-banner">
      <div class="contribute-icon" aria-hidden="true">✳</div>
      <div><p class="eyebrow">COMMUNITY BUILT</p><h2>一起把模组资料补完整。</h2><p>发现过期链接、缺少的扩展或版本变化？欢迎提交修订，让下一位玩家少翻几页工坊评论。</p></div>
      <a class="button button-light" href="#/about">查看编辑方式 <span>↗</span></a>
    </section>
  `;

  app.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    renderHome();
    document.querySelector("#race-search")?.focus({ preventScroll: true });
  }));
  const input = document.querySelector("#race-search");
  input?.addEventListener("input", (event) => {
    searchTerm = event.target.value;
    const cursor = event.target.selectionStart;
    renderHome();
    const nextInput = document.querySelector("#race-search");
    nextInput?.focus({ preventScroll: true });
    nextInput?.setSelectionRange(cursor, cursor);
  });
}

function renderRaceCard(race) {
  return `<a class="race-card accent-${race.accent}" href="#/race/${race.id}">
    <div class="card-topline"><span class="card-family">${race.family}</span><span class="card-arrow" aria-hidden="true">↗</span></div>
    <div class="race-emblem"><span>${race.symbol}</span><i></i><i></i></div>
    <div class="race-title"><div><h3>${race.name}</h3><span class="romanized">${race.romanized} <span>·</span> ${race.modName}</span></div><span class="card-index">0${races.indexOf(race) + 1}</span></div>
    <p class="race-summary">${race.summary}</p>
    <div class="tag-row">${race.tags.slice(0, 3).map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    <div class="card-footer"><span>游戏版本 ${race.gameVersions.slice(-2).join(" / ")}</span><span class="read-link">查看档案 <b>→</b></span></div>
  </a>`;
}

function renderRace(id) {
  const race = raceById(id);
  if (!race) return renderNotFound();
  app.innerHTML = `
    <div class="article-wrap accent-${race.accent}">
      <div class="breadcrumbs"><a href="#/">种族索引</a><span>/</span><span>${race.name}</span></div>
      <section class="article-hero">
        <div class="article-mark"><span>${race.symbol}</span><i></i><i></i></div>
        <div class="article-heading"><p class="eyebrow">${race.family} / RACE DOSSIER</p><h1>${race.name}<span>${race.romanized}</span></h1><p>${race.summary}</p><div class="article-actions"><a class="button button-primary" href="${race.workshop}" target="_blank" rel="noreferrer">打开 Steam 工坊 <span>↗</span></a><a class="text-link" href="#addons">查看相关模组 ↓</a></div></div>
        <div class="article-stamp"><span class="stamp-symbol">✳</span><span>档案编号<br /><b>RW · ${race.workshopId.slice(-4)}</b></span></div>
      </section>
      <div class="article-layout">
        <article class="article-body">
          <div class="notice"><span>i</span><p>${race.sourceNote}</p></div>
          <section class="article-section"><p class="eyebrow">OVERVIEW / 01</p><h2>种族简介</h2><p class="lead-paragraph">${race.intro}</p></section>
          <section class="article-section"><p class="eyebrow">FEATURES / 02</p><h2>模组内容</h2><div class="feature-list">${race.highlights.map((item, index) => `<div class="feature-row"><span class="feature-index">0${index + 1}</span><p>${item}</p><span class="feature-check">✓</span></div>`).join("")}</div></section>
          <section class="article-section" id="addons"><div class="section-heading compact"><div><p class="eyebrow">ADD-ONS / 03</p><h2>相关模组</h2></div><span class="section-count">${race.addons.length} 条已整理</span></div>
            ${race.addons.length ? `<div class="addon-list">${race.addons.map((addon) => `<a class="addon-row" href="${addon.url}" target="_blank" rel="noreferrer"><span class="addon-icon">＋</span><span class="addon-copy"><b>${addon.name}</b><small>${addon.note}</small></span><span class="addon-type">${addon.type}</span><span class="addon-arrow">↗</span></a>`).join("")}</div>` : `<div class="pending-card"><span class="pending-icon">⌁</span><div><b>扩展列表正在整理</b><p>收录者会补充基因、派系、剧情、外观和兼容补丁，并标清依赖关系。</p></div></div>`}
          </section>
          <section class="article-section"><p class="eyebrow">CONTRIBUTE / 04</p><h2>补充这篇档案</h2><p class="body-copy">欢迎帮助核对版本、补充关联模组或报告兼容性。提交内容请附工坊链接、游戏版本和可复现的说明。</p><a class="inline-link" href="https://github.com/Amekainebula/rimworld-mods-wiki/issues/new" target="_blank" rel="noreferrer">在 GitHub 提交修订建议 ↗</a></section>
        </article>
        <aside class="facts-card"><div class="facts-header"><span>MOD PROFILE</span><span class="profile-dot"></span></div><h2>${race.modName}</h2><p class="facts-race">${race.name} · ${race.romanized}</p><a class="source-link" href="${race.workshop}" target="_blank" rel="noreferrer">Steam Workshop <span>↗</span></a>
          <div class="fact-block"><span class="fact-label">适用游戏版本</span><div class="fact-chips">${race.gameVersions.map((version) => `<span class="fact-chip ${version === "1.6" ? "current" : ""}">${version}</span>`).join("")}</div></div>
          <div class="fact-block"><span class="fact-label">前置模组</span><div class="fact-values">${race.requirements.length ? race.requirements.map((item) => `<span>${item}</span>`).join("") : `<span class="muted-value">工坊页未列出前置模组</span>`}</div></div>
          <div class="fact-block"><span class="fact-label">所需 DLC</span><div class="fact-chips">${race.dlc.length ? race.dlc.map((item) => `<span class="fact-chip dlc">${item}</span>`).join("") : `<span class="muted-value">工坊页未列出 DLC 要求</span>`}</div></div>
          <div class="fact-block"><span class="fact-label">内容标签</span><div class="fact-chips">${race.tags.map((tag) => `<span class="fact-chip">${tag}</span>`).join("")}</div></div>
          <div class="fact-date"><span>最近核对</span><b>${projectInfo.checkedAt}</b></div>
        </aside>
      </div>
      <nav class="article-next" aria-label="相邻种族档案"><a href="#/race/${races[(races.indexOf(race) + races.length - 1) % races.length].id}">← 上一个专题 <b>${races[(races.indexOf(race) + races.length - 1) % races.length].name}</b></a><a href="#/race/${races[(races.indexOf(race) + 1) % races.length].id}">下一个专题 <b>${races[(races.indexOf(race) + 1) % races.length].name} →</b></a></nav>
    </div>`;
}

function renderAbout() {
  app.innerHTML = `<div class="about-wrap"><div class="breadcrumbs"><a href="#/">种族索引</a><span>/</span><span>收录原则</span></div><section class="about-hero"><p class="eyebrow">PROJECT NOTES / 01</p><h1>让模组资料<br /><em>容易查，也容易改。</em></h1><p>边缘种族档案是面向中文玩家的 RimWorld 社区模组资料项目。首期聚焦六个种族模组，以作者公开资料为基础，由玩家共同补充和校正。</p></section>
    <div class="about-grid"><article class="about-panel"><span class="panel-index">01 / SOURCES</span><h2>资料从哪里来</h2><p>模组功能、版本与依赖优先引用 Steam 工坊、作者 GitHub 或作者维护的文档。玩家反馈会注明版本与验证状态。</p><a href="${projectInfo.officialWiki}" target="_blank" rel="noreferrer">另见 RimWorld 中文 Wiki ↗</a></article><article class="about-panel"><span class="panel-index">02 / EDITING</span><h2>怎么参与编辑</h2><p>欢迎补充漏收录的扩展模组、更新失效链接、报告页面过期信息。提交时请附来源和游戏版本，便于其他人复核。</p><a href="https://github.com/Amekainebula/rimworld-mods-wiki/issues/new" target="_blank" rel="noreferrer">创建修订建议 ↗</a></article><article class="about-panel"><span class="panel-index">03 / SCOPE</span><h2>首期收录范围</h2><p>鼠族、沃芬族、米利拉族、美狐族、绮罗族、月兔族。后续是否扩展，由资料完整度和社区维护能力决定。</p><a href="#/">回到种族索引 ↗</a></article><article class="about-panel"><span class="panel-index">04 / LICENSE</span><h2>开放与尊重作者</h2><p>本站代码按 MIT 许可证开源。模组名称、作品与素材仍归原作者所有；本站以链接和文字摘要为主，不重新分发模组文件或未经许可的素材。</p><a href="https://github.com/Amekainebula/rimworld-mods-wiki/blob/main/LICENSE" target="_blank" rel="noreferrer">查看许可证 ↗</a></article></div>
    <div class="reference-note"><span>参考说明</span><p>本站借鉴了 <a href="${projectInfo.officialWiki}" target="_blank" rel="noreferrer">RimWorld 中文 Wiki</a> 的分类导航和社区共建方式，内容与设计独立编写，不代表官方 Wiki。</p></div></div>`;
}

function renderNotFound() {
  app.innerHTML = `<section class="not-found"><span class="not-found-code">404</span><h1>这份档案还没建立。</h1><p>返回种族索引，继续浏览已收录的专题。</p><a class="button button-primary" href="#/">返回首页 <span>↗</span></a></section>`;
}

function route() {
  const path = location.hash.replace(/^#/, "") || "/";
  if (path === "/") renderHome();
  else if (path === "/about") renderAbout();
  else if (path.startsWith("/race/")) renderRace(path.split("/")[2]);
  else renderNotFound();
  window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("hashchange", route);
route();
