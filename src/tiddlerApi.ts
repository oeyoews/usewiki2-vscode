/**
 * Node.js TiddlyWiki HTTP 辅助：拼接地址、探测 tiddler 是否已存在。
 */
import { wikiServerUrl } from "./wikiUrl";

const TW_HEADERS = {
  "x-requested-with": "TiddlyWiki",
} as const;

const STATUS_TIMEOUT_MS = 15_000;

export function tiddlerRecipeUrl(title: string): string {
  return `${wikiServerUrl()}/recipes/default/tiddlers/${encodeURIComponent(title)}`;
}

export function tiddlerBagDeleteUrl(title: string): string {
  return `${wikiServerUrl()}/bags/default/tiddlers/${encodeURIComponent(title)}`;
}

export { TW_HEADERS };

/** `GET /recipes/default/tiddlers/{title}` 返回 200 即表示已存在。 */
export async function tiddlerExists(title: string): Promise<boolean> {
  const response = await fetch(tiddlerRecipeUrl(title), {
    method: "GET",
    headers: TW_HEADERS,
    signal: AbortSignal.timeout(STATUS_TIMEOUT_MS),
  });
  if (response.status === 404) {
    return false;
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} when checking title`);
  }
  return true;
}
