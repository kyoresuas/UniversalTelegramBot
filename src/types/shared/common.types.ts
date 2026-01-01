import { TaskType } from "../cron";

export type Module = "queue" | "bot";

export interface IAppConfig {
  ENV: "development" | "preproduction" | "production";
  ENABLED_MODULES: Module[];
  ENABLED_TASK_TYPES: TaskType[];
  ENABLED_TASKS: string[];
  ENCRYPTION_KEY?: string;
  POSTGRESQL_URL?: string;
  TELEGRAM_BOT_TOKEN?: string;
}
