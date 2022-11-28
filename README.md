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
