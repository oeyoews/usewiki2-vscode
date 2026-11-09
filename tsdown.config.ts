import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  dts: false,
  shims: false,
  fixedExtension: false,
  deps: {
    neverBundle: ["vscode"],
  },
});
