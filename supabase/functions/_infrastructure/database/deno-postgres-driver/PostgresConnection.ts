import {
  CompiledQuery,
  DatabaseConnection,
  QueryResult,
  PoolClient,
} from "../../../deps.ts";
import { ReleaseSymbol } from "./SharedReleaseSymbol.ts";

export class PostgresConnection implements DatabaseConnection {
  private client: PoolClient;

  constructor(client: PoolClient) {
    this.client = client;
  }

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    try {
      const result = await this.client.queryObject<O>(compiledQuery.sql, [
        ...compiledQuery.parameters,
      ]);

      if (["INSERT", "UPDATE", "DELETE"].includes(result.command)) {
        const numAffectedRows = BigInt(result.rowCount || 0);

        return {
          numUpdatedOrDeletedRows: numAffectedRows,
          numAffectedRows,
          rows: result.rows ?? [],
        } as QueryResult<O>;
      }

      return {
        rows: result.rows ?? [],
      };
    } catch (err) {
      throw err;
    }
  }

  // streaming isn't supported
  // deno-lint-ignore require-yield
  async *streamQuery<O>(
    _compiledQuery: CompiledQuery
  ): AsyncIterableIterator<QueryResult<O>> {
    // stream not available
    return null;
  }

  [ReleaseSymbol](): void {
    this.client.release();
  }
}
