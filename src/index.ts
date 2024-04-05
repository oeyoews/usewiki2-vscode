import * as vscode from 'vscode'
import fetchData from './featchData'

let twdata = {} as ITiddlyWikiStatus;

export function activate(context: vscode.ExtensionContext) {
  const cmd = 'usewiki2.helloWorld'
  const tw = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right)

  const disposable = vscode.commands.registerCommand(cmd, () => {
    fetchData((data) => {
      twdata = data

      const treeDataProvider = new SampleTreeDataProvider();
      vscode.window.createTreeView('info', { treeDataProvider });

    });

  })

  context.subscriptions.push(disposable)

  tw.text = '$(add)' + 'usewiki2'
  tw.tooltip = 'usewiki2'
  tw.command = cmd
  tw.show()

}

// 树形视图数据提供程序
class SampleTreeDataProvider implements vscode.TreeDataProvider<SampleTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<SampleTreeItem | undefined> = new vscode.EventEmitter<SampleTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<SampleTreeItem | undefined> = this._onDidChangeTreeData.event;

  getTreeItem(element: SampleTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: SampleTreeItem): Thenable<SampleTreeItem[]> {
    if (!element) {
      // 返回根节点
      return Promise.resolve([
        new SampleTreeItem('Username', vscode.TreeItemCollapsibleState.None),
        new SampleTreeItem('Version', vscode.TreeItemCollapsibleState.None)
      ]);
    }
    return Promise.resolve([]);
  }
}

// 树形视图节点
class SampleTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    super(label, collapsibleState);
  }

  // 自定义标签和描述
  get tooltip(): string {
    return `${this.label}`;
  }

  // 设置版本号
  get description(): string {
    // if (this.label === 'Version') {
    //   return '1.0.0';
    // }
    switch (this.label) {
      case 'Username':
        return twdata.username;
      case 'Version':
        return twdata.tiddlywiki_version;
      default:
        break;
    }
    return '';
  }
}
