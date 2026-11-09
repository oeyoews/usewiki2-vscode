/**
 * 窗口重载后关闭非当前语言/历史路径的草稿标签，避免虚拟 FS 路径不一致打不开编辑器。
 */
import { getComposerUri, isComposerUri } from "./composerFs";
import { TabInputText, window, type Tab } from "vscode";

export async function closeStaleComposerTabs(): Promise<boolean> {
  const canonical = getComposerUri().toString();
  const toClose: Tab[] = [];
  let hadComposerTab = false;

  for (const group of window.tabGroups.all) {
    for (const tab of group.tabs) {
      if (tab.input instanceof TabInputText && isComposerUri(tab.input.uri)) {
        hadComposerTab = true;
        if (tab.input.uri.toString() !== canonical) {
          toClose.push(tab);
        }
      }
    }
  }

  if (toClose.length > 0) {
    await window.tabGroups.close(toClose, true);
  }

  return hadComposerTab;
}
