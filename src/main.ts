import appConfig from "@/constants/appConfig";
import { appLogger } from "@/config/winstonLogger";
import { setupDIContainer } from "@/config/DIContainer";
import { setupTaskQueue } from "@/config/setupTaskQueue";
import { setupTelegramBot } from "@/config/setupTelegram";
import { connectToOperationalDatabase } from "@/config/connectToOperationalDatabase";

const bootstrapApp = async (): Promise<void> => {
  // Внедрить зависимости
  setupDIContainer();

  // Подключиться к операционной базе данных
  try {
    await connectToOperationalDatabase();
  } catch (err) {
    appLogger.fatal((err as Error).message);
  }

  // Запустить очередь задач
  if (appConfig.ENABLED_MODULES.includes("queue")) {
    try {
      setupTaskQueue();
    } catch (err) {
      appLogger.fatal((err as Error).message);
    }
  }

  // Запустить Telegram-бота
  if (appConfig.ENABLED_MODULES.includes("bot")) {
    try {
      await setupTelegramBot();
    } catch (err) {
      appLogger.fatal((err as Error).message);
    }
  }

  appLogger.verbose("Запуск проекта завершён");
};

bootstrapApp();
