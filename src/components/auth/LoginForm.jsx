import { Link } from "react-router-dom";

export default function LoginForm({
  isLoggedIn,
  isAdmin,
  user,
  authMode,
  setAuthMode,
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  showPasswordConfirm,
  setShowPasswordConfirm,
  loading,
  googleLoading = false,
  emailLoading = false,
  error,
  infoMessage,
  onSubmit,
  onGoogleLogin,
  onLogout,
}) {
  if (isLoggedIn) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#D8E6DE] rounded-3xl p-8 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#E7F3EC] text-[#2BA76E] flex items-center justify-center font-bold text-xl mx-auto border border-[#D8E6DE] shadow-xs">
            {user?.name?.[0] || "U"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1A1A1A]">{user?.name}</h3>
            <p className="text-xs text-[#5C6B64] mt-0.5">{user?.email}</p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#E7F3EC] text-[#2BA76E] capitalize border border-[#D8E6DE] mt-2">
              {user?.role || "Siswa"}
            </span>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#D8E6DE]/60">
            <Link
              to={isAdmin ? "/admin" : "/dashboard"}
              className="w-full py-3 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>{isAdmin ? "Buka Dashboard Admin" : "Buka Koleksi Buku"}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2.5 rounded-xl border border-[#D8E6DE] text-[#5C6B64] hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Keluar Akun
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D8E6DE] rounded-3xl p-7 sm:p-9 shadow-sm">
      {/* Tab Selector: Masuk Akun / Daftar Baru */}
      <div className="flex rounded-xl bg-[#F8FAF9] p-1 border border-[#D8E6DE] mb-6">
        <button
          type="button"
          onClick={() => setAuthMode("login")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            authMode === "login"
              ? "bg-white text-[#2BA76E] shadow-xs"
              : "text-[#5C6B64] hover:text-[#1A1A1A]"
          }`}
        >
          Masuk Akun
        </button>
        <button
          type="button"
          onClick={() => setAuthMode("register")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            authMode === "register"
              ? "bg-white text-[#2BA76E] shadow-xs"
              : "text-[#5C6B64] hover:text-[#1A1A1A]"
          }`}
        >
          Daftar Baru
        </button>
      </div>

      {/* Title & Subtitle */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
          {authMode === "login" ? "Selamat Datang Kembali" : "Buat Akun Pembaca Baru"}
        </h2>
        <p className="text-xs text-[#5C6B64] mt-1">
          {authMode === "login"
            ? "Masukkan email dan kata sandi Anda untuk melanjutkan."
            : "Lengkapi data di bawah ini untuk mendaftar akun."}
        </p>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
          <svg className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium leading-relaxed">{error}</span>
        </div>
      )}

      {infoMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-[#E7F3EC] border border-[#D8E6DE] text-[#2BA76E] text-xs flex items-start gap-2.5 animate-fadeIn">
          <svg className="w-4 h-4 shrink-0 mt-0.5 text-[#2BA76E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium leading-relaxed">{infoMessage}</span>
        </div>
      )}

      {/* Form Input */}
      <form onSubmit={onSubmit} className="space-y-4">
        {authMode === "register" && (
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:ring-2 focus:ring-[#E7F3EC]"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
            Alamat Email
          </label>
          <input
            type="email"
            required
            placeholder="nama@sekolah.sch.id"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:ring-2 focus:ring-[#E7F3EC]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-[#1A1A1A]">
              Kata Sandi
            </label>
            {authMode === "login" && (
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-[#2BA76E] hover:underline cursor-pointer"
              >
                Lupa kata sandi?
              </Link>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Minimal 6 karakter"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:ring-2 focus:ring-[#E7F3EC]"
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

        {authMode === "register" && (
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                required
                placeholder="Ulangi kata sandi"
                value={formData.passwordConfirmation}
                onChange={(e) =>
                  setFormData({ ...formData, passwordConfirmation: e.target.value })
                }
                className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:ring-2 focus:ring-[#E7F3EC]"
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
        )}

        <button
          type="submit"
          disabled={emailLoading || googleLoading || loading}
          className="w-full py-3 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-sm font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {emailLoading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Memproses...</span>
            </span>
          ) : authMode === "login" ? (
            "Masuk dengan Email"
          ) : (
            "Daftar Akun Baru"
          )}
        </button>
      </form>

      {/* Divider ATAU */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#D8E6DE]"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-[11px] text-[#5C6B64] font-medium">atau</span>
        </div>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={emailLoading || googleLoading || loading}
        className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white hover:bg-[#F8FAF9] border border-[#D8E6DE] text-[#1A1A1A] text-xs font-semibold transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
      >
        {googleLoading ? (
          <span className="inline-flex items-center justify-center gap-2 text-[#2BA76E]">
            <svg className="animate-spin h-4 w-4 text-[#2BA76E]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Menghubungkan ke Google...</span>
          </span>
        ) : (
          <>
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Masuk dengan Google</span>
          </>
        )}
      </button>

      <p className="text-center text-[11px] text-[#5C6B64] mt-5">
        Dengan melanjutkan, Anda menyetujui Ketentuan Layanan Digilibrary.
      </p>
    </div>
  );
}
