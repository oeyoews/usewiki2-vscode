/** 占位命令，尚未实现刷新逻辑。 */
import { notify } from "../notify";

export async function cli() {
  notify("开发中", "info");
}

export const name = "usewiki2.refreshwiki";
