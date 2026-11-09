/**
 * Activity Bar 侧栏 TreeView：扁平命令列表（写新条目 / 保存 / 打开 Wiki）。
 * 设置与使用说明在视图标题栏；树数据无子节点。
 */
import {
  EventEmitter,
  ThemeIcon,
  TreeItem,
  TreeItemCollapsibleState,
  type Event,
  type TreeDataProvider,
} from "vscode";
import { t } from "../localize";

type SidebarActionKey = "sidebar.focusComposer" | "sidebar.sendToWiki" | "sidebar.openWiki";

type SidebarNode = {
  kind: "action";
  command: string;
  icon: string;
  labelKey: SidebarActionKey;
};

/** 侧栏快捷入口；文案随 VS Code 显示语言刷新。 */
export class SidebarTreeProvider implements TreeDataProvider<SidebarNode> {
  private readonly _onDidChangeTreeData = new EventEmitter<SidebarNode | undefined>();
  readonly onDidChangeTreeData: Event<SidebarNode | undefined> = this._onDidChangeTreeData.event;

  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }

  getChildren(_element?: SidebarNode): SidebarNode[] {
    if (_element) {
      return [];
    }
    return [
      {
        kind: "action",
        command: "usewiki2.openComposer",
        icon: "edit",
        labelKey: "sidebar.focusComposer",
      },
      {
        kind: "action",
        command: "usewiki2.sendToWiki",
        icon: "cloud-upload",
        labelKey: "sidebar.sendToWiki",
      },
      {
        kind: "action",
        command: "usewiki2.openwiki",
        icon: "link-external",
        labelKey: "sidebar.openWiki",
      },
    ];
  }

  getTreeItem(element: SidebarNode): TreeItem {
    const item = new TreeItem(t(element.labelKey), TreeItemCollapsibleState.None);
    item.iconPath = new ThemeIcon(element.icon);
    item.command = {
      command: element.command,
      title: t(element.labelKey),
    };
    return item;
  }
}
