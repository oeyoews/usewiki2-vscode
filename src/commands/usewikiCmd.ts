// import fetchData from '../featchData';
import * as vscode from 'vscode';
import sendTiddler from '../sendTiddler';
import { defaultTag, getType, defaultUsername } from '../config';
import { notify } from '../notify';

export const name = 'usewiki2.tiddlywiki';
export async function cli() {
  // const newdata = await fetchData();
  const random = Math.random().toString(36).slice(2);
  let title = new Date().toLocaleString().split(' ').shift() + '-' + random;
  const time = new Date().toISOString().split('.').shift()!.replace(/\D/g, '');

  const text = await vscode.window.showInputBox({
    title: '书写太微之书',
    placeHolder: '输入你的内容',
    prompt: '请输入你的内容',
  });

  if (!text) {
    notify('请输入文本', 'warning');
    return;
  }

  const tiddler: ITiddler = {
    created: time,
    modified: time,
    tags: [defaultTag()],
    creator: defaultUsername(),
    type: getType(),
    text,
    title,
  };

  sendTiddler(tiddler);
}
