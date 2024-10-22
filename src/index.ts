import * as vscode from 'vscode';
import { usewikiViewProvider } from './webviews';

import * as usewikiCmd from './commands/usewikiCmd';
import * as openWiki from './commands/openWikiCmd';
import * as wikiInfo from './commands/wikiInfo';
import * as opensetting from './commands/openSettings';
import * as refreshWiki from './commands/refreshWiki';

export async function activate(context: vscode.ExtensionContext) {
  const provider = new usewikiViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('usewiki2', provider)
  );

  const cmds = [opensetting, wikiInfo, openWiki, usewikiCmd, refreshWiki];

  // 注册命令
  cmds.forEach((cmd: { name: string; cli: any }) => {
    const disposable = vscode.commands.registerCommand(cmd.name, cmd.cli);
    context.subscriptions.push(disposable);
  });
}
