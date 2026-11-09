/**
 * 草稿编辑器的「真 placeholder」：用装饰渲染幽灵文字，不写入 TextDocument。
 * VS Code 普通编辑器无 placeholder API，故在 (0,0) 空范围上挂 `after` 伪元素。
 */
import {
  Position,
  Range,
  ThemeColor,
  window,
  workspace,
  type ExtensionContext,
  type TextEditor,
  type TextEditorDecorationType,
} from "vscode";
import { isComposerUri } from "./composerFs";
import { t } from "../localize";

/** 占位装饰在扩展存活期内复用；文案在 activate 时按当前界面语言生成。 */
let decoration: TextEditorDecorationType | undefined;

function createDecoration(): TextEditorDecorationType {
  return window.createTextEditorDecorationType({
    after: {
      contentText: t("composer.placeholder"),
      color: new ThemeColor("editorGhostText.foreground"),
      fontStyle: "italic",
    },
  });
}

function applyPlaceholder(editor: TextEditor): void {
  if (!decoration || !isComposerUri(editor.document.uri)) {
    return;
  }
  // 有正文则不显示占位，避免与真实内容叠加
  if (editor.document.getText().length > 0) {
    editor.setDecorations(decoration, []);
    return;
  }
  // 零宽 Range：仅在光标起点绘制 after 内容，文档仍为空
  const anchor = new Position(0, 0);
  editor.setDecorations(decoration, [new Range(anchor, anchor)]);
}

/** 刷新指定编辑器或所有可见的草稿标签上的占位装饰。 */
export function refreshComposerPlaceholder(editor?: TextEditor): void {
  if (editor) {
    applyPlaceholder(editor);
    return;
  }
  for (const ed of window.visibleTextEditors) {
    applyPlaceholder(ed);
  }
}

/** 在 activate 时注册装饰类型，并监听焦点/文档变更以同步显隐。 */
export function registerComposerPlaceholder(context: ExtensionContext): void {
  decoration = createDecoration();
  context.subscriptions.push(decoration);

  const refreshIfComposer = (uri: { toString(): string }) => {
    const ed = window.visibleTextEditors.find((e) => e.document.uri.toString() === uri.toString());
    if (ed) {
      applyPlaceholder(ed);
    }
  };

  context.subscriptions.push(
    window.onDidChangeActiveTextEditor((ed) => {
      refreshComposerPlaceholder(ed ?? undefined);
    }),
    workspace.onDidChangeTextDocument((event) => {
      if (isComposerUri(event.document.uri)) {
        refreshIfComposer(event.document.uri);
      }
    }),
  );

  refreshComposerPlaceholder();
}
