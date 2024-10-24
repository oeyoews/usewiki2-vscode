import { notify } from './notify';
import { getPort, getIp } from './config';

export default async function sendTiddler(tiddler: ITiddler) {
  const port = getPort();
  const ip = getIp();

  const url = `http://${ip}:${port}/recipes/default/tiddlers/${tiddler.title}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-requested-with': 'TiddlyWiki',
      },
      body: JSON.stringify(tiddler),
    });

    if (response.status === 204) {
      notify('发送成功', 'info');
    } else {
      notify('发送失败', 'error');
    }
  } catch (error) {
    notify((error as Error).message, 'error');
  }
}
