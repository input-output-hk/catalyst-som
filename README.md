# Milestone Module

## Frontend

Project uses Vue3 + Vite.

Setup:
1. For development, `.env` file needs to be populated with proper data.
Available env variables are listed in `milestone-tracker-frontend/.env.example`
file.
2. Deps needs to be installed `npm install`
3. Start dev environment: `npm run dev`
In the dev environment, env variables are pulled from the `.env` file.
4. Build:
  - `npx vue-inject-env set` to prepare the env variables that will be used by
  the bundled package. This commands creates a separate `env.js` file in the
  build folder that is loaded by the main package. This file can be updated
  without building again the full project using the `npx vue-inject-env set`
  command.
  By default `npx vue-inject-env set` picks the variables from the `.env` file,
  but value can be overridden if the same environment variables are set before
  running the command:
  `VITE_SUPABASE_URL='http://example.org' npx vue-inject-env set`
  - `npm run build` to prepare the bundle.


The Earthfile allow to build the project and saves the artifact in the `dist`
folder.

`earthly +build`

## Backend

Run a local supabase instance using docker and seed database structure and
example data.

It uses supabase-cli to spawn the various containers required.

Setup:
1. In `milestone-tracker-backend` install deps: `npm install`
2. Run `npx supabase start`. This will initialize and spawn the various
containers.

API is accessible at http://localhost:54321
Studio at http://localhost:54323

The Earthfile allow to install deps and run the containers required and it's
used for e2e testing.

### Importer

It is a set of simple CLI python scripts used to populate a running instance
from CSV export. It will be used to migrate real data from Google Sheet to the
milestone module.

### E2E tests

`milestone-tracker-tests/` includes E2E tests.

From the root of the project use earthly:

`earthly -P +e2e`

This will build the frontend and serve it, spinup the containers required by
supabase with the correct configuration and run the e2e testing.
