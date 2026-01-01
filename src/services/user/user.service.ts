import { Repository } from "typeorm";
import { User, UserRole } from "@/entities/user";

/**
 * Сервис для управления пользователями
 */
export class UserService {
  static key = "userService";

  constructor(private userRepository: Repository<User>) {}

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
}
