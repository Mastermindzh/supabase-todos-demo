import { Database } from "../database.ts";
import {
  Pool,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from "../../../deps.ts";
import { PostgresDriver } from "../deno-postgres-driver/postgresDriver.ts";
import { Logger, LogLevels, WinstonLogLevel } from "../../logging/Logger.ts";

type LogObject = {
  durationMs: number;
  sql: string;
  params: readonly unknown[];
  error?: string;
};

type LogEvent = {
  level: "query" | "error";
  query: {
    sql: string;
    parameters: readonly unknown[];
  };
  queryDurationMillis: number;
  error?: unknown;
};

// Global pool instance - created once per function instance
let globalPool: Pool | null = null;

const getPool = (connectionString?: string): Pool => {
  if (!globalPool) {
    const useCustomConnectionString =
      Deno.env.get("USE_CUSTOM_CONNECTION_STRING") === "true";
    const supabaseConnectionUrl = Deno.env.get("SUPABASE_DB_URL") ?? "";
    const customConnectionUrl = Deno.env.get("POSTGRES_DB_URL") ?? "";

    globalPool = new Pool(
      connectionString ??
        (useCustomConnectionString
          ? customConnectionUrl
          : supabaseConnectionUrl),
      parseInt(Deno.env.get("POSTGRES_POOL_SIZE") ?? "2", 10),
      Deno.env.get("POSTGRES_POOL_LAZY") === "true"
    );
  }

  return globalPool;
};
type RlsContext = {
  currentUserId: string;
};

type KyselyConfig = {
  connectionString?: string;
  rls?: RlsContext; // Optional RLS configuration
};

/**
 * get a kysely instance backed by the database definition
 * @param connectionString if empty, will use Deno.env.get("SUPABASE_DB_URL")
 * @returns Kysely instance
 */
export const getKyselyInstance = <Schema = Database>(
  connectionString?: string,
  currentUserId?: string
) => {
  const pool = getPool(connectionString);

  return new Kysely<Schema>({
    dialect: {
      createAdapter() {
        return new PostgresAdapter();
      },
      createDriver() {
        return new PostgresDriver({ pool, rls });
      },
      createIntrospector(db: Kysely<Database>) {
        return new PostgresIntrospector(db);
      },
      createQueryCompiler() {
        return new PostgresQueryCompiler();
      },
    },
    log(event: LogEvent) {
      const level = Deno.env.get("LOG_LEVEL") ?? "";
      const currentLevel = LogLevels[level as WinstonLogLevel];
      const logLevel = LogLevels["debug"];

      if (currentLevel > logLevel) {
        if (event.level === "error") {
          Logger.error("Query failed", { error: event.error });
        }
        return;
      }

      let logObject: LogObject = {
        durationMs: event.queryDurationMillis,
        sql: event.query.sql.replaceAll('"', "'"),
        params: [],
      };

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

/**
 * Only use this if you know what you are doing
 */
export const closePool = async () => {
  if (globalPool) {
    await globalPool.end();
    globalPool = null;
  }
};
