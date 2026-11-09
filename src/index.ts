import { usewikiViewProvider } from "./webviews";

import * as openWiki from "./commands/openWikiCmd";
import * as wikiInfo from "./commands/wikiInfo";
import * as opensetting from "./commands/openSettings";
import { type ExtensionContext, window, commands } from "vscode";

type ExtensionCommand = {
  name: string;
  cli: (...args: unknown[]) => unknown;
};

export async function activate(context: ExtensionContext) {
  const provider = new usewikiViewProvider(context);
  context.subscriptions.push(
    window.registerWebviewViewProvider("usewiki2", provider, {
      webviewOptions: {
        retainContextWhenHidden: true,
      },
    }),
  );

  const cmds: ExtensionCommand[] = [opensetting, wikiInfo, openWiki];

  for (const cmd of cmds) {
    context.subscriptions.push(commands.registerCommand(cmd.name, cmd.cli));
  }
}
