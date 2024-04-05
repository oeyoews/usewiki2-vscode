import http from 'node:http'
import * as vscode from 'vscode'

export default function fetchData(callback: (data: any) => void) {
  const twurl = 'http://localhost:8000/status'

  http.get(twurl, (response) => {
    let data: any = null

    response.on('data', (chunk) => {
      data = chunk
    })

    response.on('end', () => {
      // 在这里处理响应数据
      const dataTw = JSON.parse(data) as ITiddlyWikiStatus
      if (dataTw.tiddlywiki_version) {
        callback(dataTw)
      }
      else { vscode.window.showWarningMessage('请连接太微') }
    })
  }).on('error', (error) => {
    vscode.window.showErrorMessage(`Error fetching data: ${error.message}`)
  })
}
