import { BotContext } from "@/types/telegram";

/**
 * Получить Telegram ID из контекста
 */
export const getTelegramId = (ctx: BotContext): string => {
  const id = ctx.from?.id;

  if (id === undefined || id === null) {
    throw new Error(
      "Не удалось определить Telegram ID пользователя из контекста"
    );
  }

  return id.toString();
};
