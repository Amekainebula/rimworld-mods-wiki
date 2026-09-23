import { races, projectInfo } from "./data.js";

const app = document.querySelector("#app");
const pageSidebar = document.querySelector("#page-sidebar");
const repo = projectInfo.repository;
const sourceUrl = `${repo}/blob/main/src/data.js`;
const historyUrl = `${repo}/commits/main/src/data.js`;
const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const raceLink = (race) => `#/race/${race.id}`;

document.querySelector("#sidebar-races").innerHTML = races.map((race) => `<a href="${raceLink(race)}">${escapeHtml(race.name)}</a>`).join("");
document.querySelector("#site-search").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.querySelector("#search-input").value.trim();
  if (query) location.hash = `/search/${encodeURIComponent(query)}`;
});
document.querySelector("#menu-button").addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  document.querySelector("#menu-button").setAttribute("aria-expanded", String(open));
});

function pageHeader(title, kind = "页面", source = sourceUrl) {
  return `<div class="page-header"><p class="namespace">${kind}</p><h1>${escapeHtml(title)}</h1><div class="page-tabs"><span class="tab-active">阅读</span><a href="${source}" target="_blank" rel="noreferrer">查看源代码</a><a href="${historyUrl}" target="_blank" rel="noreferrer">历史记录</a><a href="${repo}/issues/new" target="_blank" rel="noreferrer">讨论</a></div></div>`;
}

function toc(items) {
  pageSidebar.innerHTML = `<div class="toc"><h2>目录</h2><a href="#main-content">页首</a>${items.map(([id, title], index) => `<a href="#section-${id}"><span>${index + 1}</span> ${title}</a>`).join("")}</div>`;
  pageSidebar.querySelectorAll('a[href^="#section-"]').forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById(link.getAttribute("href").slice(1))?.scrollIntoView({ behavior: "smooth" });
  }));
}

function section(id, title, body) {
  return `<section class="wiki-section" id="section-${id}"><h2>${title}</h2>${body}</section>`;
}

function raceList(items) {
  return `<ul class="article-list">${items.map((race) => `<li><a href="${raceLink(race)}">${escapeHtml(race.name)}</a> <span class="secondary">(${escapeHtml(race.modName)})</span> — ${escapeHtml(race.summary)}</li>`).join("")}</ul>`;
}

function renderHome() {
  document.title = "首页 - 边缘世界模组维基";
  app.innerHTML = `${pageHeader("首页", "维基首页")}
    <div class="welcome"><h2>欢迎来到边缘世界模组维基</h2><p>这里整理 RimWorld 社区种族模组的中文资料。目前收录 <strong>${races.length}</strong> 个种族条目。每个条目列出模组简介、前置需求、相关扩展与原始来源。</p></div>
    <div class="home-columns">
      <div>${section("browse", "浏览种族条目", raceList(races))}</div>
      <aside class="home-panel"><h2>从这里开始</h2><ul><li><a href="#/category/种族模组">种族模组分类</a></li><li><a href="#/about">关于本站与参与编辑</a></li><li><a href="${projectInfo.officialWiki}" target="_blank" rel="noreferrer">RimWorld 中文 Wiki ↗</a></li></ul><p>资料核对日期：${projectInfo.checkedAt}</p></aside>
    </div>
    ${section("categories", "分类", `<p>按种族主题浏览：${[...new Set(races.map((race) => race.family))].map((family) => `<a class="category-pill" href="#/category/${encodeURIComponent(family)}">${family}</a>`).join("")}</p>`)}
    ${section("contribute", "参与编辑", `<p>发现资料缺漏或错误，可以<a href="${repo}/issues/new" target="_blank" rel="noreferrer">报告问题</a>，也可以在 GitHub 上提交修订。请附原始链接、适用游戏版本和核对日期。</p>`)}
  `;
  toc([["browse", "浏览种族条目"], ["categories", "分类"], ["contribute", "参与编辑"]]);
}

