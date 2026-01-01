const fs = require("fs");
const child_process = require("child_process");

// Флаги запуска
const ARGS = new Set(process.argv.slice(2));
const FAST = ARGS.has("--fast") || ARGS.has("-f");

/**
 * Название процесса в PM2
 */
const PROCESS_NAME = "universal-telegram-bot";

/**
 * Обновление проекта на сервере
 */
async function deploy() {
  console.log(`Режим быстрого деплоя: ${FAST ? "включен" : "отключен"}`);
  console.log("Получение обновлений из git...");

  child_process.execSync("git pull");

  if (!FAST) {
    console.log("Установка пакетов...");
    child_process.execSync("npm install");
  }

  console.log("Компиляция в JavaScript...");

  child_process.execSync("npm run build");

  if (!FAST) {
    console.log("Выполнение миграций...");
    try {
      const migrationRunResult = child_process
        .execSync("npm run migration:run")
        .toString();
      if (migrationRunResult.includes("Error during migration run")) {
        throw migrationRunResult;
      }
    } catch (data) {
      console.log(data);
      throw Error("Не удалось выполнить миграцию!");
    }

    console.log("Проверка целостности данных...");
    try {
      const schemaLogResult = child_process
        .execSync("npm run schema:log")
        .toString();
      if (schemaLogResult.includes("Schema synchronization will execute")) {
        throw schemaLogResult;
      }
    } catch (data) {
      console.log(data);
      throw Error("Обнаружена потеря данных!");
    }
  } else {
    console.log("Пропуск миграций и проверки целостности (--fast)");
  }

  console.log("Перемещение ресурсов...");

  fs.cpSync("./build", "./dist", { recursive: true });

  console.log("Получение списка процессов...");

  const pm2List = JSON.parse(child_process.execSync("pm2 jlist --silent"));
  const processIsExists = !!pm2List.find(
    (pm2Process) => pm2Process.name === PROCESS_NAME
  );

  console.log("Запуск проекта в режиме PRODUCTION...");

  if (processIsExists) {
    child_process.execSync(`pm2 restart "${PROCESS_NAME}"`);
  } else {
    child_process.execSync(
      `pm2 start npm --name "${PROCESS_NAME}" -- run start`
    );
  }

  removeBuildDirectory();

  console.log("Проект успешно запущен!");
}

/**
 * Очистить директорию со временной сборкой
 */
function removeBuildDirectory() {
  if (fs.existsSync("./build")) {
    fs.rmSync("./build", { recursive: true });
  }
}

deploy().catch((err) => {
  removeBuildDirectory();

  console.error(err.message);

  process.exit(1);
});
