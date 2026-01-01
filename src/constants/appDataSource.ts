import "reflect-metadata";
import entities from "./entities";
import appConfig from "./appConfig";
import { DataSource } from "typeorm";

/**
 * Ресурсы для операционной базы данных
 */
const appDataSource = new DataSource({
  type: "postgres",
  url: appConfig.POSTGRESQL_URL,
  entities,
  migrations: [
    appConfig.ENV === "production"
      ? "./dist/migrations/*.js"
      : appConfig.ENV === "preproduction"
      ? "./build/migrations/*.js"
      : "./src/migrations/*.ts",
  ],
  synchronize: false,
  extra: {
    keepAlive: true,
  },
  poolSize: 10,
  connectTimeoutMS: 10000,
});

export default appDataSource;