function renderInfobox(race) {
  return `<aside class="infobox" aria-label="${escapeHtml(race.name)}模组信息"><div class="infobox-title">${escapeHtml(race.name)}</div><div class="infobox-subtitle">${escapeHtml(race.modName)}</div>
    <div class="infobox-symbol" aria-hidden="true">${escapeHtml(race.symbol)}</div>
    <dl><dt>种族类别</dt><dd><a href="#/category/${encodeURIComponent(race.family)}">${escapeHtml(race.family)}</a></dd>
    <dt>模组名称</dt><dd>${escapeHtml(race.modName)}</dd>
    <dt>游戏版本</dt><dd>${race.gameVersions.map(escapeHtml).join("、")}</dd>
    <dt>前置模组</dt><dd>${race.requirements.length ? race.requirements.map(escapeHtml).join("、") : "工坊页未列出"}</dd>
    <dt>所需 DLC</dt><dd>${race.dlc.length ? race.dlc.map(escapeHtml).join("、") : "工坊页未列出"}</dd>
    <dt>工坊页面</dt><dd><a href="${race.workshop}" target="_blank" rel="noreferrer">Steam Workshop ↗</a></dd>
    <dt>资料核对</dt><dd>${projectInfo.checkedAt}</dd></dl></aside>`;
}

