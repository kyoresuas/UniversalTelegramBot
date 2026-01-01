import { di } from "@/config/DIContainer";
import { BotHandler } from "@/types/telegram";
import { AdminService } from "@/services/admin";

export const adminPanelHandler: BotHandler = async (ctx) => {
  const adminService = di.container.resolve<AdminService>(AdminService.key);
  await adminService.handleOpenAdminPanel(ctx);
};
