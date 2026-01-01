import { MiddlewareFn } from "telegraf";
import { di } from "@/config/DIContainer";
import { AuthService } from "@/services/auth";
import { BotContext } from "@/types/telegram";
import { appLogger } from "@/config/winstonLogger";

/**
 * Middleware для авторизации Telegram-пользователя
 */
export const authMiddleware: MiddlewareFn<BotContext> = async (ctx, next) => {
  try {
    if (!ctx.chat) {
      return;
    }

    const from = ctx.from;

    if (!from) {
      if (ctx.callbackQuery) {
        await ctx.answerCbQuery("Не удалось авторизоваться");
      }
      return;
    }

    const authService = di.container.resolve<AuthService>(AuthService.key);

    const { user } = await authService.authenticateTelegramUser({
      telegram: from,
    });

    ctx.state.user = user;

    await next();
  } catch (err) {
    if (ctx.callbackQuery) {
      await ctx.answerCbQuery("Ошибка при авторизации в системе");
    }
    appLogger.error(`Ошибка при авторизации: ${(err as Error).message}`);
    return;
  }
};
