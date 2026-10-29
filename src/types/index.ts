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