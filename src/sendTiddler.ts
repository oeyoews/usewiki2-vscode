/**
 * 向 Node.js TiddlyWiki 写入 tiddler：`PUT /recipes/default/tiddlers/{title}`。
 * 保存前检查同名条目；成功后通知可提供「撤回重写」（DELETE + 恢复草稿）。
 */
import { notify } from "./notify";
import { defaultTag, defaultUsername, getType } from "./config";
import { t } from "./localize";
import { tiddlerExists, tiddlerRecipeUrl, tiddlerBagDeleteUrl, TW_HEADERS } from "./tiddlerApi";
import { askTiddlerTitleOnSend, draftTemplateForTitle } from "./tiddlerTitle";
import { window } from "vscode";

type SendTiddlerHooks = {
  onUndoEdit?: (draft: string) => void;
};

/** @returns 是否已成功保存（用户取消覆盖或失败时为 false） */
export default async function sendTiddler(
  title: string,
  text: string,
  hooks?: SendTiddlerHooks,
): Promise<boolean> {
  const onUndoEdit = hooks?.onUndoEdit;
  const UNDO_REWRITE = t("Undo And Rewrite");
  const OVERWRITE = t("composer.titleOverwrite");
  const EDIT_TITLE = t("composer.titleEdit");

  let resolvedTitle = title;

  try {
    while (await tiddlerExists(resolvedTitle)) {
      // showWarningMessage 自带「取消」，勿再传取消项，否则会出现两个取消按钮
      const choice = await window.showWarningMessage(
        `${t("composer.titleExists")}「${resolvedTitle}」`,
        { modal: true },
        OVERWRITE,
        EDIT_TITLE,
      );
      if (choice === EDIT_TITLE) {
        const next = await askTiddlerTitleOnSend(resolvedTitle);
        if (!next) {
          return false;
        }
        resolvedTitle = next;
        continue;
      }
      if (choice !== OVERWRITE) {
        return false;
      }
      break;
    }
  } catch (error) {
    notify((error as Error).message, "error");
    return false;
  }

  const restoreDraft = draftTemplateForTitle(resolvedTitle, text);

  const time = new Date().toISOString().split(".").shift()!.replace(/\D/g, "");
  const tiddler: ITiddler = {
    created: time,
    modified: time,
    tags: [defaultTag()],
    creator: defaultUsername(),
    type: getType(),
    text,
    title: resolvedTitle,
  };

  const url = tiddlerRecipeUrl(resolvedTitle);
  const headers = {
    "Content-Type": "application/json",
    ...TW_HEADERS,
  };
  const requestTimeoutMs = 30_000;

  async function undoAndRewrite() {
    const deleteUrl = tiddlerBagDeleteUrl(resolvedTitle);
    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: TW_HEADERS,
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    if (response.status === 204) {
      onUndoEdit?.(restoreDraft);
    } else {
      notify(t("send.undoFailed", { title: resolvedTitle }), "error");
    }
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(tiddler),
      signal: AbortSignal.timeout(requestTimeoutMs),
    });

    if (response.status === 204) {
      notify(`${t("Successfully Sent")}(${resolvedTitle})`, "info", [UNDO_REWRITE]).then((data) => {
        if (data === UNDO_REWRITE) {
          void undoAndRewrite();
        }
      });
      return true;
    }
    notify(t("Send Failed"), "error");
    return false;
  } catch (error) {
    notify((error as Error).message, "error");
    return false;
  }
}
