/**
 * 运行时文案：读取 `l10n/bundle.l10n*.json`，语言由 `getLang()`（env.language）决定。
 * 与设置页的 package.nls 无关。
 */
import { getLang } from "./config";
import en from "../l10n/bundle.l10n.json";
import zhCN from "../l10n/bundle.l10n.zh-cn.json";

type MessageKey = keyof typeof en;

const bundles = {
  en,
  zhCN,
} as const satisfies Record<string, Record<MessageKey, string>>;

export function t(key: MessageKey): string {
  const lang = getLang();
  const bundle = lang === "zhCN" ? bundles.zhCN : bundles.en;
  return bundle[key] ?? bundles.en[key] ?? key;
}
