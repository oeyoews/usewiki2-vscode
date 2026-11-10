# usewiki2-vscode — Agent 指南

面向在本仓库内协作的 AI / 自动化代理。修改代码前请先通读本节。细分规则见 [`.cursor/rules/`](.cursor/rules/)。

## 项目是什么

- **类型**：VS Code 扩展（publisher: `oeyoews`，扩展 id: `usewiki2`）
- **功能**：Activity Bar 原生侧栏 + 编辑器草稿，向本地/远程 **Node.js TiddlyWiki** 发送 tiddler（PUT `recipes/default/tiddlers/...`），支持撤回编辑、设置与命令
- **相关**：浏览器版 [usewiki2](https://github.com/oeyoews/usewiki2)；本仓库为其 VS Code 实现

## 仓库结构

```
├── src/                    # 扩展主进程（Node / VS Code API）
│   ├── index.ts            # activate：TreeView + 命令
│   ├── views/              # 侧栏 TreeDataProvider
│   ├── composer/           # 草稿编辑区（Untitled 文档）
│   ├── commands/           # 贡献点命令
│   ├── config.ts
│   ├── sendTiddler.ts
│   └── generated/meta.ts   # vscode-ext-gen，勿手改
├── dist/                   # tsdown → index.js
├── res/                    # Activity Bar 图标等
├── l10n/ + package.nls*.json
└── tsdown.config.mts
```

- **配置键**：`package.json` → `contributes.configuration`；常量见 `src/generated/meta.ts`（改 manifest 后 `pnpm run update`）

## 技术栈

| 区域     | 工具                                              |
| -------- | ------------------------------------------------- |
| 包管理   | pnpm **12**                                       |
| 扩展打包 | **tsdown** → CJS `dist/index.js`                  |
| UI       | VS Code TreeView、命令、编辑器草稿、`vscode` l10n |
| 质量     | **oxlint** / **oxfmt**                            |
| 测试     | Vitest **5**                                      |
| VS Code  | `engines.vscode` **^1.128.0**                     |

## 常用命令

```bash
pnpm install
pnpm run build
pnpm run dev              # tsdown --watch
pnpm run package
pnpm run typecheck
pnpm run lint
pnpm run open:devhost
pnpm run update           # 改 contributes 后
```

## 启动调试

1. `pnpm run build`（或 `pnpm run dev`）
2. F5 → **Extension (Run)**，或 `pnpm run open:devhost`
3. Activity Bar **usewiki** → 打开编辑区 → **Ctrl+Enter** 保存

## 扩展约定

- `vscode` 仅 external，禁止在扩展主机使用 DOM API
- 本地化：扩展侧 `l10n.t` + `l10n/`、`package.nls*.json`
- 改 `contributes` 后必须 `pnpm run update`

## Git / 发布

除非用户明确要求：**勿 commit / push / 改 version / vsce publish**。
