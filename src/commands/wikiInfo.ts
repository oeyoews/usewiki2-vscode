import * as vscode from 'vscode';
import fetchData from '../featchData';

export async function cli() {
  const data = await fetchData();
  // 居中弹窗显示详情
  vscode.window
    .showInformationMessage(
      `TiddlyWiki5: ${data.tiddlywiki_version}(${data.username})`
    )
    .then((selection) => {
      // if (selection === '选项1') {
      // vscode.window.showInformationMessage('你选择了选项1');
      // }
    });
}

export const name = 'usewiki2.wikiinfo';
