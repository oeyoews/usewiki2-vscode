import * as vscode from 'vscode';
import { enableHttps, config, getIp, getPort } from './config';
import { notify } from './notify';

export default async function fetchData(): Promise<ITiddlyWikiStatus> {
  // notify(`正在获取数据${getPort()}`, 'info');
  const protocal = enableHttps() ? 'https' : 'http';
  const twurl = `${protocal}://${getIp()}:${getPort()}/status`;
  notify(`正在获取数据${twurl}`, 'info');

  try {
    const response = await fetch(twurl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const dataTw = (await response.json()) as ITiddlyWikiStatus;

    if (dataTw.tiddlywiki_version) {
      return dataTw;
    } else {
      throw new Error('TiddlyWiki not connected');
    }
  } catch (error) {
    vscode.window
      .showErrorMessage((error as Error).message, '配置端口')
      .then(async (choice) => {
        if (choice === '配置端口') {
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
                  vscode.commands.executeCommand(
                    'workbench.action.reloadWindow'
                  );
                }
              });
          }
        }
      });

    throw error;
  }
}
