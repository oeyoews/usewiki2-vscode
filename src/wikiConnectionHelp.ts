/**
 * 连接失败时引导用户修改端口并重载窗口。
 */
import { commands, window } from "vscode";
import { config, getPort } from "./config";
import { t } from "./localize";

export async function offerWikiPortRecovery(message?: string): Promise<void> {
  const configurePort = t("wiki.configurePort");
  const choice = await window.showErrorMessage(
    message ?? t("wiki.status.offlineHint"),
    configurePort,
  );
  if (choice !== configurePort) {
    return;
  }
  const port = await window.showInputBox({
    prompt: t("wiki.portPrompt"),
    value: getPort().toString(),
  });
  if (!port) {
    return;
  }
  const parsed = Number(port);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    void window.showWarningMessage(t("wiki.portInvalid"));
    return;
  }
  await config().update("port", parsed, true);
  const restart = t("wiki.reloadWindow");
  const restartChoice = await window.showInformationMessage(t("wiki.portUpdated"), restart);
  if (restartChoice === restart) {
    await commands.executeCommand("workbench.action.reloadWindow");
  }
}
