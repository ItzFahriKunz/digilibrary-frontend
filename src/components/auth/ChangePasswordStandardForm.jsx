export default function ChangePasswordStandardForm({
  hasPassword,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showCurrent,
  setShowCurrent,
  showNew,
  setShowNew,
  showConfirm,
  setShowConfirm,
  loading,
  otpLoading,
  onSubmit,
  onStartOtp,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Field 1: Kata Sandi Saat Ini */}
      <div>
        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
          Kata Sandi Saat Ini {hasPassword && <span className="text-rose-600">*</span>}
          {!hasPassword && (
            <span className="text-[#5C6B64] font-normal text-[11px] ml-1">(Opsional)</span>
          )}
        </label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={
              hasPassword
                ? "Masukkan kata sandi lama Anda"
                : "Kosongkan jika belum pernah buat kata sandi"
            }
            required={hasPassword}
            className="w-full pl-4 pr-11 py-2.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] placeholder-[#5C6B64]/60 focus:outline-none focus:border-[#39BF81] focus:bg-white transition-all shadow-2xs"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5C6B64] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            title={showCurrent ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showCurrent ? (
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

      {/* Field 2: Kata Sandi Baru */}
      <div>
        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
          Kata Sandi Baru <span className="text-rose-600">*</span>
        </label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            required
            className="w-full pl-4 pr-11 py-2.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] placeholder-[#5C6B64]/60 focus:outline-none focus:border-[#39BF81] focus:bg-white transition-all shadow-2xs"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5C6B64] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            title={showNew ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showNew ? (
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

      {/* Field 3: Konfirmasi Kata Sandi Baru */}
      <div>
        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
          Konfirmasi Kata Sandi Baru <span className="text-rose-600">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi kata sandi baru"
            required
            className="w-full pl-4 pr-11 py-2.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] placeholder-[#5C6B64]/60 focus:outline-none focus:border-[#39BF81] focus:bg-white transition-all shadow-2xs"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5C6B64] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            title={showConfirm ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showConfirm ? (
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

      {/* Link Bantuan Lupa Kata Sandi via OTP di Bawah Form */}
      <div className="pt-1 flex items-center justify-end">
        <button
          type="button"
          onClick={onStartOtp}
          disabled={otpLoading}
          className="text-xs text-[#369D6D] hover:text-[#107a55] font-bold hover:underline cursor-pointer inline-flex items-center gap-1.5 transition-colors disabled:opacity-60"
        >
          {otpLoading ? (
            <>
              <div className="w-3 h-3 border-2 border-[#369D6D] border-t-transparent rounded-full animate-spin" />
              <span>Mengirim kode OTP ke email...</span>
            </>
          ) : (
            <>
              <span>Lupa kata sandi? Reset via Kode OTP</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Tombol Aksi */}
      <div className="pt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="w-1/3 py-2.5 px-4 rounded-xl border border-[#D8E6DE] bg-[#F8FAF9] hover:bg-slate-100 text-[#5C6B64] text-xs font-bold transition-colors cursor-pointer text-center"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-2/3 py-2.5 px-5 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <span>Perbarui Kata Sandi</span>
          )}
        </button>
      </div>
    </form>
  );
}
