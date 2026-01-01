import { User, TelegramAccount } from "@/entities";

export type RegularUser = Pick<User, "id" | "role" | "createdAt" | "updatedAt">;

export type ExtendedUser = RegularUser & {
  telegramAccount: TelegramAccount;
};
