import * as vscode from 'vscode'
import { getPort } from './config'

export default async function openWikiCmd() {
	const url = `http://localhost:${getPort()}`

	vscode.env.openExternal(vscode.Uri.parse(url))
}

export const openWikiCli = 'usewiki2.openwiki'