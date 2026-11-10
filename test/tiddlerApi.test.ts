import { describe, expect, it, vi, afterEach } from "vitest";

vi.mock("../src/config", () => ({
  enableHttps: () => false,
  getIp: () => "127.0.0.1",
  getPort: () => 8080,
}));

import { tiddlerExists, tiddlerRecipeUrl } from "../src/tiddlerApi";

describe("tiddlerRecipeUrl", () => {
  it("encodes title in path", () => {
    expect(tiddlerRecipeUrl("a/b")).toContain(encodeURIComponent("a/b"));
  });
});

describe("tiddlerExists", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false on 404", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 404, ok: false }));
    await expect(tiddlerExists("missing")).resolves.toBe(false);
  });

  it("returns true on 200", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 200, ok: true }));
    await expect(tiddlerExists("exists")).resolves.toBe(true);
  });
});
