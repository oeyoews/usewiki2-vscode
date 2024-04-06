import * as vscode from 'vscode';
// import fetchData from './featchData';

export class SampleTreeDataProvider implements vscode.TreeDataProvider<SampleTreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<SampleTreeItem | undefined> = new vscode.EventEmitter<SampleTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<SampleTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(private twdata: ITiddlyWikiStatus) {

		// vscode.window.onDidChangeTextEditorViewColumn(() => { });
	}

	getTreeItem(element: SampleTreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: SampleTreeItem): Thenable<SampleTreeItem[]> {
		if (!element) {
			// 返回根节点
			return Promise.resolve([
				new SampleTreeItem('Username', this.twdata.username, vscode.TreeItemCollapsibleState.Expanded, 'res/tiddlywiki01.png'),
				new SampleTreeItem('Version', this.twdata.tiddlywiki_version, vscode.TreeItemCollapsibleState.Expanded, '../res/tiddlywiki01.png'),
				new SampleTreeItem('Port', '8000', vscode.TreeItemCollapsibleState.Expanded, 'res/tiddlywiki01.png'),
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
		public readonly iconPath?: string | vscode.Uri | { light: string | vscode.Uri; dark: string | vscode.Uri }
	) {
		super(label, collapsibleState);
	}

	// 自定义标签和描述
	// @ts-ignore
	get tooltip(): string {
		return `${this.label}`;
	}
}
