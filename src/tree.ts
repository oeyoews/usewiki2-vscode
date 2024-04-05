import * as vscode from 'vscode';

export class SampleTreeDataProvider implements vscode.TreeDataProvider<SampleTreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<SampleTreeItem | undefined> = new vscode.EventEmitter<SampleTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<SampleTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(private twdata: ITiddlyWikiStatus) { }

	getTreeItem(element: SampleTreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: SampleTreeItem): Thenable<SampleTreeItem[]> {
		if (!element) {
			// 返回根节点
			return Promise.resolve([
				new SampleTreeItem('Username', this.twdata.username, vscode.TreeItemCollapsibleState.None),
				new SampleTreeItem('Version', this.twdata.tiddlywiki_version, vscode.TreeItemCollapsibleState.None)
			]);
		}
		return Promise.resolve([]);
	}
}

// 树形视图节点
class SampleTreeItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly description: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
	) {
		super(label, collapsibleState);
	}

	// @ts-ignore
	get tooltip(): string {
		return `${this.label}`;
	}
}
