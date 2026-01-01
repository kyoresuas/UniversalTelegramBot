import { Markup } from "telegraf";
import { BotContext } from "@/types/telegram";

/**
 * Сервис с основными методами бота
 */
export class BotService {
  static key = "botService";

  constructor() {}

  /**
   * Начать
   */
  async handleStart(ctx: BotContext, back?: boolean): Promise<void> {
    if (!ctx.from) return;

    const text = "Hello";
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback("Назад", "back")],
    ]);

    if (back) {
      await ctx.replyWithNewMessage(text, keyboard);
    } else {
      await ctx.reply(text, keyboard);
    }
  }
}
