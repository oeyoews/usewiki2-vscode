import { window } from 'vscode';

export const notify = (
  message: string,
  type: INotifyType = 'info',
  options: string[] = []
) => {
  const typeMap: Record<INotifyType, string> = {
    info: 'showInformationMessage',
    error: 'showErrorMessage',
    warning: 'showWarningMessage',
  };

  const method = typeMap[type];
  // @ts-ignore
  return window[method](message, ...options) as Promise<any>;
};
