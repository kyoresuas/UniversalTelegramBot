import { appLogger } from "./winstonLogger";
import appConfig from "@/constants/appConfig";
import appDataSource from "@/constants/appDataSource";

/**
 * Подключение к операционной базе данных
 */
export const connectToOperationalDatabase = async (): Promise<void> => {
  if (!appConfig.POSTGRESQL_URL) {
    appLogger.error("Нет URL для подключения к операционной базе данных");
    return;
  }

  appLogger.info("Подключение к операционной базе данных...");

  try {
    await appDataSource.initialize();

    appLogger.verbose("Соединение с операционной базой данных установлено");
  } catch (err) {
    appLogger.error((err as Error).message);

    appLogger.error("Не удалось подключиться к операционной базе данных");
    return;
  }
};
