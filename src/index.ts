import * as vscode from 'vscode'
import { TWTreeDataProvider } from './tree';
import fetchData from './featchData';
import usewikiCmd, { usewikiCli } from './usewikiCmd';
import openWikiCmd, { openWikiCli } from './openWikiCmd';

export async function activate(context: vscode.ExtensionContext) {

  // send cmd
  const disposable = vscode.commands.registerCommand(usewikiCli, usewikiCmd)

  // open cmd
  const openDisposable = vscode.commands.registerCommand(openWikiCli, openWikiCmd)

  context.subscriptions.push(disposable)
  context.subscriptions.push(openDisposable)


  // tree
  const data = await fetchData();
  const tree = new TWTreeDataProvider(data)
  vscode.window.createTreeView('usewiki2', { treeDataProvider: tree })

}
