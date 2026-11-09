/** 请求 `/status` 并弹窗展示 TiddlyWiki 版本与用户名（命令面板可用）。 */
import { window } from "vscode";
import fetchData from "../featchData";

export async function cli() {
  const data = await fetchData();
  window.showInformationMessage(`TiddlyWiki5: ${data.tiddlywiki_version}(${data.username})`);
}

export const name = "usewiki2.wikiinfo";
