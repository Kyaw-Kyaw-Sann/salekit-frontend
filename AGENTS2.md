# AGENTS.md - SaleKit Backend-Connected React Frontend

## 1. Interaction rules

- The user may write in English or Myanmar, but always respond in Myanmar language.
- Never create, update, remove, rename, move, fix, or otherwise modify code, files, folders, configuration, dependencies, or project structure unless the user explicitly says the exact phrase:

  `Build Now`

- Similar phrases such as `start`, `next`, `continue`, `go ahead`, `do it`, or `proceed` are not permission to modify the project.
- Before `Build Now`, only inspect, discuss, explain, review, plan, suggest, and provide focused commands or snippets for the user to write manually.
- When `Build Now` is given, make only the changes already discussed or explicitly requested in that message.
- Do not silently install packages, change the backend, modify the database, add new endpoints, or introduce unrelated features.

## 2. Project purpose

SaleKit Frontend is the dedicated React web client for the completed SaleKit API at `D:\User\salekit-api`.

This repository is intentionally separate from `D:\User\salekit`, which remains a frontend-only React CRUD learning project.

The goal here is to learn and manually reproduce a complete but focused frontend integration during a 7-hour-30-minute coding test. The required scope is:

- cookie-based authentication
- email OTP verification
- forgot/reset password
- protected routes
- ownership-aware product CRUD
- a user dashboard
- minimal `user`/`admin` role-based access
- admin stats and users pages

Prefer the simplest correct, secure, valuable, and teachable solution. Do not turn this project into an enterprise frontend.

## 3. Current starter status

- React, Vite, TypeScript, React Router, Tailwind CSS, and Lucide React are installed.
- `BrowserRouter` and the Tailwind Vite plugin are configured.
- Shared theme colors exist in `src/index.css`.
- `App.tsx` currently renders only a starter heading.
- The files under `src/api`, `src/components`, `src/layouts`, and `src/types` are empty placeholders.
- `.env.example` is currently empty and must be completed in a later authorized step.
- No authentication, API request, route guard, dashboard, form, or product UI is implemented yet.

Never claim a placeholder feature works until it is implemented and actually tested.

## 4. Backend contract

The backend is a separate project at `D:\User\salekit-api` and normally runs at:

```text
http://localhost:3000
```

The frontend development origin is normally:

```text
http://localhost:5173
```

The frontend API base URL will be configured as:

```text
VITE_API_URL=http://localhost:3000/api
```

Authentication endpoints:

```text
POST /api/auth/signup
POST /api/auth/verify-email
POST /api/auth/resend-verification-otp
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

Protected product endpoints:

```text
GET    /api/products
GET    /api/products/:productId
POST   /api/products
PUT    /api/products/:productId
DELETE /api/products/:productId
```

Admin-only endpoints:

```text
GET /api/admin/users
GET /api/admin/stats
```

Inspect the real backend controller response before defining each frontend response type. Do not guess response shapes.

## 5. Agreed technology and simplest architecture

Use the existing:

- React
- Vite
- TypeScript
- React Router
- Tailwind CSS
- Lucide React
- browser `fetch`

Do not add Axios, Redux, Zustand, React Context, TanStack Query, React Hook Form, Zod, a component library, or another dependency unless the user explicitly requests and approves it.

Use:

- `useState` and `useEffect`
- controlled forms
- props and callbacks
- simple route guards
- page-owned loading/error/data state
- small API functions
- direct and readable TypeScript types

For the coding-test version:

- `App.tsx` owns only `currentUser` and `authLoading`.
- Authentication pages own their form/loading/error state.
- Product pages own their API/loading/error/product state.
- Admin pages own their API/loading/error state.
- Do not create global product state. After create or edit, navigate back and fetch the server data again.
- Do not introduce a custom hook merely to move a few lines of code.

## 6. Cookie authentication rules

The backend stores the access JWT in an `HttpOnly` cookie named `access_token`.

Every authentication-dependent request must use:

```ts
credentials: "include"
```

Rules:

- Never read the JWT from frontend JavaScript.
- Never store the JWT in localStorage or sessionStorage.
- Never manually add a Bearer token to this web frontend.
- Login returns a success message; call `/auth/me` afterward to obtain the authenticated user.
- On app startup, call `/auth/me` once to restore the session.
- Treat startup `401` as a normal logged-out state.
- Wait for the startup authentication check before redirecting routes.
- Logout must call the backend, clear `currentUser`, and navigate to login.
- A browser refresh must restore the session from `/auth/me`, not from stored frontend user data.

The backend remains the real security boundary. Frontend route guards and hidden links only improve UX.

## 7. API organization

Use the existing placeholders:

```text
src/api/apiClient.ts
src/api/authApi.ts
src/api/productsApi.ts
src/api/adminApi.ts
```

- `apiClient.ts`: base URL, JSON request handling, `credentials: "include"`, response parsing, and a small status-aware error.
- `authApi.ts`: authentication endpoints only.
- `productsApi.ts`: product CRUD endpoints only.
- `adminApi.ts`: the two admin GET endpoints only.

Do not create repository, service, interceptor, adapter, or dependency-injection layers.

Use one small shared API error that exposes the HTTP status so the UI can distinguish `400`, `401`, `403`, `404`, and `429`.

## 8. Core frontend types

Define only the type needed by the current step. Expected core concepts include:

```ts
type UserRole = "user" | "admin"

