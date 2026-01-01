import "dotenv/config";
import { IAppConfig, Module } from "@/types/shared";

const {
  ENV,
  ENABLED_MODULES,
  ENABLED_TASKS,
  POSTGRESQL_URL,
  TELEGRAM_BOT_TOKEN,
} = process.env;

/**
 * Главная конфигурация проекта
 */
const appConfig: IAppConfig = {
  ENV: ENV as "development" | "preproduction" | "production",
  ENABLED_MODULES: ENABLED_MODULES
    ? (ENABLED_MODULES.split(",") as Module[])
    : [],
  ENABLED_TASKS: ENABLED_TASKS ? ENABLED_TASKS.split(",") : [],
  POSTGRESQL_URL,
  TELEGRAM_BOT_TOKEN,
};

export default appConfig;
