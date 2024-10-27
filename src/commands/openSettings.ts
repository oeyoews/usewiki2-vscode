import { commands, l10n, window } from 'vscode';

export async function cli() {
  const searchQuery = '@ext:oeyoews.usewiki2';
  commands.executeCommand('workbench.action.openSettings', searchQuery);
  // const mes = l10n.t('setup_language');
  // window.showInformationMessage(mes);
}

export const name = 'usewiki2.opensettings';
