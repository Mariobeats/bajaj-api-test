# DeskFlow

DeskFlow is a MERN ticket management assessment project with an Express/Mongoose API and a Vite React frontend.

Source note: the assessment PDF was provided at `/Users/mohitkushwah/Downloads/MERN_Assessment (5).pdf` and reviewed before final verification. The extracted checklist is in `docs/REQUIREMENTS_CHECKLIST.md`.

## Features

- Ticket CRUD API
- Required field, email, priority, and status validation
- Strict adjacent status transitions
- Dynamic SLA fields that are not stored in MongoDB
- Combined backend filters for status, priority, and SLA breach
- Stats endpoint with status counts, priority counts, and currently open breach count
- Responsive React ticket board
- Inline form validation, loading states, and error states
- Transition-aware card actions that never expose invalid moves

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Required environment variables:

```bash
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/deskflow?retryWrites=true&w=majority
CORS_ORIGIN=https://your-frontend.vercel.app
```

API routes:

- `POST /tickets`
- `GET /tickets`
- `PATCH /tickets/:id`
- `DELETE /tickets/:id`
- `GET /tickets/stats`
- `GET /health`

The backend also exposes `/api/tickets` as a compatibility alias.

Filters:

```bash
GET /tickets?status=open&priority=urgent&breached=true
```

Tests:

```bash
cd backend
npm test
```

Build check:

```bash
cd backend
npm run build
```

## Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Required environment variable:

```bash
VITE_API_BASE_URL=https://your-backend.onrender.com
```

For separate frontend/backend deployments, set `VITE_API_BASE_URL` to your Render backend origin.

Build:

```bash
cd frontend
npm run build
```

## Deployment Guide

### MongoDB Atlas

1. Create an Atlas cluster.
2. Create a database user with read/write access.
3. Add the Render outbound IPs or temporarily allow access from required deployment networks.
4. Copy the connection string and set it as `MONGODB_URI` in Render.

### Render Backend

1. Create a new Web Service from this repository.
2. Set the root directory to `DeskFlow/backend`.
3. Build command: `npm install`.
4. Start command: `npm start`.
5. Add environment variables from `backend/.env.example`.
6. Set `CORS_ORIGIN` to the deployed Vercel frontend URL.
7. Verify `/health` returns `{ "status": "ok" }`.

### Vercel Frontend

1. Create a new Vercel project from this repository.
2. Set the root directory to `DeskFlow/frontend`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Set `VITE_API_BASE_URL` to the deployed Render backend URL.
6. Deploy and verify ticket creation, filtering, transitions, and stats.

## SLA Rules

Targets:

- `urgent`: 60 minutes
- `high`: 240 minutes
- `medium`: 1440 minutes
- `low`: 4320 minutes

`ageMinutes` is computed from `createdAt` to `resolvedAt` for resolved tickets, otherwise from `createdAt` to the current time. `slaBreached` is computed dynamically using that age and the priority target.

## Status Transitions

Allowed forward:

- `open -> in_progress`
- `in_progress -> resolved`
- `resolved -> closed`

Allowed backward by one step:

- `closed -> resolved`
- `resolved -> in_progress`
- `in_progress -> open`

All other status jumps return `400` with a clear error message.
