import * as vscode from 'vscode';

export const config = vscode.workspace.getConfiguration('usewiki2');

export const enableHttps = () => config.get('enableHttps', false);
export const getIp = () => config.get('ip', 'localhost');
export const getPort = () => config.get('port', 8080);
export const getType = (): ITiddler['type'] =>
  config.get('type', 'text/vnd.tiddlywiki');
