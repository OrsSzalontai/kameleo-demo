# Kameleo Demo App - Error Handling Application

## Overview

This project demonstrates a small full-stack application built with an Angular frontend and a .NET Minimal API backend.

The primary goal is to showcase a production-style error handling architecture, including:

- centralized global HTTP error handling
- consistent backend error responses
- user-friendly toast notifications
- graceful offline and network handling
- component-level overrides for specific business cases

The focus is on clean structure, maintainability, and realistic patterns rather than UI complexity.

---

## Project Structure

```
kameleo-demo/
├─ backend/   .NET Minimal API
└─ frontend/  Angular application
```

---

## Prerequisites

### Backend

- .NET SDK 8 or newer

Verify:

```
dotnet --version
```

### Frontend

- Node.js 18 or newer
- Angular CLI

Install Angular CLI:

```
npm install -g @angular/cli
```

Verify:

```
ng version
```

---

## Getting Started

Clone the repository:

```
git clone <repo-url>
cd kameleo-demo
```

---

## Running the Backend

Navigate to the API project:

```
cd backend/Demo.Api
```

Run:

```
dotnet run
```

The API will start on:

```
https://localhost:1337
```

Swagger UI is available at:

```
https://localhost:1337/swagger
```

---

## Running the Frontend

Open a second terminal:

```
cd frontend/demo-ui
npm install
ng serve --ssl
```

Open the application:

```
https://localhost:4200
```

The Angular development server proxies API requests to the backend.

---

## Building for Production

### Backend

```
dotnet publish -c Release
```

### Frontend

```
ng build
```

Frontend build output:

```
frontend/demo-ui/dist/
```

---

## Backend Behavior

The API exposes simple demo endpoints that intentionally return different HTTP outcomes:

```
GET /api/demo/success   → 200 OK
GET /api/demo/error     → 500 Internal Server Error
GET /api/demo/upgrade   → 402 Payment Required
```

All non-200 responses return a consistent JSON structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "traceId": "..."
  }
}
```

This predictable format allows the frontend to reliably map backend errors to user-friendly UI messages.

---

## Frontend Behavior

The UI displays three buttons:

- Success
- Error
- Upgrade Required

Each button calls one backend endpoint to demonstrate different error scenarios.  
Notifications are shown using Angular Material snackbars.

---

## Error Handling Architecture

### Global HTTP Interceptor

A custom Angular `HttpInterceptor` intercepts all HTTP requests.

Responsibilities:

- catch failed responses
- forward errors to a centralized handler
- display global notifications
- handle offline and network failures (status 0)

This ensures consistent behavior across the entire application without duplicating logic inside components.

---

### Central ErrorHandlerService

All user-facing error presentation logic is centralized in a single service.

Responsibilities:

- detect offline/network errors
- parse backend error payloads
- map error codes to friendly messages
- display snackbars
- attach optional actions when required

Examples:

- network failure → "Network error. Please check your connection."
- generic server error → "Something went wrong"
- PLAN_UPGRADE_REQUIRED → snackbar with an "Upgrade now" action

Keeping this logic centralized improves maintainability and keeps components simple.

---

### Component-Level Overrides

Some errors require custom behavior that differs from the global default.

For example:

```
/api/demo/upgrade → 402 PLAN_UPGRADE_REQUIRED
```

Instead of the generic error message, the UI shows:

- a specific message
- an action button ("Upgrade now")
- navigation to the pricing page

This is implemented by opting out of global handling using an `HttpContext` flag and handling the error locally in the originating component.

This approach allows:

- global defaults for most scenarios
- local customization only where necessary
- clear separation of concerns

---

## Design Goals

This project demonstrates:

- consistent backend error contracts
- centralized frontend error handling
- minimal duplication
- clear separation of responsibilities
- maintainable, production-style patterns

The implementation prioritizes clarity and robustness over complexity.
