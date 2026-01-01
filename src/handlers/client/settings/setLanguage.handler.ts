import { di } from "@/config/DIContainer";
import { BotHandler } from "@/types/telegram";
import { SettingsService } from "@/services/settings";

export const settingsSetLanguageHandler: BotHandler = async (ctx) => {
  const data =
    ctx.callbackQuery && "data" in ctx.callbackQuery
      ? ctx.callbackQuery.data
      : null;

  const match =
    typeof data === "string" ? data.match(/^settings:lang:(ru|en)$/) : null;
  if (!match) return;

  const language = match[1] as "ru" | "en";

  const settingsService = di.container.resolve<SettingsService>(
    SettingsService.key
  );
  await settingsService.handleSetLanguage(ctx, language);
};
