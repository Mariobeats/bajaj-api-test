# DeskFlow Assessment Checklist

Source: `/Users/mohitkushwah/Downloads/MERN_Assessment (5).pdf`, extracted and reviewed on 2026-05-26.

## Requirement Analysis

- Data model: Ticket with `subject`, `description`, `customerEmail`, `priority`, `status`, `createdAt`, `updatedAt`, `resolvedAt`.
- API: `POST /tickets`, `GET /tickets`, `PATCH /tickets/:id`, `DELETE /tickets/:id`, `GET /tickets/stats`.
- Validation: required fields, valid email, valid priority, valid status.
- Status transitions: only adjacent forward/backward transitions are allowed.
- SLA targets: urgent 60m, high 240m, medium 1440m, low 4320m.
- Derived fields: `ageMinutes` and `slaBreached`, computed dynamically and not stored.
- UI: responsive ticket board, cards, form, filters, stats strip, loading/error states, inline validation.
- Deployment: backend on Render, frontend on Vercel, database on MongoDB Atlas.
- Evaluation: correctness, validation, transitions, SLA, filters, stats, tests, builds, deployment readiness.

## Development Checklist

- [x] Requirements extracted
- [x] Backend project scaffolded
- [x] Ticket schema implemented
- [x] Validation implemented
- [x] Status transition rules implemented
- [x] SLA utility implemented
- [x] Ticket CRUD API implemented
- [x] Stats API implemented with currently open breached count
- [x] Error handling middleware implemented
- [x] Backend tests implemented
- [x] Frontend project scaffolded
- [x] Ticket board implemented
- [x] Ticket card actions implemented
- [x] Ticket form implemented
- [x] Filter bar implemented
- [x] Stats strip implemented
- [x] Loading, error, and inline validation states implemented
- [x] Environment examples added
- [x] Deployment guide added
- [x] README added
- [x] Backend dependencies installed
- [x] Backend tests run
- [x] Backend build/check run
- [x] Frontend dependencies installed
- [x] Frontend build run
- [x] Final verification completed
