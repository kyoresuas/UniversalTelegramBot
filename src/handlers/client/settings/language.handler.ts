import { di } from "@/config/DIContainer";
import { BotHandler } from "@/types/telegram";
import { SettingsService } from "@/services/settings";

export const settingsLanguageHandler: BotHandler = async (ctx) => {
  const settingsService = di.container.resolve<SettingsService>(
    SettingsService.key
  );
  await settingsService.handleOpenLanguageSettings(ctx);
};
