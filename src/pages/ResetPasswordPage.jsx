import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services";

// Komponen Modular Auth
import AuthNavbar from "../components/auth/AuthNavbar";

export default function ResetPasswordPage() {
  const { isLoggedIn, updateUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const emailParam = searchParams.get("email") || "";
  const tokenParam = searchParams.get("token") || "";

  const email = emailParam;
  const token = tokenParam;
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email || !token) {
      setError("Email atau token verifikasi tidak ditemukan. Silakan ulangi langkah verifikasi.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const res = await authService.resetPassword({
        email: email.trim(),
        token: token.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });

      if (res.data?.status === "success") {
        if (isLoggedIn) {
          updateUser({ has_password: true });
          setSuccessMsg(
            res.data.message || "Kata sandi berhasil diperbarui! Mengalihkan ke dashboard..."
          );
          setTimeout(() => {
            navigate("/dashboard");
          }, 1200);
        } else {
          setSuccessMsg(
            res.data.message || "Kata sandi berhasil diperbarui! Mengalihkan ke halaman login..."
          );
          setTimeout(() => {
            navigate("/login?reset=success");
          }, 1200);
        }
      }
    } catch (err) {
      console.error("Reset Password Error:", err);
      setError(
        err.response?.data?.message ||
          "Gagal mengatur ulang kata sandi. Pastikan kode verifikasi masih berlaku."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1A1A1A] font-sans antialiased flex flex-col selection:bg-[#E7F3EC] selection:text-[#39BF81]">
      {/* ================= HEADER ================= */}
      <AuthNavbar backTo="/login" backLabel="Batal & Masuk" showDashboardIfLoggedIn={true} />

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white border border-[#D8E6DE] rounded-3xl p-7 sm:p-9 shadow-sm">
            {/* Icon & Title */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#E7F3EC] text-[#2BA76E] flex items-center justify-center mx-auto mb-4 border border-[#D8E6DE] shadow-xs">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] tracking-tight">
                Buat Kata Sandi Baru
              </h2>
              <p className="text-xs text-[#5C6B64] mt-1.5 leading-relaxed">
                Silakan masukkan kata sandi baru yang aman untuk akun Anda.
              </p>
            </div>

            {/* Notifications */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <svg className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-[#E7F3EC] border border-[#D8E6DE] text-[#2BA76E] text-xs flex items-start gap-2.5">
                <svg className="w-4 h-4 shrink-0 mt-0.5 text-[#2BA76E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">{successMsg}</span>
              </div>
            )}

            {/* Form Ganti Password */}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                  Kata Sandi Baru <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:ring-2 focus:ring-[#E7F3EC] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C6B64] hover:text-[#39BF81] transition-colors cursor-pointer"
                    title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                  Konfirmasi Kata Sandi Baru <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    required
                    placeholder="Ulangi kata sandi baru"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:ring-2 focus:ring-[#E7F3EC] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C6B64] hover:text-[#39BF81] transition-colors cursor-pointer"
                    title={showPasswordConfirm ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPasswordConfirm ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan Kata Sandi...</span>
                    </>
                  ) : (
                    <>
                      <span>Simpan & Selesaikan</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-[#D8E6DE] text-center">
              <Link
                to="/login"
                className="text-xs font-semibold text-[#5C6B64] hover:text-[#39BF81] transition-colors"
              >
                Ingat kata sandi? <strong className="text-[#2BA76E]">Masuk sekarang</strong>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-[#D8E6DE] py-6 sm:py-7 text-center text-xs sm:text-sm text-[#5C6B64]">
        Digilibrary &copy; {new Date().getFullYear()} — Perpustakaan Digital Sekolah Dasar
      </footer>
    </div>
  );
}
