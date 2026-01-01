import { di } from "./awilixManager";
import { asClass, asValue } from "awilix";
import { BotService } from "@/services/bot";
import { appLogger } from "../winstonLogger";
import { AuthService } from "@/services/auth";
import { CronService } from "@/services/cron";
import { UserService } from "@/services/user";
import { CacheService } from "@/services/cache";
import { getTelegramBot } from "../setupTelegram";
import appDataSource from "@/constants/appDataSource";
import { User, TelegramAccount } from "@/entities/user";

/**
 * Внедрить зависимости в DI-контейнер
 */
export const setupDIContainer = (): void => {
  appLogger.info("Внедрение зависимостей...");

  // Таблицы операционной базы данных
  const userRepository = appDataSource.getRepository(User);
  const telegramAccountRepository =
    appDataSource.getRepository(TelegramAccount);

  di.container.register({
    // Таблицы операционной базы данных
    userRepository: asValue(userRepository),
    telegramAccountRepository: asValue(telegramAccountRepository),

    // Сервисы
    [BotService.key]: asClass(BotService).singleton(),
    [AuthService.key]: asClass(AuthService).singleton(),
    [CronService.key]: asClass(CronService).singleton(),
    [UserService.key]: asClass(UserService).singleton(),
    [CacheService.key]: asClass(CacheService).singleton(),
  });

  // Экземпляр Telegram-бота
  const telegramBot = getTelegramBot();
  if (telegramBot) {
    di.container.register({ telegramBot: asValue(telegramBot) });
  }

  appLogger.verbose("Зависимости внедрены");
};
