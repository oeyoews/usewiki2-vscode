/** 按配置的 IP/端口与 HTTPS 开关在系统浏览器打开 Wiki 根地址。 */
import { env, Uri } from "vscode";
import { wikiServerUrl } from "../wikiUrl";
import { commands } from "../generated/meta";
import { ensureWikiServerConfigured } from "../wikiServerReady";

export const name = commands.openwiki;

export async function cli(): Promise<void> {
  if (!(await ensureWikiServerConfigured())) {
    return;
  }
  await env.openExternal(Uri.parse(wikiServerUrl()));
}
