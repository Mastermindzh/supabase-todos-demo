BEGIN;
-- CREATE SCHEMA IF NOT EXISTS for the entire todos example
CREATE SCHEMA IF NOT EXISTS todos;
-- CREATE TABLE IF NOT EXISTS for people
CREATE TABLE IF NOT EXISTS todos.people (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL
);
-- CREATE TABLE IF NOT EXISTS for categories (Work, Personal, etc.)
CREATE TABLE IF NOT EXISTS todos.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);
-- CREATE TABLE IF NOT EXISTS for todos
CREATE TABLE IF NOT EXISTS todos.todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES todos.categories(id) ON DELETE
    SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- CREATE TABLE IF NOT EXISTS for assigning todos to multiple people
CREATE TABLE IF NOT EXISTS todos.todo_assignees (
    todo_id INTEGER REFERENCES todos.todos(id) ON DELETE CASCADE,
    person_id INTEGER REFERENCES todos.people(id) ON DELETE CASCADE,
    PRIMARY KEY (todo_id, person_id)
);
COMMIT;