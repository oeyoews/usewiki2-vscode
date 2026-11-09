/**
 * Node.js TiddlyWiki HTTP 辅助：拼接地址、探测 tiddler 是否已存在。
 */
import { enableHttps, getIp, getPort } from "./config";

const TW_HEADERS = {
  "x-requested-with": "TiddlyWiki",
} as const;

function baseUrl(): string {
  const protocal = enableHttps() ? "https" : "http";
  return `${protocal}://${getIp()}:${getPort()}`;
}

export function tiddlerRecipeUrl(title: string): string {
  return `${baseUrl()}/recipes/default/tiddlers/${encodeURIComponent(title)}`;
}

export function tiddlerBagDeleteUrl(title: string): string {
  return `${baseUrl()}/bags/default/tiddlers/${encodeURIComponent(title)}`;
}

export { TW_HEADERS };

/** `GET /recipes/default/tiddlers/{title}` 返回 200 即表示已存在。 */
export async function tiddlerExists(title: string): Promise<boolean> {
  const response = await fetch(tiddlerRecipeUrl(title), {
    method: "GET",
    headers: TW_HEADERS,
  });
  if (response.status === 404) {
    return false;
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} when checking title`);
  }
  return true;
}
