>>>> vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})

/////////////////////////////////////////////////

>>>> index.css

@import "tailwindcss";

@theme {
  --color-primary: #4f46e5;
  --color-primary-hover: #4338ca;
  --color-on-primary: #ffffff;

  --color-sidebar: #111827;
  --color-sidebar-hover: #1f2937;
  --color-sidebar-border: #374151;
  --color-sidebar-text: #f9fafb;
  --color-sidebar-muted: #d1d5db;

  --color-background: #f8fafc;
  --color-surface: #ffffff;

  --color-heading: #111827;
  --color-body: #4b5563;
  --color-muted: #9ca3af;
  --color-border: #e5e7eb;

  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-body);
  font-family: Arial, Helvetica, sans-serif;
}

button,
input,
select,
textarea {
  font: inherit;
}

/////////////////////////////////////////////////////

>>>> .env

VITE_API_URL=http://localhost:3000/api

//////////////////////////////////////////////////

>>>> folder structure

src/
├── api/
│   ├── apiClient.ts
│   ├── authApi.ts
├── components/
│   ├── ProtectedRoute.tsx
├── layouts/
│   └── AppLayout.tsx
├── pages/
│   ├── auth/
|   |      ForgotPassword.tsx
|   |      Login.tsx
|   |      ResetPassword.tsx
|   |      Signup.tsx
|   |      VerifyEmail.tsx
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css

//////////////////////////////////////////////

>>>> apiClient.ts

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error("VITE_API_URL is not configured")
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

function getErrorMessage(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message
  }

  return "Request failed"
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  })

  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(getErrorMessage(data), response.status)
  }

  return data as T
}

/////////////////////////////////////////////////

>>>> index.ts

export type UserRole = "user" | "admin"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

export type LoginData = {
  email: string
  password: string
}

export type SignupData = {
  name: string
  email: string
  password: string
}

export type VerifyEmailData = {
  email: string
  otp: string
}

export type ResendVerificationOtpData = {
  email: string
}

export type ForgotPasswordData = {
  email: string
}

export type ResetPasswordData = {
  email: string
  otp: string
  newPassword: string
}

//////////////////////////////////////////////////

>>>> authApi.ts

type MeResponse = {
  user: AuthUser;
};

type MessageResponse = {
  message: string;
};

export async function getMe(): Promise<AuthUser> {
  const response = await apiRequest<MeResponse>("/auth/me");

  return response.user;
}

export async function login(loginData: LoginData): Promise<string> {
  const response = await apiRequest<MessageResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(loginData),
  });

  return response.message;
}

export async function logout(): Promise<string> {
  const response = await apiRequest<MessageResponse>("/auth/logout", {
    method: "POST",
  });

  return response.message;
}

export async function signup(signupData: SignupData): Promise<string> {
  const response = await apiRequest<MessageResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(signupData),
  });

  return response.message;
}

export async function verifyEmail(
  verificationData: VerifyEmailData,
): Promise<string> {
  const response = await apiRequest<MessageResponse>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(verificationData),
  });

  return response.message;
}

export async function resendVerificationOtp(
  resendData: ResendVerificationOtpData,
): Promise<string> {
  const response = await apiRequest<MessageResponse>(
    "/auth/resend-verification-otp",
    {
      method: "POST",
      body: JSON.stringify(resendData),
    },
  )

  return response.message
}

export async function forgotPassword(
  forgotPasswordData: ForgotPasswordData,
): Promise<string> {
  const response = await apiRequest<MessageResponse>(
    "/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify(forgotPasswordData),
    },
  )

  return response.message
}

export async function resetPassword(
  resetPasswordData: ResetPasswordData,
): Promise<string> {
  const response = await apiRequest<MessageResponse>(
    "/auth/reset-password",
    {
      method: "POST",
      body: JSON.stringify(resetPasswordData),
    },
  )

  return response.message
}

////////////////////////////////////////////////

>>>> ProtectedRoutes.tsx

import { Navigate, Outlet } from "react-router-dom"
import type { AuthUser } from "../types"

type ProtectedRouteProps = {
  currentUser: AuthUser | null
  authLoading: boolean
}

function ProtectedRoute({
  currentUser,
  authLoading,
}: ProtectedRouteProps) {
  if (authLoading) {
    return <p>Checking session...</p>
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute

////////////////////////////////////////////////////////

>>>> App.tsx

async function handleLogin(loginData: LoginData) {
    await login(loginData);

    const user = await getMe();
    setCurrentUser(user);

    navigate("/");
  }

  async function handleLogout() {
    await logout();

    setCurrentUser(null);
    navigate("/login", { replace: true });
  }

  async function handleSignup(signupData: SignupData) {
    await signup(signupData);

    const cleanEmail = signupData.email.trim().toLowerCase();

    setVerificationEmail(cleanEmail);
    navigate("/verify-email");
  }

  const [verificationEmail, setVerificationEmail] = useState("");

  async function handleVerifyEmail(verificationData: VerifyEmailData) {
    const message = await verifyEmail(verificationData);

    setVerificationEmail("");
    navigate("/login", {
      replace: true,
      state: { successMessage: message },
    });
  }

  //////////////////////////////////////////////////

