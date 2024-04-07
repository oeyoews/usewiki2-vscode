import * as vscode from 'vscode'

export const config = vscode.workspace.getConfiguration('usewiki2');

export const getPort = () => config.get('port', 8080)