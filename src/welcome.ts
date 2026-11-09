/**
 * 首次激活时提示默认服务器与基本用法（globalState 只弹一次）。
 */
import type { ExtensionContext } from "vscode";
import { commands, window } from "vscode";
import { t } from "./localize";

const WELCOME_KEY = "usewiki2.hasShownWelcome";

export async function maybeShowWelcome(context: ExtensionContext): Promise<void> {
  if (context.globalState.get(WELCOME_KEY)) {
    return;
  }
  await context.globalState.update(WELCOME_KEY, true);

  const openComposer = t("sidebar.focusComposer");
  const openSettings = t("wiki.openSettings");
  const choice = await window.showInformationMessage(
    t("welcome.firstInstall"),
    openComposer,
    openSettings,
  );
  if (choice === openComposer) {
    await commands.executeCommand("usewiki2.openComposer");
  } else if (choice === openSettings) {
    await commands.executeCommand("usewiki2.opensettings");
  }
}
