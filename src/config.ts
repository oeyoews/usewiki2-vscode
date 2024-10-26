import * as vscode from 'vscode';

export const config = () => vscode.workspace.getConfiguration('usewiki2');
// export const placeholder = () => config().get('placeholder', '');
export const enableSendSound = () => config().get('enableSendSound', false);

export const enableHttps = () => config().get('enableHttps', false);
export const defaultTag = () => config().get('defaultTag', 'Journal');
export const defaultUsername = () => config().get('defaultUsername', '');
export const getLang = () => config().get('lang', 'en');
export const getIp = () => config().get('ip', 'localhost');
export const getPort = () => config().get('port', 8080);
export const getType = (): ITiddler['type'] =>
  config().get('type', 'text/vnd.tiddlywiki');
