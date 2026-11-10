/**
 * TiddlyWiki 服务根地址（无尾斜杠）。
 */
import { enableHttps, getIp, getPort } from "./config";

export function wikiServerUrl(): string {
  const protocol = enableHttps() ? "https" : "http";
  return `${protocol}://${getIp()}:${getPort()}`;
}
