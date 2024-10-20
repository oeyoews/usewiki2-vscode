import * as vscode from 'vscode';
import { usewikiViewProvider } from './webviews';

import usewikiCmd, { usewikiCli } from './usewikiCmd';
import openWikiCmd, { openWikiCli } from './openWikiCmd';
import wikiInfoCmd, { wikiInfoCli } from './commands/wikiInfo';

export async function activate(context: vscode.ExtensionContext) {
  const provider = new usewikiViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('usewiki2', provider)
  );
  const disposable = vscode.commands.registerCommand(usewikiCli, usewikiCmd);
  const openDisposable = vscode.commands.registerCommand(
    openWikiCli,
    openWikiCmd
  );
  const wikiInfoDisposable = vscode.commands.registerCommand(
    wikiInfoCli,
    wikiInfoCmd
  );

  context.subscriptions.push(disposable, openDisposable);
}
