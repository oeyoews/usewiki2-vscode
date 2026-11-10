import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../src/config", () => ({
  defaultTag: () => "Journal",
  enableHttps: () => false,
  getIp: () => "10.0.0.1",
  getPort: () => 3000,
  getType: () => "text/markdown" as const,
}));

vi.mock("../src/localize", () => ({
  t: (key: string) => key,
}));

import { buildWikiContextFromStatus, buildWikiContextOffline } from "../src/wikiContext";

describe("buildWikiContextFromStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("marks connected when status payload is valid", () => {
    const snapshot = buildWikiContextFromStatus({
      tiddlywiki_version: "5.2.0",
      username: "tester",
    });
    expect(snapshot.connectionStatus).toBe("connected");
    expect(snapshot.statusDetail).toContain("5.2.0");
    expect(snapshot.serverUrl).toBe("http://10.0.0.1:3000");
  });

  it("marks offline when status is null", () => {
    const snapshot = buildWikiContextFromStatus(null, "offline");
    expect(snapshot.connectionStatus).toBe("offline");
    expect(snapshot.statusDetail).toBe("offline");
  });
});

describe("buildWikiContextOffline", () => {
  it("starts in checking state", () => {
    const snapshot = buildWikiContextOffline();
    expect(snapshot.connectionStatus).toBe("checking");
    expect(snapshot.saveFormat).toBe("Markdown");
  });
});
