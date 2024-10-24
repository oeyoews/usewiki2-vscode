interface Message {
  data: {
    command: string;
  };
}

interface IOptions {
  context: any;
  vscode?: any;
}

export class WebviewMessenger {
  private _vscode: any; // 仅用于 Webview 端
  private panel: any; // 仅用于 VSCode 扩展端
  private handlers: { [command: string]: (payload: any) => void } = {};

  constructor({ context, vscode }: IOptions) {
    if (context instanceof Object && 'webview' in context) {
      // VSCode 扩展端
      this.panel = context;
      this.panel.webview.onDidReceiveMessage((message: Message) => {
        // @ts-ignore
        // 格式和 message 一致, 手动在外面包上一层data
        this.handleMessage({ data: message });
      });
    } else {
      // Webview 端
      this._vscode = vscode;
      // @ts-expect-error
      window.addEventListener('message', (event: MessageEvent<Message>) =>
        this.handleMessage(event)
      );
    }
  }

  // 发送消息：在 Webview 中通过 vscode.postMessage，在扩展端通过 panel.webview.postMessage
  send(command: string, payload: any = {}) {
    if (this.panel) {
      // VSCode 扩展端
      this.panel.webview.postMessage({ command, ...payload });
    } else if (this._vscode) {
      // Webview 端
      this._vscode.postMessage({ command, ...payload });
    }
  }

  // 注册接收消息的处理函数
  on(command: string, callback: (payload: any) => void) {
    this.handlers[command] = callback;
  }

  // 处理接收到的消息并调用相应的 handler
  private handleMessage(message: Message) {
    const data = message.data;
    const { command, ...payload } = data;
    if (this.handlers[command]) {
      this.handlers[command](payload);
    }
  }
}
