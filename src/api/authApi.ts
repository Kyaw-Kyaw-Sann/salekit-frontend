import type {
  AuthUser,
  ForgotPasswordData,
  LoginData,
  ResendVerificationOtpData,
  ResetPasswordData,
  SignupData,
  VerifyEmailData,
} from "../types";
import { apiRequest } from "./apiClient";

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