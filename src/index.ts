import * as vscode from 'vscode';
import { notify } from './notify';

export async function activate(context: vscode.ExtensionContext) {
  const provider = new MyWebviewViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('ollamaView', provider)
  );
}

export class MyWebviewViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  constructor(
    private context: vscode.ExtensionContext,
    private _extensionUri = context.extensionUri
  ) {}

  resolveWebviewView(
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

    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'sendWiki':
          vscode.window.showInformationMessage(message.data.text);
          break;
        case 'showMessage':
          vscode.window.showInformationMessage(message.data.text);
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
                <h3>输入框</h3>
                <input type="text" id="inputField" placeholder="在这里输入..." />
                <button class="send-wiki">提交</button>

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
