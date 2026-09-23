import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services";

// Komponen Modular Auth
import AuthNavbar from "../components/auth/AuthNavbar";
import ChangePasswordGoogleNotice from "../components/auth/ChangePasswordGoogleNotice";
import ChangePasswordStandardForm from "../components/auth/ChangePasswordStandardForm";
import ChangePasswordOtpStep from "../components/auth/ChangePasswordOtpStep";
import ChangePasswordNewStep from "../components/auth/ChangePasswordNewStep";

export default function ChangePasswordPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const hasPassword = user?.has_password ?? true;

  // Navigasi langkah di dalam halaman ganti kata sandi:
  // "form": Ganti sandi normal (Kata Sandi Lama + Baru)
  // "otp": Kirim & verifikasi kode OTP ke email
  // "new_password": Masukkan kata sandi baru setelah OTP terverifikasi
  const [viewStep, setViewStep] = useState("form");

  // State Form Kata Sandi Standar
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // State Form Verifikasi OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [verifiedToken, setVerifiedToken] = useState("");
  const inputRefs = useRef([]);

  // State Form Kata Sandi Baru via OTP
  const [otpNewPassword, setOtpNewPassword] = useState("");
  const [otpConfirmPassword, setOtpConfirmPassword] = useState("");
  const [showOtpNew, setShowOtpNew] = useState(false);
  const [showOtpConfirm, setShowOtpConfirm] = useState(false);

  // Status Umum
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Countdown timer kirim ulang OTP
  useEffect(() => {
    let timer;
    if (countdown > 0 && viewStep === "otp") {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, viewStep]);

  // Auto focus input OTP pertama saat masuk ke step OTP
  useEffect(() => {
    if (viewStep === "otp" && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [viewStep]);

  // ================= ALUR 1: GANTI KATA SANDI MANUAL =================
  const handleSubmitStandard = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (hasPassword && !currentPassword) {
      setError("Kata sandi saat ini wajib diisi.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Kata sandi baru dan konfirmasi wajib diisi.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      };
      if (hasPassword && currentPassword) {
        payload.current_password = currentPassword;
      }

      const res = await authService.changePassword(payload);
      if (res.data?.status === "success") {
        setSuccess(res.data.message || "Kata sandi berhasil diperbarui!");
        updateUser({ has_password: true });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      console.error("Gagal ganti kata sandi:", err);
      const msg =
        err.response?.data?.message ||
        (hasPassword
          ? "Gagal mengganti kata sandi. Pastikan kata sandi saat ini benar."
          : "Gagal membuat kata sandi.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ================= ALUR 2: RESET VIA OTP DI DALAM SESI LOGIN =================
  const handleStartOtpFlow = async () => {
    const email = user?.email;
    if (!email) {
      setError("Email akun tidak ditemukan.");
      return;
    }

    setOtpLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await authService.forgotPassword(email);
      setSuccess(
        res.data?.message ||
          `Kode OTP telah dikirimkan ke email ${email}. Silakan cek kotak masuk atau folder spam.`
      );
      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);
      setViewStep("otp");
    } catch (err) {
      console.error("Gagal mengirim OTP:", err);
      setError(
        err.response?.data?.message ||
          "Gagal mengirim kode verifikasi OTP. Silakan coba lagi."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || otpLoading) return;
    setError("");
    setSuccess("");
    setOtpLoading(true);

    try {
      const res = await authService.forgotPassword(user?.email);
      setSuccess(res.data?.message || "Kode OTP baru telah berhasil dikirim!");
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal mengirim ulang kode OTP. Harap tunggu beberapa saat."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtpCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const fullCode = otp.join("");
    if (fullCode.length < 6) {
      setError("Harap lengkapi semua 6 digit kode OTP verifikasi.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyOtp(user?.email, fullCode.trim());

      if (res.data?.status === "success") {
        setVerifiedToken(fullCode.trim());
        setSuccess("Kode OTP valid! Silakan masukkan kata sandi baru Anda.");
        setViewStep("new_password");
      }
    } catch (err) {
      console.error("Gagal verifikasi OTP:", err);
      setError(
        err.response?.data?.message ||
          "Kode OTP salah atau telah kedaluwarsa. Silakan periksa kembali."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNewPasswordWithOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otpNewPassword.length < 6) {
      setError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    if (otpNewPassword !== otpConfirmPassword) {
      setError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword({
        email: user?.email,
        token: verifiedToken,
        password: otpNewPassword,
        password_confirmation: otpConfirmPassword,
      });

      if (res.data?.status === "success") {
        setSuccess("Kata sandi akun Anda berhasil diperbarui!");
        updateUser({ has_password: true });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      console.error("Gagal simpan password OTP:", err);
      setError(
        err.response?.data?.message ||
          "Gagal memperbarui kata sandi. Silakan ulangi langkah verifikasi OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col justify-between">
      {/* Top Navbar */}
      <AuthNavbar showDashboardIfLoggedIn={true} backTo="/dashboard" backLabel="Ke Dashboard" />

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#D8E6DE] p-6 sm:p-8 shadow-xs space-y-6">
          {/* ================= TAMPILAN 1: FORM STANDAR ================= */}
          {viewStep === "form" && (
            <>
              {/* Header Title */}
              <div className="space-y-1 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#E7F3EC] text-[#39BF81] border border-[#D8E6DE] flex items-center justify-center mb-3 shadow-2xs mx-auto sm:mx-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-[#1A1A1A] tracking-tight">
                  Ganti Kata Sandi
                </h1>
                <p className="text-xs text-[#5C6B64] leading-relaxed">
                  Perbarui kata sandi akun Anda atau gunakan opsi reset OTP jika lupa kata sandi lama.
                </p>
              </div>

              {/* Info Khusus Akun Google */}
              {!hasPassword && <ChangePasswordGoogleNotice />}

              {/* Alert Error / Success */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
                  <svg className="w-4 h-4 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#369D6D] text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
                  <svg className="w-4 h-4 shrink-0 text-[#369D6D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              {/* Form Input Standar */}
              <ChangePasswordStandardForm
                hasPassword={hasPassword}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                showCurrent={showCurrent}
                setShowCurrent={setShowCurrent}
                showNew={showNew}
                setShowNew={setShowNew}
                showConfirm={showConfirm}
                setShowConfirm={setShowConfirm}
                loading={loading}
                otpLoading={otpLoading}
                onSubmit={handleSubmitStandard}
                onStartOtp={handleStartOtpFlow}
                onCancel={() => navigate(-1)}
              />
            </>
          )}

          {/* ================= TAMPILAN 2: INPUT KODE OTP ================= */}
          {viewStep === "otp" && (
            <>
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <svg className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3.5 rounded-xl bg-[#E7F3EC] border border-[#D8E6DE] text-[#369D6D] text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <svg className="w-4 h-4 shrink-0 mt-0.5 text-[#369D6D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">{success}</span>
                </div>
              )}

              <ChangePasswordOtpStep
                userEmail={user?.email}
                otp={otp}
                setOtp={setOtp}
                inputRefs={inputRefs}
                countdown={countdown}
                loading={loading}
                otpLoading={otpLoading}
                onSubmit={handleVerifyOtpCode}
                onResend={handleResendOtp}
                onCancel={() => {
                  setViewStep("form");
                  setError("");
                  setSuccess("");
                }}
              />
            </>
          )}

          {/* ================= TAMPILAN 3: KATA SANDI BARU VIA OTP ================= */}
          {viewStep === "new_password" && (
            <>
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
                  <svg className="w-4 h-4 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#369D6D] text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
                  <svg className="w-4 h-4 shrink-0 text-[#369D6D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              <ChangePasswordNewStep
                newPassword={otpNewPassword}
                setNewPassword={setOtpNewPassword}
                confirmPassword={otpConfirmPassword}
                setConfirmPassword={setOtpConfirmPassword}
                showNew={showOtpNew}
                setShowNew={setShowOtpNew}
                showConfirm={showOtpConfirm}
                setShowConfirm={setShowOtpConfirm}
                loading={loading}
                onSubmit={handleSaveNewPasswordWithOtp}
                onCancel={() => {
                  setViewStep("form");
                  setError("");
                  setSuccess("");
                }}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
