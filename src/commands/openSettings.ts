import * as vscode from 'vscode';

export async function cli() {
  const searchQuery = '@ext:oeyoews.usewiki2';
  vscode.commands.executeCommand('workbench.action.openSettings', searchQuery);
}

export const name = 'usewiki2.opensettings';
