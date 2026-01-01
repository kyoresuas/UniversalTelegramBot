import {
  User,
  UserLanguage,
  UserSettings,
  TelegramAccount,
} from "@/entities/user";
import { Repository } from "typeorm";

/**
 * Сервис для авторизации пользователей
 */
export class AuthService {
  static key = "authService";

  constructor(
    private userRepository: Repository<User>,
    private userSettingsRepository: Repository<UserSettings>,
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
    const languageCode = from.language_code?.toLowerCase() ?? null;
    const defaultLanguage: UserLanguage =
      languageCode && languageCode.startsWith("en") ? "en" : "ru";

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
    } else {
      Object.assign(telegram, telegramData);
    }

    telegram = await this.telegramAccountRepository.save(telegram);

    // Найти или создать пользователя
    let user = telegram.userId
      ? await this.userRepository.findOne({
          where: { id: telegram.userId },
          relations: { settings: true },
        })
      : null;

    if (!user) {
      user = await this.userRepository.save(
        this.userRepository.create({ role: null })
      );
      telegram.userId = user.id;
    }

    // Создать настройки пользователя
    if (!user.settings) {
      user.settings = await this.userSettingsRepository.save(
        this.userSettingsRepository.create({
          userId: user.id,
          language: defaultLanguage,
        })
      );
    }

    // Обновить последнюю активность пользователя
    telegram.lastVisitAt = new Date();

    await this.telegramAccountRepository.save(telegram);

    return { user };
  }
}
