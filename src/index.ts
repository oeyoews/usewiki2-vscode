import * as vscode from 'vscode'
import fetchData from './featchData'
import { TWTreeDataProvider } from './tree';

export async function activate(context: vscode.ExtensionContext) {
  const cmd = 'usewiki2.tiddlywiki'


  const disposable = vscode.commands.registerCommand(cmd, async () => {

    const data = await fetchData();

    if (data) {
      vscode.window.showInformationMessage('太微连接成功')
    } else {
      // vscode.window.showQuickPick(['8080', '8000', '8081'], { placeHolder: '选择你的太微端口' })
    }
  })


  const data = await fetchData();
  const treeDataProvider = new TWTreeDataProvider(data as ITiddlyWikiStatus);
  const treeview = vscode.window.createTreeView('usewiki2-info', { treeDataProvider });

  // vscode.commands.executeCommand(cmd)
  context.subscriptions.push(disposable)

}
