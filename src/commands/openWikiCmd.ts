import { env, Uri } from 'vscode';
import { getIp, getPort, enableHttps } from '../config';

export function cli() {
  const protocal = enableHttps() ? 'https' : 'http';
  const url = `${protocal}://${getIp()}:${getPort()}`;

  env.openExternal(Uri.parse(url));
}

export const name = 'usewiki2.openwiki';
