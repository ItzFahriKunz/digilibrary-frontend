import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

import LandingPageClone from "./pages/landing-figma/LandingPageClone";

/**
 * Smart redirect setelah login — arahkan ke halaman sesuai role.
 */
function AuthRedirect() {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Halaman Publik */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing-figma" element={<LandingPageClone />} />
        <Route path="/landing-clone" element={<LandingPageClone />} />
        <Route path="/figma" element={<LandingPageClone />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Smart redirect: /go → sesuai role */}
        <Route path="/go" element={<AuthRedirect />} />

        {/* Halaman Terproteksi: Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Halaman Terproteksi: Siswa / Guru */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Halaman Terproteksi: Lengkapi Profil */}
        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute requiredRole="completing">
              <CompleteProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Halaman Terproteksi: Ganti Kata Sandi */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
