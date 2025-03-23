SELECT ROUND(AVG(task_count), 2) AS avg_tasks_per_person
FROM (
        SELECT p.id,
            COUNT(ta.todo_id) AS task_count
        FROM todos.people p
            LEFT JOIN todos.todo_assignees ta ON p.id = ta.person_id
        GROUP BY p.id
    ) subquery;