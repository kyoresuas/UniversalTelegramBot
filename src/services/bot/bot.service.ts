import { Markup } from "telegraf";
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

    const text = "Привет!";
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback("Информация", "info")],
    ]);

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

    const text = "Информация о боте";
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback("Назад", "back")],
    ]);

    await ctx.replyWithNewMessage(text, keyboard);
  }
}
