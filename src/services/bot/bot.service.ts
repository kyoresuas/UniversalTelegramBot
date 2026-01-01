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

    const text = "Привет!";
    const buttons = [[Markup.button.callback("Информация", "info")]];

    if (user?.role === UserRole.ADMINISTRATOR) {
      buttons.push([
        Markup.button.callback("Панель администратора", "admin:open"),
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
   * Админ панель
   */
  async handleAdminPanel(ctx: BotContext): Promise<void> {
    if (!ctx.from) return;

    const text = "Админ панель";
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback("Назад", "back")],
    ]);

    await ctx.replyWithNewMessage(text, keyboard);
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
