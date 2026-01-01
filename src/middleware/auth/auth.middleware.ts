import i18next from "i18next";
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
        await ctx.answerCbQuery(ctx.t("middleware.auth.AUTH_FAILED"));
      }
      return;
    }

    const authService = di.container.resolve<AuthService>(AuthService.key);

    const { user } = await authService.authenticateTelegramUser({
      telegram: from,
    });

    ctx.state.user = user;

    const languageCode = from.language_code?.toLowerCase() ?? null;
    const fallbackLanguage =
      languageCode && languageCode.startsWith("en") ? "en" : "ru";
    const language = user.settings?.language ?? fallbackLanguage;

    ctx.state.language = language;
    const fixedT = i18next.getFixedT(language);
    ctx.t = (key, args) => fixedT(key, args);

    await next();
  } catch (err) {
    if (ctx.callbackQuery) {
      await ctx.answerCbQuery(ctx.t("middleware.auth.AUTH_FAILED"));
    }
    appLogger.error(`Ошибка при авторизации: ${(err as Error).message}`);
    return;
  }
};
