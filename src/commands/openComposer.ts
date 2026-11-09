/** 打开固定「新条目」草稿（不要求先填标题）。 */
import type { ComposerSession } from "../composer/composerSession";

let session: ComposerSession | undefined;

export function bindComposer(s: ComposerSession) {
  session = s;
}

export const name = "usewiki2.openComposer";

export async function cli() {
  await session?.openNew();
}
