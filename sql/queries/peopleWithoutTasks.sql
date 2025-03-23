SELECT p.name
FROM todos.people p
    LEFT JOIN todos.todo_assignees ta ON p.id = ta.person_id
WHERE ta.todo_id IS NULL;