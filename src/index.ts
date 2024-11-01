import { usewikiViewProvider } from './webviews';

import * as openWiki from './commands/openWikiCmd';
import * as wikiInfo from './commands/wikiInfo';
import * as opensetting from './commands/openSettings';
import {
  type ExtensionContext,
  window,
  commands,
  ColorThemeKind,
} from 'vscode';

// import * as usewikiCmd from './commands/usewikiCmd';
// import * as refreshWiki from './commands/refreshWiki';

export async function activate(context: ExtensionContext) {
  const provider = new usewikiViewProvider(context);
  context.subscriptions.push(
    window.registerWebviewViewProvider('usewiki2', provider)
  );

  const cmds = [opensetting, wikiInfo, openWiki];

  // 注册命令
  cmds.forEach((cmd: { name: string; cli: any }) => {
    const disposable = commands.registerCommand(cmd.name, cmd.cli);
    context.subscriptions.push(disposable);
  });
}
