import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CompleteProfilePage() {
  const { user, completeProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [grade, setGrade] = useState(4);
  const [subClass, setSubClass] = useState("A");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const kelas = `Kelas ${grade}${subClass}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }
    if (!kelas) {
      setError("Pilih kelas terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      await completeProfile(name.trim(), kelas);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4 font-sans antialiased selection:bg-[#E7F3EC] selection:text-[#39BF81]">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#369D6D] flex items-center justify-center text-white shadow-sm">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
            Lengkapi Profil Kamu
          </h1>
          <p className="text-sm text-[#5C6B64]">
            Isi data berikut agar kami bisa menyesuaikan koleksi buku yang sesuai dengan kelasmu.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl border border-[#D8E6DE] p-7 sm:p-9 shadow-sm">

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <svg className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email (readonly) */}
            <div>
              <label className="block text-xs font-semibold text-[#5C6B64] mb-1.5">
                Email Terdaftar
              </label>
              <div className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#5C6B64] font-mono">
                {user?.email || "—"}
              </div>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D8E6DE] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:ring-2 focus:ring-[#E7F3EC] transition-colors"
              />
              <p className="text-[11px] text-[#5C6B64] mt-1">Gunakan nama sesuai data sekolah.</p>
            </div>

            {/* 24 Jajaran Kelas SD */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#1A1A1A]">
                  Pilih Kelas (24 Jajaran Kelas SD)
                </label>
                <span className="text-xs font-bold text-[#2BA76E] bg-[#E7F3EC] px-2.5 py-0.5 rounded-full border border-[#D8E6DE]">
                  {kelas}
                </span>
              </div>

              {/* 1. Pilih Jenjang Kelas 1-6 */}
              <div>
                <span className="text-[11px] font-medium text-[#5C6B64] block mb-1">1. Jenjang Tingkat Kelas:</span>
                <div className="grid grid-cols-6 gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        grade === g
                          ? "bg-[#369D6D] text-white border-[#369D6D] shadow-xs"
                          : "bg-[#F8FAF9] text-[#5C6B64] border-[#D8E6DE] hover:bg-white"
                      }`}
                    >
                      Kls {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Pilih Sub-kelas A, B, C, D */}
              <div>
                <span className="text-[11px] font-medium text-[#5C6B64] block mb-1">2. Ruang Sub-Kelas:</span>
                <div className="grid grid-cols-4 gap-2">
                  {["A", "B", "C", "D"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSubClass(s)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        subClass === s
                          ? "bg-[#369D6D] text-white border-[#369D6D] shadow-xs"
                          : "bg-white text-[#1A1A1A] border-[#D8E6DE] hover:bg-[#F8FAF9]"
                      }`}
                    >
                      {grade}{s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Role (readonly) */}
            <div>
              <label className="block text-xs font-semibold text-[#5C6B64] mb-1.5">
                Status Akun
              </label>
              <div className="w-full px-3.5 py-2.5 bg-[#E7F3EC] border border-[#D8E6DE] rounded-xl text-xs text-[#2BA76E] font-bold capitalize">
                {user?.role || "Siswa"} — Perpustakaan Digilibrary SD
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-sm font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : "Simpan & Mulai Membaca"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#5C6B64]">
          Data ini hanya digunakan untuk keperluan internal perpustakaan sekolah.
        </p>
      </div>
    </div>
  );
}
