import * as vscode from 'vscode'
import fetchData from './featchData'
import { TWTreeDataProvider } from './tree';
import { notify } from './notify';

export async function activate(context: vscode.ExtensionContext) {
  const cmd = 'usewiki2.tiddlywiki'

  const data = await fetchData();
  const treeDataProvider = new TWTreeDataProvider(data as ITiddlyWikiStatus);

  const disposable = vscode.commands.registerCommand(cmd, async () => {

    // treeDataProvider.refresh()

    const data = await fetchData();

    if (data) {
      notify('太微连接成功')
    } else {
      // vscode.window.showQuickPick(['8080', '8000', '8081'], { placeHolder: '选择你的太微端口' })
    }

  })


  const treeview = vscode.window.createTreeView('usewiki2', { treeDataProvider });

  // vscode.commands.executeCommand(cmd)
  context.subscriptions.push(disposable)

}
