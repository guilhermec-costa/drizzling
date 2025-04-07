import {config} from "dotenv";
config();
import {migrate} from "drizzle-orm/postgres-js/migrator"
import {drizzle} from "drizzle-orm/postgres-js"
import postgres from "postgres"
import path, {dirname} from "path";

export function buildConnectionStr() {
  const {
    DB_DATABASE,
    DB_HOST,
    DB_PORT,
    DB_PWD,
    DB_USER
  } = process.env;

  return `postgresql://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
}

export function getPgClient() {
  const migClient = postgres(buildConnectionStr(), {
    idle_timeout: 10,
    connect_timeout: 300,
    max_lifetime: 10
  });

  return migClient;
}



(async function() {
  const migrationFolderPath = path.resolve(path.resolve(), "./drizzle/migrations");
  const migClient = getPgClient(); 
  await  migrate(drizzle(migClient), {
    migrationsFolder: migrationFolderPath
  });

  await migClient.end();
})();