import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — Guard component untuk routing berbasis role.
 * 
 * Props:
 *   - children: komponen halaman yang diproteksi
 *   - requiredRole: "admin" | "user" (siswa/guru) | undefined (any logged in)
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  // Masih loading cek session
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-xl bg-[#369D6D] flex items-center justify-center text-white animate-pulse">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-sm text-[#5C6B64] font-medium">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  // Belum login → redirect ke /login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Role guard
  if (requiredRole === "admin" && !isAdmin) {
    // User biasa coba akses admin → redirect ke /dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Admin diperbolehkan mengakses halaman user (/dashboard) untuk inspeksi & pengujian

  return children;
}
