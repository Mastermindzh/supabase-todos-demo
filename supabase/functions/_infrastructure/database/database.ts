export type Database = {
  people: PeopleTable;
  categories: CategoriesTable;
  todos: TodosTable;
  todo_assignees: TodoAssigneesTable;
};

export type PeopleTable = {
  id: number;
  name: string;
  email: string;
  username: string;
};

export type CategoriesTable = {
  id: number;
  name: string;
};

export type TodosTable = {
  id: number;
  title: string;
  description: string | null;
  category_id: number | null;
  created_at: Date;
};

export type TodoAssigneesTable = {
  todo_id: number;
  person_id: number;
};
