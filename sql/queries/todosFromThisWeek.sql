SELECT id,
    title,
    description,
    created_at
FROM todos.todos
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;