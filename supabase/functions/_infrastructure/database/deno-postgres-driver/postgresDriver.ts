import {
  CompiledQuery,
  DatabaseConnection,
  Driver,
  TransactionSettings,
  Pool,
  PoolClient,
} from "../../../deps.ts";
import { DenoPostgresDriverConfig } from "./DenoPostgresDriverConfig.ts";
import { PostgresConnection } from "./PostgresConnection.ts";
import { ReleaseSymbol } from "./SharedReleaseSymbol.ts";

const transactionKeywords = {
  startWithIsolationlevel: "start transaction isolation level",
  begin: "begin",
  commit: "commit",
  rollback: "rollback",
};

export class PostgresDriver implements Driver {
  readonly #config: DenoPostgresDriverConfig;
  readonly #connections = new WeakMap<PoolClient, DatabaseConnection>();
  #pool?: Pool;

  constructor(config: DenoPostgresDriverConfig) {
    this.#config = config;
  }

  async init(): Promise<void> {
    this.#pool =
      typeof this.#config.pool === "function"
        ? await this.#config.pool()
        : this.#config.pool;
  }

  /**
   * reuse a connection if available, or create a new one
   * @returns a connection to the database
   */
  async acquireConnection(): Promise<DatabaseConnection> {
    const client = await this.#pool!.connect();
    let connection = this.#connections.get(client);

    if (!connection) {
      if (this.#config.rls?.currentUserId) {
        await client.queryArray(
          `SET app.current_user_id = '${this.#config.rls.currentUserId}'`
        );
      }

      connection = new PostgresConnection(client);
      this.#connections.set(client, connection);
    }

    return connection;
  }

  async beginTransaction(
    connection: DatabaseConnection,
    settings: TransactionSettings
  ): Promise<void> {
    const { begin, startWithIsolationlevel } = transactionKeywords;

    if (settings.isolationLevel) {
      await connection.executeQuery(
        CompiledQuery.raw(
          `${startWithIsolationlevel} ${settings.isolationLevel}`
        )
      );
    } else {
      await connection.executeQuery(CompiledQuery.raw(begin));
    }
  }

  async commitTransaction(connection: DatabaseConnection) {
    const { commit } = transactionKeywords;
    await connection.executeQuery(CompiledQuery.raw(commit));
  }

  async rollbackTransaction(connection: DatabaseConnection) {
    const { rollback } = transactionKeywords;
    await connection.executeQuery(CompiledQuery.raw(rollback));
  }

  // deno-lint-ignore require-await
  async releaseConnection(connection: PostgresConnection) {
    connection[ReleaseSymbol]();
  }

  async destroy(): Promise<void> {
    if (this.#pool) {
      const pool = this.#pool;
      this.#pool = undefined;
      await pool.end();
    }
  }
}
