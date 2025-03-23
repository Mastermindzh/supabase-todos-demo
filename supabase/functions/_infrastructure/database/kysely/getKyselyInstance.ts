import { Database } from "../database.ts";
import {
  Pool,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from "../../../deps.ts";
import { PostgresDriver } from "../deno-postgres-driver/postgresDriver.ts";

/**
 * get a kysely instance backed by the database definition
 * @param connectionString if empty, will use Deno.env.get("POSTGRES_CONNECTION_STRING")
 * @returns Kysely instance
 */
export const getKyselyInstance = <Schema = Database>(
  connectionString?: string
) => {
  const pool = new Pool(
    connectionString ?? Deno.env.get("POSTGRES_CONNECTION_STRING") ?? "",
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
  });
};
