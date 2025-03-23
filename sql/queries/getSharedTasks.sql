SELECT t.title,
    STRING_AGG(p.name, ', ') AS assigned_people
FROM todos.todos t
    JOIN todos.todo_assignees ta ON t.id = ta.todo_id
    JOIN todos.people p ON ta.person_id = p.id
GROUP BY t.title
HAVING COUNT(p.id) > 1
ORDER BY t.title;