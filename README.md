# Usewiki2

> TiddlyWiki AnyWhere — 在 VS Code / Cursor 里快速写条目，保存到你的 TiddlyWiki。

浏览器扩展 [usewiki2](https://github.com/oeyoews/usewiki2) 的编辑器版本：原生侧栏 + 草稿编辑区，通过 Node.js TiddlyWiki HTTP API 写入 tiddler。

## 前置条件

你需要一个可访问的 [Node.js TiddlyWiki](https://tiddlywiki.com/#Installing%20TiddlyWiki%20on%20Node.js) 实例（本地或远程），并确认服务已启动。

## 功能

- Activity Bar 侧栏，一键打开草稿编辑区
- `Ctrl+Enter`（macOS：`Cmd+Enter`）保存到 TiddlyWiki
- 默认连接 `127.0.0.1:8080`，可在设置中修改地址 / 端口 / HTTPS
- 首次安装提示用法
- 支持撤回重写
- Markdown / WikiText 保存格式
- 中英文界面

## 使用

1. 启动 Node.js TiddlyWiki（默认本机 `127.0.0.1:8080`；若不同，打开扩展设置修改服务器地址与端口）。
2. 首次安装激活后会弹出简要提示。
3. 点击 Activity Bar 的 **usewiki** → **写新条目**，书写正文后按 **Ctrl+Enter** / **Cmd+Enter**，或点状态栏 / 工具栏保存。
4. 保存时填写条目标题；默认标签为 `Journal`。

也可通过命令面板搜索：`写新条目`、`保存到 TiddlyWiki`、`扩展设置`、`使用说明`。

## 设置

| 设置项                     | 说明                           | 默认值                |
| -------------------------- | ------------------------------ | --------------------- |
| `usewiki2.ip`              | TiddlyWiki 服务器地址          | `127.0.0.1`           |
| `usewiki2.port`            | HTTP(S) 端口                   | `8080`                |
| `usewiki2.enableHttps`     | 是否使用 HTTPS                 | `false`               |
| `usewiki2.defaultTag`      | 保存时的默认标签               | `Journal`             |
| `usewiki2.defaultUsername` | 服务端需要身份时的用户名       | （空）                |
| `usewiki2.type`            | 保存格式：Markdown 或 WikiText | `text/vnd.tiddlywiki` |

侧栏标题栏的齿轮也可直接打开本扩展设置。

## 相关

- [usewiki2 浏览器扩展](https://github.com/oeyoews/usewiki2)
- [更多 TiddlyWiki 相关项目](https://github.com/stars/oeyoews/lists/tiddlywiki)
