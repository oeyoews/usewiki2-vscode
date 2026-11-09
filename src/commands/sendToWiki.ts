/** 从草稿取正文并调用 sendTiddler；空内容时提示并聚焦草稿。 */
import sendTiddler from "../sendTiddler";
import type { ComposerSession } from "../composer/composerSession";
import { t } from "../localize";
import { window } from "vscode";

let session: ComposerSession | undefined;

export function bindComposer(s: ComposerSession) {
  session = s;
}

export const name = "usewiki2.sendToWiki";

export async function cli() {
  const text = session?.getDraftText().trim() ?? "";
  if (!text) {
    void window.showWarningMessage(t("composer.empty"));
    await session?.open();
    return;
  }
  await sendTiddler(text, {
    onUndoEdit: (value) => session?.restoreAfterUndoEdit(value),
  });
  await session?.clearAfterSend();
  await session?.open();
}
