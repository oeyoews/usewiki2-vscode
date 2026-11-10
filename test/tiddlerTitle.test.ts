import { describe, expect, it, vi } from "vitest";

vi.mock("vscode", () => ({
  env: { language: "en" },
  workspace: {
    getConfiguration: () => ({
      get: (_key: string, defaultValue: unknown) => defaultValue,
    }),
  },
}));

vi.mock("../src/localize", () => ({
  t: (key: string) => key,
}));

import { draftTemplateForTitle, splitFirstLineTitle } from "../src/tiddlerTitle";

describe("splitFirstLineTitle", () => {
  it("parses title and body", () => {
    expect(splitFirstLineTitle("Hello\n\nBody")).toEqual({
      title: "Hello",
      text: "Body",
    });
  });

  it("handles single line as body only", () => {
    expect(splitFirstLineTitle("only body")).toEqual({
      title: "",
      text: "only body",
    });
  });

  it("normalizes CRLF", () => {
    expect(splitFirstLineTitle("Title\r\n\r\nLine two")).toEqual({
      title: "Title",
      text: "Line two",
    });
  });
});

describe("draftTemplateForTitle", () => {
  it("wraps body for undo restore", () => {
    expect(draftTemplateForTitle("T", "content")).toBe("T\n\ncontent");
  });
});
