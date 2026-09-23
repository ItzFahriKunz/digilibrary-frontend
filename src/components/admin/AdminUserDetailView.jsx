import { useState, useEffect, useMemo } from "react";
import { userService } from "../../services";
import UserAvatar from "../ui/UserAvatar";
import CustomSelect from "../ui/CustomSelect";

export default function AdminUserDetailView({
  userId,
  initialUserData,
  usersList = [],
  onBack,
  onUserUpdated,
  onUserDeleted,
}) {
  const [user, setUser] = useState(initialUserData || null);
  const [loading, setLoading] = useState(!initialUserData?.reading_logs);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit Form States
  const [formData, setFormData] = useState({
    name: initialUserData?.name || "",
    email: initialUserData?.email || "",
    role: initialUserData?.role || "siswa",
    kelas: initialUserData?.kelas || "",
  });
  const [saving, setSaving] = useState(false);

  // Peta wali kelas guru lain yang sudah aktif bertugas (kecuali user yang sedang diedit)
  const otherWaliMap = useMemo(() => {
    const map = {};
    (usersList || []).forEach((u) => {
      if (u.role === "guru" && u.kelas && Number(u.id) !== Number(userId)) {
        const clean = u.kelas.replace(/^Kelas\s+/i, "").trim().toUpperCase();
        if (clean && !["NONE", "TIDAK ADA", "BELUM DITUGASKAN", "-"].includes(clean)) {
          map[clean] = u.name;
          map[`Kelas ${clean}`] = u.name;
        }
      }
    });
    return map;
  }, [usersList, userId]);

  // Reset Password States
  const [resettingPass, setResettingPass] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [newTempPassword, setNewTempPassword] = useState("");
  const [copiedPass, setCopiedPass] = useState(false);

  const fetchUserDetail = async (id) => {
    setLoading(true);
    setError("");
    try {
      const res = await userService.getAdminUserDetail(id);
      if (res.data?.status === "success") {
        const u = res.data.data;
        setUser(u);
        setFormData({
          name: u.name || "",
          email: u.email || "",
          role: u.role || "siswa",
          kelas: u.kelas || "",
        });
      }
    } catch (err) {
      console.error("Error fetching user detail:", err);
      setError("Gagal memuat rincian data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetail(userId);
    }
  }, [userId]);

  const handleRoleChange = (newRole) => {
    setFormData((prev) => {
      let nextKelas = prev.kelas;
      if (newRole === "admin") {
        nextKelas = "";
      } else if (newRole === "guru") {
        const clean = prev.kelas ? prev.kelas.replace(/^Kelas\s+/i, "").trim().toUpperCase() : "";
        if (!clean || otherWaliMap[clean]) {
          nextKelas = "";
        }
      } else {
        if (!nextKelas) nextKelas = "Kelas 4A";
      }
      return { ...prev, role: newRole, kelas: nextKelas };
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    setSuccessMsg("");

    try {
      const payload = {
        name: formData.name.trim(),
        role: formData.role,
        kelas: formData.role === "admin" ? null : (formData.kelas || null),
      };

      const res = await userService.updateAdminUser(user.id, payload);

      if (res.data?.status === "success") {
        const updated = res.data.data;
        setUser((prev) => ({ ...prev, ...updated }));
        setSuccessMsg("Perubahan profil berhasil disimpan.");
        if (onUserUpdated) {
          onUserUpdated(updated);
        }
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Gagal memperbarui data pengguna.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user) return;
    setResettingPass(true);
    setError("");
    try {
      const res = await userService.resetAdminUserPassword(user.id);
      if (res.data?.status === "success") {
        setNewTempPassword(res.data.data.temporary_password);
        setIsResetConfirmOpen(false);
        setSuccessMsg("Kata sandi berhasil direset secara otomatis.");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError(err.response?.data?.message || "Gagal me-reset kata sandi pengguna.");
      setIsResetConfirmOpen(false);
    } finally {
      setResettingPass(false);
    }
  };

  const handleCopyPassword = () => {
    if (newTempPassword) {
      navigator.clipboard.writeText(newTempPassword);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const isGoogleAccount = Boolean(
    user?.is_google ||
      user?.firebase_uid ||
      user?.avatar?.includes("googleusercontent.com")
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Breadcrumb & Navigation */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C6B64] hover:text-[#39BF81] transition-colors cursor-pointer group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Daftar Pengguna</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#39BF81] text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg("")}
            className="text-[#39BF81] font-bold text-xs hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {error && (
        <div className="px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-rose-600 font-bold text-xs hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Temporary Password Result Banner */}
      {newTempPassword && (
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Kata Sandi Sementara Berhasil Dibuat
            </p>
            <p className="text-[11px] text-amber-800">
              Berikan kata sandi ini kepada {user?.name}:{" "}
              <code className="px-1.5 py-0.5 rounded bg-white border border-amber-300 font-mono font-bold text-slate-900 text-xs select-all">
                {newTempPassword}
              </code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyPassword}
              className="px-3 py-1.5 rounded-lg bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              {copiedPass ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Salin Sandi</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setNewTempPassword("")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Tutup"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl border border-[#D8E6DE] p-5 sm:p-7 shadow-xs space-y-6">
        {/* Header Kartu */}
        <div className="text-center border-b border-[#D8E6DE] pb-4">
          <h2 className="text-base font-bold text-[#1A1A1A]">Profil Pengguna</h2>
          <p className="text-xs text-[#5C6B64] mt-0.5">
            Kelola data diri, foto avatar, peran akun, dan aktivitas pengguna perpustakaan
          </p>
        </div>

        {/* Avatar Showcase di Bagian Tengah */}
        <div className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-[#F8FAF9] border border-[#D8E6DE] text-center space-y-3.5">
          <UserAvatar
            src={user?.avatar}
            name={user?.name}
            size="3xl"
            shape="rounded-full"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-[#39BF81] shadow-md ring-4 ring-[#E7F3EC]"
          />

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <p className="text-base font-bold text-[#1A1A1A]">{user?.name || "Nama Pengguna"}</p>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  user?.role === "admin"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : user?.role === "guru"
                    ? "bg-teal-50 text-teal-700 border border-teal-200"
                    : "bg-emerald-50 text-[#39BF81] border border-emerald-200"
                }`}
              >
                {user?.role || "Siswa"}
              </span>
            </div>
            <p className="text-xs text-[#5C6B64] font-mono">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#5C6B64] pt-0.5">
              {user?.kelas && (
                <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                  {user?.kelas}
                </span>
              )}
              {isGoogleAccount ? (
                <span className="inline-flex items-center gap-1 text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full font-medium text-[10px]">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                  Google OAuth
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium text-[10px]">
                  Akun Mandiri
                </span>
              )}
              <span className="bg-emerald-50 text-[#39BF81] border border-emerald-200 px-2 py-0.5 rounded-full font-bold text-[10px]">
                Aktif
              </span>
              <span className="bg-[#E7F3EC] text-[#39BF81] px-2 py-0.5 rounded-full font-mono font-bold text-[10px]">
                Total Baca: {user?.reading_logs_count || 0}x
              </span>
              <span className="w-px h-3 bg-slate-300 inline-block align-middle" />
              <span className="text-[10px]">
                Terdaftar{" "}
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Form Perbarui Data */}
        <form onSubmit={handleUpdateProfile} className="space-y-4 pt-2">
          <div className="border-b border-[#D8E6DE] pb-2">
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Informasi Profil</h3>
            <p className="text-[11px] text-[#5C6B64]">
              Ubah rincian nama, peran akses, dan tingkatan kelas pengguna
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:ring-1 focus:ring-[#39BF81] transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Alamat Email
                </label>
                <span className="text-[10px] text-[#5C6B64] font-medium flex items-center gap-1">
                  <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Terkunci
                </span>
              </div>
              <input
                type="email"
                disabled
                readOnly
                value={formData.email}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono cursor-not-allowed select-all"
                title="Alamat email tidak dapat diubah demi menjaga keamanan akun"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Peran (Role)
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
                    value={formData.kelas || ""}
                    onChange={(val) => setFormData({ ...formData, kelas: val })}
                    options={[
                      { value: "", label: "-- Belum Ditugaskan (None) --" },
                      ...[1, 2, 3, 4, 5, 6].flatMap((grade) => [
                        { isGroupHeader: true, label: `Tingkat Kelas ${grade}` },
                        ...["A", "B", "C", "D"].map((sub) => {
                          const classVal = `Kelas ${grade}${sub}`;
                          const code = `${grade}${sub}`;
                          const otherWali = otherWaliMap[code];
                          const isGuru = formData.role === "guru";
                          const isCurrentWali =
                            isGuru &&
                            user?.kelas &&
                            user.kelas.replace(/^Kelas\s+/i, "").trim().toUpperCase() === code;
                          const isOccupiedByOther = isGuru && Boolean(otherWali);

                          return {
                            value: classVal,
                            label: `Kelas ${grade}${sub}${
                              isCurrentWali
                                ? " (Kelas binaan saat ini)"
                                : isOccupiedByOther
                                ? ` (Sudah ada wali: ${otherWali})`
                                : ""
                            }`,
                          };
                        }),
                      ]),
                    ]}
                    className="w-full"
                    fullWidthMenu={true}
                  />
                  {formData.role === "guru" && (
                    <p className="text-[10px] text-[#5C6B64] mt-1 leading-normal">
                      * 1 kelas hanya berhak memiliki 1 wali kelas. Pilih <strong>Belum Ditugaskan (None)</strong> jika guru belum memiliki penugasan kelas.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#D8E6DE]">
            {user?.email !== "admin@digilibrary.sch.id" ? (
              <button
                type="button"
                onClick={() => onUserDeleted && onUserDeleted(user.id, user.name)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Hapus Pengguna</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {saving ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
        </form>

        {/* Keamanan & Reset Password Section */}
        <div className="pt-4 border-t border-[#D8E6DE] space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                Keamanan & Kata Sandi Akun
              </h3>
              <p className="text-[11px] text-[#5C6B64]">
                {isGoogleAccount
                  ? "Akun tertaut Google OAuth. Pengguna dapat masuk langsung dengan akun Google mereka."
                  : "Buat kata sandi sementara baru secara otomatis jika pengguna lupa sandi atau butuh akses cepat."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D8E6DE] hover:border-[#39BF81] text-[#39BF81] text-xs font-bold hover:bg-[#E7F3EC] transition-all cursor-pointer shadow-2xs shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span>Reset Kata Sandi Otomatis</span>
            </button>
          </div>
        </div>

        {/* Riwayat Aktivitas Baca */}
        <div className="pt-4 border-t border-[#D8E6DE] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Riwayat Membaca Terakhir</h3>
              <p className="text-[11px] text-[#5C6B64]">Daftar buku yang baru-baru ini dibuka oleh pengguna</p>
            </div>
            <span className="text-[11px] font-mono text-[#5C6B64]">
              {user?.reading_logs?.length || 0} aktivitas
            </span>
          </div>

          {loading ? (
            <p className="text-xs text-[#5C6B64] py-3 text-center">Memuat riwayat...</p>
          ) : !user?.reading_logs || user.reading_logs.length === 0 ? (
            <div className="py-4 text-center text-xs text-[#5C6B64] bg-[#F8FAF9] rounded-xl border border-dashed border-[#D8E6DE]">
              Belum ada riwayat membaca tercatat untuk pengguna ini.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#D8E6DE]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAF9] border-b border-[#D8E6DE] text-[#5C6B64] font-semibold text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-3">Buku</th>
                    <th className="py-2 px-3 text-center">Halaman Terakhir</th>
                    <th className="py-2 px-3 text-center">Durasi</th>
                    <th className="py-2 px-3 text-center">Platform</th>
                    <th className="py-2 px-3 text-right">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8E6DE]/60">
                  {user.reading_logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F8FAF9]/80">
                      <td className="py-2 px-3 font-semibold text-[#1A1A1A]">
                        {log.book?.judul || "Buku Kurikulum"}
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-[#39BF81]">
                        Hal. {log.halaman_terakhir}
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-[#5C6B64]">
                        {Math.floor(log.durasi_detik / 60)}m {log.durasi_detik % 60}s
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {log.platform || "web"}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-[#5C6B64] font-mono text-[11px]">
                        {new Date(log.read_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Reset Password */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-[#D8E6DE] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#1A1A1A]">
                Reset Kata Sandi Pengguna?
              </h3>
              <p className="text-xs text-[#5C6B64] leading-relaxed">
                Sistem akan membuat kata sandi acak baru untuk akun{" "}
                <strong className="text-[#1A1A1A]">{user?.name}</strong>. Kata sandi sebelumnya tidak dapat digunakan lagi.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D8E6DE]">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                disabled={resettingPass}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#5C6B64] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resettingPass}
                className="px-4 py-1.5 rounded-lg bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {resettingPass ? "Memproses..." : "Ya, Reset Sandi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
