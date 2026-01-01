import { Markup } from "telegraf";
import { BotContext } from "@/types/telegram";

export class AdminService {
  static key = "adminService";

  constructor() {}

  /**
   * Открыть панель администратора
   */
  async handleOpenAdminPanel(ctx: BotContext): Promise<void> {
    if (!ctx.from) return;

    const text = ctx.t("services.admin.text.ADMIN_PANEL");
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback(ctx.t("common.buttons.BACK"), "back")],
    ]);

    await ctx.replyWithNewMessage(text, keyboard);
  }
}
