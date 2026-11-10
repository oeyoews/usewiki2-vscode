/**
 * 侧栏/状态栏展示的 Wiki 连接与配置摘要；`GET /status` 静默探测。
 */
import { defaultTag, getIp, getPort, getType } from "./config";
import { t } from "./localize";
import { wikiServerUrl } from "./wikiUrl";

export { wikiServerUrl };

export type WikiConnectionStatus = "checking" | "connected" | "offline";

export type WikiContextSnapshot = {
  serverUrl: string;
  defaultTag: string;
  saveFormat: string;
  statusLabel: string;
  statusDetail: string;
  statusIcon: "check" | "error" | "loading~spin";
  connectionStatus: WikiConnectionStatus;
};

function saveFormatLabel(): string {
  return getType() === "text/markdown" ? "Markdown" : "WikiText";
}

export function buildWikiContextOffline(): WikiContextSnapshot {
  return {
    serverUrl: wikiServerUrl(),
    defaultTag: defaultTag(),
    saveFormat: saveFormatLabel(),
    statusLabel: t("wiki.status.checking"),
    statusDetail: "",
    statusIcon: "loading~spin",
    connectionStatus: "checking",
  };
}

export function buildWikiContextFromStatus(
  data: ITiddlyWikiStatus | null,
  error?: string,
): WikiContextSnapshot {
  const base = {
    serverUrl: wikiServerUrl(),
    defaultTag: defaultTag(),
    saveFormat: saveFormatLabel(),
  };
  if (data?.tiddlywiki_version) {
    return {
      ...base,
      statusLabel: t("wiki.status.connected"),
      statusDetail: `TiddlyWiki ${data.tiddlywiki_version} · ${data.username}`,
      statusIcon: "check",
      connectionStatus: "connected",
    };
  }
  return {
    ...base,
    statusLabel: t("wiki.status.offline"),
    statusDetail: error ?? "",
    statusIcon: "error",
    connectionStatus: "offline",
  };
}

const STATUS_TIMEOUT_MS = 15_000;

/** 不弹通知，仅供 UI 刷新。 */
export async function pingWikiStatus(): Promise<ITiddlyWikiStatus | null> {
  const url = `${wikiServerUrl()}/status`;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(STATUS_TIMEOUT_MS) });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as ITiddlyWikiStatus;
    return data.tiddlywiki_version ? data : null;
  } catch {
    return null;
  }
}

export function composerStatusBarText(snapshot: WikiContextSnapshot): string {
  return `$(globe) ${getIp()}:${getPort()} · ${snapshot.defaultTag}`;
}

export function composerStatusBarTooltip(snapshot: WikiContextSnapshot): string {
  const lines = [
    snapshot.serverUrl,
    `${t("sidebar.infoTag")}: ${snapshot.defaultTag}`,
    `${t("sidebar.infoFormat")}: ${snapshot.saveFormat}`,
    snapshot.statusDetail || snapshot.statusLabel,
    t("sidebar.infoSaveTitle"),
    t("status.sendTooltip"),
  ];
  return lines.filter(Boolean).join("\n");
}
