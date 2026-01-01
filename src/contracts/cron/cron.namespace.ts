import { ITask } from "@/types/cron";
import { updateUsersTask } from "@/tasks/service";

export namespace CronContract {
  /**
   * Обновить информацию о всех пользователях (каждый час)
   */
  export const UpdateUsers: ITask = {
    name: "UpdateUsers",
    schedule: "0 * * * *",
    handler: updateUsersTask,
  };
}
