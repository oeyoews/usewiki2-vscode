import http from 'node:http';
import https from 'node:https';
import * as vscode from 'vscode';
import { enableHttps, config, getIp, getPort } from './config';
import { notify } from './notify';

export default function fetchData(): Promise<ITiddlyWikiStatus> {
  // notify(`正在获取数据${getPort()}`, 'info');
  const protocal = enableHttps() ? 'https' : 'http';
  const twurl = `${protocal}://${getIp()}:${getPort()}/status`;
  // notify(`正在获取数据${twurl}`, 'info');
  const protocalMethos = enableHttps() ? https : http;

  return new Promise((resolve, reject) => {
    protocalMethos
      .get(twurl, (response) => {
        let data: any = null;
        response.on('data', (chunk) => {
          data = chunk;
        });

        response.on('end', () => {
          try {
            const dataTw = JSON.parse(data) as ITiddlyWikiStatus;
            if (dataTw.tiddlywiki_version) {
              resolve(dataTw);
            } else {
              reject(new Error('TiddlyWiki not connected'));
            }
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', (error) => {
        vscode.window
          .showErrorMessage(error.message, '配置端口')
          .then(async (choice) => {
            if (choice === '配置端口') {
              // vscode.commands.executeCommand('workbench.action.openSettings', 'usewiki2.port');
              const port = await vscode.window.showInputBox({
                prompt: '输入端口',
                value: getPort().toString(),
              });
              if (port) {
                config().update('port', Number(port), true);
                vscode.window
                  .showInformationMessage(
                    '配置已更新，需要重启插件以应用更改。',
                    '重启插件'
                  )
                  .then((choice) => {
                    if (choice === '重启插件') {
                      // 重启插件
                      vscode.commands.executeCommand(
                        'workbench.action.reloadWindow'
                      );
                    }
                  });
              }
            }
          });

        reject(error);
      });
  });
}
