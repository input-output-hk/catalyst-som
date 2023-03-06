# Milestone Module

## Frontend

Project uses Vue3 + Vite.

Setup:
1. `.env` file needs to be populated with proper data. Available env variables
are listed in `milestone-tracker-frontend/.env.example` file.
2. Deps needs to be installed `npm install`
3. Start dev environment: `npm run dev`
4. Build: `npm run build`

## Backend

Run a local supabase instance using docker and seed database structure and
example data.

1. `.env` file needs to be populated with proper data. Available env variables
are listed in `milestone-tracker-backend/.env.example` file.
2. Start: `docker compose up` in `milestone-tracker-backend`
3. Stop: `docker compose down`
4. Destroy: `docker compose -f docker-compose.yml down -v --remove-orphans`

To run a local instance the example `.env.example` files are good to go.

## Full Project

In the root of the project a `docker-compose.yml` is available to run the full
project (it spins up frontend + supabase backend services).

1. `.env` file needs to be populated with proper data. Available env variables
are listed in `.env.example` file.
2. Start `docker compose up` in the root of the project
3. Stop: `docker compose down`
4. Destroy: `docker compose -f docker-compose.yml down -v --remove-orphans`
5. Rebuild frontend after changes `docker compose build --no-cache`

### `.env` details

`RUNNING_ENV` variable is used to select the DB migration file that seed data
 into the database after the schema is applied.
It loads the file `milestone-tracker-backend/volumes/db/migrations/${RUNNING_ENV}.sql`
 as the last operation after the initialization of the DB.

- `testing` includes a set of example data that is used for e2e testing.
- `production` is empty and doesn't add example data.

### Importer

It is a set of simple CLI python scripts used to populate a running instance
from CSV export. It will be used to migrate real data from Google Sheet to the
milestone module.

### E2E tests

`milestone-tracker-tests/` includes E2E tests.

1. Run a fresh instance of the backend from `milestone-tracker-backend`
(`RUNNING_ENV` should be `testing`)
2. Start a dev env from `milestone-tracker-frontend`
3. From `milestone-tracker-tests/` launch `npm run test`
  It's possible to run group of tests with `npx tsc && npx nightwatch --tag {tag}`
  Available tags are:

  - `login`
  - `som`
  - `poa`
  - `poa-review`
  - `signoff`
  - `som-review`
