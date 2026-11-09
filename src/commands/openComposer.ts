/** 打开或聚焦虚拟草稿文档（由 ComposerSession 处理分列与占位）。 */
import type { ComposerSession } from "../composer/composerSession";

let session: ComposerSession | undefined;

export function bindComposer(s: ComposerSession) {
  session = s;
}

export const name = "usewiki2.openComposer";

export async function cli() {
  await session?.open();
}
