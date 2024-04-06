import * as vscode from 'vscode'
import fetchData from './featchData'
import { TWTreeDataProvider } from './tree';

export function activate(context: vscode.ExtensionContext) {
  const cmd = 'usewiki2.tiddlywiki'
  const disposable = vscode.commands.registerCommand(cmd, () => {
    fetchData((data) => {
      if (data) {
        vscode.window.showInformationMessage('太微连接成功')
      } else {
        vscode.window.showQuickPick(['8080', '8000', '8081'], { placeHolder: '选择你的太微端口' })
      }

      const treeDataProvider = new TWTreeDataProvider(data as ITiddlyWikiStatus);
      const treeview = vscode.window.createTreeView('usewiki2-info', { treeDataProvider });
      treeview.onDidChangeSelection(event => {
        const { label } = event.selection[0]
        switch (label) {
          case 'Port':
            vscode.window.showQuickPick(['8000', '8000', '8081']).then(selection => {
              if (selection) {
                vscode.window.showInformationMessage(`Selected option: ${selection}`);
              }
            });
            break
          default:
            break;
        }
        // 弹出 Quick Pick 对话框
      });


    });
  })

  // vscode.commands.executeCommand(cmd)
  context.subscriptions.push(disposable)

}
