import i18next from "i18next";
import { MiddlewareFn } from "telegraf";
import { BotContext } from "@/types/telegram";

/**
 * Middleware для выбора языка пользователя и удобного доступа к переводам
 */
export const i18nMiddleware: MiddlewareFn<BotContext> = async (ctx, next) => {
  const code = ctx.from?.language_code?.toLowerCase() ?? null;

  const language: "ru" | "en" = code && code.startsWith("en") ? "en" : "ru";

  ctx.state.language = language;

  const t = i18next.getFixedT(language);
  ctx.t = (key, args) => t(key, args);

  await next();
};
