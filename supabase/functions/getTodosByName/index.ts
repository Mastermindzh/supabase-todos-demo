import { getKyselyInstance } from "../_infrastructure/database/kysely/getKyselyInstance.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async () => {
  const db = getKyselyInstance();

  try {
    const todos = await db
      .withSchema("todos")
      .selectFrom("todos")
      .selectAll()
      .limit(10)
      .execute();

    // todos is typed here :)
    const allTitles = todos.map((todo) => {
      return todo.title;
    });

    const response = {
      allTitles,
      todos,
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
});
