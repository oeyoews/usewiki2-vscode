/** 按配置的 IP/端口与 HTTPS 开关在系统浏览器打开 Wiki 根地址。 */
import { env, Uri } from "vscode";
import { getIp, getPort, enableHttps } from "../config";
import { ensureWikiServerConfigured } from "../wikiServerReady";

export async function cli() {
  if (!(await ensureWikiServerConfigured())) {
    return;
  }
  const protocal = enableHttps() ? "https" : "http";
  const url = `${protocal}://${getIp()}:${getPort()}`;

  await env.openExternal(Uri.parse(url));
}

export const name = "usewiki2.openwiki";
