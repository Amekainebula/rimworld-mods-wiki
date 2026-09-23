# MediaWiki 迁移包

此目录存放从现有静态网站转换出的 MediaWiki 初始页面。它不会自动上线；须先有一座实际运行的 MediaWiki Wiki。

本机已建立可编辑的 MediaWiki，打开方式见 [本机使用说明.md](本机使用说明.md)。本机程序、数据库和管理员密码位于未提交的 `local-wiki/` 目录。

## 已准备的内容

`import.xml` 包含首页、六个种族条目、分类页面和首页重定向，共 15 页。条目的简介、前置模组、DLC、扩展与来源沿用当前 `src/data.js` 中的资料。图片未包含在导入包中。

`build-import.mjs` 可以在迁移前从 `src/data.js` 重新生成 `import.xml`：

```sh
node mediawiki/build-import.mjs
```

## 建站后导入

1. 先创建一座语言设为中文的 MediaWiki Wiki，并确认可视化编辑器可用。
2. 用 Wiki 管理员账号打开 `Special:Import`，上传 `import.xml`。若托管服务未开放 XML 上传权限，请联系其支持人员导入。
3. 检查「首页」及六个种族条目，确认信息框、分类和来源链接显示正常。
4. 如果导入后「首页」仍显示 MediaWiki 的默认欢迎语，打开「首页」的编辑源代码界面，把 `首页.wiki` 的内容粘贴进去并保存。`Main Page` 页面会重定向到「首页」。
5. 新 Wiki 地址确认后，再将 `wiki.ame-kai.com` 接入托管服务提供的目标地址。DNS 记录的值应以托管服务实际给出的说明为准。

## 迁移后

新 Wiki 的日常编辑在网页上的「编辑」按钮完成；GitHub 中的静态网站不会自动同步这些修改。此导入包只有一次初始修订，不包含旧 GitHub 提交历史。上线后应定期使用 MediaWiki 的导出或托管服务备份功能保存内容。

