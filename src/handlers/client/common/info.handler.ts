import { di } from "@/config/DIContainer";
import { BotService } from "@/services/bot";
import { BotHandler } from "@/types/telegram";

export const commonInfoHandler: BotHandler = async (ctx) => {
  const botService = di.container.resolve<BotService>(BotService.key);
  await botService.handleInfo(ctx);
};
