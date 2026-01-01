import { di } from "@/config/DIContainer";
import { BotService } from "@/services/bot";
import { BotHandler } from "@/types/telegram";

export const commonBackHandler: BotHandler = async (ctx) => {
  const botService = di.container.resolve<BotService>(BotService.key);
  await botService.handleStart(ctx, true);
};
