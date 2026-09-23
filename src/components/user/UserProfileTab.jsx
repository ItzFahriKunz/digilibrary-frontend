import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { userService } from "../../services";
import AvatarCropperModal from "./AvatarCropperModal";
import ToastAlert from "../ui/ToastAlert";
import CustomSelect from "../ui/CustomSelect";

export default function UserProfileTab({ user, onProfileUpdated }) {
  const fileInputRef = useRef(null);

  // Form State Profil
  const [name, setName] = useState(user?.name || "");
  const [kelas, setKelas] = useState(
    user?.role === "guru" ? (user?.kelas || "") : (user?.kelas || "Kelas 4A")
  );
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [imgError, setImgError] = useState(false);

  // Cropper Modal State
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null);

  // UI Status State
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // Toast Alert State
  const [toast, setToast] = useState({ type: "info", message: "" });

  // Handle file select -> Buka modal pemotong foto
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileError("File harus berupa gambar (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setProfileError("Ukuran foto maksimal 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawImageSrc(event.target.result);
      setIsCropperOpen(true);
      setProfileError("");
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // Reset file input
  };

  // Callback setelah pemotongan foto selesai
  const handleCropComplete = ({ file, previewUrl }) => {
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
    setSelectedAvatar("");
    setProfileError("");
  };


  // Submit Update Profil
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!name.trim()) {
      setProfileError("Nama lengkap tidak boleh kosong.");
      return;
    }

    setProfileLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("kelas", kelas);

      if (avatarFile) {
        formData.append("avatar_file", avatarFile);
      } else if (selectedAvatar) {
        formData.append("avatar", selectedAvatar);
      }

      const res = await userService.updateProfile(formData);

      if (res.data?.status === "success" && res.data?.data) {
        setProfileSuccess("Profil berhasil diperbarui!");
        setToast({ type: "success", message: "Profil berhasil diperbarui!" });
        if (onProfileUpdated) {
          onProfileUpdated(res.data.data);
        }
      }
    } catch (err) {
      console.error("Profile update error:", err);
      const errMsg = err.response?.data?.message || "Gagal memperbarui profil.";
      setProfileError(errMsg);
      setToast({ type: "error", message: errMsg });
    } finally {
      setProfileLoading(false);
    }
  };

  const userInitial = user?.name ? user.name[0].toUpperCase() : "S";

  return (
    <div className="space-y-8 max-w-2xl mx-auto w-full pb-12">
      {/* Toast Alert Global */}
      <ToastAlert
        type={toast.type}
        message={toast.message}
        duration={4000}
        onDismiss={() => setToast({ type: "info", message: "" })}
      />

      {/* Modal Pemotong Foto */}
      <AvatarCropperModal
        isOpen={isCropperOpen}
        imageSrc={rawImageSrc}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={handleCropComplete}
      />

      {/* ================= SECTION 1: PROFIL & FOTO ================= */}
      <section className="bg-white rounded-3xl border border-[#D8E6DE] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header Kartu */}
        <div className="text-center border-b border-[#D8E6DE] pb-5">
          <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A]">Profil Siswa</h2>
          <p className="text-xs text-[#5C6B64] mt-1">
            Kelola data diri, foto avatar, dan tingkatan kelas di perpustakaan digital
          </p>
        </div>

        {profileError && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{profileError}</span>
          </div>
        )}

        {profileSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#369D6D] text-xs font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-[#369D6D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>{profileSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar Showcase di Bagian Tengah */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#F8FAF9] border border-[#D8E6DE] text-center space-y-4">
            <div className="relative group">
              {avatarPreview && !imgError ? (
                <img
                  src={avatarPreview}
                  alt={name || "Avatar"}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#369D6D] shadow-md bg-white ring-4 ring-[#E7F3EC]"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#369D6D] text-white text-3xl font-bold flex items-center justify-center shadow-md ring-4 ring-[#E7F3EC]">
                  {userInitial}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 rounded-full bg-[#369D6D] hover:bg-[#107a55] text-white shadow-md border-2 border-white transition-transform hover:scale-105 cursor-pointer"
                title="Pilih foto profil baru"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            <div>
              <p className="text-sm font-bold text-[#1A1A1A]">{name || "Nama Siswa"}</p>
              <p className="text-[11px] text-[#5C6B64] mt-0.5">{kelas} | {user?.email || ""}</p>
            </div>

            {/* Action Buttons Foto */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#E7F3EC] text-[#369D6D] hover:text-[#107a55] border border-[#D8E6DE] text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Pilih Foto Baru</span>
              </button>

              {/* Tombol Potong Foto Jika Ada Gambar Yang Sedang Dipakai */}
              {(rawImageSrc || (avatarFile && avatarPreview)) && (
                <button
                  type="button"
                  onClick={() => setIsCropperOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#E7F3EC] hover:bg-[#d8ece0] text-[#369D6D] border border-[#D8E6DE] text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                  </svg>
                  <span>Sesuaikan Potongan</span>
                </button>
              )}

              {avatarPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarFile(null);
                    setSelectedAvatar("");
                    setAvatarPreview("");
                    setRawImageSrc(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-[#D8E6DE] text-xs font-semibold transition-all cursor-pointer"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>


          {/* Form Input Data Diri */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                Nama Lengkap Siswa <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Muhammad Bintang"
                className="w-full px-4 py-2.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                  {user?.role === "guru" ? "Kelas Binaan (Wali Kelas)" : "Tingkatan Kelas (24 Kelas SD)"}
                </label>
                <CustomSelect
                  value={kelas}
                  onChange={(val) => setKelas(val)}
                  options={[
                    { value: "", label: "-- Belum Ditugaskan (None) --" },
                    ...[1, 2, 3, 4, 5, 6].flatMap((grade) => [
                      { isGroupHeader: true, label: `Tingkat Kelas ${grade} SD` },
                      ...["A", "B", "C", "D"].map((sub) => ({
                        value: `Kelas ${grade}${sub}`,
                        label: `Kelas ${grade}${sub} SD`,
                      })),
                    ]),
                  ]}
                  className="w-full"
                  fullWidthMenu={true}
                />
                {user?.role === "guru" && (
                  <p className="text-[10px] text-[#5C6B64] mt-1.5 leading-normal">
                    * 1 kelas hanya dapat dibina oleh 1 orang wali kelas. Penugasan resmi dikelola oleh Administrator sekolah.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                  Peran Akun (Role)
                </label>
                <div className="px-4 py-2.5 bg-slate-100 border border-[#D8E6DE] rounded-xl text-xs text-[#369D6D] font-bold capitalize flex items-center justify-between">
                  <span>{user?.role || "Siswa"}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">Aktif</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                Alamat Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-4 py-2.5 bg-slate-100 border border-[#D8E6DE] rounded-xl text-xs text-[#5C6B64] cursor-not-allowed"
              />
              <span className="text-[10px] text-[#5C6B64] mt-1 block">Email terikat pada akun dan tidak dapat diubah di sini.</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {profileLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan Perubahan...</span>
                </>
              ) : (
                <span>Simpan Perubahan Profil</span>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ================= SECTION 2: GANTI KATA SANDI (DASHBOARD CARD BUTTON DENGAN ALUR OTP) ================= */}
      <section className="bg-white rounded-3xl border border-[#D8E6DE] p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
            Keamanan & Kata Sandi
          </h2>
          <p className="text-xs text-[#5C6B64] mt-0.5">
            Perbarui kata sandi akun Anda secara berkala demi menjaga keamanan data dan riwayat bacaan.
          </p>
        </div>

        {/* Tombol Sederhana untuk ke Halaman Ganti Password */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 rounded-2xl border border-[#D8E6DE] bg-[#F8FAF9]">
          <div>
            <h4 className="text-xs font-bold text-[#1A1A1A]">
              Kata Sandi Akun
            </h4>
            <p className="text-[11px] text-[#5C6B64] mt-0.5">
              Kelola kata sandi akun Anda atau reset via OTP jika lupa kata sandi lama
            </p>
          </div>

          <Link
            to="/change-password"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#369D6D] text-[#369D6D] hover:text-white border border-[#D8E6DE] text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <span>Ganti Kata Sandi</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
