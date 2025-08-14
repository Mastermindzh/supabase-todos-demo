import { Pool } from "../../../deps.ts";

export type DenoPostgresDriverConfig = {
  pool: Pool | (() => Promise<Pool>);
  rls?: {
    currentUserId: string;
  };
};
