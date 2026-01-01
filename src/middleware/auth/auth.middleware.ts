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

    // Получаем язык пользователя
    const languageCode = from.language_code?.toLowerCase() ?? null;
    const fallbackLanguage =
      languageCode && languageCode.startsWith("en") ? "en" : "ru";

    // Если язык не установлен, используем язык из профиля Telegram
    const language = user.settings?.language ?? fallbackLanguage;

    // Устанавливаем язык в контекст
    ctx.state.language = language;

    // Устанавливаем переводы в контекст
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
