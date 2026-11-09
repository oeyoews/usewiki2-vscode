/**
 * 扩展入口：注册虚拟草稿 FS、侧栏树、占位装饰、命令与状态栏。
 * 不再在侧栏可见时自动打开草稿（避免点 Activity Bar 就新开标签）。
 */
import { SidebarTreeProvider } from "./views/sidebarTree";
import { ComposerFileSystemProvider } from "./composer/composerFs";
import { ComposerSession } from "./composer/composerSession";
import { registerComposerPlaceholder } from "./composer/composerPlaceholder";

import * as openWiki from "./commands/openWikiCmd";
import * as wikiInfo from "./commands/wikiInfo";
import * as opensetting from "./commands/openSettings";
import * as openComposer from "./commands/openComposer";
import * as sendToWiki from "./commands/sendToWiki";
import * as showHint from "./commands/showHint";
import { type ExtensionContext, window, commands, workspace, StatusBarAlignment } from "vscode";
import { isComposerUri } from "./composer/composerFs";
import { t } from "./localize";

type ExtensionCommand = {
  name: string;
  cli: (...args: unknown[]) => unknown;
};

export async function activate(context: ExtensionContext) {
  const composerFs = new ComposerFileSystemProvider(context);
  context.subscriptions.push(
    workspace.registerFileSystemProvider("usewiki-compose", composerFs, {
      isCaseSensitive: true,
      isReadonly: false,
    }),
  );

  const composer = new ComposerSession(composerFs);
  openComposer.bindComposer(composer);
  sendToWiki.bindComposer(composer);
  registerComposerPlaceholder(context);

  const tree = new SidebarTreeProvider();
  const treeView = window.createTreeView("usewiki2.sidebar", {
    treeDataProvider: tree,
    showCollapseAll: false,
  });
  context.subscriptions.push(treeView);

  const statusBar = window.createStatusBarItem(StatusBarAlignment.Right, 80);
  statusBar.command = "usewiki2.sendToWiki";
  context.subscriptions.push(statusBar);

  /** 侧栏标题、状态栏、树节点走 l10n/bundle（随 VS Code 界面语言，非 package.nls 设置页）。 */
  const applyLocalizedChrome = () => {
    treeView.title = t("view.sidebarTitle");
    statusBar.text = t("status.sendHint");
    statusBar.tooltip = t("status.sendTooltip");
    tree.refresh();
  };

  /** 仅当焦点在草稿标签上时显示「保存到 TiddlyWiki」状态栏入口。 */
  const syncStatusBar = () => {
    const editor = window.activeTextEditor;
    if (editor && isComposerUri(editor.document.uri)) {
      statusBar.show();
    } else {
      statusBar.hide();
    }
  };

  applyLocalizedChrome();
  syncStatusBar();

  context.subscriptions.push(window.onDidChangeActiveTextEditor(syncStatusBar));

  const cmds: ExtensionCommand[] = [
    opensetting,
    wikiInfo,
    openWiki,
    openComposer,
    sendToWiki,
    showHint,
  ];

  for (const cmd of cmds) {
    context.subscriptions.push(commands.registerCommand(cmd.name, cmd.cli));
  }
}
