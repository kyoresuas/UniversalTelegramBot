import { ITask } from "@/types/cron";
import { updateUsersTask } from "@/tasks/service";

export namespace CronContract {
  /**
   * Обновить информацию о всех пользователях (каждый час)
   */
  export const UpdateUsers: ITask = {
    name: "updateUsers",
    schedule: "0 * * * *",
    handler: updateUsersTask,
  };
}
