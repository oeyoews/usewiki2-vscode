import * as vscode from 'vscode';
import { getIp, getPort, enableHttps } from './config';

export default async function openWikiCmd() {
  const protocal = enableHttps() ? 'https' : 'http';
  const url = `${protocal}://${getIp()}:${getPort()}`;

  vscode.env.openExternal(vscode.Uri.parse(url));
}

export const openWikiCli = 'usewiki2.openwiki';
