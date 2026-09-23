import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services";

// Komponen Modular Auth
import AuthNavbar from "../components/auth/AuthNavbar";

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Silakan masukkan alamat email akun Anda.");
      return;
    }

    setLoading(true);

    try {
      const res = await authService.forgotPassword(email.trim());

      if (res.data?.status === "success") {
        // Langsung pindah ke halaman verifikasi kode OTP tanpa popup alert
        navigate(`/verify-otp?email=${encodeURIComponent(email.trim())}`);
      }
    } catch (err) {
      console.error("Forgot Password Error:", err);
      setError(
        err.response?.data?.message ||
          "Alamat email tidak ditemukan atau gagal mengirim kode. Pastikan email sudah terdaftar."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1A1A1A] font-sans antialiased flex flex-col selection:bg-[#E7F3EC] selection:text-[#39BF81]">
      {/* ================= HEADER ================= */}
      <AuthNavbar backTo="/login" backLabel="Kembali ke Masuk" showDashboardIfLoggedIn={true} />

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
                Lupa Kata Sandi?
              </h2>
              <p className="text-xs text-[#5C6B64] mt-1.5 leading-relaxed">
                Masukkan alamat email yang terdaftar. Kami akan mengirimkan 6 digit kode OTP verifikasi untuk mengatur ulang kata sandi Anda.
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

            {/* Form Request OTP */}
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                  Alamat Email Akun Terdaftar
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama@sekolah.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:ring-2 focus:ring-[#E7F3EC] transition-all"
                />
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
                      <span>Mengirim Kode OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Kode OTP</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
