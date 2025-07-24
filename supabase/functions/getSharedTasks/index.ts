import {
  closePool,
  getKyselyInstance,
} from "../_infrastructure/database/kysely/getKyselyInstance.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getSharedTasks } from "../_shared/queries/getSharedTasks.ts";

Deno.serve(async () => {
  const db = getKyselyInstance();
  const sharedTasks = await getSharedTasks(db);

  // without this... the endpoint can't handle more than 10ish requests at the same time in the cheap supabase version
  // we have no idea why yet.
  closePool();
  return new Response(JSON.stringify(sharedTasks), {
    headers: { "Content-Type": "application/json" },
  });
});
