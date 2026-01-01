import {
  settingsOpenHandler,
  settingsLanguageHandler,
  settingsSetLanguageHandler,
} from "@/handlers/client";
import { BotController } from "@/types/telegram";

/**
 * Открыть меню настроек
 */
export const settingsOpenController: BotController = {
  meta: { event: { type: "callback", data: /^settings:open$/ } },
  handler: settingsOpenHandler,
};

/**
 * Открыть настройки языка
 */
export const settingsLanguageController: BotController = {
  meta: { event: { type: "callback", data: /^settings:language$/ } },
  handler: settingsLanguageHandler,
};

/**
 * Выбрать язык
 */
export const settingsSetLanguageController: BotController = {
  meta: { event: { type: "callback", data: /^settings:lang:(ru|en)$/ } },
  handler: settingsSetLanguageHandler,
};
