import { Repository } from "typeorm";
import { User, TelegramAccount } from "@/entities/user";

/**
 * Сервис для авторизации пользователей
 */
export class AuthService {
  static key = "authService";

  constructor(
    private userRepository: Repository<User>,
    private telegramAccountRepository: Repository<TelegramAccount>
  ) {}

  /**
   * Авторизация по Telegram
   */
  async authenticateTelegramUser(params: {
    telegram: {
      id: number | string;
      is_bot: boolean;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_premium?: boolean;
    };
  }): Promise<{ user: User }> {
    const from = params.telegram;
    const telegramId = String(from.id);

    // Найти или создать профиль Telegram
    let telegram = await this.telegramAccountRepository.findOne({
      where: { telegramId },
    });

    const telegramData = {
      telegramId,
      isBot: from.is_bot,
      firstName: from.first_name,
      lastName: from.last_name ?? null,
      username: from.username ?? null,
      languageCode: from.language_code ?? null,
      isPremium: from.is_premium ?? null,
    };

    if (!telegram) {
      telegram = this.telegramAccountRepository.create(telegramData);
      await this.telegramAccountRepository.insert(telegram);
    } else {
      await this.telegramAccountRepository.update(
        { id: telegram.id },
        telegramData
      );
    }

    // Найти или создать пользователя
    let user = telegram.userId
      ? await this.userRepository.findOne({ where: { id: telegram.userId } })
      : null;

    if (!user) {
      user = this.userRepository.create({ role: null });
      await this.userRepository.insert(user);
      await this.telegramAccountRepository.update(
        { id: telegram.id },
        { userId: user.id }
      );
    }

    // Обновить последнюю активность пользователя
    telegram.lastVisitAt = new Date();

    await this.telegramAccountRepository.save(telegram);

    return { user };
  }
}
