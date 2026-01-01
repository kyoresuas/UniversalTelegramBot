import i18next from "i18next";
import { Markup } from "telegraf";
import { Repository } from "typeorm";
import { BotContext } from "@/types/telegram";
import { UserLanguage, UserSettings } from "@/entities/user";

export class SettingsService {
  static key = "settingsService";

  constructor(private userSettingsRepository: Repository<UserSettings>) {}

  /**
   * Открыть меню настроек
   */
  async handleOpenSettings(ctx: BotContext): Promise<void> {
    if (!ctx.from) return;

    const text = ctx.t("services.settings.text.TITLE");
    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback(
          ctx.t("services.settings.buttons.LANGUAGE"),
          "settings:language"
        ),
      ],
      [Markup.button.callback(ctx.t("common.buttons.BACK"), "back")],
    ]);

    await ctx.replyWithNewMessage(text, keyboard);
  }

  /**
   * Открыть выбор языка
   */
  async handleOpenLanguageSettings(ctx: BotContext): Promise<void> {
    if (!ctx.from) return;

    const text = ctx.t("services.settings.text.CHOOSE_LANGUAGE");
    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback(
          ctx.t("services.settings.buttons.RU"),
          "settings:lang:ru"
        ),
      ],
      [
        Markup.button.callback(
          ctx.t("services.settings.buttons.EN"),
          "settings:lang:en"
        ),
      ],
      [Markup.button.callback(ctx.t("common.buttons.BACK"), "settings:open")],
    ]);

    await ctx.replyWithNewMessage(text, keyboard);
  }

  /**
   * Выбрать язык
   */
  async handleSetLanguage(
    ctx: BotContext,
    language: UserLanguage
  ): Promise<void> {
    const userId = ctx.state.user?.id;
    if (!userId) return;

    const { updated } = await this.setUserLanguage({ userId, language });
    if (!updated) {
      await ctx.answerCbQuery(
        ctx.t("services.settings.text.LANGUAGE_ALREADY_SELECTED")
      );
      return;
    }

    ctx.state.language = language;
    const fixedT = i18next.getFixedT(language);
    ctx.t = (key, args) => fixedT(key, args);

    const text = ctx.t("services.settings.text.CHOOSE_LANGUAGE");
    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback(
          ctx.t("services.settings.buttons.RU"),
          "settings:lang:ru"
        ),
      ],
      [
        Markup.button.callback(
          ctx.t("services.settings.buttons.EN"),
          "settings:lang:en"
        ),
      ],
      [Markup.button.callback(ctx.t("common.buttons.BACK"), "settings:open")],
    ]);

    await ctx.answerCbQuery(ctx.t("services.settings.text.LANGUAGE_UPDATED"));

    await ctx.editMessageText(text, keyboard);
  }

  /**
   * Установить выбранный язык пользователя
   */
  async setUserLanguage(params: {
    userId: string;
    language: UserLanguage;
  }): Promise<{ settings: UserSettings; updated: boolean }> {
    const { userId, language } = params;

    let settings = await this.userSettingsRepository.findOne({
      where: { userId },
    });

    if (!settings) {
      settings = this.userSettingsRepository.create({ userId, language });
      return {
        settings: await this.userSettingsRepository.save(settings),
        updated: true,
      };
    }

    if (settings.language === language) {
      return { settings, updated: false };
    }

    settings.language = language;
    return {
      settings: await this.userSettingsRepository.save(settings),
      updated: true,
    };
  }
}
