import { MiddlewareFn } from "telegraf";
import { BotContext } from "@/types/telegram";

/**
 * Middleware, добавляющее удобные helper-методы в контекст бота
 */
export const contextHelpersMiddleware: MiddlewareFn<BotContext> = async (
  ctx,
  next
) => {
  ctx.replyWithNewMessage = async (text, extra) => {
    // Для callback-запросов сначала корректно отвечаем и удаляем старое сообщение
    if (ctx.callbackQuery) {
      try {
        await ctx.answerCbQuery();
      } catch {
        // Игнорируем ошибки ответа на callback
      }

      const message = ctx.callbackQuery.message;
      if (message && "message_id" in message && message.chat) {
        try {
          await ctx.telegram.deleteMessage(message.chat.id, message.message_id);
        } catch {
          // Сообщение уже могло быть удалено/изменено
        }
      }
    }

    return ctx.reply(text, { ...(extra || {}), disable_notification: true });
  };

  await next();
};
