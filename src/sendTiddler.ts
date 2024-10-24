import { notify } from './notify';
import { defaultTag, getPort, getIp, defaultUsername, getType } from './config';
export default async function sendTiddler(text: string) {
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
    throw Error((error as Error).message);
  }
}
