SELECT p.name,
    COUNT(ta.todo_id) AS total_tasks
FROM todos.people p
    LEFT JOIN todos.todo_assignees ta ON p.id = ta.person_id
GROUP BY p.name
ORDER BY total_tasks DESC;