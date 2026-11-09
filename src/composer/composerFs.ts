/**
 * 虚拟文件系统 `usewiki-compose:`：单文件草稿，内容持久化到 globalState。
 * 路径名（中/英）在 getComposerUri 中按 VS Code 界面语言切换。
 */
import {
  EventEmitter,
  FileChangeType,
  FileSystemError,
  FileType,
  Uri,
  type Event,
  type ExtensionContext,
  type FileStat,
  type FileSystemProvider,
  type Disposable,
} from "vscode";
import en from "../../l10n/bundle.l10n.json";
import zhCN from "../../l10n/bundle.l10n.zh-cn.json";
import { t } from "../localize";

const DRAFT_KEY = "usewiki2.composerDraft";

/** 历史版本可能用过不同文件名，打开/判断 URI 时都认作同一草稿。 */
const composerPaths = new Set(
  [en["composer.fileName"], zhCN["composer.fileName"]].map((name) => `/${name}`),
);

/** 当前语言下的草稿 URI（仅应存在其中一个路径的标签页）。 */
export function getComposerUri(): Uri {
  return Uri.from({ scheme: "usewiki-compose", path: `/${t("composer.fileName")}` });
}

export function isComposerUri(uri: Uri): boolean {
  return uri.scheme === "usewiki-compose" && composerPaths.has(uri.path);
}

export class ComposerFileSystemProvider implements FileSystemProvider {
  private readonly changeEmitter = new EventEmitter<{ type: FileChangeType; uri: Uri }[]>();

  constructor(private readonly context: ExtensionContext) {
    const saved = context.globalState.get<string>(DRAFT_KEY);
    if (saved) {
      this.text = saved;
    }
  }

  private text = "";

  readonly onDidChangeFile: Event<{ type: FileChangeType; uri: Uri }[]> = this.changeEmitter.event;

  getText(): string {
    return this.text;
  }

  setText(value: string): void {
    this.text = value;
    void this.context.globalState.update(DRAFT_KEY, value);
    this.changeEmitter.fire([{ type: FileChangeType.Changed, uri: getComposerUri() }]);
  }

  watch(_uri: Uri): Disposable {
    return { dispose: () => {} };
  }

  stat(uri: Uri): FileStat {
    this.assertComposer(uri);
    return {
      type: FileType.File,
      ctime: 0,
      mtime: Date.now(),
      size: Buffer.byteLength(this.text, "utf8"),
    };
  }

  readDirectory(_uri: Uri): [string, FileType][] {
    return [];
  }

  createDirectory(): void {
    throw FileSystemError.NoPermissions("usewiki-compose");
  }

  readFile(uri: Uri): Uint8Array {
    this.assertComposer(uri);
    return Buffer.from(this.text, "utf8");
  }

  writeFile(
    uri: Uri,
    content: Uint8Array,
    _options: { readonly create: boolean; readonly overwrite: boolean },
  ): void {
    this.assertComposer(uri);
    this.setText(Buffer.from(content).toString("utf8"));
  }

  delete(uri: Uri): void {
    this.assertComposer(uri);
    this.setText("");
  }

  rename(): void {
    throw FileSystemError.Unavailable("usewiki-compose");
  }

  private assertComposer(uri: Uri): void {
    if (!isComposerUri(uri)) {
      throw FileSystemError.FileNotFound(uri);
    }
  }
}