type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

type Product = {
  id: string
  name: string
  price: number
  category: string
  stock: number
}

type ProductFormData = {
  name: string
  price: number
  category: string
  stock: number
}
```

Admin response types must contain only the safe fields returned by the backend. Never define or expose password hashes or OTP hashes.

If MySQL decimal values arrive as strings, convert the product price to a number once at the API boundary.

## 9. Authentication pages and UX

Required public routes:

```text
/login
/signup
/verify-email
/forgot-password
/reset-password
```

Each form should provide:

- visible labels
- controlled inputs
- focused client validation
- email trimming and lowercase normalization
- password validation matching the backend rules
- six-digit OTP validation where required
- one submission at a time
- disabled inputs/button while submitting
- a visible public API error
- clear success feedback
- links to related authentication pages

Do not display stack traces, database errors, SMTP errors, raw JWT values, raw OTP values, or internal server details.

The forgot-password page must always show the backend's generic success behavior without revealing whether an account exists.

Do not automatically log in after password reset. Navigate the user back to login.

## 10. Routing and layouts

Use the existing route-guard placeholders:

```text
src/components/ProtectedRoute.tsx
src/components/AdminRoutes.tsx
```

The admin guard file is currently named `AdminRoutes.tsx`; do not rename it unless a focused step discusses and approves that change.

Suggested routes:

```text
Public:
  /login
  /signup
  /verify-email
  /forgot-password
  /reset-password

Authenticated user:
  /
  /products
  /products/new
  /products/:productId
  /products/:productId/edit

Admin only:
  /admin
  /admin/users
