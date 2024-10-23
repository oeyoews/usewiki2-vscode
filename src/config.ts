import * as vscode from 'vscode';

export const config = () => vscode.workspace.getConfiguration('usewiki2');
// todo
export const placeholder = () => config().get('placeholder', '请输入你的内容');

export const enableHttps = () => config().get('enableHttps', false);
export const defaultTag = () => config().get('defaultTag', 'Journal');
export const defaultUsername = () => config().get('defaultUsername', '');
export const getIp = () => config().get('ip', 'localhost');
export const getPort = () => config().get('port', 8080);
export const getType = (): ITiddler['type'] =>
  config().get('type', 'text/vnd.tiddlywiki');
