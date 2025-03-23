SELECT t.id,
    t.title,
    t.description,
    c.name AS category,
    p.name AS assigned_person
FROM todos.todos t
    LEFT JOIN todos.categories c ON t.category_id = c.id
    LEFT JOIN todos.todo_assignees ta ON t.id = ta.todo_id
    LEFT JOIN todos.people p ON ta.person_id = p.id
ORDER BY t.id;