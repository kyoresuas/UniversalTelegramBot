import { di } from "./awilixManager";
import { asClass, asValue } from "awilix";
import { BotService } from "@/services/bot";
import { appLogger } from "../winstonLogger";
import { AuthService } from "@/services/auth";
import { CronService } from "@/services/cron";
import { UserService } from "@/services/user";
import { AdminService } from "@/services/admin";
import { CacheService } from "@/services/cache";
import { getTelegramBot } from "../setupTelegram";
import { SettingsService } from "@/services/settings";
import appDataSource from "@/constants/appDataSource";
import { User, TelegramAccount, UserSettings } from "@/entities/user";

/**
 * Внедрить зависимости в DI-контейнер
 */
export const setupDIContainer = (): void => {
  appLogger.info("Внедрение зависимостей...");

  // Таблицы операционной базы данных
  const userRepository = appDataSource.getRepository(User);
  const telegramAccountRepository =
    appDataSource.getRepository(TelegramAccount);
  const userSettingsRepository = appDataSource.getRepository(UserSettings);

  di.container.register({
    // Таблицы операционной базы данных
    userRepository: asValue(userRepository),
    userSettingsRepository: asValue(userSettingsRepository),
    telegramAccountRepository: asValue(telegramAccountRepository),

    // Сервисы
    [BotService.key]: asClass(BotService).singleton(),
    [AuthService.key]: asClass(AuthService).singleton(),
    [CronService.key]: asClass(CronService).singleton(),
    [UserService.key]: asClass(UserService).singleton(),
    [CacheService.key]: asClass(CacheService).singleton(),
    [AdminService.key]: asClass(AdminService).singleton(),
    [SettingsService.key]: asClass(SettingsService).singleton(),
  });

  // Экземпляр Telegram-бота
  const telegramBot = getTelegramBot();
  if (telegramBot) {
    di.container.register({ telegramBot: asValue(telegramBot) });
  }

  appLogger.verbose("Зависимости внедрены");
};
