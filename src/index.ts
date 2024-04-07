import * as vscode from 'vscode'
import { TWTreeDataProvider } from './tree';
import fetchData from './featchData';
import usewikiCmd from './usewikiCmd';

export async function activate(context: vscode.ExtensionContext) {

  const cmd = 'usewiki2.tiddlywiki'

  const disposable = vscode.commands.registerCommand(cmd, usewikiCmd)
  context.subscriptions.push(disposable)

  // tree
  const data = await fetchData();
  const tree = new TWTreeDataProvider(data)
  vscode.window.createTreeView('usewiki2', { treeDataProvider: tree })

  // 刷新 cmd
  // vscode.workspace.onDidChangeConfiguration((event) => {
  //   if (event.affectsConfiguration('usewiki2.port')) {
  //     // 如果用户名配置发生了变化，重新注册命令
  //     disposable.dispose();
  //     const newDisposable = vscode.commands.registerCommand(cmd, usewikiCmd);
  //     context.subscriptions.push(newDisposable);
  //     notify(config.get('port') + '端口配置已更新', 'info',);
  //   }
  // });


}