```

- `ProtectedRoute` waits for auth loading, redirects guests to `/login`, and renders authenticated content.
- `AdminRoutes` first requires authentication and then allows only `role === "admin"`.
- A normal authenticated user attempting an admin page should receive a simple access-denied UX or be redirected to `/`.
- Unknown routes should render a small not-found page.
- `AppLayout` should contain simple navigation, user identity, role-aware admin links, logout, and an `Outlet`.

## 11. Ownership-aware product rules

- Never send `user_id` in create or update bodies.
- Never let the user choose product ownership.
- The backend uses the cookie-authenticated user as the owner.
- Fetch and reconnect one product behavior at a time: list, create, detail, update, delete.
- Validate name, category, price, and stock before sending a request.
- Price must be a valid non-negative value accepted by the backend.
- Stock must be a non-negative integer.
- Show loading, error, and empty states.
- Ask for confirmation before delete.
- Remove a deleted product from local list state only after the API succeeds.
- Treat another user's product like a missing product according to the backend `404` response.
- Test with two accounts and prove ownership isolation.

## 12. User dashboard

Keep the user dashboard small:

- greet the authenticated user
- fetch the authenticated user's products
- derive total products
- derive total stock
- derive low-stock count
- provide a link to product management

Do not add a new backend dashboard endpoint. Derive the values from the existing products response.

Sales, cart, checkout, payment, and revenue are outside this project's current backend scope.

## 13. Minimal role-based admin UX

The project has only two roles:

```text
user
admin
```

Admin scope is limited to:

```text
GET /api/admin/stats
GET /api/admin/users
```

Rules:

- Show admin navigation only when `currentUser.role === "admin"`.
- Hidden links are not authorization; the backend must still return `403` to a normal user.
- Admin pages are read-only.
- Do not add role changes, user deletion, user banning, or other admin mutations.
- Admin status does not bypass product ownership.
- Test admin pages as guest, normal user, and admin.

## 14. Error handling

Use small, understandable behavior:

- `400`: show the backend's safe validation message.
- `401`: treat the session as logged out where appropriate and lead to login.
- `403`: show access denied without pretending the user is logged out.
- `404`: show a not-found state.
- `429`: tell the user to wait before retrying.
- Network failure: say the API could not be reached.

Do not automatically retry signup, login, OTP, reset-password, create, update, or delete requests.

## 15. Tiny-step working style

Build one small, logically connected behavior at a time.

- Do not implement a whole authentication system, all CRUD operations, or several pages in one response.
- Do not fill every empty placeholder file merely because it exists.
- The user normally writes the important React and API integration code manually.
- Keep every step understandable and reproducible under coding-test pressure.

For every manual step:

1. State the small goal.
2. Name the exact file and location.
3. Provide only the focused snippet.
4. Explain the request, state, props, and callback flow briefly.
5. Explain how to verify it in the browser and Network tab.
6. Wait for the user to say `done` or ask a question.

When the user says `done`, inspect the actual code before continuing or diagnosing an error.

If the user asks for a review, do not modify files. If the user asks for a hint only, do not provide the complete solution.

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

## 16. Tiny-step implementation roadmap

### Foundation

1. Review the starter and confirm both server origins.
2. Add `VITE_API_URL` to `.env.example` and `.env.local`.
3. Define the smallest shared API client with cookie credentials.
4. Define `UserRole` and `AuthUser`.
5. Add only the `/auth/me` API function.
6. Add `currentUser` and `authLoading` to `App.tsx`.
7. Restore the session at startup and handle logged-out `401` normally.

### Login, routing, and logout

8. Build the controlled login form and validation.
9. Add the login API request.
10. Call `/auth/me` after login and set the current user.
11. Add `ProtectedRoute` and protect one page.
12. Add the simple `AppLayout`.
13. Add logout and verify refresh no longer restores the session.

### Signup and email verification

14. Build signup form state and validation.
15. Connect signup and pass the email to verification.
16. Build email plus six-digit OTP verification.
17. Connect verification and navigate to login.
18. Add resend-verification behavior and `429` feedback.

### Password recovery

19. Build and connect forgot-password with generic success UX.
20. Build reset-password inputs and validation.
21. Connect email, OTP, and new password reset.
22. Return to normal login after reset.

### Ownership-aware product CRUD

23. Define product types from the real backend response.
24. Add the product list API and page.
25. Add loading, error, and empty list states.
26. Build and connect product creation.
27. Fetch and render one product detail.
28. Load one product into the edit form.
29. Connect product update.
30. Connect confirmed product deletion.
31. Test every operation with two accounts.

### Dashboards and RBAC

32. Add the small user dashboard from product data.
33. Add `AdminRoutes` and role-aware navigation.
34. Add and test the admin stats page.
35. Add and test the read-only admin users page.
36. Verify guest `401`, user `403`, and admin `200` behavior.

### Final verification

37. Add focused responsive styling and accessibility.
38. Verify refresh and expired/invalid session behavior.
39. Verify `400`, `401`, `403`, `404`, `429`, empty, and network-error states.
40. Run lint and build checks.
41. Test the complete signup-to-product flow.
42. Test the complete admin flow.

Do not start sales, checkout, OAuth, MFA, refresh-token rotation, role-management mutations, React Native, or advanced architecture during this roadmap.

## 17. Coding-test target: 7 hours 30 minutes

```text
00:00-00:30  Project setup, Router, Tailwind, environment
00:30-01:10  Types, shared API client, API structure
01:10-02:10  /me, login, logout, protected routes
02:10-03:30  Signup, email verification, resend OTP
03:30-04:15  Forgot-password and reset-password
04:15-06:15  Ownership-aware product CRUD
06:15-06:55  Admin stats and users
06:55-07:30  UX checks, lint/build, full-flow tests
```

Styling may be simplified under time pressure, but do not sacrifice:

- `credentials: "include"`
- startup `/auth/me`
- route protection
- input validation
- loading and error states
- password/OTP privacy
- ownership rules
- `401` versus `403`
- real build and browser testing

## 18. Code style

- Use ordinary functions, named handlers, clear `if` statements, and readable JSX.
- Use simple TypeScript types and avoid `any`.
- Avoid unnecessary assertions, advanced generics, classes beyond a small API error, reducers, decorators, and clever one-liners.
- Avoid nested ternaries and premature abstractions.
- Do not split every small JSX block into a component.
- Keep form logic visible in the related page.
- Add short comments only when the reason is not obvious.
- Preserve existing working code and avoid unrelated refactors.

## 19. Styling responsibility

The user should focus on React and API logic rather than detailed Tailwind work.

The assistant may add or refine repetitive Tailwind styling only when explicitly authorized with `Build Now`.

When styling:

- preserve all logic and handlers
- use the theme colors in `src/index.css`
- keep forms responsive and accessible
- use visible labels and keyboard focus states
- avoid excessive animation and decoration

## 20. After an authorized change

After every `Build Now` change:

1. Summarize exactly what changed and where.
2. Explain the request flow, state flow, props, and important functions in Myanmar.
3. Provide a short browser and Network-tab test procedure.
4. Give one small exercise for the user to attempt without AI.
5. Run appropriate lint/build checks and report the real result.
6. Never claim frontend, backend, cookies, email, OTP, APIs, or build work unless actually tested.

If a check fails because the backend is stopped or unrelated code is unfinished, report the exact failure and do not expand scope without permission.

## 21. Definition of done for a small step

A step is done when:

- The focused UI and request behavior work as described.
- The code is simple enough to explain and reproduce.
- Types and common invalid inputs are handled.
- Authenticated requests include credentials without exposing the JWT.
- Loading, success, error, and relevant empty states are clear.
- Backend authorization and ownership remain authoritative.
- The user knows how to test the behavior manually.
- No unrelated dependency, abstraction, endpoint, or feature was added.

## 22. Main principle

Help the user become capable of rebuilding the complete focused SaleKit frontend integration without AI. Choose the simplest secure and teachable solution.
