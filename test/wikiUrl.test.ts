import { describe, expect, it, vi } from "vitest";

vi.mock("../src/config", () => ({
  enableHttps: () => false,
  getIp: () => "127.0.0.1",
  getPort: () => 8080,
}));

import { wikiServerUrl } from "../src/wikiUrl";

describe("wikiServerUrl", () => {
  it("builds http base url", () => {
    expect(wikiServerUrl()).toBe("http://127.0.0.1:8080");
  });
});
