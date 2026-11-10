/**
 * 保存 / 打开 Wiki 前检查 `usewiki2.ip` 与 `usewiki2.port` 是否已填写。
 */
import { commands as vscodeCommands, window } from "vscode";
import { getIp, getPort } from "./config";
import { commands } from "./generated/meta";
import { t } from "./localize";

const OPEN_SETTINGS = t("wiki.openSettings");

export function isWikiServerConfigured(): boolean {
  const ip = getIp().trim();
  const port = getPort();
  return ip.length > 0 && Number.isInteger(port) && port > 0 && port <= 65535;
}

/** 未配置时提示并可跳转设置；已配置返回 true。 */
export async function ensureWikiServerConfigured(): Promise<boolean> {
  if (isWikiServerConfigured()) {
    return true;
  }
  const choice = await window.showWarningMessage(
    t("wiki.configRequired"),
    { modal: true },
    OPEN_SETTINGS,
  );
  if (choice === OPEN_SETTINGS) {
    await vscodeCommands.executeCommand(commands.opensettings);
  }
  return false;
}
