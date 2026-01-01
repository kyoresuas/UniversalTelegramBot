import { Repository } from "typeorm";
import { sleep } from "@/utils/sleep";
import { appLogger } from "@/config/winstonLogger";
import { getTelegramBot } from "@/config/setupTelegram";
import { User, UserRole, TelegramAccount } from "@/entities/user";

/**
 * Сервис для управления пользователями
 */
export class UserService {
  static key = "userService";

  constructor(
    private userRepository: Repository<User>,
    private telegramAccountRepository: Repository<TelegramAccount>
  ) {}

  /**
   * Администратор или нет
   */
  async isAdmin(id: string): Promise<boolean> {
    if (!id) return false;

    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user?.role === UserRole.ADMINISTRATOR;
  }

  /**
   * Получить пользователя по telegramId
   */
  async getUserByTelegramId(telegramId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { telegramAccount: { telegramId } },
    });

    return user ?? null;
  }

  /**
   * Обновить информацию о всех пользователях
   */
  async updateUsers(): Promise<void> {
    const bot = getTelegramBot();
    if (!bot) return;

    const telegramAccounts = await this.telegramAccountRepository.find();

    for (const telegram of telegramAccounts) {
      if (telegram.isBot) continue;

      const patch: Partial<TelegramAccount> = {};

      // Получить информацию о чате
      try {
        const chat = await bot.telegram.getChat(telegram.telegramId);

        if (chat.type === "private") {
          if (chat.first_name && chat.first_name !== telegram.firstName) {
            patch.firstName = chat.first_name;
          }
          const lastName = chat.last_name ?? null;
          if (lastName !== telegram.lastName) patch.lastName = lastName;

          const username = chat.username ?? null;
          if (username !== telegram.username) patch.username = username;
        }
      } catch (err) {
        appLogger.warn(
          `Не удалось получить информацию о пользователе ${
            telegram.telegramId
          }: ${(err as Error).message}`
        );
      }

      // Проверить блокировку бота
      try {
        await bot.telegram.sendChatAction(telegram.telegramId, "typing");

        if (telegram.isBotBlocked) {
          patch.isBotBlocked = false;
        }
      } catch (err) {
        if (
          (err as Error).message.includes("blocked") ||
          (err as Error).message.includes("deactivated") ||
          (err as Error).message.includes("chat not found") ||
          (err as Error).message.includes("user not found")
        ) {
          patch.isBotBlocked = true;
        }
      }

      if (Object.keys(patch).length > 0) {
        await this.telegramAccountRepository.update({ id: telegram.id }, patch);
      }

      // Минимальный троттлинг
      await sleep(60);
    }
  }
}
