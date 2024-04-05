import * as vscode from 'vscode'
import fetchData from './featchData'
import { SampleTreeDataProvider } from './tree';

export function activate(context: vscode.ExtensionContext) {
  const cmd = 'usewiki2.helloWorld'
  const disposable = vscode.commands.registerCommand(cmd, () => {
    fetchData((data) => {
      data && vscode.window.showInformationMessage('太微连接成功')
      const treeDataProvider = new SampleTreeDataProvider(data as ITiddlyWikiStatus);
      vscode.window.createTreeView('info', { treeDataProvider });

    });

  })

  context.subscriptions.push(disposable)

}
