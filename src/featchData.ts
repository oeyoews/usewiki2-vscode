import http from 'node:http';
import * as vscode from 'vscode';
import { notify } from './notify';

export default function fetchData(): Promise<ITiddlyWikiStatus> {
  const twurl = 'http://localhost:8000/status';

  return new Promise((resolve, reject) => {
    http.get(twurl, (response) => {
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
            vscode.window.showWarningMessage('请连接太微');
            reject(new Error('TiddlyWiki not connected'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      notify(`Error fetching data: ${error.message}`, 'error');
      reject(error);
    });
  });
}

