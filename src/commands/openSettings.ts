import { commands } from 'vscode';

export async function cli() {
  const searchQuery = '@ext:oeyoews.usewiki2';
  commands.executeCommand('workbench.action.openSettings', searchQuery);
}

export const name = 'usewiki2.opensettings';
