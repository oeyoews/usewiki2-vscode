import * as vscode from 'vscode';
import sendTiddler from '../sendTiddler';
import * as openWikiCmd from '../commands/openWikiCmd';
import { WebviewMessenger } from '../utils/extensionMessenger';
import { config, enableSendSound, getLang } from '../config';
import { ILanguage } from '../../packages/react/src/i18n';

interface ILanguageOptions extends vscode.QuickPickItem {
  value: ILanguage;
}

export class usewikiViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  constructor(
    private context: vscode.ExtensionContext,
    private _extensionUri = context.extensionUri
  ) {}

  async resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this.getWebviewContent(webviewView.webview);

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('usewiki2.lang')) {
        messenger.send('changeLanguage', { text: getLang() });
        // 全局刷新, 但是需要webview 主动检查语言配置
        // webviewView.webview.html = this.getWebviewContent(webviewView.webview);
      }
    });

    const messenger = new WebviewMessenger({ context: this._view });

    // messenger.on('placeholder', () => {
    //   messenger.send('placeholder', { text: placeholder() });
    // });

    // const currentLang = getLang();
    // language
    const langOptions: ILanguageOptions[] = [
      {
        label: 'English',
        value: 'en',
      },
      {
        label: 'Simplified Chinese',
        value: 'zhCN',
        picked: true, // not work ???
      },
    ];
    // langOptions.forEach((item, index) => {
    //   if (item.value === currentLang) {
    //     langOptions[index].picked = true;
    //   }
    // });

    // console.log('current lang is', getLang());
    messenger.send('changeLanguage', { text: getLang() });
    messenger.on('showVsCodeLanguageInputBox', async () => {
      // 选择不同的语言 en, zhCN 下拉框
      const langItem = await vscode.window.showQuickPick(langOptions, {
        title: 'Setup Usewiki2 Language',
        placeHolder: 'Select Language',
        canPickMany: false,
        matchOnDetail: true,
        onDidSelectItem: (item) => {
          // TODO: 如何实时预览切换， 并且在取消时恢复, 是否回多次触发输入时
        },
      });
      if (!langItem) return;
      messenger.send('changeLanguage', { text: langItem.value });
      config().update('lang', langItem.value, true);
    });

    messenger.on('openLink', (data) => {
      vscode.env.openExternal(vscode.Uri.parse(data.link));
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
  private getWebviewContent(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'react-dist', 'main.js')
    );
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'res', 'reset.css')
    );
    const styleAppUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'react-dist', 'main.css')
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
