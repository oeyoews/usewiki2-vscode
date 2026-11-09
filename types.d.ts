/** Node.js TiddlyWiki `/status` 响应片段。 */
interface ITiddlyWikiStatus {
  tiddlywiki_version: string;
  username: string;
}

type INotifyType = "info" | "warning" | "error";

/** PUT `/recipes/default/tiddlers/...` 请求体字段（与 TW5 JSON 格式对齐）。 */
interface ITiddler {
  title: string;
  text: string;
  created: Date | string;
  tags?: string[];
  type: "text/markdown" | "text/vnd.tiddlywiki";
  creator?: string;
  modified?: Date | string;
}
