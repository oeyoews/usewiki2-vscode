import * as vscode from 'vscode';
import sendTiddler from '../sendTiddler';
import * as openWikiCmd from '../commands/openWikiCmd';
import { WebviewMessenger } from '../utils/extensionMessenger';

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
    const messenger = new WebviewMessenger({ context: this._view });

    messenger.on('openLink', (data) => {
      vscode.env.openExternal(vscode.Uri.parse(data.link));
    });
    messenger.on('openWiki', () => {
      openWikiCmd.cli();
    });
    messenger.on('sendWiki', ({ text }) => {
      sendTiddler(text).then(() => {
        messenger.send('playSound');
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
