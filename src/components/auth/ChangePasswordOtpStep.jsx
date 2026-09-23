import AuthOtpInput from "./AuthOtpInput";

export default function ChangePasswordOtpStep({
  userEmail,
  otp,
  setOtp,
  inputRefs,
  countdown,
  loading,
  otpLoading,
  onSubmit,
  onResend,
  onCancel,
}) {
  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#E7F3EC] text-[#39BF81] flex items-center justify-center mx-auto mb-3 border border-[#D8E6DE] shadow-xs">
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
          Verifikasi Kode OTP
        </h2>
        <p className="text-xs text-[#5C6B64] mt-1.5 leading-relaxed">
          Masukkan 6 digit kode yang dikirim ke email <strong>{userEmail}</strong>.
        </p>
      </div>

      {/* Form 6 Kotak OTP */}
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-2 text-center">
            Kode Verifikasi (6 Digit)
          </label>
          <AuthOtpInput
            otp={otp}
            onChange={setOtp}
            inputRefs={inputRefs}
            autoFocusFirst={true}
            disabled={loading}
          />
        </div>

        <div className="pt-2 space-y-2.5">
          <button
            type="submit"
            disabled={loading || otp.join("").length < 6}
            className="w-full py-3 rounded-2xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi Kode OTP...</span>
              </>
            ) : (
              <>
                <span>Verifikasi &amp; Lanjut Buat Sandi</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 rounded-xl border border-[#D8E6DE] bg-[#F8FAF9] hover:bg-slate-100 text-[#5C6B64] text-xs font-semibold transition-colors cursor-pointer text-center"
          >
            Batal &amp; Kembali ke Form Sandi
          </button>
        </div>
      </form>

      {/* Kirim Ulang OTP */}
      <div className="pt-4 border-t border-[#D8E6DE] text-center">
        <p className="text-xs text-[#5C6B64] mb-2">
          Belum menerima kode OTP di email atau spam?
        </p>
        {countdown > 0 ? (
          <span className="text-xs font-semibold text-[#5C6B64] bg-[#F8FAF9] px-3 py-1.5 rounded-full border border-[#D8E6DE] inline-block">
            Kirim ulang dalam <strong className="text-[#39BF81]">{countdown}s</strong>
          </span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={otpLoading}
            className="text-xs font-bold text-[#39BF81] hover:text-[#369D6D] hover:underline cursor-pointer transition-colors"
          >
            {otpLoading ? "Mengirim ulang..." : "Kirim Ulang Kode OTP"}
          </button>
        )}
      </div>
    </div>
  );
}
