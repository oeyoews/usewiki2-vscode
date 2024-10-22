import http from 'node:http';
import { notify } from './notify';
import { getPort, getIp } from './config';

export default function sendTiddler(tiddler: ITiddler) {
  const port = getPort();
  const ip = getIp();

  const req = http.request(
    {
      hostname: ip,
      port,
      path: `/recipes/default/tiddlers/${tiddler.title}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-requested-with': 'TiddlyWiki',
      },
    },
    (response) => {
      let responseData = '';

      response.on('data', (chunk) => {
        responseData += chunk;
      });

      response.on('end', () => {
        if (response.statusCode === 204) {
          notify('发送成功', 'info');
        } else {
          notify('发送失败', 'error');
        }
      });
    }
  );

  req.write(JSON.stringify(tiddler));
  // NOTE: 必须要手动结束
  req.end();
}
