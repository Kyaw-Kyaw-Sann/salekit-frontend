# SaleKit Frontend

SaleKit Frontend is a React and TypeScript web client for the SaleKit API. The planned application includes cookie-based authentication, email OTP flows, user-specific product CRUD, a user dashboard, and minimal role-based admin pages.

## Current Status

This repository is currently a starter project.

- React, Vite, TypeScript, React Router, Tailwind CSS, and Lucide React are configured.
- The app currently renders a simple starter heading.
- API, route guard, layout, and type files exist as empty placeholders.
- Authentication, product CRUD, dashboards, and admin pages are not implemented yet.

## Planned Features

- Signup and email OTP verification
- Resend verification OTP
- Login and logout using an HttpOnly JWT cookie
- Session restoration with `/api/auth/me`
- Forgot-password and reset-password OTP flows
- Protected user routes
- Ownership-aware product list, details, create, update, and delete
- User dashboard derived from product data
- Role-protected admin stats and users pages

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Browser `fetch`

## Required Backend

This project requires the separate SaleKit API project:

```text
D:\User\salekit-api
```

The backend normally runs at:

```text
http://localhost:3000
```

The backend must allow the frontend origin through CORS with credentials enabled.

## Environment Setup

Create `.env.local` in the project root:

```env
VITE_API_URL=http://localhost:3000/api
```

Only variables prefixed with `VITE_` are available to frontend code. Do not place backend secrets, JWT secrets, OTP secrets, SMTP credentials, or database credentials in this project.

## Run Locally

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd salekit-frontend
npm install
```

Start the backend API in its own terminal, then start this frontend:

```bash
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

## Authentication Model

The backend sends the access JWT in an `HttpOnly` cookie. Frontend requests that depend on authentication must use:

```ts
credentials: "include"
```

The frontend must not read the JWT or store it in localStorage. The current user is restored by calling `GET /api/auth/me` when the app starts.

## Planned Routes

```text
/                         User dashboard
/login                    Login
/signup                   Signup
/verify-email             Email OTP verification
/forgot-password          Request password-reset OTP
/reset-password           Reset password with OTP
/products                 User-owned products
/products/new             Create product
/products/:productId      Product details
/products/:productId/edit Edit product
/admin                    Admin statistics
/admin/users              Admin user list
```

## Project Scope

This coding-test project intentionally avoids Redux, Axios, React Context, refresh tokens, sales, checkout, OAuth, MFA, role-management mutations, and advanced frontend architecture. The focus is a simple and secure integration with the existing SaleKit API.
