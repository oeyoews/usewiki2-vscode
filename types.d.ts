
interface ITiddlyWikiStatus {
	tiddlywiki_version: string
	username: string
}

type INotifyType = 'info' | 'warning' | 'error'

interface ITiddler {
	title: string
	text: string
	created: Date | string
	tags?: string[],
	type: 'text/markdown' | 'text/vnd.tiddlywiki'
	creator?: string
	modified?: Date | string
}