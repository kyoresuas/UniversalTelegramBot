import { MiddlewareFn, Telegraf } from "telegraf";
import { appLogger } from "@/config/winstonLogger";
import { BotContext, BotController } from "@/types/telegram";

/**
 * Регистрация обработчиков бота
 */
export const registerBotHandlers = (
  bot: Telegraf<BotContext>,
  controllers: BotController[]
): void => {
  const compose = (
    middlewares: MiddlewareFn<BotContext>[],
    handler: MiddlewareFn<BotContext>
  ): MiddlewareFn<BotContext> => {
    return async (ctx, next) => {
      let index = -1;

      const dispatch = async (i: number): Promise<void> => {
        if (i <= index) return;
        index = i;

        const fn = i === middlewares.length ? handler : middlewares[i];
        if (!fn) return;

        await fn(ctx, () => dispatch(i + 1));
      };

      await dispatch(0);
      await next();
    };
  };

  // Регистрация обработчиков бота
  controllers.forEach(({ meta, handler }) => {
    const chain = meta.middlewares ?? [];

    // Создаем middleware для обработки события
    const handlerMiddleware: MiddlewareFn<BotContext> = async (ctx) => {
      await handler(ctx);
    };

    // Создаем комбинированный middleware
    const combined = compose(chain, handlerMiddleware);

    // Регистрируем middleware в зависимости от типа события
    switch (meta.event.type) {
      case "command": {
        bot.command(meta.event.command, combined);
        break;
      }
      case "hears": {
        bot.hears(meta.event.text, combined);
        break;
      }
      case "text": {
        bot.on("text", combined);
        break;
      }
      case "callback": {
        if (meta.event.data) {
          bot.action(meta.event.data, combined);
        } else {
          bot.on("callback_query", combined);
        }
        break;
      }
      default: {
        appLogger.warn("Неизвестный тип события контроллера бота");
      }
    }
  });
};
