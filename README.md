# Getting started

- run `npm install`
- run `npm run deps` to start supabase
- run `npm start` to serve functions

## Creating and seeding the database

- the `sql/create.sql` file has queries to create the tables etc.
- the `sql/seed.sql` file has queries to seed the tables

## structure

Common folder structure

```sh
supabase/
└── functions

    # infrastructure concerns, such as databases, load balancers, proxies
    ├── _infrastructure 
    
    # shared code, such as queries that are re-used between functions
    ├── _shared 
    
    # example function folder
    └── getTodosByName 
```

## 🚨 Mandatory Supabase Environment Settings

To ensure reliable and scalable function execution, the following environment variables **must** be set correctly:

### 1. `POSTGRES_POOL_SIZE`

- **Required value:** `"1"` or leave empty (defaults to `1`)
- **Why:** Any other value will cause errors due to too many connections. Supabase functions must use a single connection.

### 2. `USE_CUSTOM_CONNECTION_STRING`

- **Required value:** `"true"`
- **Why:** Enables the use of a custom PostgreSQL connection string, which is necessary for proper scaling.

### 3. `POSTGRES_DB_URL`

- **Required value:** Use the pgbouncer port (`6543`) in your connection string:

  ```text
  postgres://postgres:<your-password>@db.<PROJECT_REF>.supabase.co:6543/postgres
  ```

- **Why:** Connecting via pgbouncer ensures connection pooling and scalability.

> **Note:** You do **not** need to manually close connections (`db.closeConnection`, `db.closePool`). Both the Postgres driver and Kysely handle connection management automatically.

**Incorrect settings will result in a percentage of function errors and poor scalability. Always use the above configuration for production and scalable deployments.**
