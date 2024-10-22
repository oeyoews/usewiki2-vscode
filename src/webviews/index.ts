import * as vscode from 'vscode';
// import fetchData from '../featchData';
import sendTiddler from '../sendTiddler';
import * as openWikiCmd from '../commands/openWikiCmd';
import { defaultTag, defaultUsername, getType } from '../config';

export class usewikiViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  // private _twdata = {} as ITiddlyWikiStatus;
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
    // this._twdata = await fetchData();

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this.getWebviewContent(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'openWiki':
          openWikiCmd.cli();
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
            tags: [defaultTag()],
            creator: defaultUsername(),
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
      vscode.Uri.joinPath(this._extensionUri, 'react-dist', 'main.js')
    );
    const styleAppUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'react-dist', 'main.css')
    );
    // const { tiddlywiki_version, username } = this._twdata;
    const nonce = getNonce();
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
	      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Custom Sidebar</title>
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
