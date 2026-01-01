import { Markup } from "telegraf";
import { UserRole } from "@/entities/user";
import { BotContext } from "@/types/telegram";

/**
 * Сервис с основными методами бота
 */
export class BotService {
  static key = "botService";

  constructor() {}

  /**
   * Вызвать главное меню
   */
  async handleStart(ctx: BotContext, back?: boolean): Promise<void> {
    if (!ctx.from) return;

    const user = ctx.state.user;

    const text = ctx.t("services.bot.text.WELCOME");
    const buttons = [
      [
        Markup.button.callback(
          ctx.t("services.bot.buttons.SETTINGS"),
          "settings:open"
        ),
      ],
      [Markup.button.callback(ctx.t("services.bot.buttons.INFO"), "info:open")],
    ];

    if (user?.role === UserRole.ADMINISTRATOR) {
      buttons.push([
        Markup.button.callback(
          ctx.t("services.bot.buttons.ADMIN_PANEL"),
          "admin:open"
        ),
      ]);
    }

    const keyboard = Markup.inlineKeyboard(buttons);

    if (back) {
      await ctx.replyWithNewMessage(text, keyboard);
    } else {
      await ctx.reply(text, keyboard);
    }
  }

  /**
   * Информация о боте
   */
  async handleInfo(ctx: BotContext): Promise<void> {
    if (!ctx.from) return;

    const text = ctx.t("services.bot.text.INFO");
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback(ctx.t("common.buttons.BACK"), "back")],
    ]);

    await ctx.replyWithNewMessage(text, keyboard);
  }
}
