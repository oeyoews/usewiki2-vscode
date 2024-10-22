import * as vscode from 'vscode';

export async function cli() {
  // 居中弹窗显示详情
  vscode.window
    .showInformationMessage('wikiinfo', 'version', 'username')
    .then((selection) => {
      // if (selection === '选项1') {
      // vscode.window.showInformationMessage('你选择了选项1');
      // }
    });
}

export const name = 'usewiki2.wikiinfo';
