import {
  Entity,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserSettings } from "./userSettings.entity";
import { TelegramAccount } from "./telegramAccount.entity";

export enum UserRole {
  ADMINISTRATOR = "Administrator",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /**
   * Роль пользователя
   */
  @Column({
    type: "enum",
    enum: UserRole,
    enumName: "UserRole",
    nullable: true,
  })
  role!: UserRole | null;

  /**
   * Telegram аккаунт пользователя
   */
  @OneToOne(() => TelegramAccount, (ta: TelegramAccount) => ta.user)
  telegramAccount!: TelegramAccount | null;

  /**
   * Настройки пользователя
   */
  @OneToOne(() => UserSettings, (s: UserSettings) => s.user, { nullable: true })
  settings!: UserSettings | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
