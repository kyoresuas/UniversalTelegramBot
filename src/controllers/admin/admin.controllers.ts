import { UserRole } from "@/entities/user";
import { verifyPreHandler } from "@/middleware";
import { BotController } from "@/types/telegram";
import { adminPanelHandler } from "@/handlers/admin";

/**
 * Админ панель
 */
export const adminPanelController: BotController = {
  meta: {
    event: { type: "callback", data: /^admin:open$/ },
    middlewares: [verifyPreHandler([UserRole.ADMINISTRATOR])],
  },
  handler: adminPanelHandler,
};
