# usewiki2-vscode — Agent 指南

面向在本仓库内协作的 AI / 自动化代理。修改代码前请先通读本节。细分规则见 [`.cursor/rules/`](.cursor/rules/)。

## 项目是什么

- **类型**：VS Code 扩展（publisher: `oeyoews`，扩展 id: `usewiki2`）
- **功能**：在 Activity Bar 侧边 Webview 中向本地/远程 **Node.js TiddlyWiki** 发送 tiddler（PUT `recipes/default/tiddlers/...`），支持 i18n、主题同步、撤回编辑等
- **相关**：浏览器版 [usewiki2](https://github.com/oeyoews/usewiki2)；本仓库为其 VS Code 实现

## 仓库结构

```
├── src/                    # 扩展主进程（Node / VS Code API）
│   ├── index.ts            # activate：WebviewViewProvider + 命令注册
│   ├── webviews/           # 侧边栏 HTML + 与 Webview 的消息桥
│   ├── commands/           # 贡献点命令实现
│   ├── config.ts           # workspace.getConfiguration('usewiki2')
│   ├── sendTiddler.ts      # 调用 TW HTTP API
│   └── generated/meta.ts   # 由 vscode-ext-gen 生成，勿手改
├── packages/react/         # Webview UI（Vite + React 19 + Tailwind 4）
│   └── 构建产物 → ../../react-dist/
├── dist/                   # tsdown 输出的扩展入口 index.js
├── l10n/ + package.nls*.json
├── tsdown.config.mts
├── .oxlintrc.json / .oxfmtrc.json
└── pnpm-workspace.yaml     # pnpm 12；allowBuilds / minimumReleaseAge
```

- **双端消息**：扩展侧 `src/utils/extensionMessenger.ts`；Webview 侧 `packages/react/src/utils/WebViewMessenger.ts`（两套文件，改协议时需对齐）
- **配置键**：`package.json` → `contributes.configuration`；TypeScript 常量见 `src/generated/meta.ts`（改 manifest 后跑 `pnpm run update`）

## 技术栈（当前）

| 区域     | 工具                                                                                                      |
| -------- | --------------------------------------------------------------------------------------------------------- |
| 包管理   | pnpm **12**（`packageManager`: `pnpm@12.18.0`）                                                           |
| 扩展打包 | **tsdown** → CJS `dist/index.js`，`vscode` 为 `neverBundle`                                               |
| Webview  | Vite **8**、React **19**、Tailwind **4**（`@tailwindcss/vite` + `tailwind.config.cjs` 经 `@config` 引用） |
| 质量     | **oxlint** / **oxfmt**（无 ESLint / Prettier）                                                            |
| 测试     | Vitest **5**（根目录 `vitest.config.mts`）                                                                |
| 类型     | TypeScript **5.9**；根 `tsc` 仅 `src/` + `test/`，React 用 `packages/react` 的 `tsc -b`                   |
| VS Code  | `engines.vscode` **^1.105.0**；无显式 `activationEvents`（隐式 `onView` / `onCommand`）                   |
| 发布     | `@vscode/vsce` 4.x，`--no-dependencies`                                                                   |

## 常用命令

```bash
corepack enable && corepack prepare pnpm@12.18.0 --activate
pnpm install

pnpm run build          # 仅扩展主进程
pnpm run build:react    # Webview → react-dist/
pnpm run package        # react + vsix
pnpm run dev            # tsdown watch；F5 调试扩展
pnpm run typecheck
pnpm run lint && pnpm run format:check
pnpm run test

# 修改 package.json contributes 后
pnpm run update         # 再生 src/generated/meta.ts
```

**注意**：改 `packages/react` 的 UI 后需 `pnpm run build:react`（或 `package`）再调试，Webview 读的是 `react-dist/`，不是 Vite dev server。

## 启动调试

### 方式 A：IDE（F5）

1. `pnpm install`（首次）
2. `pnpm run build:react`（首次或改过 React）
3. `pnpm run dev`（tsdown watch；或由 F5 的 `preLaunchTask` 自动启动）
4. 运行和调试 → 选 **Extension** → **F5**
5. 在标题含 **`[Extension Development Host]`** 的新窗口中打开侧边栏 **usewiki**

### 方式 B：命令行打开扩展开发宿主

在仓库根目录：

```bash
pnpm run build:react
pnpm run build          # 一次性；或另开终端 pnpm run dev 保持 watch

# Cursor（推荐）
cursor --new-window \
  --extensionDevelopmentPath="$(pwd)" \
  --disable-extensions

# 或 VS Code
code --new-window \
  --extensionDevelopmentPath="$(pwd)" \
  --disable-extensions
```

说明：

- `--extensionDevelopmentPath` 指向本仓库根目录（含 `package.json` 的目录）。
- `--disable-extensions` 与 `.vscode/launch.json` 一致，避免其它扩展干扰调试。
- **不会**自动启动 `tsdown --watch`；改 `src/` 时需另开终端 `pnpm run dev`，或改完后 `pnpm run build` 并在开发宿主里 **Ctrl+Shift+F5** 重载。
- 新窗口左侧 Activity Bar 点 **usewiki**；发送内容前需本机 TiddlyWiki 已启动并配置 `usewiki2.ip` / `usewiki2.port`。

## 扩展开发约定

1. **`vscode` 仅作 external**：不要打进 bundle；禁止在扩展主机里用浏览器 API。
2. **Webview CSP**：在 `src/webviews/index.ts` 维护完整 `Content-Security-Policy`；静态资源用 `webview.asWebviewUri` + nonce script。
3. **订阅与泄漏**：`resolveWebviewView` 里对 `workspace.onDidChangeConfiguration`、`window.onDidChangeActiveColorTheme` 等须在 `webviewView.onDidDispose` 中 `dispose`。
4. **注册 Webview**：使用 `retainContextWhenHidden: true`，避免侧边栏隐藏后 React 状态丢失。
5. **本地化**：扩展侧用 `vscode` 的 `l10n.t`；Webview 侧用 `react-i18next` + `packages/react/src/locales/`。设置项 `usewiki2.lang` 与 Webview 语言需一致。
6. **改配置 / 命令 / 视图 id**：先改 `package.json`，再 `pnpm run update`，并同步 `README` 里由工具生成的表格（若项目仍维护该段）。

## 代码风格

- 提交前：`oxlint`（可用 `lint:fix`）、`oxfmt`（根目录配置忽略 `dist/`、`react-dist/`、`node_modules/`）。
- React：oxlint `react` 插件较严；VS Code `postMessage` 等「仅 mount 一次」的 `useEffect` 可用 `oxlint-disable` 块并注明原因。
- 最小 diff：不问不修；不要顺带大改无关依赖或 README。

## 调试与打包

- 启动方式见上文 **启动调试**（F5 或 `cursor`/`code --extensionDevelopmentPath`）。
- `.vscode/launch.json`：Extension Host，`preLaunchTask` 为 `npm: dev`（tsdown watch）。
- 打包入口：`main` = `./dist/index.js`；`files` 含 `dist`、`react-dist`、`res`、`l10n`、nls json。
- CI（`.github/workflows/release.yml`）：pnpm 12 → lint / format / typecheck / test → `pnpm run package`；tag 时发 release。

## Git / 发布

- **不要**除非用户明确要求：commit、push、`vsce publish`、改 version。
- 发版流程由用户触发：`pnpm run release`（bumpp + publish）。

## 容易踩坑

| 问题                             | 说明                                                                          |
| -------------------------------- | ----------------------------------------------------------------------------- |
| pnpm install 报 `IGNORED_BUILDS` | 确认 `pnpm-workspace.yaml` 中 `allowBuilds` 含 `esbuild`、`@vscode/vsce-sign` |
| `typecheck` 扫到 react 源码      | 根 `tsconfig.json` 应 `exclude: packages`                                     |
| Tailwind 图标类名                | 依赖 `@egoist/tailwindcss-icons` + `tailwind.config.cjs` 的 `iconsPlugin`     |
| 文件名 `featchData.ts`           | 历史拼写，重命名需全仓库引用一起改                                            |

## 代理任务检查清单

- [ ] 动 `package.json` contributes → `pnpm run update`
- [ ] 动 React UI → `build:react` 或完整 `package`
- [ ] 动扩展 TS → `build` + `typecheck`
- [ ] 提交前 → lint、format:check、test（用户要求提交时再执行）
