/**
 * 向 Node.js TiddlyWiki 写入 tiddler：`PUT /recipes/default/tiddlers/{title}`。
 * 成功后通知支持撤回（DELETE）或撤回并恢复草稿编辑。
 */
import { notify } from "./notify";
import { defaultTag, getPort, getIp, defaultUsername, getType, enableHttps } from "./config";
import { t } from "./localize";

type SendTiddlerHooks = {
  onUndoEdit?: (text: string) => void;
};

export default async function sendTiddler(text: string, hooks?: SendTiddlerHooks) {
  const onUndoEdit = hooks?.onUndoEdit;
  const UNDO = t("Undo");
  const UNDOEDIT = t("Undo And Edit");
  const port = getPort();
  const ip = getIp();
  const protocal = enableHttps() ? "https" : "http";

  // 标题：ISO 日期前缀 + 随机后缀，降低碰撞概率
  const random = Math.random().toString(36).slice(2);
  let title = new Date().toISOString().split("T")[0].replace("-", "/") + "-" + random;
  const time = new Date().toISOString().split(".").shift()!.replace(/\D/g, "");
  const tiddler: ITiddler = {
    created: time,
    modified: time,
    tags: [defaultTag()],
    creator: defaultUsername(),
    type: getType(),
    text,
    title,
  };

  const url = `${protocal}://${ip}:${port}/recipes/default/tiddlers/${title}`;
  const headers = {
    "Content-Type": "application/json",
    "x-requested-with": "TiddlyWiki",
  };

  async function undoSendTiddler() {
    const url = `${protocal}://${ip}:${port}/bags/default/tiddlers/${title}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (response.status === 204) {
      notify(`${t("Successfully Undone")}(${title})`, "info");
    } else {
      notify(`撤回失败${title}`, "error");
    }
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(tiddler),
    });

    if (response.status === 204) {
      notify(`${t("Successfully Sent")}(${title})`, "info", [UNDO, UNDOEDIT]).then((data) => {
        if (data === UNDO) {
          undoSendTiddler();
        } else if (data === UNDOEDIT) {
          void undoSendTiddler();
          onUndoEdit?.(text);
        }
      });
    } else {
      notify(t("Send Failed"), "error");
    }
  } catch (error) {
    notify((error as Error).message, "error");
    throw Error((error as Error).message);
  }
}
