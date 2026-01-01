import { BotController } from "@/types/telegram";
import { commonBackHandler, commonStartHandler } from "@/handlers/client";

/**
 * Команда /start
 */
export const commonStartController: BotController = {
  meta: { event: { type: "command", command: "start" } },
  handler: commonStartHandler,
};

/**
 * Возврат к меню
 */
export const commonBackController: BotController = {
  meta: { event: { type: "callback", data: /^back$/ } },
  handler: commonBackHandler,
};
