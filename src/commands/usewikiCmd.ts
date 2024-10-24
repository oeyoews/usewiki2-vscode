// import fetchData from '../featchData';
import * as vscode from 'vscode';
import sendTiddler from '../sendTiddler';
import { notify } from '../notify';

export const name = 'usewiki2.tiddlywiki';
export async function cli() {
  const text = await vscode.window.showInputBox({
    title: '书写太微之书',
    placeHolder: '输入你的内容',
    prompt: '请输入你的内容',
  });

  if (!text) {
    notify('请输入文本', 'warning');
    return;
  }

  sendTiddler(text);
}
