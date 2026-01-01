import { di } from "@/config/DIContainer";
import { BotHandler } from "@/types/telegram";
import { SettingsService } from "@/services/settings";

export const settingsOpenHandler: BotHandler = async (ctx) => {
  const settingsService = di.container.resolve<SettingsService>(
    SettingsService.key
  );
  await settingsService.handleOpenSettings(ctx);
};
