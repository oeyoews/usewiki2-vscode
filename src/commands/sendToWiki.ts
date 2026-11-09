/** 保存时填写标题，再发送到 Wiki。 */
import sendTiddler from "../sendTiddler";
import type { ComposerSession } from "../composer/composerSession";
import { askTiddlerTitleOnSend } from "../tiddlerTitle";
import { t } from "../localize";
import { ensureWikiServerConfigured } from "../wikiServerReady";
import { window } from "vscode";

let session: ComposerSession | undefined;

export function bindComposer(s: ComposerSession) {
  session = s;
}

export const name = "usewiki2.sendToWiki";

export async function cli() {
  if (!(await ensureWikiServerConfigured())) {
    return;
  }

  const text = session?.getDraftText().trim() ?? "";
  if (!text) {
    void window.showWarningMessage(t("composer.empty"));
    await session?.open();
    return;
  }

  const title = await askTiddlerTitleOnSend();
  if (!title) {
    return;
  }

  const saved = await sendTiddler(title, text, {
    onUndoEdit: (draft) => session?.restoreAfterUndoEdit(draft),
  });
  if (!saved) {
    return;
  }
  await session?.clearAfterSend();
  await session?.openNew();
}
