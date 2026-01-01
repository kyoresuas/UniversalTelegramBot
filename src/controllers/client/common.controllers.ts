import {
  commonBackHandler,
  commonInfoHandler,
  commonStartHandler,
} from "@/handlers/client";
import { BotController } from "@/types/telegram";

/**
 * Вывод главного меню
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

/**
 * Информация о боте
 */
export const commonInfoController: BotController = {
  meta: { event: { type: "callback", data: /^info:open$/ } },
  handler: commonInfoHandler,
};
