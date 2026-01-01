import { di } from "@/config/DIContainer";
import { TaskHandler } from "@/types/cron";
import { UserService } from "@/services/user";

export const updateUsersTask: TaskHandler = async () => {
  const userService = di.container.resolve<UserService>(UserService.key);

  await userService.updateUsers();
};
