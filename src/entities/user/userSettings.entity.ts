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

export type UserLanguage = "ru" | "en";

/**
 * Настройки пользователя
 */
@Entity()
export class UserSettings {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /**
   * Ссылка на пользователя
   */
  @OneToOne(() => User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User;

  /**
   * Внешний ключ на пользователя
   */
  @Column({ type: "uuid", unique: true })
  userId!: string;

  /**
   * Выбранный язык пользователя в боте
   */
  @Column({ type: "text", default: "ru" })
  language!: UserLanguage;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
