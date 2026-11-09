/**
 * 读取 `usewiki2.*` 工作区/用户配置；语言映射供 localize 与草稿文件名使用。
 */
import { env, workspace } from "vscode";

export const config = () => workspace.getConfiguration("usewiki2");

export type AppLang = "en" | "zhCN";

/** 与 VS Code 显示语言一致（如 `zh-cn` → `zhCN`）。 */
export function getLang(): AppLang {
  const code = env.language.toLowerCase();
  if (code === "zh-cn" || code.startsWith("zh")) {
    return "zhCN";
  }
  return "en";
}

export const enableHttps = () => config().get("enableHttps", false);
export const defaultTag = () => config().get("defaultTag", "Journal");
export const defaultUsername = () => config().get("defaultUsername", "");
export const getIp = () => config().get("ip", "");
export const getPort = () => config().get("port", 0);
export const getType = (): ITiddler["type"] => config().get("type", "text/vnd.tiddlywiki");
