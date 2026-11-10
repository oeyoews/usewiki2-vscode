/** 打开固定「新条目」草稿（不要求先填标题）。 */
import type { ComposerSession } from "../composer/composerSession";
import { commands } from "../generated/meta";

let session: ComposerSession | undefined;

export function bindComposer(s: ComposerSession) {
  session = s;
}

export const name = commands.openComposer;

export async function cli() {
  await session?.openNew();
}