function renderRace(id) {
  const race = races.find((item) => item.id === id);
  if (!race) return renderNotFound();
  document.title = `${race.name} - 边缘世界模组维基`;
  const addons = race.addons.length
    ? `<ul class="article-list">${race.addons.map((addon) => `<li><a href="${addon.url}" target="_blank" rel="noreferrer">${escapeHtml(addon.name)} ↗</a> <span class="secondary">（${escapeHtml(addon.type)}）</span> — ${escapeHtml(addon.note)}</li>`).join("")}</ul>`
    : "<p>暂无已整理的相关扩展模组。</p>";
  app.innerHTML = `<div class="breadcrumbs"><a href="#/">首页</a> › <a href="#/category/种族模组">种族模组</a> › ${escapeHtml(race.name)}</div>
    ${pageHeader(race.name, "种族模组条目")}
    ${renderInfobox(race)}
    <p class="article-intro"><strong>${escapeHtml(race.name)}</strong>（${escapeHtml(race.romanized)}）是《边缘世界》的社区种族模组 <em>${escapeHtml(race.modName)}</em> 所加入的种族。${escapeHtml(race.summary)}<sup><a href="#section-sources">[1]</a></sup></p>
    ${section("overview", "概述", `<p>${escapeHtml(race.intro)}</p><p class="source-note">${escapeHtml(race.sourceNote)}</p>`)}
    ${section("features", "模组内容", `<ul class="article-list">${race.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`)}
    ${section("requirements", "安装需求", `<p><strong>前置模组：</strong>${race.requirements.length ? race.requirements.map(escapeHtml).join("、") : "工坊页未列出"}</p><p><strong>所需 DLC：</strong>${race.dlc.length ? race.dlc.map(escapeHtml).join("、") : "工坊页未列出"}</p><p><strong>适用游戏版本：</strong>${race.gameVersions.map(escapeHtml).join("、")}。订阅前请以作者的最新工坊说明为准。<sup><a href="#section-sources">[1]</a></sup></p>`)}
    ${section("addons", "相关扩展", addons)}
    ${section("sources", "参考资料", `<ol class="references"><li><a href="${race.workshop}" target="_blank" rel="noreferrer">${escapeHtml(race.modName)}，Steam Workshop</a>。本站核对日期：${projectInfo.checkedAt}。</li></ol>`)}
    <div class="category-footer">分类：<a href="#/category/种族模组">种族模组</a> · <a href="#/category/${encodeURIComponent(race.family)}">${escapeHtml(race.family)}</a></div>`;
  toc([["overview", "概述"], ["features", "模组内容"], ["requirements", "安装需求"], ["addons", "相关扩展"], ["sources", "参考资料"]]);
}

function renderCategory(name) {
  const category = decodeURIComponent(name);
  const items = category === "种族模组" ? races : races.filter((race) => race.family === category);
  if (!items.length) return renderNotFound();
  document.title = `分类:${category} - 边缘世界模组维基`;
  app.innerHTML = `<div class="breadcrumbs"><a href="#/">首页</a> › 分类</div>${pageHeader(`分类:${category}`, "分类页面")}
    <p>本分类共有 ${items.length} 个条目。</p>
    ${section("entries", "分类中的页面", raceList(items))}
    <div class="category-footer">上级分类：<a href="#/category/种族模组">种族模组</a></div>`;
  toc([["entries", "分类中的页面"]]);
}

function renderSearch(encodedQuery) {
  const query = decodeURIComponent(encodedQuery).trim();
  const lower = query.toLocaleLowerCase();
  const items = races.filter((race) => [race.name, race.romanized, race.modName, race.family, race.summary, ...race.tags].join(" ").toLocaleLowerCase().includes(lower));
  document.querySelector("#search-input").value = query;
  document.title = `搜索“${query}” - 边缘世界模组维基`;
  app.innerHTML = `${pageHeader(`搜索结果：${query}`, "站内搜索")}<p>找到 ${items.length} 个匹配条目。</p>${items.length ? raceList(items) : "<p>没有找到匹配的条目。可尝试种族中文名称或模组英文名称。</p>"}`;
  pageSidebar.innerHTML = "";
}

function renderAbout() {
  document.title = "关于本站 - 边缘世界模组维基";
  app.innerHTML = `${pageHeader("关于本站")}
    <p>边缘世界模组维基是面向中文玩家的社区资料项目，首期整理六个种族模组。资料以作者公开的工坊页面为主要来源。</p>
    ${section("scope", "收录范围", `<p>目前收录：${races.map((race) => `<a href="${raceLink(race)}">${race.name}</a>`).join("、")}。后续条目按可核对的资料逐步增加。</p>`)}
    ${section("editing", "参与编辑", `<p>本站代码和条目数据存放在 <a href="${repo}" target="_blank" rel="noreferrer">GitHub 仓库</a>。可以<a href="${repo}/issues/new" target="_blank" rel="noreferrer">创建问题</a>报告错误，也可以提交 Pull Request 修改条目。建议提供工坊链接、游戏版本和核对日期。</p><p>页面上的“查看源代码”和“历史记录”会打开 GitHub 中对应的数据文件与提交记录；本站目前由 GitHub 维护修订记录。</p>`)}
    ${section("license", "版权与许可", `<p>网站代码采用 <a href="${repo}/blob/main/LICENSE" target="_blank" rel="noreferrer">MIT 许可证</a>。模组、美术与游戏内容归各自权利人所有。本站与 Ludeon Studios、灰机 Wiki 及模组作者无隶属关系。</p>`)}
    ${section("reference", "相关链接", `<ul class="article-list"><li><a href="${projectInfo.officialWiki}" target="_blank" rel="noreferrer">RimWorld 中文 Wiki ↗</a></li><li><a href="https://www.mediawiki.org/wiki/Skin:Vector/en" target="_blank" rel="noreferrer">MediaWiki Vector 界面说明 ↗</a></li></ul>`)}`;
  toc([["scope", "收录范围"], ["editing", "参与编辑"], ["license", "版权与许可"], ["reference", "相关链接"]]);
}

function renderNotFound() {
  document.title = "页面不存在 - 边缘世界模组维基";
  app.innerHTML = `${pageHeader("页面不存在")}<p>尚无这个条目。请从<a href="#/">首页</a>或<a href="#/category/种族模组">种族模组分类</a>继续浏览。</p>`;
  pageSidebar.innerHTML = "";
}

function route() {
  const path = location.hash.slice(1) || "/";
  if (path === "/") renderHome();
  else if (path === "/about") renderAbout();
  else if (path.startsWith("/race/")) renderRace(path.slice(6));
  else if (path.startsWith("/category/")) renderCategory(path.slice(10));
  else if (path.startsWith("/search/")) renderSearch(path.slice(8));
  else renderNotFound();
  document.body.classList.remove("nav-open");
  document.querySelector("#menu-button").setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
document.addEventListener("click", (event) => {
  const anchor = event.target.closest('a[href^="#section-"]');
  if (!anchor) return;
  event.preventDefault();
  document.getElementById(anchor.getAttribute("href").slice(1))?.scrollIntoView({ behavior: "smooth" });
});
route();
