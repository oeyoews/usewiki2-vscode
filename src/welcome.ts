/**
 * 首次安装与版本升级时以通知形式提示（非模态）。
 */
import type { ExtensionContext } from "vscode";
import { commands as vscodeCommands, window } from "vscode";
import { commands } from "./generated/meta";
import { t } from "./localize";

const WELCOME_KEY = "usewiki2.hasShownWelcome";
const VERSION_KEY = "usewiki2.lastKnownVersion";

async function maybeShowWelcome(context: ExtensionContext): Promise<void> {
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
    await vscodeCommands.executeCommand(commands.openComposer);
  } else if (choice === openSettings) {
    await vscodeCommands.executeCommand(commands.opensettings);
  }
}

async function notifyUpgrade(context: ExtensionContext, version: string): Promise<void> {
  const viewHint = t("welcome.viewHint");
  const openSettings = t("wiki.openSettings");
  const choice = await window.showInformationMessage(
    t("welcome.upgraded", { version }),
    viewHint,
    openSettings,
  );
  if (choice === viewHint) {
    await vscodeCommands.executeCommand(commands.showHint);
  } else if (choice === openSettings) {
    await vscodeCommands.executeCommand(commands.opensettings);
  }
}

/** 激活时：升级优先于首次欢迎；最后写入当前版本号。 */
export async function notifyExtensionLifecycle(context: ExtensionContext): Promise<void> {
  const current = context.extension.packageJSON.version;
  const previous = context.globalState.get<string>(VERSION_KEY);

  if (previous !== undefined && previous !== current) {
    await notifyUpgrade(context, current);
  } else {
    await maybeShowWelcome(context);
  }

  await context.globalState.update(VERSION_KEY, current);
}
