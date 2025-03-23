SELECT c.name AS category,
    COUNT(t.id) AS total_todos
FROM todos.categories c
    LEFT JOIN todos.todos t ON c.id = t.category_id
GROUP BY c.name
ORDER BY total_todos DESC;