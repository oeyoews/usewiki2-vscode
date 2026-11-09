/**
 * 打开/聚焦草稿标签，读取发送正文；不负责 placeholder（见 composerPlaceholder）。
 */
import { getComposerUri, isComposerUri, type ComposerFileSystemProvider } from "./composerFs";
import { refreshComposerPlaceholder } from "./composerPlaceholder";
import { splitFirstLineTitle } from "../tiddlerTitle";
import {
  TabInputText,
  window,
  workspace,
  ViewColumn,
  type Tab,
  type TextEditor,
  type Uri,
} from "vscode";

export class ComposerSession {
  constructor(private readonly fs: ComposerFileSystemProvider) {}

  /** 打开空草稿（固定「新条目」标签）。 */
  async openNew(): Promise<void> {
    this.fs.clearDraft();
    await this.open();
  }

  async open(content?: string) {
    if (content !== undefined) {
      const { text } = splitFirstLineTitle(content);
      this.fs.setText(text);
    }

    const uri = getComposerUri();
    await closeComposerTabsExcept(uri);

    const doc = await workspace.openTextDocument(uri);

    const tabOpen = window.tabGroups.all.some((group) =>
      group.tabs.some(
        (tab) => tab.input instanceof TabInputText && tab.input.uri.toString() === uri.toString(),
      ),
    );

    let editor: TextEditor;
    if (tabOpen) {
      editor = await window.showTextDocument(doc, { preview: false, preserveFocus: false });
    } else {
      const beside =
        window.activeTextEditor?.document.uri.toString() === uri.toString()
          ? ViewColumn.Active
          : ViewColumn.Beside;

      editor = await window.showTextDocument(doc, {
        viewColumn: beside,
        preview: false,
        preserveFocus: false,
      });
    }

    refreshComposerPlaceholder(editor);
  }

  getDraftText(): string {
    const editor = window.visibleTextEditors.find((e) => isComposerUri(e.document.uri));
    if (editor) {
      return editor.document.getText();
    }
    return this.fs.getText();
  }

  async clearAfterSend() {
    this.fs.clearDraft();
  }

  async restoreAfterUndoEdit(text: string) {
    const { text: body } = splitFirstLineTitle(text);
    await this.open(body);
  }
}

async function closeComposerTabsExcept(keep: Uri): Promise<void> {
  const toClose: Tab[] = [];
  for (const group of window.tabGroups.all) {
    for (const tab of group.tabs) {
      if (tab.input instanceof TabInputText && isComposerUri(tab.input.uri)) {
        if (tab.input.uri.toString() !== keep.toString()) {
          toClose.push(tab);
        }
      }
    }
  }
  if (toClose.length > 0) {
    await window.tabGroups.close(toClose, true);
  }
}
