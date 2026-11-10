/** 请求 `/status` 并弹窗展示 TiddlyWiki 版本与用户名（命令面板可用）。 */
import { window } from "vscode";
import { commands } from "../generated/meta";
import { t } from "../localize";
import { pingWikiStatus } from "../wikiContext";
import { offerWikiPortRecovery } from "../wikiConnectionHelp";
import { ensureWikiServerConfigured } from "../wikiServerReady";

export const name = commands.wikiinfo;

export async function cli(): Promise<void> {
  if (!(await ensureWikiServerConfigured())) {
    return;
  }

  const data = await pingWikiStatus();
  if (data) {
    await window.showInformationMessage(
      t("wiki.infoDetail", {
        version: data.tiddlywiki_version,
        username: data.username,
      }),
      { modal: true },
    );
    return;
  }

  await offerWikiPortRecovery();
}
