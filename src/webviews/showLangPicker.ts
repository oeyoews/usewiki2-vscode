import * as vscode from 'vscode';
import { config, getLang } from '../config';

import { WebviewMessenger } from '../utils/extensionMessenger';

export async function showLanguagePicker(messenger: WebviewMessenger) {
  const langOptions: vscode.QuickPickItem[] = [
    { label: 'English', description: 'en' },
    { label: '中文', description: 'zhCN' },
  ];
  const t = vscode.l10n.t;

  // 存储原始语言设置，用于恢复
  const originalLanguage = getLang(); // 自定义函数，假设获取当前语言
  const activeItemIndex = langOptions.findIndex(
    (opt) => opt.description === originalLanguage
  );

  // 创建自定义 QuickPick
  const quickPick = vscode.window.createQuickPick();
  quickPick.items = langOptions;
  quickPick.title = 'Setup Language';
  quickPick.placeholder = 'Select Language';
  // quickPick.title = t('setup_language');
  // quickPick.placeholder = t('select_language');
  quickPick.activeItems = [langOptions[activeItemIndex]];

  // TODO: selection 不起作用， 用active 的话accept 的时候也会触发active 事件
  // 当选择变化时实时预览
  //   quickPick.onDidChangeSelection((selectedItems) => {
  //     if (selectedItems.length > 0) {
  //       const selectedLanguage = selectedItems[0].description;
  //       messenger.send('changeLanguage', { text: selectedLanguage });
  //     }
  //   });

  // 监听取消操作，恢复原始语言设置
  //   quickPick.onDidHide((item) => {
  //     messenger.send('changeLanguage', { text: originalLanguage });
  //     quickPick.dispose();
  //   });

  // 确认选择并应用
  quickPick.onDidAccept(() => {
    const selectedLanguage = quickPick.selectedItems[0].description;
    config().update('lang', selectedLanguage, true);
    quickPick.dispose();
  });

  quickPick.show();
}
