import { window } from 'vscode';

export const notify = (message: string, type: INotifyType = 'info') => {
  const typeMap: Record<INotifyType, string> = {
    info: 'showInformationMessage',
    error: 'showErrorMessage',
    warning: 'showWarningMessage',
  };

  const method = typeMap[type];
  // @ts-ignore
  window[method](message);
};
