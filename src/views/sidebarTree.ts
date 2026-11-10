/**
 * Activity Bar 侧栏：「信息」只读分组 + 「操作」命令分组。
 */
import {
  EventEmitter,
  ThemeColor,
  ThemeIcon,
  TreeItem,
  TreeItemCollapsibleState,
  type Event,
  type TreeDataProvider,
} from "vscode";
import { commands as commandIds } from "../generated/meta";
import { t } from "../localize";
import type { WikiContextSnapshot } from "../wikiContext";
import type { WikiContextStore } from "../wikiContextStore";

type SidebarActionKey = "sidebar.focusComposer" | "sidebar.sendToWiki" | "sidebar.openWiki";

type SidebarSectionId = "info" | "actions";

type SidebarNode =
  | { kind: "section"; id: SidebarSectionId }
  | {
      kind: "info";
      icon: string;
      label: string;
      description?: string;
      tooltip?: string;
      connectionStatus?: WikiContextSnapshot["connectionStatus"];
    }
  | {
      kind: "action";
      command: string;
      icon: string;
      labelKey: SidebarActionKey;
    };

export class SidebarTreeProvider implements TreeDataProvider<SidebarNode> {
  private readonly _onDidChangeTreeData = new EventEmitter<SidebarNode | undefined>();
  readonly onDidChangeTreeData: Event<SidebarNode | undefined> = this._onDidChangeTreeData.event;

  constructor(private readonly wikiContext: WikiContextStore) {
    wikiContext.subscribe(() => this.refresh());
  }

  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }

  private infoNodes(ctx: WikiContextSnapshot): SidebarNode[] {
    return [
      {
        kind: "info",
        icon: "server",
        label: t("sidebar.infoServer"),
        description: ctx.serverUrl,
        tooltip: ctx.serverUrl,
      },
      {
        kind: "info",
        icon: "tag",
        label: t("sidebar.infoTag"),
        description: ctx.defaultTag,
      },
      {
        kind: "info",
        icon: ctx.statusIcon,
        label:
          ctx.connectionStatus === "offline" && ctx.statusDetail
            ? `${ctx.statusLabel} ${ctx.statusDetail}`
            : ctx.statusLabel,
        description: ctx.connectionStatus === "offline" ? undefined : ctx.statusDetail || undefined,
        tooltip: ctx.statusDetail || ctx.statusLabel,
        connectionStatus: ctx.connectionStatus,
      },
      {
        kind: "info",
        icon: "file-code",
        label: t("sidebar.infoFormat"),
        description: ctx.saveFormat,
      },
      {
        kind: "info",
        icon: "note",
        label: t("sidebar.infoSaveTitle"),
        description: t("sidebar.infoSaveTitleDetail"),
        tooltip: t("sidebar.hint"),
      },
    ];
  }

  private actionNodes(): SidebarNode[] {
    return [
      {
        kind: "action",
        command: commandIds.openComposer,
        icon: "edit",
        labelKey: "sidebar.focusComposer",
      },
      {
        kind: "action",
        command: commandIds.sendToWiki,
        icon: "cloud-upload",
        labelKey: "sidebar.sendToWiki",
      },
      {
        kind: "action",
        command: commandIds.openwiki,
        icon: "link-external",
        labelKey: "sidebar.openWiki",
      },
    ];
  }

  getChildren(element?: SidebarNode): SidebarNode[] {
    if (!element) {
      return [
        { kind: "section", id: "actions" },
        { kind: "section", id: "info" },
      ];
    }
    if (element.kind === "section" && element.id === "info") {
      return this.infoNodes(this.wikiContext.getSnapshot());
    }
    if (element.kind === "section" && element.id === "actions") {
      return this.actionNodes();
    }
    return [];
  }

  getTreeItem(element: SidebarNode): TreeItem {
    if (element.kind === "section") {
      const label = element.id === "info" ? t("sidebar.sectionInfo") : t("sidebar.sectionActions");
      const expanded = element.id === "actions";
      const item = new TreeItem(
        label,
        expanded ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.Collapsed,
      );
      item.id = `usewiki2.section.${element.id}`;
      item.iconPath = new ThemeIcon(element.id === "info" ? "info" : "zap");
      item.contextValue = item.id;
      return item;
    }
    if (element.kind === "info") {
      const offline = element.connectionStatus === "offline";
      const item = new TreeItem(element.label, TreeItemCollapsibleState.None);
      item.iconPath = offline
        ? new ThemeIcon(element.icon, new ThemeColor("errorForeground"))
        : new ThemeIcon(element.icon);
      if (element.description) {
        item.description = element.description;
      }
      item.tooltip = element.tooltip ?? element.label;
      item.contextValue = offline ? "usewiki2.info.offline" : "usewiki2.info";
      return item;
    }
    const item = new TreeItem(t(element.labelKey), TreeItemCollapsibleState.None);
    item.iconPath = new ThemeIcon(element.icon);
    item.command = {
      command: element.command,
      title: t(element.labelKey),
    };
    item.contextValue = "usewiki2.action";
    return item;
  }

  getParent(element: SidebarNode): SidebarNode | undefined {
    if (element.kind === "info") {
      return { kind: "section", id: "info" };
    }
    if (element.kind === "action") {
      return { kind: "section", id: "actions" };
    }
    return undefined;
  }
}
