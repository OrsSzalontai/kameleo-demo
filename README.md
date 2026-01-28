# Kameleo Demo App - Error Handling Application

## What this project is

This is a small full-stack demo application built with:

- Angular (standalone + Angular Material)
- .NET Minimal API

The goal is to demonstrate a clean, production-style error handling approach rather than complex UI or features.

It shows how to:

- handle HTTP errors globally
- show consistent toast notifications
- handle offline/network failures
- override error behavior at component level when needed

---

## Project structure

```
kameleo-demo/
├─ backend/   .NET API
└─ frontend/  Angular app
```

---

## Prerequisites

Backend:

- .NET SDK 8+

Frontend:

- Node 18+
- Angular CLI

Install Angular CLI if needed:

```
npm install -g @angular/cli
```

---

## Run the backend

```
cd backend/Demo.Api
dotnet run
```

API:

```
https://localhost:1337
```

Swagger:

```
https://localhost:1337/swagger
```

---

## Run the frontend

```
cd frontend/demo-ui
npm install
ng serve --ssl
```

App:

```
https://localhost:4200
```

---

## Demo endpoints

The backend exposes three simple endpoints:

```
GET /api/demo/success   → 200
GET /api/demo/error     → 500
GET /api/demo/upgrade   → 402
```

All errors return a consistent JSON format:

```json
{
  "error": {
    "code": "SOME_CODE",
    "message": "Message for the user"
  }
}
```

This makes it easy for the frontend to map backend errors to UI messages.

---

## Error handling approach

### Global handling

An Angular HTTP interceptor catches all failed requests and forwards them to a central `ErrorHandlerService`.

This service:

- handles offline errors (status 0)
- maps backend error codes to friendly messages
- shows snackbars
- keeps components free of duplicated error logic

So most components don’t need any error handling at all.

---

### Component overrides

Some errors require custom behavior.

For example, when the backend returns:

```
402 PLAN_UPGRADE_REQUIRED
```

Instead of a generic toast, the app shows:

- a specific message
- an "Upgrade now" button
- navigation to the pricing page

This is done by opting out of the global interceptor using `HttpContext` and handling the error locally in that component.

---

## Why this structure

The main idea is:

- global defaults for common cases
- local overrides only when necessary
- centralized error logic
- minimal duplication

This keeps the code simple and easier to maintain.
