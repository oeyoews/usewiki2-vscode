import * as vscode from 'vscode';
import fetchData from '../featchData';
import sendTiddler from '../sendTiddler';
import openWikiCmd from '../openWikiCmd';
import { getType } from '../config';

export class usewikiViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _twdata = {} as ITiddlyWikiStatus;
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
    this._twdata = await fetchData();

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this.getWebviewContent(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'openWiki':
          openWikiCmd();
          break;
        case 'sendWiki':
          const random = Math.random().toString(36).slice(2);
          let title =
            new Date().toISOString().split('T')[0].replace('-', '/') +
            '-' +
            random;
          const time = new Date()
            .toISOString()
            .split('.')
            .shift()!
            .replace(/\D/g, '');
          const tiddler: ITiddler = {
            created: time,
            modified: time,
            // TODO:
            tags: ['Journal'],
            creator: 'usewiki2-vscode',
            type: getType(),
            text: message.data.text,
            title,
          };
          sendTiddler(tiddler);
          break;
      }
    });
  }
  private getWebviewContent(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'res', 'main.js')
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'res', 'main.css')
    );
    const { tiddlywiki_version, username } = this._twdata;
    const nonce = getNonce();
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
	      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Custom Sidebar</title>
	              <link href="${styleMainUri}" rel="stylesheet">
            </head>
            <body>
                <div class="container">
                <h3>TiddlyWiki (${username} - ${tiddlywiki_version})</h3>
                <div class="input-box">
                <input type="text" id="inputField" placeholder="input..." />
                <button class="send-wiki">Save</button>
                </div>
                </div>

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
