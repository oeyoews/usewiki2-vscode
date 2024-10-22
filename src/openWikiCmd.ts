import * as vscode from 'vscode';
import { getIp, getPort, enableHttps } from './config';

export function cli() {
  const protocal = enableHttps() ? 'https' : 'http';
  const url = `${protocal}://${getIp()}:${getPort()}`;

  vscode.env.openExternal(vscode.Uri.parse(url));
}

export const name = 'usewiki2.openwiki';
