import { useState, useMemo } from "react";
import { userService } from "../../services";
import CustomSelect from "../ui/CustomSelect";

export default function AdminUserModal({ isOpen, onClose, onUserCreated, usersList = [] }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "siswa",
    kelas: "Kelas 4A",
    password: "",
    passwordConfirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Peta wali kelas guru yang sudah aktif bertugas
  const existingWaliMap = useMemo(() => {
    const map = {};
    (usersList || []).forEach((u) => {
      if (u.role === "guru" && u.kelas) {
        const clean = u.kelas.replace(/^Kelas\s+/i, "").trim().toUpperCase();
        if (clean && !["NONE", "TIDAK ADA", "BELUM DITUGASKAN", "-"].includes(clean)) {
          map[clean] = u.name;
          map[`Kelas ${clean}`] = u.name;
        }
      }
    });
    return map;
  }, [usersList]);

  const handleRoleChange = (newRole) => {
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      kelas: newRole === "admin" ? "" : newRole === "guru" ? "" : "Kelas 4A",
    }));
  };

  if (!isOpen) return null;

  const handleClose = () => {
    if (submitting) return;
    setFormData({
      name: "",
      email: "",
      role: "siswa",
      kelas: "Kelas 4A",
      password: "",
      passwordConfirmation: "",
    });
    setShowPassword(false);
    setShowPasswordConfirm(false);
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Kata sandi minimal harus 6 karakter.");
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      setError("Konfirmasi kata sandi tidak cocok dengan kata sandi.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        kelas: formData.role === "admin" ? null : (formData.kelas || null),
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
      };

      const res = await userService.createAdminUser(payload);

      if (res.data?.status === "success") {
        if (onUserCreated) {
          onUserCreated(res.data.data);
        }
        handleClose();
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setError(
        err.response?.data?.message ||
          "Gagal menambahkan pengguna. Pastikan email belum terdaftar."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#D8E6DE] space-y-4 animate-in fade-in zoom-in-95 duration-150 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#D8E6DE] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#39BF81] flex items-center justify-center shrink-0 border border-[#D8E6DE]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                Tambah Pengguna Baru
              </h3>
              <p className="text-[11px] text-[#5C6B64]">
                Daftarkan akun siswa, guru, atau admin perpustakaan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-[#5C6B64] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            title="Tutup dialog"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Information Alert Card */}
        <div className="p-3 rounded-xl bg-[#E7F3EC] border border-[#D8E6DE] text-xs text-[#39BF81] flex items-start gap-2.5">
          <svg className="w-4 h-4 text-[#39BF81] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[11px] leading-relaxed text-[#39BF81]">
            <strong>Informasi Akun:</strong> Masukkan kata sandi awal (minimal 6 karakter) untuk akun baru. Pengguna dapat memperbarui kata sandi mandiri setelah berhasil masuk.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between">
            <span className="leading-snug">{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-rose-600 font-bold hover:underline cursor-pointer ml-2 shrink-0"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Cut Fahri"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:ring-1 focus:ring-[#39BF81] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="nama@sekolah.sch.id"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:ring-1 focus:ring-[#39BF81] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Peran (Role) <span className="text-rose-500">*</span>
              </label>
              <CustomSelect
                value={formData.role}
                onChange={(val) => handleRoleChange(val)}
                options={[
                  { value: "siswa", label: "Siswa" },
                  { value: "guru", label: "Guru (Wali Kelas)" },
                  { value: "admin", label: "Administrator" },
                ]}
                className="w-full"
                fullWidthMenu={true}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {formData.role === "guru"
                  ? "Wali Kelas (1 Guru per Kelas)"
                  : formData.role === "admin"
                  ? "Tingkat Akses"
                  : "Kelas"}
              </label>

              {formData.role === "admin" ? (
                <input
                  type="text"
                  disabled
                  value="Seluruh Tingkatan (Admin)"
                  className="w-full px-3 py-2 bg-slate-50 border border-[#D8E6DE] rounded-xl text-xs text-[#5C6B64] cursor-not-allowed"
                />
              ) : (
                <>
                  <CustomSelect
                    value={formData.kelas}
                    onChange={(val) => setFormData({ ...formData, kelas: val })}
                    options={[
                      { value: "", label: "-- Belum Ditugaskan (None) --" },
                      ...[1, 2, 3, 4, 5, 6].flatMap((grade) => [
                        { isGroupHeader: true, label: `Tingkat Kelas ${grade}` },
                        ...["A", "B", "C", "D"].map((sub) => {
                          const classVal = `Kelas ${grade}${sub}`;
                          const code = `${grade}${sub}`;
                          const wali = existingWaliMap[code];
                          const isGuru = formData.role === "guru";
                          const isOccupied = isGuru && Boolean(wali);

                          return {
                            value: classVal,
                            label: `Kelas ${grade}${sub}${isOccupied ? ` (Sudah ada wali: ${wali})` : ""}`,
                          };
                        }),
                      ]),
                    ]}
                    className="w-full"
                    fullWidthMenu={true}
                  />
                  {formData.role === "guru" && (
                    <p className="text-[10px] text-[#5C6B64] mt-1 leading-normal">
                      * 1 kelas hanya berhak memiliki 1 wali kelas. Pilih <strong>Belum Ditugaskan (None)</strong> jika guru belum memiliki penugasan.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Kata Sandi & Konfirmasi Kata Sandi dengan Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-3 pr-9 py-2 bg-white border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:ring-1 focus:ring-[#39BF81] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5C6B64] hover:text-[#39BF81] transition-colors cursor-pointer"
                  title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Ulangi kata sandi"
                  value={formData.passwordConfirmation}
                  onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })}
                  className="w-full pl-3 pr-9 py-2 bg-white border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:ring-1 focus:ring-[#39BF81] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5C6B64] hover:text-[#39BF81] transition-colors cursor-pointer"
                  title={showPasswordConfirm ? "Sembunyikan sandi" : "Tampilkan sandi"}
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
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#D8E6DE]">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan & Buat Akun</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
