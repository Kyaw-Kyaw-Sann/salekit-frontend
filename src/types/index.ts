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

export type Product = {
  id: string
  name: string
  price: number
  category: string
  stock: number
}

export type ProductFormData = {
  name: string
  price: number
  category: string
  stock: number
}

export type AdminUser = {
  id: string
  name: string
  email: string
  role: UserRole
  isVerified: boolean
}

export type AdminStats = {
  totalUsers: number
  verifiedUsers: number
  totalProducts: number
}