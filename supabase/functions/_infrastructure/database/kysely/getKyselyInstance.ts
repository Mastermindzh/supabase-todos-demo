import { Database } from "../database.ts";
import {
  Pool,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from "../../../deps.ts";
import { PostgresDriver } from "../deno-postgres-driver/postgresDriver.ts";
import { Logger, LogLevels } from "../../logging/Logger.ts";

type LogObject = {
  durationMs: number;
  sql: string;
  params: readonly unknown[];
  error?: string;
};

/**
 * get a kysely instance backed by the database definition
 * @param connectionString if empty, will use Deno.env.get("POSTGRES_CONNECTION_STRING")
 * @returns Kysely instance
 */
export const getKyselyInstance = <Schema = Database>(
  connectionString?: string
) => {
  const pool = new Pool(
    connectionString ?? Deno.env.get("SUPABASE_DB_URL") ?? "",
    3,
    true
  );

  return new Kysely<Schema>({
    dialect: {
      createAdapter() {
        return new PostgresAdapter();
      },
      createDriver() {
        // this is our own, custom, deno-postgres driver
        return new PostgresDriver({ pool });
      },
      createIntrospector(db: Kysely<Database>) {
        return new PostgresIntrospector(db);
      },
      createQueryCompiler() {
        return new PostgresQueryCompiler();
      },
    },
    log(event) {
      const level = Deno.env.get("LOG_LEVEL") ?? "";
      const currentLevel = LogLevels[level];
      const logLevel = LogLevels["debug"];

      if (currentLevel > logLevel) {
        return;
      }

      let logObject = {
        durationMs: event.queryDurationMillis,
        sql: event.query.sql.replaceAll('"', "'"),
        params: [],
      } as LogObject;

      if (Deno.env.get("LOG_PARAMETERS") === "true") {
        logObject = { ...logObject, params: event.query.parameters };
      }

      if (event.level === "error") {
        Logger.error("Query failed", { ...logObject, error: event.error });
      } else {
        Logger.debug("Query executed", { ...logObject });
      }
    },
  });
};
