/**
 * 打开/聚焦草稿标签，读取发送正文；不负责 placeholder（见 composerPlaceholder）。
 */
import { getComposerUri, isComposerUri, type ComposerFileSystemProvider } from "./composerFs";
import { refreshComposerPlaceholder } from "./composerPlaceholder";
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

  async open(content?: string) {
    if (content !== undefined) {
      this.fs.setText(content);
    }

    const uri = getComposerUri();
    // 切换界面语言后关闭旧文件名的标签，避免同一份草稿开两个 URI
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
      // 首次打开占一侧栏位；已在该标签内则保持当前列
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

  /** 优先读可见编辑器缓冲，以便未保存的编辑也能发送。 */
  getDraftText(): string {
    const editor = window.visibleTextEditors.find((e) => isComposerUri(e.document.uri));
    if (editor) {
      return editor.document.getText();
    }
    return this.fs.getText();
  }

  async clearAfterSend() {
    this.fs.setText("");
  }

  async restoreAfterUndoEdit(text: string) {
    await this.open(text);
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
