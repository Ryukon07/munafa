# Munafa

Munafa is a full-stack trading and expense tracker built with React, Vite, Express, Prisma, and PostgreSQL. It lets users sign up, log in, track trades and expenses, and review a dashboard with their net financial position.

## Features

- Secure authentication with JWT.
- Trade tracking with buy price, sell price, quantity, and P&L calculation.
- Expense tracking with debit and credit entries.
- Dashboard summary with charts and key metrics.
- Custom date picker and a polished light/dark theme.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Recharts
- Backend: Node.js, Express, Prisma
- Database: PostgreSQL

## Project Structure

- `backend/` - Express API, Prisma schema, and database migrations.
- `frontend/` - Vite React app for the user interface.

## Color Palette

The app uses a warm, paper-like palette with muted accent colors:

| Color | Hex | Usage |
| --- | --- | --- |
| Background | `#FAF8F3` | Main page background |
| Surface | `#F4EFE7` | Cards, panels, and UI surfaces |
| Surface 2 | `#EBE2D5` | Secondary surface tone |
| Border / Ink | `#3A3A3A` | Borders, outlines, and strong text |
| Text | `#2F343D` | Main body text |
| Accent | `#8A9FB7` | Highlights and soft emphasis |
| Success | `#6D8B7E` | Positive values and success states |
| Danger | `#BB6F63` | Negative values and warnings |

## Getting Started

### Prerequisites

- Node.js 18 or newer
- PostgreSQL database

### 1. Clone the repository

```bash
git clone <repo-url>
cd munafa
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with at least:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="your-secret-key"
PORT=5000
```

Then prepare Prisma and start the server:

```bash
npx prisma generate
npx prisma migrate deploy
npm run dev
```

If you are setting up a fresh local database and want Prisma to create the tables for development, you can also use:

```bash
npx prisma migrate dev
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
```

If your backend is not running on `http://localhost:5000`, create a `.env` file in `frontend/` and set:

```env
VITE_API_URL="http://localhost:5000/api"
```

Start the frontend:

```bash
npm run dev
```

## Quick Tutorial

1. Start the backend and frontend.
2. Open the frontend in your browser and create a new account or log in.
3. Go to the Trades page to add buy/sell details and track your P&L.
4. Go to the Expenses page to record debit and credit entries.
5. Open the Dashboard to see total P&L, total expenses, and net balance.

## Useful Scripts

### Backend

- `npm run dev` - start the Express server with nodemon.
- `npm run start` - run Prisma migrations and start the production server.
- `npm run build` - generate Prisma client.

### Frontend

- `npm run dev` - start the Vite dev server.
- `npm run build` - build the frontend for production.
- `npm run lint` - run ESLint.

## API Notes

- Backend base URL: `http://localhost:5000`
- API base URL: `http://localhost:5000/api`
- Main endpoints:
	- `POST /api/auth/register`
	- `POST /api/auth/login`
	- `GET /api/trades`
	- `POST /api/trades`
	- `DELETE /api/trades/:id`
	- `GET /api/expenses`
	- `POST /api/expenses`
	- `DELETE /api/expenses/:id`

## Notes

- The frontend stores the auth token in local storage.
- The app is designed for local-first personal finance tracking.
- If you change the backend URL, update `VITE_API_URL` in the frontend environment file.