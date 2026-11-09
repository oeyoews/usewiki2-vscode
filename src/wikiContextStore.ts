import { t } from "./localize";
import { isWikiServerConfigured } from "./wikiServerReady";
import {
  buildWikiContextFromStatus,
  buildWikiContextOffline,
  pingWikiStatus,
  type WikiContextSnapshot,
} from "./wikiContext";

type Listener = (snapshot: WikiContextSnapshot) => void;

/** 缓存最近一次探测结果，供侧栏与状态栏订阅。 */
export class WikiContextStore {
  private snapshot: WikiContextSnapshot = buildWikiContextOffline();
  private readonly listeners = new Set<Listener>();
  private refreshInFlight: Promise<void> | undefined;

  getSnapshot(): WikiContextSnapshot {
    return this.snapshot;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => this.listeners.delete(listener);
  }

  private publish(next: WikiContextSnapshot) {
    this.snapshot = next;
    for (const listener of this.listeners) {
      listener(next);
    }
  }

  /** 先用配置刷新文案，再异步探测连接。 */
  refresh(): Promise<void> {
    if (this.refreshInFlight) {
      return this.refreshInFlight;
    }
    this.publish(buildWikiContextOffline());
    this.refreshInFlight = (async () => {
      if (!isWikiServerConfigured()) {
        this.publish(buildWikiContextFromStatus(null, t("wiki.status.offlineHint")));
        return;
      }
      const data = await pingWikiStatus();
      this.publish(
        buildWikiContextFromStatus(data, data ? undefined : t("wiki.status.offlineHint")),
      );
    })().finally(() => {
      this.refreshInFlight = undefined;
    });
    return this.refreshInFlight;
  }
}
