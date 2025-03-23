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
