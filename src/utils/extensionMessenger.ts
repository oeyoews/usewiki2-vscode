import type { WebviewView } from "vscode";

type WebviewCommandPayload = Record<string, unknown>;

interface IncomingMessage {
  command: string;
  [key: string]: unknown;
}

interface IOptions {
  context: WebviewView;
  vscode?: {
    postMessage: (message: IncomingMessage) => void;
  };
}

export class WebviewMessenger {
  private _vscode?: IOptions["vscode"];
  private panel?: WebviewView;
  private handlers: Record<string, (payload: WebviewCommandPayload) => void> = {};

  constructor({ context, vscode }: IOptions) {
    if ("webview" in context) {
      this.panel = context;
      this.panel.webview.onDidReceiveMessage((message: IncomingMessage) => {
        this.handleMessage(message);
      });
    } else if (vscode) {
      this._vscode = vscode;
    }
  }

  send(command: string, payload: WebviewCommandPayload = {}) {
    const message = { command, ...payload };
    if (this.panel) {
      void this.panel.webview.postMessage(message);
    } else if (this._vscode) {
      this._vscode.postMessage(message);
    }
  }

  on(command: string, callback: (payload: WebviewCommandPayload) => void) {
    this.handlers[command] = callback;
  }

  private handleMessage(data: IncomingMessage) {
    const { command, ...payload } = data;
    this.handlers[command]?.(payload);
  }
}
