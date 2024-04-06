import * as vscode from 'vscode';

// 定义树形视图的数据提供者类
export class SampleTreeDataProvider implements vscode.TreeDataProvider<SampleTreeItem> {
	// 定义事件，用于通知树形视图数据的变化
	private _onDidChangeTreeData: vscode.EventEmitter<SampleTreeItem | undefined> = new vscode.EventEmitter<SampleTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<SampleTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(private twdata: ITiddlyWikiStatus) {
	}

	// 获取树形视图节点
	getTreeItem(element: SampleTreeItem): vscode.TreeItem {
		return element;
	}

	// 获取子节点
	getChildren(element?: SampleTreeItem): Thenable<SampleTreeItem[]> {
		if (!element) {
			// 如果没有指定父节点，则返回根节点的子节点
			return Promise.resolve([
				new SampleTreeItem('info', '', vscode.TreeItemCollapsibleState.Expanded, [
					new SampleTreeItem('username', this.twdata.username, vscode.TreeItemCollapsibleState.None),
					new SampleTreeItem('version', this.twdata.tiddlywiki_version, vscode.TreeItemCollapsibleState.None),
				])
			]);
		} else {
			// 如果有父节点，则返回父节点的子节点数组
			return Promise.resolve(element.children || []);
		}
	}
}

// 树形视图节点类
class SampleTreeItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly description: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly children?: SampleTreeItem[]
	) {
		super(label, collapsibleState);
		// 如果有子节点，则设置图标
		if (this.children && this.children.length > 0) {
			this.iconPath = new vscode.ThemeIcon('folder');
		}
	}

	// 获取鼠标悬停时显示的提示信息
	// @ts-ignore
	get tooltip(): string {
		return `${this.label}`;
	}
}
