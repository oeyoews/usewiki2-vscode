# Usewiki2

![alt text](https://github.com/oeyoews/usewiki2-vscode/raw/main/banner.png)
> TiddlyWiki AnyWhere. 快速发送文本保存到Tiddlywiki, 随时随地记录下你的想法.

> [usewiki2](https://github.com/oeyoews/usewiki2) 浏览器扩展的 的 vscode 插件

<!--
* manage: https://marketplace.visualstudio.com/manage/publishers/oeyoews
* publish: https://vscode.github.net.cn/api/working-with-extensions/publishing-extension
* https://code.visualstudio.com/api/extension-guides/webview
* icon: https://code.visualstudio.com/api/references/icons-in-labels
-->

## prerequisites

* vscode

> [!WARNING]
> 你必须有一个可以在线或本地访问nodejs tiddlywiki实例.

## Features

* 快速发送文本到 TiddlyWiki
* 配置丰富
* 支持声音提示
* ...


## Install

* 直接在vscode 的扩展里面搜索 `usewiki2` 或者直接点击 [安装](#https://marketplace.visualstudio.com/items?itemName=oeyoews.usewiki2) 即可

## Usage

* 点击侧边栏出现的小猫图片， 点击右上方的齿轮图标， 请先配置你的TiddlyWiki地址.

## Commands

<!-- commands -->

| Command                 | Title                              |
| ----------------------- | ---------------------------------- |
| `usewiki2.tiddlywiki`   | UseWiki2: Add Journal              |
| `usewiki2.wikiinfo`     | Usewiki2: Info                     |
| `usewiki2.openwiki`     | Usewiki2: Open TiddlyWiki Instance |
| `usewiki2.opensettings` | Usewiki2: Settings                 |

<!-- commands -->

## Configurations

<!-- configs -->

| Key                        | Description                                                                                    | Type      | Default                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------- | --------- | ----------------------------------------- |
| `usewiki2.enableSendSound` | 启用发送声音                                                                                         | `boolean` | `false`                                   |
| `usewiki2.placeholder`     | 默认提示符                                                                                          | `string`  | `"Write something... Ctrl+Enter to save"` |
| `usewiki2.defaultTag`      | 默认标签                                                                                           | `string`  | `"Journal"`                               |
| `usewiki2.defaultUsername` | 默认用户名                                                                                          | `string`  | `""`                                      |
| `usewiki2.ip`              | 你的TiddlyWiki地址 (请确定你已经启动了[太微](https://tiddlywiki.com/#Installing%20TiddlyWiki%20on%20Node.js)) | `string`  | `"127.0.0.1"`                             |
| `usewiki2.port`            | 端口 (请确定你已经启动了太微)                                                                               | `number`  | `8080`                                    |
| `usewiki2.enableHttps`     | Enable or Disable HTTPS(untest for https)                                                      | `boolean` | `false`                                   |
| `usewiki2.type`            | 选择要使用的文本格式 (Markdown 或 TiddlyWiki)                                                             | `string`  | `"text/vnd.tiddlywiki"`                   |
<!-- ## TODO

* [ ] 加入条目标题配置, author
* [x] use vue/react framework to refactor usewiki2 -->

## For Dev

```bash
pnpm install
pnpm dev ## and press `F5` to debug
```

<!-- * configuration: https://code.visualstudio.com/api/references/contribution-points#contributes.configuration -->

<!-- ## Credits

https://github.com/microsoft/vscode-extension-samples/blob/main/webview-view-sample -->

## Related Projects

* [usewiki2](https://github.com/oeyoews/usewiki2)
* [other tiddlywiki projects](https://github.com/stars/oeyoews/lists/tiddlywiki)
