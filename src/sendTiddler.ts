import { notify } from './notify';
import { defaultTag, getPort, getIp, defaultUsername, getType } from './config';
import { type WebviewMessenger } from './utils/extensionMessenger';
import { l10n } from 'vscode';
export default async function sendTiddler(
  text: string,
  messenger: WebviewMessenger
) {
  const UNDO = l10n.t('Undo');
  const UNDOEDIT = l10n.t('Undo And Edit');
  const port = getPort();
  const ip = getIp();

  const random = Math.random().toString(36).slice(2);
  let title =
    new Date().toISOString().split('T')[0].replace('-', '/') + '-' + random;
  const time = new Date().toISOString().split('.').shift()!.replace(/\D/g, '');
  const tiddler: ITiddler = {
    created: time,
    modified: time,
    tags: [defaultTag()],
    creator: defaultUsername(),
    type: getType(),
    text,
    title,
  };

  const url = `http://${ip}:${port}/recipes/default/tiddlers/${title}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-requested-with': 'TiddlyWiki',
  };

  async function undoSendTiddler() {
    const url = `http://${ip}:${port}/bags/default/tiddlers/${title}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (response.status === 204) {
      // '撤回并重新编辑'
      notify(`${l10n.t('Successfully Undone')}(${title})`, 'info');
      // window.showInformationMessage('发送成功', 'demo').then(() => {});
    } else {
      notify(`撤回失败${title}`, 'error');
    }
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(tiddler),
    });

    if (response.status === 204) {
      notify(`发送成功(${title})`, 'info', [UNDO, UNDOEDIT]).then((data) => {
        if (data === UNDO) {
          undoSendTiddler();
        } else if (data === UNDOEDIT) {
          undoSendTiddler();
          messenger.send('edit', { text });
        }
      });
    } else {
      notify('发送失败', 'error');
    }
  } catch (error) {
    notify((error as Error).message, 'error');
    throw Error((error as Error).message);
  }
}
