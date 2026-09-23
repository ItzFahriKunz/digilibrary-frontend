import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { auth, googleProvider } from "../firebase/config";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

// Komponen Modular Auth
import AuthBrandSidebar from "../components/auth/AuthBrandSidebar";
import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  const { isLoggedIn, isAdmin, user, login, register, loginGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState(() =>
    searchParams.get("reset") === "success"
      ? "Kata sandi berhasil diatur ulang! Silakan masuk dengan kata sandi baru Anda."
      : ""
  );

  // Tab State: "login" atau "register"
  const [authMode, setAuthMode] = useState("login");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const redirectByRole = useCallback(
    (userData) => {
      if (userData?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    },
    [navigate]
  );

  // Kalau sudah login, otomatis redirect
  useEffect(() => {
    if (isLoggedIn && user) {
      redirectByRole(user);
    }
  }, [isLoggedIn, user, redirectByRole]);

  const handleGoogleLogin = async () => {
    if (!auth || !googleProvider) {
      setError("Konfigurasi Google Auth belum siap. Periksa file .env Anda.");
      return;
    }
    setGoogleLoading(true);
    setError("");

    // Proxy window.open untuk mendeteksi penutupan jendela akun Google secara instan (<300ms)
    let popupWindow = null;
    const originalWindowOpen = window.open;
    window.open = function (...args) {
      popupWindow = originalWindowOpen.apply(window, args);
      return popupWindow;
    };

    let checkInterval = null;
    let handleFocus = null;

    const cleanup = () => {
      if (checkInterval) clearInterval(checkInterval);
      if (handleFocus) window.removeEventListener("focus", handleFocus);
      window.open = originalWindowOpen;
    };

    try {
      const signInPromise = signInWithPopup(auth, googleProvider);
      // Kembalikan window.open segera setelah signInWithPopup memanggilnya
      window.open = originalWindowOpen;

      // Pantau bila jendela akun Google ditutup (klik tombol X) oleh user
      if (popupWindow) {
        checkInterval = setInterval(() => {
          try {
            if (popupWindow.closed) {
              cleanup();
              window.location.reload();
            }
          } catch (e) {}
        }, 250);

        handleFocus = () => {
          setTimeout(() => {
            try {
              if (popupWindow && popupWindow.closed) {
                cleanup();
                window.location.reload();
              }
            } catch (e) {}
          }, 150);
        };
        window.addEventListener("focus", handleFocus);
      }

      const result = await signInPromise;
      cleanup();

      const idToken = await result.user.getIdToken();
      const photoURL = result.user.photoURL;
      const { user: userData } = await loginGoogle(idToken, photoURL);
      redirectByRole(userData);
    } catch (err) {
      cleanup();
      console.error("Google Login Error:", err);
      // Jika pop-up ditutup oleh pengguna atau proses login dibatalkan:
      // Otomatis refresh ulang halaman agar kembali bersih ke keadaan awal
      if (
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request" ||
        err.message?.includes("closed-by-user") ||
        err.message?.includes("cancelled")
      ) {
        window.location.reload();
        return;
      } else if (err.code === "auth/popup-blocked") {
        setError("Jendela pop-up Google diblokir peramban. Harap izinkan pop-up untuk situs ini.");
      } else {
        setError(err.message || "Gagal masuk dengan akun Google.");
      }
    } finally {
      cleanup();
      setGoogleLoading(false);
    }
  };

  const handleEmailFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");
    setEmailLoading(true);

    if (!formData.email || !formData.password) {
      setError("Harap isi email dan kata sandi.");
      setEmailLoading(false);
      return;
    }
    if (authMode === "register" && formData.password !== formData.passwordConfirmation) {
      setError("Konfirmasi kata sandi tidak cocok.");
      setEmailLoading(false);
      return;
    }

    try {
      if (authMode === "login") {
        const { user: userData } = await login(formData.email, formData.password);
        redirectByRole(userData);
      } else {
        const { user: userData } = await register(
          formData.name,
          formData.email,
          formData.password
        );
        redirectByRole(userData);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.response?.data?.message || err.message || "Gagal memproses autentikasi.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth).catch(() => {});
    } catch {}
    await logout();
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1A1A1A] font-sans antialiased flex flex-col lg:flex-row selection:bg-[#E7F3EC] selection:text-[#39BF81]">
      {/* ================= PANEL KIRI: BRANDING & WELCOME ================= */}
      <AuthBrandSidebar />

      {/* ================= PANEL KANAN: FORMULIR AUTENTIKASI ================= */}
      <div className="w-full lg:w-[58%] bg-[#F8FAF9] flex flex-col justify-between min-h-screen p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Top Right: Kembali ke Beranda */}
        <div className="flex justify-end items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#5C6B64] hover:text-[#39BF81] transition-colors group py-1 px-2 rounded-lg hover:bg-slate-100"
          >
            <svg
              className="w-4 h-4 text-[#5C6B64] group-hover:text-[#39BF81] transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Center: Card Formulir */}
        <div className="my-auto py-6 max-w-md w-full mx-auto">
          <LoginForm
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            user={user}
            authMode={authMode}
            setAuthMode={(mode) => {
              setAuthMode(mode);
              setError("");
              setInfoMessage("");
            }}
            formData={formData}
            setFormData={setFormData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showPasswordConfirm={showPasswordConfirm}
            setShowPasswordConfirm={setShowPasswordConfirm}
            loading={emailLoading || googleLoading}
            googleLoading={googleLoading}
            emailLoading={emailLoading}
            error={error}
            infoMessage={infoMessage}
            onSubmit={handleEmailFormSubmit}
            onGoogleLogin={handleGoogleLogin}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}
