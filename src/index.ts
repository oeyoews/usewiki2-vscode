/**
 * 扩展入口：注册虚拟草稿 FS、侧栏树、占位装饰、命令与状态栏。
 */
import { SidebarTreeProvider } from "./views/sidebarTree";
import { ComposerFileSystemProvider, getComposerUri, isComposerUri } from "./composer/composerFs";
import { ComposerSession } from "./composer/composerSession";
import { registerComposerPlaceholder } from "./composer/composerPlaceholder";
import { closeStaleComposerTabs } from "./composer/reconcileTabs";
import { WikiContextStore } from "./wikiContextStore";
import { composerStatusBarText, composerStatusBarTooltip } from "./wikiContext";

import * as openWiki from "./commands/openWikiCmd";
import * as wikiInfo from "./commands/wikiInfo";
import * as opensetting from "./commands/openSettings";
import * as openComposer from "./commands/openComposer";
import * as sendToWiki from "./commands/sendToWiki";
import * as showHint from "./commands/showHint";
import { notifyExtensionLifecycle } from "./welcome";
import { commands as commandIds } from "./generated/meta";
import {
  type ExtensionContext,
  window,
  commands,
  workspace,
  StatusBarAlignment,
  TabInputText,
} from "vscode";
import { t } from "./localize";

type ExtensionCommand = {
  name: string;
  cli: (...args: unknown[]) => unknown;
};

function isCanonicalComposerTabOpen(): boolean {
  const canonical = getComposerUri().toString();
  return window.tabGroups.all.some((g) =>
    g.tabs.some(
      (tab) => tab.input instanceof TabInputText && tab.input.uri.toString() === canonical,
    ),
  );
}

export async function activate(context: ExtensionContext) {
  const wikiContext = new WikiContextStore();

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

  const hadComposer = await closeStaleComposerTabs();
  if (hadComposer && !isCanonicalComposerTabOpen() && composerFs.getText().length > 0) {
    await composer.open();
  }

  const tree = new SidebarTreeProvider(wikiContext);
  const treeView = window.createTreeView("usewiki2.sidebar", {
    treeDataProvider: tree,
    showCollapseAll: false,
  });
  context.subscriptions.push(
    treeView,
    treeView.onDidChangeVisibility((e) => {
      if (e.visible) {
        void wikiContext.refresh();
      }
    }),
  );

  const statusBar = window.createStatusBarItem(StatusBarAlignment.Right, 80);
  statusBar.command = commandIds.sendToWiki;
  context.subscriptions.push(statusBar);

  const contextStatusBar = window.createStatusBarItem(StatusBarAlignment.Left, 20);
  context.subscriptions.push(contextStatusBar);

  const applyContextStatusBar = (snapshot = wikiContext.getSnapshot()) => {
    contextStatusBar.text = composerStatusBarText(snapshot);
    contextStatusBar.tooltip = composerStatusBarTooltip(snapshot);
  };

  wikiContext.subscribe((snapshot) => {
    tree.refresh();
    applyContextStatusBar(snapshot);
  });

  const applyLocalizedChrome = () => {
    treeView.title = t("view.sidebarTitle");
    statusBar.text = t("status.sendHint");
    statusBar.tooltip = t("status.sendTooltip");
    tree.refresh();
    void wikiContext.refresh();
  };

  const syncStatusBar = () => {
    const editor = window.activeTextEditor;
    const inComposer = editor && isComposerUri(editor.document.uri);
    if (inComposer) {
      statusBar.show();
      applyContextStatusBar();
      contextStatusBar.show();
    } else {
      statusBar.hide();
      contextStatusBar.hide();
    }
  };

  applyLocalizedChrome();
  syncStatusBar();

  context.subscriptions.push(
    window.onDidChangeActiveTextEditor(syncStatusBar),
    workspace.onDidChangeConfiguration((e) => {
      if (!e.affectsConfiguration("usewiki2")) {
        return;
      }
      applyLocalizedChrome();
    }),
  );

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

  void wikiContext.refresh();
  void notifyExtensionLifecycle(context);
}
