import { Kysely, sql } from "../../deps.ts";
import { Database } from "../../_infrastructure/database/database.ts";

export async function getSharedTasks(db: Kysely<Database>) {
  return await db
    .withSchema("todos")
    .selectFrom("todos as t")
    .innerJoin("todo_assignees as ta", "t.id", "ta.todo_id")
    .innerJoin("people as p", "ta.person_id", "p.id")
    .select([
      "t.title",
      sql<string>`STRING_AGG(p.name, ', ')`.as("assigned_people"),
    ])
    .groupBy("t.title")
    .having(sql`COUNT(p.id)`, ">", sql`1`) // ✅ Fix: Ensures correct SQL boolean evaluation
    .orderBy("t.title")
    .execute();
}
