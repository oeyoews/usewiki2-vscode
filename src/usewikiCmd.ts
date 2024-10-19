import fetchData from './featchData';
import * as vscode from 'vscode';
import sendTiddler from './sendTiddler';
import { getType } from './config';

export const usewikiCli = 'usewiki2.tiddlywiki';
export default async function usewikiCmd() {
  const newdata = await fetchData();
  const random = Math.random().toString(36).slice(2);
  let title = new Date().toLocaleString().split(' ').shift() + '-' + random;
  const time = new Date().toISOString().split('.').shift()!.replace(/\D/g, '');

  const text = await vscode.window.showInputBox({
    title: '书写太微之书',
    placeHolder: '输入你的内容',
    prompt: '请输入你的内容',
  });

  if (!text) {
    // notify('输入取消', 'warning')
    return;
  }

  const tiddler: ITiddler = {
    created: time,
    modified: time,
    tags: ['Journal'],
    creator: newdata.username || '',
    type: getType(),
    text,
    title,
  };

  sendTiddler(tiddler);
}
