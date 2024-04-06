import * as vscode from 'vscode';
import path from 'path';
import { iconMappings } from './icon';

// 定义树形视图的数据提供者类
export class TWTreeDataProvider implements vscode.TreeDataProvider<TWTreeItem> {
	// 定义事件，用于通知树形视图数据的变化
	private _onDidChangeTreeData: vscode.EventEmitter<TWTreeItem | undefined> = new vscode.EventEmitter<TWTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<TWTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(private twdata: ITiddlyWikiStatus) {
	}

	/** @see: https://code.visualstudio.com/api/extension-guides/tree-view */
	getTreeItem(element: TWTreeItem): vscode.TreeItem {
		return element;
	}

	// 获取子节点
	getChildren(element?: TWTreeItem): Thenable<TWTreeItem[]> {
		if (!element) {
			// 如果没有指定父节点，则返回根节点的子节点
			return Promise.resolve([
				new TWTreeItem('输入框', '输入框的描述', vscode.TreeItemCollapsibleState.None),
				new TWTreeItem('信息', '', vscode.TreeItemCollapsibleState.Expanded, [
					new TWTreeItem('用户名', this.twdata.username, vscode.TreeItemCollapsibleState.None),
					new TWTreeItem('版本', this.twdata.tiddlywiki_version, vscode.TreeItemCollapsibleState.None),
				]),
			]);
		} else {
			// 如果有父节点，则返回父节点的子节点数组
			return Promise.resolve(element.children || []);
		}
	}

	// iconPath = {
	// 	light: path.join(__filename, '..', '..', 'res', 'tw256.png',),
	// 	dark: path.join(__filename, '..', '..', 'res', 'tw256.png',)
	// };

	refresh() {
		vscode.window.showInformationMessage('refresh')
	}


}

// 树形视图节点类
class TWTreeItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly description: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly children?: TWTreeItem[]
	) {
		super(label, collapsibleState);

		const icon = iconMappings[label];
		if (icon) {
			this.iconPath = new vscode.ThemeIcon(icon);
		}
	}
}
