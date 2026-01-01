import { UserRole } from "@/entities/user";
import { BotContext } from "@/types/telegram";
import { Markup, MiddlewareFn } from "telegraf";

/**
 * PreHandler для проверки прав
 */
export const verifyPreHandler = (
  roles: UserRole[]
): MiddlewareFn<BotContext> => {
  return async (ctx, next) => {
    if (!roles?.length) {
      await next();
      return;
    }

    const user = ctx.state.user;
    const role = user?.role ?? null;

    if (!role || !roles.includes(role)) {
      if (ctx.callbackQuery) {
        await ctx.answerCbQuery(
          ctx.t("middleware.verify.NOT_ENOUGH_PERMISSIONS")
        );
        return;
      }

      ctx.replyWithNewMessage(
        ctx.t("middleware.verify.NOT_ENOUGH_PERMISSIONS"),
        Markup.inlineKeyboard([
          [Markup.button.callback(ctx.t("common.buttons.BACK"), "back")],
        ])
      );
      return;
    }

    await next();
  };
};
