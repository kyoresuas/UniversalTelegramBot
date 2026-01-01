import {
  authMiddleware,
  i18nMiddleware,
  contextHelpersMiddleware,
} from "@/middleware";
import { appLogger } from "./winstonLogger";
import { Telegraf, session } from "telegraf";
import * as Controllers from "@/controllers";
import appConfig from "@/constants/appConfig";
import { setupTelegramCommands } from "./setupTelegramCommands";
import { registerBotHandlers } from "@/helpers/registerBotHandlers";
import { BotController, BotContext, SessionData } from "@/types/telegram";

let telegramBotInstance: Telegraf<BotContext>;

/**
 * Создать и вернуть экземпляр Telegram-бота
 */
export const getTelegramBot = (): Telegraf<BotContext> | undefined => {
  if (telegramBotInstance) return telegramBotInstance;

  if (!appConfig.TELEGRAM_BOT_TOKEN) {
    appLogger.error("Нет токена для подключения к Telegram");
    return undefined;
  }

  telegramBotInstance = new Telegraf<BotContext>(appConfig.TELEGRAM_BOT_TOKEN);

  return telegramBotInstance;
};

/**
 * Инициализация и запуск бота
 */
export const setupTelegramBot = async (): Promise<void> => {
  const bot = getTelegramBot();

  if (!bot) return;

  appLogger.info("Запуск Telegram-бота...");

  // Базовый обработчик ошибок
  bot.catch((err) => {
    appLogger.error(`Ошибка Telegram: ${(err as Error).message}`);
  });

  // Сбросить webhook
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
  } catch (err) {
    appLogger.warn(`Не удалось сбросить webhook: ${(err as Error).message}`);
  }

  // Авторизация Telegram-пользователя
  bot.use(
    session({
      defaultSession: (): SessionData => ({ test: "" }),
    })
  );
  // Хелперы для контекста
  bot.use(contextHelpersMiddleware);
  // Мультиязычность
  bot.use(i18nMiddleware);
  // Авторизация
  bot.use(authMiddleware);

  // Команды бота в боковом меню Telegram
  await setupTelegramCommands(bot);

  // Регистрация контроллеров
  const controllers = Object.values(Controllers).filter(
    (controller): controller is BotController =>
      controller && "meta" in controller && "handler" in controller
  );
  registerBotHandlers(bot, controllers);

  // Запустить бота
  try {
    const me = await bot.telegram.getMe();
    appLogger.verbose(
      `Telegram-бот запущен и авторизован как @${me.username} (id: ${me.id})`
    );
    await bot.launch();
  } catch (err) {
    appLogger.error(
      `Не удалось запустить Telegram-бота: ${(err as Error).message}`
    );
  }

  // Грейсфул-шатдаун
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
