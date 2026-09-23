import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services";

// Komponen Modular Auth
import AuthNavbar from "../components/auth/AuthNavbar";
import AuthOtpInput from "../components/auth/AuthOtpInput";

export default function VerifyOtpPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const emailParam = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailParam || user?.email || "");

  // 6 Kolom State untuk OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(
    emailParam
      ? `Kode verifikasi 6 digit telah dikirim ke ${emailParam}. Silakan periksa kotak masuk atau folder Spam.`
      : ""
  );

  // Countdown timer untuk kirim ulang (60 detik)
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const fullToken = otp.join("");

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim()) {
      setError("Alamat email tidak boleh kosong.");
      return;
    }

    if (fullToken.length < 6) {
      setError("Harap lengkapi semua 6 digit kode OTP verifikasi.");
      return;
    }

    setLoading(true);

    try {
      const res = await authService.verifyOtp(email.trim(), fullToken.trim());

      if (res.data?.status === "success") {
        setSuccessMsg(res.data.message || "Kode verifikasi berhasil diverifikasi!");
        setTimeout(() => {
          navigate(
            `/reset-password?email=${encodeURIComponent(email.trim())}&token=${encodeURIComponent(
              fullToken.trim()
            )}`
          );
        }, 800);
      }
    } catch (err) {
      console.error("Verify OTP Error:", err);
      setError(
        err.response?.data?.message ||
          "Kode verifikasi salah atau telah kedaluwarsa. Silakan periksa kembali."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || resendLoading) return;
    setError("");
    setSuccessMsg("");
    setResendLoading(true);

    try {
      const res = await authService.forgotPassword(email.trim());

      if (res.data?.status === "success") {
        setSuccessMsg(res.data.message || "Kode baru berhasil dikirimkan ke email Anda!");
        setCountdown(60);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error("Resend OTP Error:", err);
      setError(
        err.response?.data?.message ||
          "Gagal mengirim ulang kode verifikasi. Harap tunggu beberapa saat."
      );
    } finally {
      setResendLoading(false);
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] tracking-tight">
                Masukkan Kode OTP
              </h2>
              <p className="text-xs text-[#5C6B64] mt-1.5 leading-relaxed">
                Ketik 6 digit kode verifikasi yang telah dikirim ke email Anda.
              </p>
            </div>

            {/* Notifications */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <svg className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-[#E7F3EC] border border-[#D8E6DE] text-[#2BA76E] text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <svg className="w-4 h-4 shrink-0 mt-0.5 text-[#2BA76E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">{successMsg}</span>
              </div>
            )}

            {/* Form Verifikasi OTP 6 Kolom */}
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                  Alamat Email Akun
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

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-2">
                  Kode Verifikasi (OTP)
                </label>
                <AuthOtpInput
                  otp={otp}
                  onChange={setOtp}
                  inputRefs={inputRefs}
                  autoFocusFirst={true}
                  disabled={loading}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || fullToken.length < 6}
                  className="w-full py-3 rounded-2xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memverifikasi Kode...</span>
                    </>
                  ) : (
                    <>
                      <span>Verifikasi & Lanjut Ganti Sandi</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Kirim Ulang OTP */}
            <div className="mt-6 pt-5 border-t border-[#D8E6DE] text-center">
              <p className="text-xs text-[#5C6B64] mb-2">
                Belum menerima kode verifikasi di email atau spam?
              </p>
              {countdown > 0 ? (
                <span className="text-xs font-semibold text-[#5C6B64] bg-[#F8FAF9] px-3 py-1.5 rounded-full border border-[#D8E6DE] inline-block">
                  Kirim ulang kode dalam <strong className="text-[#2BA76E]">{countdown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="text-xs font-bold text-[#2BA76E] hover:text-[#107a55] hover:underline cursor-pointer transition-colors"
                >
                  {resendLoading ? "Mengirim ulang..." : "Kirim Ulang Kode Verifikasi"}
                </button>
              )}
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
