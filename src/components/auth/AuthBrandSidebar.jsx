import { Link } from "react-router-dom";

export default function AuthBrandSidebar() {
  return (
    <div className="w-full lg:w-[42%] bg-gradient-to-br from-[#1a935f] to-[#106b44] text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden shrink-0">
      {/* Dekorasi Garis Halus Latar Belakang */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100" y2="100" stroke="white" strokeWidth="0.5" />
          <line x1="20" y1="0" x2="100" y2="80" stroke="white" strokeWidth="0.5" />
          <line x1="0" y1="20" x2="80" y2="100" stroke="white" strokeWidth="0.5" />
          <circle cx="90" cy="10" r="40" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      {/* Top: Brand Logo */}
      <div className="relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-sm group-hover:bg-white/25 transition-all">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white block leading-none">
              Digilibrary
            </span>
            <span className="text-[11px] text-emerald-200 font-medium mt-1 block">
              Perpustakaan Digital Sekolah Dasar
            </span>
          </div>
        </Link>
      </div>

      {/* Middle: Headline & Paragraph */}
      <div className="my-10 lg:my-auto relative z-10 max-w-md space-y-4">
        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block">
          Autentikasi Digilibrary
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
          Selamat Datang di Digilibrary!
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
          Masuk untuk menyimpan riwayat bacaan, mengakses ratusan koleksi buku Kurikulum Merdeka, dan membaca cerita anak resmi Kemendikdasmen.
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15">
            <div className="w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">Login Cepat & Aman</h2>
              <p className="text-[11px] text-emerald-100">Bisa menggunakan akun Google belajar atau email terdaftar.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15">
            <div className="w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">Akses Sesuai Peran</h2>
              <p className="text-[11px] text-emerald-100">Guru dan siswa otomatis diarahkan ke halaman masing-masing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Copyright & Links */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200 border-t border-white/15 pt-6">
        <span>&copy; {new Date().getFullYear()} Digilibrary</span>
        <div className="flex items-center gap-3 font-medium">
          <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
          <span className="w-px h-3 bg-emerald-200/40 inline-block" />
          <Link to="/forgot-password" className="hover:text-white transition-colors">Bantuan</Link>
          <span className="w-px h-3 bg-emerald-200/40 inline-block" />
          <span>Kemendikdasmen</span>
        </div>
      </div>
    </div>
  );
}
