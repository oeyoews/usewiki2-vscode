export default function getWebviewContent(data: ITiddlyWikiStatus) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TiddlyWiki</title>
        </head>
        <body>
            <h1>Hello, ${data.username}!</h1>
            <p>版本号：${data.tiddlywiki_version}</p>
        </body>
        </html>
    `;
}