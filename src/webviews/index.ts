import sendTiddler from '../sendTiddler';
import * as openWikiCmd from '../commands/openWikiCmd';
import { WebviewMessenger } from '../utils/extensionMessenger';
import { enableMeteors, enableSendSound, getLang } from '../config';
import { showLanguagePicker } from './showLangPicker';
import {
  Uri,
  workspace,
  env,
  window,
  ColorTheme,
  type Webview,
  type WebviewView,
  type WebviewViewResolveContext,
  type CancellationToken,
  type ExtensionContext,
  type WebviewViewProvider,
  ColorThemeKind,
} from 'vscode';

export class usewikiViewProvider implements WebviewViewProvider {
  private _view?: WebviewView;
  private _messenger?: WebviewMessenger;
  constructor(
    private context: ExtensionContext,
    private _extensionUri = context.extensionUri
  ) {}

  async resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    const messenger = new WebviewMessenger({ context: this._view });
    webviewView.webview.html = this.getWebviewContent(webviewView.webview);

    messenger.on('enableMeteors', () => {
      messenger.send('enableMeteors', { text: enableMeteors() });
    });

    workspace.onDidChangeConfiguration((e) => {
      // switch meteors
      if (e.affectsConfiguration('usewiki2.enableMeteors')) {
        messenger.send('enableMeteors', {
          text: enableMeteors(),
        });
      }
      // lang switch
      if (e.affectsConfiguration('usewiki2.lang')) {
        messenger.send('changeLanguage', { text: getLang() });
        // 全局刷新, 但是需要webview 主动检查语言配置
        // webviewView.webview.html = this.getWebviewContent(webviewView.webview);
      }
    });

    this._messenger = messenger;
    messenger.on('changeTheme', () => {
      this.checkTheme();
    });
    window.onDidChangeActiveColorTheme((theme) => {
      const themeKind = theme.kind;
      if (themeKind === ColorThemeKind.Dark) {
        messenger.send('changeTheme', { text: 'dark' });
      } else if (themeKind === ColorThemeKind.Light) {
        messenger.send('changeTheme', { text: 'light' });
      } else {
        messenger.send('changeTheme', { text: 'high-contrast' });
      }
    });

    messenger.send('changeLanguage', { text: getLang() });
    messenger.on('showVsCodeLanguageInputBox', async () => {
      showLanguagePicker(messenger);
    });

    messenger.on('openLink', (data) => {
      env.openExternal(Uri.parse(data.link));
    });

    messenger.on('openWiki', () => {
      openWikiCmd.cli();
    });

    messenger.on('sendWiki', ({ text }) => {
      sendTiddler(text, messenger).then(() => {
        if (enableSendSound()) {
          messenger.send('playSound');
        }
      });
    });
  }
  // 初始化时检查当前主题模式
  private checkTheme() {
    const themeKind = window.activeColorTheme.kind;
    if (themeKind === ColorThemeKind.Dark) {
      this._messenger?.send('changeTheme', { text: 'dark' });
    } else if (themeKind === ColorThemeKind.Light) {
      this._messenger?.send('changeTheme', { text: 'light' });
    } else {
      this._messenger?.send('changeTheme', { text: 'high-contrast' });
    }
  }

  private getWebviewContent(webview: Webview) {
    const scriptUri = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, 'react-dist', 'main.js')
    );
    const styleResetUri = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, 'res', 'reset.css')
    );
    const styleAppUri = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, 'react-dist', 'main.css')
    );
    // const { tiddlywiki_version, username } = this._twdata;
    const nonce = getNonce();
    // content="default-src 'none';
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
	      <meta http-equiv="Content-Security-Policy" style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Custom Sidebar</title>
	              <link href="${styleResetUri}" rel="stylesheet">
	              <link href="${styleAppUri}" rel="stylesheet">
            </head>
            <body>
            <div id="root"></div>
	          <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>
        `;
  }
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
