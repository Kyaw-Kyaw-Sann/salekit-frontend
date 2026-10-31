import { useEffect, useState } from "react";
import type { AuthUser, LoginData, SignupData, VerifyEmailData } from "./types";
import { getMe, login, logout, signup, verifyEmail } from "./api/authApi";
import { ApiError } from "./api/apiClient";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Signup from "./pages/auth/Signup";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

function App() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true); // as this page is automatically run
  
  const [verificationEmail, setVerificationEmail] = useState("");

  useEffect(() => {
    async function restoreSession() {
      try {
        const user = await getMe();
        setCurrentUser(user);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          setCurrentUser(null);
          return;
        }

        const message =
          error instanceof Error ? error.message : "Failed to restore session";

        console.error(`Failed to restore session, ${message}`);
      } finally {
        setAuthLoading(false);
      }
    }

    restoreSession();
  }, []);

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

  async function handleVerifyEmail(verificationData: VerifyEmailData) {
    const message = await verifyEmail(verificationData);

    setVerificationEmail("");
    navigate("/login", {
      replace: true,
      state: { successMessage: message },
    });
  }

  if (authLoading) {
    return <div className="">Loading ...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      <Route
        path="/signup"
        element={
          currentUser ? (
            <Navigate to="/" replace />
          ) : (
            <Signup onSignup={handleSignup} />
          )
        }
      />

      <Route
        path="/verify-email"
        element={
          currentUser ? (
            <Navigate to="/" replace />
          ) : (
            <VerifyEmail
              initialEmail={verificationEmail}
              onVerify={handleVerifyEmail}
            />
          )
        }
      />

      <Route
        path="/forgot-password"
        element={currentUser ? <Navigate to="/" replace /> : <ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={currentUser ? <Navigate to="/" replace /> : <ResetPassword />}
      />

      <Route
        element={
          <ProtectedRoute currentUser={currentUser} authLoading={authLoading} />
        }
      >
        <Route
          element={
            <AppLayout currentUser={currentUser} onLogout={handleLogout} />
          }
        >
          <Route
            path="/"
            element={
              <section>
                <h1 className="text-2xl font-bold text-heading">Dashboard</h1>

                <p className="mt-2 text-body">Welcome, {currentUser?.name}</p>
              </section>
            }
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to={currentUser ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
