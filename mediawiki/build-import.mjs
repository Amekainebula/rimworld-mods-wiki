import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createHash } from "node:crypto";

const directory = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(directory, "../src/data.js"), "utf8");
const { races, projectInfo } = await import("data:text/javascript;base64," + Buffer.from(source).toString("base64"));

const xml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
})[char]);

const row = (label, value) => `|-
! scope="row" | ${label}
| ${value}`;
const external = (url, label) => `[${url} ${label}]`;

function article(race) {
  const table = [
    '{| class="wikitable" style="float:right; width:300px; max-width:100%; margin:0 0 1em 1.4em;"',
    `|+ '''${race.name}'''`,
    row("模组", race.modName),
    row("种族类别", `[[:Category:${race.family}|${race.family}]]`),
    row("游戏版本", race.gameVersions.join("、")),
    row("前置模组", race.requirements.length ? race.requirements.join("、") : "工坊页未列出"),
    row("所需 DLC", race.dlc.length ? race.dlc.join("、") : "工坊页未列出"),
    row("工坊页面", external(race.workshop, "Steam Workshop")),
    row("核对日期", projectInfo.checkedAt),
    "|}"
  ].join("\n");
  const addons = race.addons.length
    ? race.addons.map((addon) => `* ${external(addon.url, addon.name)}（${addon.type}）：${addon.note}`).join("\n")
    : "暂无已整理的相关扩展模组。";
  return `${table}
'''${race.name}'''（${race.romanized}）是《边缘世界》社区模组“${race.modName}”加入的种族。${race.summary}

== 概述 ==
${race.intro}

${race.sourceNote}

== 模组内容 ==
${race.highlights.map((item) => `* ${item}`).join("\n")}

== 安装需求 ==
* '''前置模组：'''${race.requirements.length ? race.requirements.join("、") : "工坊页未列出"}
* '''所需 DLC：'''${race.dlc.length ? race.dlc.join("、") : "工坊页未列出"}
* '''适用游戏版本：'''${race.gameVersions.join("、")}

订阅前请以作者最新的工坊说明为准。

== 相关扩展 ==
${addons}

== 资料来源 ==
* ${external(race.workshop, `${race.modName} — Steam Workshop`)}（核对日期：${projectInfo.checkedAt}）

[[Category:种族模组]]
[[Category:${race.family}]]
`;
}

const home = `= 欢迎来到边缘世界模组维基 =
这里整理《边缘世界》社区种族模组的中文资料。目前收录六个种族条目。读者可以从下方列表或[[:Category:种族模组|种族模组分类]]进入条目。

== 种族条目 ==
${races.map((race) => `* [[${race.name}]]（${race.modName}）——${race.summary}`).join("\n")}

== 参与编辑 ==
登录后打开条目，点击“编辑”即可使用可视化编辑器。修订模组信息时，请附原始来源、适用游戏版本和核对日期。

== 关于本站 ==
本站由玩家维护，与 Ludeon Studios、灰机 Wiki 及模组作者无隶属关系。另见[https://rimworld.huijiwiki.com/wiki/首页 RimWorld 中文 Wiki]。
`;

const pages = [
  { title: "首页", ns: 0, text: home },
  { title: "Main Page", ns: 0, text: "#REDIRECT [[首页]]", redirect: "首页" },
  ...races.map((race) => ({ title: race.name, ns: 0, text: article(race) })),
  { title: "Category:种族模组", ns: 14, text: "收录《边缘世界》社区种族模组条目。" },
  ...[...new Set(races.map((race) => race.family))].map((family) => ({
    title: `Category:${family}`, ns: 14, text: `收录${family}相关条目。\n\n[[Category:种族模组]]`
  }))
];

const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
function pageXml(page, index) {
  const hash = createHash("sha1").update(page.text, "utf8").digest("hex");
  const sha1 = BigInt("0x" + hash).toString(36);
  return `  <page>
    <title>${xml(page.title)}</title>
    <ns>${page.ns}</ns>
    <id>${index + 1}</id>
    ${page.redirect ? `<redirect title="${xml(page.redirect)}" />\n    ` : ""}<revision>
      <id>${index + 1}</id>
      <timestamp>${timestamp}</timestamp>
      <contributor><username>Amekainebula</username></contributor>
      <comment>从开源静态站迁入初始条目</comment>
      <model>wikitext</model>
      <format>text/x-wiki</format>
      <text xml:space="preserve" bytes="${Buffer.byteLength(page.text, "utf8")}">${xml(page.text)}</text>
      <sha1>${sha1}</sha1>
    </revision>
  </page>`;
}

const output = `<?xml version="1.0" encoding="UTF-8"?>
<mediawiki xmlns="http://www.mediawiki.org/xml/export-0.10/" version="0.10" xml:lang="zh">
  <siteinfo>
    <sitename>边缘世界模组维基</sitename>
    <dbname>rimworldmodswiki</dbname>
    <base>https://wiki.ame-kai.com/wiki/首页</base>
    <generator>MediaWiki import package</generator>
    <case>first-letter</case>
    <namespaces><namespace key="0" case="first-letter" /><namespace key="14" case="first-letter">Category</namespace></namespaces>
  </siteinfo>
${pages.map(pageXml).join("\n")}
</mediawiki>
`;
writeFileSync(resolve(directory, "import.xml"), output, "utf8");
console.log(`生成 ${pages.length} 个页面：mediawiki/import.xml`);

