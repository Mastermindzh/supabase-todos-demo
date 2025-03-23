SELECT t.id,
    t.title,
    t.description,
    c.name AS category
FROM todos.todos t
    LEFT JOIN todos.categories c ON t.category_id = c.id
    LEFT JOIN todos.todo_assignees ta ON t.id = ta.todo_id
WHERE ta.person_id IS NULL;