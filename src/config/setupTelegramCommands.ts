import { Telegraf } from "telegraf";
import { appLogger } from "./winstonLogger";
import { BotContext } from "@/types/telegram";

/**
 * Настройка команд бота в боковом меню Telegram
 */
export const setupTelegramCommands = async (
  bot: Telegraf<BotContext>
): Promise<void> => {
  try {
    await bot.telegram.setMyCommands([
      {
        command: "start",
        description: "Открыть главное меню",
      },
    ]);
  } catch (err) {
    appLogger.warn(
      `Не удалось задать список команд бота: ${(err as Error).message}`
    );
  }
};
