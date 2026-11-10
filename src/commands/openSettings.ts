/** 在设置 UI 中筛选本扩展（`@ext:oeyoews.usewiki2`）。 */
import { commands as vscodeCommands } from "vscode";
import { commands, name as extensionName, publisher } from "../generated/meta";

export const name = commands.opensettings;

export async function cli(): Promise<void> {
  const searchQuery = `@ext:${publisher}.${extensionName}`;
  await vscodeCommands.executeCommand("workbench.action.openSettings", searchQuery);
}
