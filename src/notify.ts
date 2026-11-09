/**
 * 薄封装 `window.show*Message`，统一按类型分发。
 */
import { window } from "vscode";

export const notify = (message: string, type: INotifyType = "info", options: string[] = []) => {
  const typeMap: Record<INotifyType, string> = {
    info: "showInformationMessage",
    error: "showErrorMessage",
    warning: "showWarningMessage",
  };

  const method = typeMap[type];
  // show*Message 签名一致，用动态方法名调用
  // @ts-expect-error method 限定为 window 上已有的 show*Message
  return window[method](message, ...options) as Promise<string | undefined>;
};
