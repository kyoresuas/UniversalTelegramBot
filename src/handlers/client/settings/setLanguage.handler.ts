import { di } from "@/config/DIContainer";
import { BotHandler } from "@/types/telegram";
import { SettingsService } from "@/services/settings";

export const settingsSetLanguageHandler: BotHandler = async (ctx) => {
  const callbackQuery = ctx.callbackQuery;
  if (!callbackQuery || !("data" in callbackQuery)) return;

  const data = callbackQuery.data;
  const language =
    data === "settings:lang:ru"
      ? "ru"
      : data === "settings:lang:en"
      ? "en"
      : null;

  if (!language) return;

  const settingsService = di.container.resolve<SettingsService>(
    SettingsService.key
  );
  await settingsService.handleSetLanguage(ctx, language);
};
