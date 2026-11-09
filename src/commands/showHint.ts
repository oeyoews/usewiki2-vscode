/** 侧栏标题栏「使用说明」：模态展示完整操作提示（l10n）。 */
import { window } from "vscode";
import { t } from "../localize";

export const name = "usewiki2.showHint";

export function cli() {
  void window.showInformationMessage(t("sidebar.hint"), { modal: true });
}
