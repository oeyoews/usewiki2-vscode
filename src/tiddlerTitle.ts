/**
 * 保存时询问标题；撤回编辑时还原草稿结构。
 */
import { t } from "./localize";
import { window } from "vscode";

/** 撤回编辑写回：标题行 + 正文。 */
export function draftTemplateForTitle(title: string, body: string): string {
  return `${title}\n\n${body}`;
}

/** 从撤回缓存解析（兼容旧格式）。 */
export function splitFirstLineTitle(draft: string): { title: string; text: string } {
  const normalized = draft.replace(/\r\n/g, "\n");
  const newline = normalized.indexOf("\n");
  if (newline === -1) {
    return { title: "", text: normalized.trim() };
  }
  const title = normalized.slice(0, newline).trim();
  const text = normalized.slice(newline + 1).replace(/^\n+/, "");
  return { title, text };
}

/** 发送前填写 Wiki 标题；取消则返回 undefined。 */
export async function askTiddlerTitleOnSend(initialValue?: string): Promise<string | undefined> {
  const input = await window.showInputBox({
    title: t("composer.titlePrompt"),
    prompt: t("composer.titlePromptDetail"),
    value: initialValue,
    ignoreFocusOut: true,
    validateInput: (value) => {
      if (!value?.trim()) {
        return t("composer.titleRequired");
      }
      return undefined;
    },
  });
  if (input === undefined) {
    return undefined;
  }
  return input.trim();
}
