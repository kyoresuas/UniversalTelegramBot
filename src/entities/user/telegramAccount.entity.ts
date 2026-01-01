import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

/**
 * Telegram аккаунт пользователя
 */
@Entity()
export class TelegramAccount {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /**
   * Ссылка на пользователя
   */
  @OneToOne(() => User, {
    nullable: true,
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User | null;

  /**
   * Внешний ключ на пользователя
   */
  @Column({ type: "uuid", nullable: true, unique: true })
  userId!: string | null;

  /**
   * Пользователь заблокировал бота
   */
  @Column({ type: "boolean", default: false })
  isBotBlocked!: boolean;

  /**
   * Telegram ID
   */
  @Column({ type: "bigint" })
  telegramId!: string;

  /**
   * Является ли аккаунт ботом
   */
  @Column({ type: "boolean", default: false })
  isBot!: boolean;

  /**
   * Имя пользователя
   */
  @Column({ type: "text" })
  firstName!: string;

  /**
   * Фамилия пользователя
   */
  @Column({ type: "text", nullable: true })
  lastName!: string | null;

  /**
   * Username
   */
  @Column({ type: "text", nullable: true })
  username!: string | null;

  /**
   * Код языка пользователя
   */
  @Column({ type: "text", nullable: true })
  languageCode!: string | null;

  /**
   * Есть ли премиум
   */
  @Column({ type: "boolean", nullable: true })
  isPremium!: boolean | null;

  /**
   * Последняя активность
   */
  @UpdateDateColumn()
  lastVisitAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
