import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserAvatar from "../../components/ui/UserAvatar";
import RevealOnScroll from "../../components/ui/RevealOnScroll";
import { LANDING_CATEGORIES, DEFAULT_FALLBACK_COVER, LANDING_PREVIEW_BOOKS } from "../../data/landingBooks";

/* ==========================================================================
   1. SVG ICONS (DARI LandingIcons.jsx)
   ========================================================================== */

function BookStackIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  );
}

function GraduationCapIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10l-10-5L2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
      <path d="M22 10v6" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function SparklesIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
      <path d="M19 2l.5 1.5L21 4l-1.5.5L19 6l-.5-1.5L17 4l1.5-.5L19 2z" />
    </svg>
  );
}

function FrogStoryIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2.5C6.5 2.5 5.5 4.5 6 7.5L7.5 10.5" />
      <path d="M16 2.5C17.5 2.5 18.5 4.5 18 7.5L16.5 10.5" />
      <path d="M7.3 4.8c-.3.6-.2 1.6.3 2.7" strokeWidth="1.2" />
      <path d="M16.7 4.8c.3.6.2 1.6-.3 2.7" strokeWidth="1.2" />
      <path d="M5 12c-1.5 2-1 4.5.5 6 2 2 4.5 2.5 6.5 2.5s4.5-.5 6.5-2.5c1.5-1.5 2-4 .5-6-1.5-2-3.5-2.5-6.5-2.5s-5 .5-6.5 2.5z" />
      <circle cx="8.5" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
      <path d="M12 14.8l-1 1.2h2l-1-1.2z" fill="currentColor" stroke="none" />
      <path d="M10.5 16.8c.5.4 1 .6 1.5.6s1-.2 1.5-.6" />
      <path d="M3.5 14h2.5M3.5 16h2.5M20.5 14h-2.5M20.5 16h-2.5" strokeWidth="1.4" />
    </svg>
  );
}

function HeartHandIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z" />
    </svg>
  );
}

function MapCompassIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polygon points="12 4.5 14.5 12 12 10.5 9.5 12" fill="currentColor" stroke="currentColor" strokeWidth="1" />
      <polygon points="12 19.5 14.5 12 12 13.5 9.5 12" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <line x1="12" y1="1.5" x2="12" y2="3" strokeWidth="2" />
      <line x1="12" y1="21" x2="12" y2="22.5" strokeWidth="2" />
      <line x1="1.5" y1="12" x2="3" y2="12" strokeWidth="2" />
      <line x1="21" y1="12" x2="22.5" y2="12" strokeWidth="2" />
    </svg>
  );
}

function LeafScienceIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" />
      <path d="M9 14c0 0 2-1 4-1" />
    </svg>
  );
}

function BookOpenIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

function StarIcon({ className = "w-4 h-4", filled = true }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/* ==========================================================================
   2. POLICY & HELP MODAL (DARI LandingPolicyModal.jsx)
   ========================================================================== */

function LandingPolicyModal({ isOpen, type, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const contentMap = {
    privacy: {
      badge: "Keamanan Data & Privasi Anak",
      title: "Kebijakan Privasi Siswa",
      subtitle: "Perlindungan data pribadi siswa dan ekosistem belajar ramah anak.",
      icon: (
        <svg className="w-6 h-6 text-[#1F6F4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      sections: [
        {
          heading: "1. Komitmen Keamanan Data Anak (Ramah Anak)",
          body: "Digilibrary SD dirancang khusus untuk lingkungan pendidikan dasar. Kami tidak mengumpulkan data sensitif seperti lokasi GPS langsung, NIK, atau informasi finansial keluarga siswa.",
        },
        {
          heading: "2. Data yang Dicatat & Tujuannya",
          body: "Data akun terbatas pada: Nama lengkap, email sekolah/Google, tingkatan kelas, dan riwayat aktivitas membaca. Data ini semata-mata digunakan untuk pelaporan literasi sekolah dan pemantauan wali kelas.",
        },
        {
          heading: "3. 100% Bebas Iklan Komersial",
          body: "Platform ini sepenuhnya bersih dari iklan pihak ketiga, banner promosi, atau pelacak komersial, sehingga anak-anak dapat membaca buku cerita dan pelajaran dengan aman tanpa distraksi.",
        },
        {
          heading: "4. Akses Terbatas",
          body: "Catatan baca siswa hanya dapat diakses oleh siswa bersangkutan, wali kelas binaannya, dan admin perpustakaan sekolah. Tidak ada data yang dibagikan ke pihak luar.",
        },
      ],
    },
    terms: {
      badge: "Ketentuan Layanan Resmi",
      title: "Syarat & Ketentuan Penggunaan",
      subtitle: "Pedoman hak cipta materi SIBI dan etika penggunaan perpustakaan digital.",
      icon: (
        <svg className="w-6 h-6 text-[#1F6F4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      sections: [
        {
          heading: "1. Sumber Koleksi Buku Resmi",
          body: "Seluruh buku teks pelajaran, buku panduan guru, dan buku non-teks pengayaan bersumber resmi dari Sistem Informasi Perbukuan Indonesia (SIBI) Kementerian Pendidikan Dasar dan Menengah RI.",
        },
        {
          heading: "2. Pemanfaatan Non-Komersial",
          body: "Akses buku e-book ditujukan secara eksklusif untuk sarana belajar, mengajar, dan penguatan literasi siswa SD. Pengguna dilarang keras memperjualbelikan, mendistribusikan ulang berbayar, atau memodifikasi materi hak cipta.",
        },
        {
          heading: "3. Tanggung Jawab Akun",
          body: "Setiap siswa dan guru bertanggung jawab menjaga kerahasiaan kata sandi akunnya. Satu akun guru berhak membina satu kelas resmi sesuai data penugasan dari pihak sekolah.",
        },
        {
          heading: "4. Tata Tertib Pembaca",
          body: "Pengguna diharapkan memanfaatkan fasilitas pembaca digital secara bijak demi mendukung Gerakan Literasi Sekolah (GLS) dan Profil Pelajar Pancasila.",
        },
      ],
    },
    help: {
      badge: "Pusat Bantuan & Layanan",
      title: "Bantuan Teknis & FAQ",
      subtitle: "Panduan cepat penggunaan platform dan kontak pengelola perpustakaan.",
      icon: (
        <svg className="w-6 h-6 text-[#1F6F4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      sections: [
        {
          heading: "1. Lupa Kata Sandi Akun Siswa?",
          body: "Siswa dapat menggunakan menu 'Lupa Sandi' dengan memasukkan email akun, atau meminta Wali Kelas/Admin Perpustakaan untuk me-reset kata sandi sementara secara langsung.",
        },
        {
          heading: "2. Buku PDF Tidak Bisa Dibuka?",
          body: "Pastikan koneksi internet aktif saat membuka buku pertama kali. Jika layar putih, coba segarkan (refresh) halaman. E-book telah dioptimalkan agar ringan dibuka di komputer maupun ponsel pintar.",
        },
        {
          heading: "3. Tracker Halaman & Progres Baca",
          body: "Sistem otomatis menyimpan halaman terakhir yang Anda baca. Durasi membaca hanya dihitung saat Anda aktif membaca (otomatis jeda jika layar ditinggalkan atau diam lebih dari 30 detik).",
        },
        {
          heading: "4. Layanan Pengaduan & Dukungan",
          body: "Jika membutuhkan penambahan kelas atau kendala teknis lainnya, silakan hubungi tim IT perpustakaan sekolah melalui email support@digilibrary.sch.id.",
        },
      ],
    },
  };

  const current = contentMap[type] || contentMap.privacy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#D8E6DE] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#D8E6DE]/70 bg-[#F8FAF9]/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E7F3EC] flex items-center justify-center border border-[#D8E6DE] shrink-0">
              {current.icon}
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#E7F3EC] text-[#1F6F4A] border border-[#D8E6DE]">
                {current.badge}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mt-1">
                {current.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#5C6B64] hover:text-[#1A1A1A] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-[#5C6B64] leading-relaxed">
          <p className="italic text-[#1F6F4A] font-medium bg-[#E7F3EC]/40 p-3 rounded-xl border border-[#D8E6DE]/50">
            {current.subtitle}
          </p>
          {current.sections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <h4 className="font-bold text-[#1A1A1A] text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F6F4A]" />
                <span>{sec.heading}</span>
              </h4>
              <p className="pl-3.5 text-xs text-[#5C6B64] leading-relaxed">
                {sec.body}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#D8E6DE]/70 bg-[#F8FAF9]/50 flex items-center justify-between">
          <span className="text-[11px] text-[#5C6B64]">
            Digilibrary SD &bull; Layanan Resmi
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1F6F4A] hover:bg-[#17573A] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. HEADER NAVBAR (DARI LandingHeader.jsx)
   ========================================================================== */

const NAV_ITEMS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#kategori", label: "Kategori SIBI" },
  { href: "#koleksi", label: "Koleksi Buku SD" },
  { href: "#keunggulan", label: "Keunggulan" },
  { href: "#kurikulum", label: "Kurikulum" },
  { href: "#faq", label: "FAQ" },
];

function LandingHeader({ isLoggedIn, user }) {
  const [activeNav, setActiveNav] = useState("#beranda");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 130;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.querySelector(NAV_ITEMS[i].href);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveNav(NAV_ITEMS[i].href);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setActiveNav(href);
    setMobileMenuOpen(false);

    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.replaceState(null, "", href);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D8E6DE] transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-[#1F6F4A] flex items-center justify-center text-white shadow-md shadow-[#1F6F4A]/20 group-hover:bg-[#17573A] transition-colors shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-[#1F6F4A] leading-none whitespace-nowrap">
                Digilibrary
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#E7F3EC] text-[#1F6F4A] border border-[#D8E6DE] inline-flex items-center justify-center leading-none translate-y-[1.5px] shrink-0">
                SD
              </span>
            </div>
            <p className="text-[11px] text-[#5C6B64] font-medium hidden xl:block mt-1 whitespace-nowrap">
              Perpustakaan Digital Sekolah Dasar
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8 text-xs xl:text-sm font-medium shrink-0">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`group relative py-2 select-none active:scale-95 cursor-pointer transition-colors duration-200 whitespace-nowrap shrink-0 ${isActive
                  ? "text-[#1F6F4A] font-semibold"
                  : "text-[#5C6B64] font-medium hover:text-[#1F6F4A]"
                  }`}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#1F6F4A] transition-transform duration-300 ease-out origin-left ${isActive
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                    }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#1F6F4A] hover:bg-[#17573A] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:shadow-[#1F6F4A]/20 active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <span>Buka Dashboard</span>
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#F8FAF9] hover:bg-[#F0F7F3] border border-[#D8E6DE] transition-colors shrink-0 group cursor-pointer"
                title="Buka Dashboard Profil"
              >
                <UserAvatar
                  src={user?.avatar}
                  name={user?.name}
                  size="xs"
                  className="w-6 h-6 rounded-full border border-[#D8E6DE] shrink-0"
                />
                <span className="text-xs font-semibold text-[#1A1A1A] max-w-28 truncate group-hover:text-[#1F6F4A] transition-colors">
                  {user?.name}
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="group relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#5C6B64] hover:text-[#1F6F4A] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Masuk Akun</span>
                <span className="absolute bottom-1 left-3 right-3 h-[2px] rounded-full bg-[#1F6F4A] transition-transform duration-300 ease-out origin-left scale-x-0 group-hover:scale-x-100" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#1F6F4A] hover:bg-[#17573A] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:shadow-[#1F6F4A]/20 active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <span>Daftar Gratis</span>
              </Link>
            </>
          )}

          {/* Toggle Menu Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl border border-[#D8E6DE] text-[#1A1A1A] hover:bg-[#F8FAF9] active:scale-95 transition-all ml-1 cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Drawer Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D8E6DE] bg-white/98 backdrop-blur-md px-4 py-3 space-y-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoggedIn && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-[#F8FAF9] hover:bg-[#E7F3EC]/50 border border-[#D8E6DE] transition-colors"
            >
              <UserAvatar
                src={user?.avatar}
                name={user?.name}
                size="sm"
                className="w-9 h-9 rounded-full border border-[#D8E6DE] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#1A1A1A] truncate">{user?.name}</p>
                <p className="text-[11px] text-[#5C6B64] truncate">{user?.email || "Akun Terhubung"}</p>
              </div>
              <span className="text-[10px] font-bold text-[#1F6F4A] bg-[#E7F3EC] px-2 py-0.5 rounded-md border border-[#D8E6DE]">
                Profil
              </span>
            </Link>
          )}

          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`group relative px-3 py-2.5 text-sm select-none active:scale-[0.98] flex items-center justify-between transition-colors duration-200 ${isActive
                  ? "text-[#1F6F4A] font-semibold"
                  : "text-[#5C6B64] font-medium hover:text-[#1F6F4A]"
                  }`}
              >
                <span className="relative inline-block py-0.5">
                  <span>{item.label}</span>
                  <span
                    className={`absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-[#1F6F4A] transition-transform duration-300 ease-out origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                  />
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isActive ? "text-[#1F6F4A] translate-x-0.5" : "text-[#9EAEA5]"
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}

/* ==========================================================================
   4. HERO SECTION (DARI LandingHero.jsx)
   ========================================================================== */

function LandingHero({ featuredBook: initialFeatured, onActionClick }) {
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);

  const showcaseList = [
    initialFeatured || LANDING_PREVIEW_BOOKS[0],
    LANDING_PREVIEW_BOOKS[1],
    LANDING_PREVIEW_BOOKS[4],
  ].filter(Boolean);

  const activeBook = showcaseList[selectedBookIndex] || showcaseList[0];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const elem = document.getElementById("koleksi");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="beranda" className="relative pt-14 sm:pt-18 lg:pt-22 pb-20 sm:pb-24 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Kolom Kiri: Teks & CTA */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            <div></div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-[1.16]">
              Buku Cerita & Pelajaran SD,{" "}
              <span className="text-[#1F6F4A]">Kapan Saja</span> Tanpa Antre!
            </h1>

            <p className="text-[#5C6B64] text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Akses langsung buku teks Kurikulum Merdeka resmi (Kelas 1–6) dan buku cerita nonteks pengayaan literasi anak dari Pusat Perbukuan Kemendikdasmen secara gratis.
            </p>

            {/* Quick Exploration Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0">
              <div className="relative flex items-center shadow-xs rounded-2xl bg-white border border-[#D8E6DE] hover:border-[#1F6F4A]/60 transition-colors p-1.5">
                <div className="pl-3 text-[#5C6B64]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari judul buku pelajaran, cerita fabel, sains SD..."
                  className="w-full px-3 py-2 text-xs sm:text-sm text-[#1A1A1A] placeholder-[#5C6B64]/70 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#1F6F4A] hover:bg-[#17573A] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer shrink-0"
                >
                  Cari Koleksi
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-2.5 text-xs text-[#5C6B64]">
                <span className="font-semibold text-[#1A1A1A]">Pilihan Cepat:</span>
                <a href="#koleksi" className="px-2 py-0.5 rounded-md bg-[#F8FAF9] hover:bg-[#E7F3EC] hover:text-[#1F6F4A] border border-[#D8E6DE] transition-colors">
                  IPAS Kelas 4
                </a>
                <a href="#koleksi" className="px-2 py-0.5 rounded-md bg-[#F8FAF9] hover:bg-[#E7F3EC] hover:text-[#1F6F4A] border border-[#D8E6DE] transition-colors">
                  Matematika SD
                </a>
                <a href="#koleksi" className="px-2 py-0.5 rounded-md bg-[#F8FAF9] hover:bg-[#E7F3EC] hover:text-[#1F6F4A] border border-[#D8E6DE] transition-colors">
                  Cerita Fabel
                </a>
                <a href="#koleksi" className="px-2 py-0.5 rounded-md bg-[#F8FAF9] hover:bg-[#E7F3EC] hover:text-[#1F6F4A] border border-[#D8E6DE] transition-colors">
                  Kelas 1–6
                </a>
              </div>
            </form>

            {/* CTA Action Buttons */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                type="button"
                onClick={onActionClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-[#1F6F4A] hover:bg-[#17573A] text-white text-sm sm:text-base font-bold transition-all shadow-md shadow-[#1F6F4A]/20 hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <span>Mulai Membaca Buku SD</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <a
                href="#koleksi"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-[#F8FAF9] text-[#1A1A1A] text-sm sm:text-base font-bold border border-[#D8E6DE] transition-colors shadow-2xs"
              >
                <span>Lihat Katalog Koleksi</span>
              </a>
            </div>

            {/* Key Quality Points */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-[#5C6B64] font-medium">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#1F6F4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Buku Teks & Cerita Resmi SIBI</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#1F6F4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Format Digital Ramah Anak</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#1F6F4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Bebas Akses Kapan Saja</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Showcase Card */}
          <div className="lg:col-span-5 relative lg:pl-2">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative bg-white border border-[#D8E6DE] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                <div className="border-b border-[#D8E6DE]/80 pb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1F6F4A]">
                      Buku Pilihan Hari Ini
                    </span>
                    <span className="text-xs text-[#5C6B64] font-medium">SIBI Kemendikdasmen</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 bg-[#F8FAF9] p-1 rounded-xl border border-[#D8E6DE] text-xs">
                    {showcaseList.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedBookIndex(idx)}
                        className={`py-1.5 px-2 rounded-lg font-bold text-center transition-all cursor-pointer truncate ${selectedBookIndex === idx
                          ? "bg-white text-[#1F6F4A] shadow-2xs"
                          : "text-[#5C6B64] hover:text-[#1A1A1A]"
                          }`}
                      >
                        {item.badgeLabel || `Buku ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 sm:gap-5 items-start">
                  <div className="w-28 sm:w-34 h-38 sm:h-46 rounded-2xl overflow-hidden shadow-md shrink-0 bg-[#E7F3EC] relative border border-[#D8E6DE]">
                    <img
                      src={activeBook?.cover || DEFAULT_FALLBACK_COVER}
                      alt={activeBook?.title || "Buku"}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_FALLBACK_COVER;
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1F6F4A] text-white shadow-xs">
                        {activeBook?.badgeLabel || "Pilihan"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{activeBook?.rating || "4.9"}</span>
                      <span className="text-[#5C6B64] font-normal">({activeBook?.pages || "36 Hal"})</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] leading-snug line-clamp-2">
                      {activeBook?.title}
                    </h3>

                    <p className="text-xs text-[#5C6B64] line-clamp-1 font-medium">
                      Oleh: {activeBook?.author || "Pusat Perbukuan"}
                    </p>

                    <p className="text-xs text-[#5C6B64] line-clamp-2 leading-relaxed pt-1">
                      {activeBook?.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#D8E6DE]/60">
                  <span className="text-xs font-semibold text-[#1F6F4A]">
                    {activeBook?.jenjang || "SD Kelas 1–6"}
                  </span>

                  <button
                    type="button"
                    onClick={onActionClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F6F4A] hover:bg-[#17573A] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>Baca Buku Ini</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   5. STATS SECTION (DARI LandingStats.jsx)
   ========================================================================== */

function LandingStats() {
  const stats = [
    { label: "Buku SIBI Kemendikdasmen", value: "1,500+", icon: BookStackIcon },
    { label: "Kelas & Sekolah Binaan", value: "34+", icon: GraduationCapIcon },
    { label: "Akses Gratis & Berizin Resmi", value: "100%", icon: ShieldCheckIcon },
    { label: "Rating Kepuasan Membaca", value: "4.9/5", icon: SparklesIcon },
  ];

  return (
    <section className="py-12 bg-white border-y border-[#D8E6DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAF9] border border-[#D8E6DE]/60"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E7F3EC] flex items-center justify-center text-[#1F6F4A] shrink-0 border border-[#D8E6DE]">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#5C6B64] font-medium leading-snug">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   6. CATEGORIES SECTION (DARI LandingCategories.jsx)
   ========================================================================== */

function LandingCategories({ selectedCategory, onSelectCategory }) {
  const categories = [
    {
      nama: "Cerita & Fabel Bergambar",
      icon: FrogStoryIcon,
      badge: "Buku Nonteks",
      desc: "Kisah fabel binatang dan cerita anak bilingual bergambar.",
    },
    {
      nama: "Penguatan Karakter Anak",
      icon: HeartHandIcon,
      badge: "Buku Nonteks",
      desc: "Menumbuhkan budi pekerti, kemandirian, dan empati siswa.",
    },
    {
      nama: "Literasi Budaya & Cerita Rakyat",
      icon: MapCompassIcon,
      badge: "Buku Nonteks",
      desc: "Legenda nusantara dan keragaman adat istiadat Indonesia.",
    },
    {
      nama: "Literasi Sains & Lingkungan",
      icon: LeafScienceIcon,
      badge: "Buku Nonteks",
      desc: "Eksplorasi alam, kelautan nusantara, dan peduli lingkungan.",
    },
    {
      nama: "Buku Teks Kurikulum Merdeka",
      icon: BookOpenIcon,
      badge: "Buku Pelajaran",
      desc: "Buku teks utama IPAS, Matematika, B. Indonesia Fase A–C.",
    },
  ];

  return (
    <section id="kategori" className="py-20 bg-[#FDFDFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#1F6F4A]">
              Klasifikasi Buku SIBI
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
            Kategori Bacaan Berkualitas untuk Setiap Fase Belajar
          </h2>
          <p className="text-sm sm:text-base text-[#5C6B64] leading-relaxed">
            Pilih kategori buku bacaan yang sesuai dengan minat dan jenjang kelas peserta didik Sekolah Dasar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.nama;
            const IconComponent = cat.icon;
            return (
              <RevealOnScroll key={idx} delay={idx * 60} distance={16}>
                <div
                  onClick={() => onSelectCategory(cat.nama)}
                  className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer h-full ${isSelected
                    ? "bg-[#E7F3EC]/70 border-[#1F6F4A] shadow-md ring-2 ring-[#1F6F4A]/20"
                    : "bg-white border-[#D8E6DE] hover:border-[#1F6F4A]/50 hover:shadow-md hover:bg-[#F8FAF9]"
                    }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isSelected
                          ? "bg-[#1F6F4A] text-white shadow-sm"
                          : "bg-[#E7F3EC] text-[#1F6F4A]"
                          }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white text-[#5C6B64] border border-[#D8E6DE]">
                        {cat.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                      {cat.nama}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C6B64] leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#D8E6DE]/60 flex items-center justify-between text-xs font-bold text-[#1F6F4A]">
                    <span>{isSelected ? "Sedang Dipilih" : "Jelajahi Kategori"}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   7. BOOK SHOWCASE SECTION (DARI LandingBookShowcase.jsx)
   ========================================================================== */

function LandingBookShowcase({
  books,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onBookClick,
}) {
  const [previewBook, setPreviewBook] = useState(null);

  const filteredBooks = books.filter((book) => {
    const matchCategory =
      selectedCategory === "Semua Koleksi" ||
      book.category === selectedCategory ||
      (selectedCategory === "Buku Teks Kurikulum Merdeka" && book.jenjang?.includes("SD Kelas"));

    const query = (searchQuery || "").toLowerCase().trim();
    const matchSearch =
      !query ||
      (book.title || "").toLowerCase().includes(query) ||
      (book.author || "").toLowerCase().includes(query) ||
      (book.jenjang || "").toLowerCase().includes(query) ||
      (book.desc || "").toLowerCase().includes(query);

    return matchCategory && matchSearch;
  });

  return (
    <section id="koleksi" className="py-20 bg-white border-y border-[#D8E6DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#1F6F4A]">
                Katalog Resmi SIBI
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              Eksplorasi Koleksi Buku SD
            </h2>
            <p className="text-sm sm:text-base text-[#5C6B64] max-w-xl">
              Koleksi bacaan resmi dari Pusat Perbukuan Kemendikdasmen untuk memperkaya literasi dan mendampingi pembelajaran siswa.
            </p>
          </div>

          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="Cari judul, penulis, kelas..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-[#5C6B64]/70 focus:outline-none focus:border-[#1F6F4A] focus:ring-2 focus:ring-[#E7F3EC] transition-all"
            />
            <svg
              className="w-4 h-4 text-[#5C6B64] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filter Pills Kategori */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {LANDING_CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
                ? "bg-[#1F6F4A] text-white shadow-xs"
                : "bg-[#F8FAF9] hover:bg-[#E7F3EC] text-[#5C6B64] border border-[#D8E6DE]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Buku */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 bg-[#F8FAF9] rounded-2xl border border-[#D8E6DE]">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white text-[#5C6B64] flex items-center justify-center border border-[#D8E6DE]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">Buku Tidak Ditemukan</h3>
            <p className="text-xs text-[#5C6B64] mt-1">Coba gunakan kata kunci pencarian atau kategori yang berbeda.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-[#D8E6DE] hover:border-[#1F6F4A]/40 transition-all duration-200 hover:shadow-lg flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="aspect-3/4 overflow-hidden bg-slate-100 relative">
                    <img
                      src={book.cover || DEFAULT_FALLBACK_COVER}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_FALLBACK_COVER;
                      }}
                    />
                    <div className="absolute bottom-3 left-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md border backdrop-blur-xs ${book.tagColor || "bg-emerald-50 text-emerald-900 border-emerald-200"}`}>
                        {book.badgeLabel || "SIBI SD"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F6F4A] block">
                      {book.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#1A1A1A] leading-snug line-clamp-2 group-hover:text-[#1F6F4A] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-[#5C6B64] line-clamp-1">
                      {book.author}
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#5C6B64]">
                      <span>{book.jenjang}</span>
                      <span className="font-mono">{book.pages}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewBook(book)}
                    className="py-2.5 px-3 rounded-xl bg-[#F8FAF9] hover:bg-[#E7F3EC] text-[#5C6B64] hover:text-[#1F6F4A] text-xs font-semibold border border-[#D8E6DE] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Detail</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onBookClick(book)}
                    className="py-2.5 px-3 rounded-xl bg-[#1F6F4A] hover:bg-[#17573A] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-[0.98]"
                    title="Masuk atau Buka di Dashboard untuk membaca buku lengkap"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Baca</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center text-xs text-[#5C6B64] bg-[#F8FAF9] p-4 rounded-xl border border-[#D8E6DE]">
          Sumber Data: Seluruh katalog di atas merujuk pada standar buku resmi <strong>SIBI Kemendikdasmen</strong> (<a href="https://buku.kemendikdasmen.go.id" target="_blank" rel="noreferrer" className="text-[#1F6F4A] font-semibold underline">buku.kemendikdasmen.go.id</a>).
        </div>
      </div>

      {/* MODAL DETAIL PREVIEW BUKU */}
      {previewBook && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#D8E6DE] shadow-2xl relative">
            <button
              onClick={() => setPreviewBook(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#5C6B64] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex gap-4 items-start">
              <div className="w-24 h-32 rounded-xl overflow-hidden shadow-md shrink-0 bg-slate-100">
                <img
                  src={previewBook.cover || DEFAULT_FALLBACK_COVER}
                  alt={previewBook.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5 flex-1 pr-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F6F4A] bg-[#E7F3EC] px-2.5 py-0.5 rounded-md border border-[#D8E6DE]">
                  {previewBook.badgeLabel || "SIBI"}
                </span>
                <h3 className="text-base font-bold text-[#1A1A1A] leading-tight">
                  {previewBook.title}
                </h3>
                <p className="text-xs text-[#5C6B64]">{previewBook.author}</p>
                <div className="text-[11px] text-[#5C6B64] pt-1">
                  <span>{previewBook.jenjang}</span> | <span>{previewBook.pages}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#1A1A1A]">Sinopsis & Deskripsi:</h4>
              <p className="text-xs text-[#5C6B64] leading-relaxed">
                {previewBook.desc}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#D8E6DE] text-[11px] text-[#5C6B64] space-y-1">
              <div className="flex justify-between">
                <span>Penerbit:</span>
                <strong className="text-[#1A1A1A]">{previewBook.sumber || "Pusat Perbukuan Kemendikdasmen"}</strong>
              </div>
              <div className="flex justify-between">
                <span>Format Baca:</span>
                <strong className="text-[#1F6F4A]">E-Reader Canvas Interaktif</strong>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPreviewBook(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5C6B64] text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  const b = previewBook;
                  setPreviewBook(null);
                  onBookClick(b);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#1F6F4A] hover:bg-[#17573A] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Buka Lembaran Buku</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ==========================================================================
   8. FEATURES SECTION (DARI LandingFeatures.jsx)
   ========================================================================== */

function LandingFeatures() {
  const features = [
    {
      title: "Pembaca PDF Interaktif Aman",
      desc: "Kanvas pembaca digital yang responsif dengan proteksi watermark dinamis untuk melindungi hak cipta buku kementerian.",
      icon: (
        <svg className="w-6 h-6 text-[#1F6F4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "Pelacak Durasi Membaca Aktif",
      desc: "Live Reading Tracker otomatis mengukur waktu membaca aktif siswa dan otomatis menjeda saat layar ditinggalkan.",
      icon: (
        <svg className="w-6 h-6 text-[#1F6F4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Kurikulum Merdeka Fase A - C",
      desc: "Struktur materi disusun rapi berdasarkan jenjang kelas 1 sampai 6 untuk memudahkan pemetaan capaian pembelajaran.",
      icon: (
        <svg className="w-6 h-6 text-[#1F6F4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: "Panel Pemantauan Guru & Kelas",
      desc: "Wali kelas dapat memantau grafik membaca mingguan, total buku selesai, dan progres setiap siswa secara real-time.",
      icon: (
        <svg className="w-6 h-6 text-[#1F6F4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="keunggulan" className="py-20 bg-[#FDFDFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#1F6F4A]">
              Keunggulan Platform
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Fitur Terbaik untuk Literasi Sekolah Dasar
          </h2>
          <p className="text-sm sm:text-base text-[#5C6B64]">
            Dirancang khusus dengan standar kenyamanan membaca anak, kemudahan guru, dan kepatuhan perbukuan nasional.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-[#D8E6DE] hover:border-[#1F6F4A]/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E7F3EC] flex items-center justify-center mb-5 border border-[#D8E6DE]">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-[#1A1A1A] mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#5C6B64] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#D8E6DE]/60 text-[11px] font-bold text-[#1F6F4A]">
                Standar Kemendikdasmen
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   9. CURRICULUM SECTION (DARI LandingCurriculum.jsx)
   ========================================================================== */

function LandingCurriculum({ onActionClick }) {
  const phases = [
    {
      phase: "Fase A",
      classes: "Kelas 1 – 2 SD",
      focus: "Membaca Dini & Fabel Sederhana",
      desc: "Menekankan fonemik, pengenalan huruf/kata dengan ilustrasi visual besar dan kalimat ramah pembaca pemula.",
      tag: "Pembaca Awal",
    },
    {
      phase: "Fase B",
      classes: "Kelas 3 – 4 SD",
      focus: "Literasi Cerita & Konsep Dasar",
      desc: "Cerita fiksi bertema budi pekerti, persahabatan, sains sehari-hari, dan buku teks mata pelajaran pokok.",
      tag: "Pembaca Madya",
    },
    {
      phase: "Fase C",
      classes: "Kelas 5 – 6 SD",
      focus: "Eksplorasi Sains & Kebangsaan",
      desc: "Kisah sejarah nusantara, kelestarian lingkungan hidup, serta penguatan literasi digital dan berpikir kritis.",
      tag: "Pembaca Mahir",
    },
  ];

  return (
    <section id="kurikulum" className="py-20 bg-white border-y border-[#D8E6DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#1F6F4A]">
              Kurikulum Merdeka
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Penyesuaian Fase Membaca Peserta Didik
          </h2>
          <p className="text-sm sm:text-base text-[#5C6B64]">
            Setiap fase kurikulum didukung oleh bahan bacaan berjenjang yang sesuai dengan tingkat kognitif anak.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {phases.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#F8FAF9] border border-[#D8E6DE] hover:border-[#1F6F4A]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-[#1F6F4A]">
                    {p.phase}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E7F3EC] text-[#1F6F4A] border border-[#D8E6DE]">
                    {p.tag}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#1A1A1A] mb-1">
                  {p.classes}
                </h3>
                <p className="text-xs font-semibold text-[#1F6F4A] mb-3">
                  {p.focus}
                </p>
                <p className="text-xs text-[#5C6B64] leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D8E6DE]/60 flex items-center justify-between text-xs font-bold text-[#1F6F4A]">
                <span>Koleksi Terverifikasi</span>
                <span className="w-2 h-2 rounded-full bg-[#1F6F4A]" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner Bawah */}
        <div className="rounded-3xl bg-gradient-to-r from-[#1F6F4A] to-[#17573A] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">
              Siap Memulai Literasi Digital di Sekolah Anda?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Daftarkan akun sekarang secara gratis dan nikmati akses ke ribuan halaman bacaan berstandar nasional.
            </p>
          </div>
          <button
            type="button"
            onClick={onActionClick}
            className="px-6 py-3.5 rounded-2xl bg-white text-[#1F6F4A] font-bold text-sm hover:bg-emerald-50 transition-colors shadow-sm shrink-0 cursor-pointer"
          >
            Daftar &amp; Mulai Baca
          </button>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   10. TESTIMONIALS SECTION (DARI LandingTestimonials.jsx)
   ========================================================================== */

function LandingTestimonials() {
  const testimonials = [
    {
      name: "Ibu Nurhayati, S.Pd.",
      role: "Wali Kelas 4 SD Negeri 01",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
      content: "Fitur pemantauan membacanya sangat membantu saya mengetahui siswa mana yang rajin membaca di rumah. Buku Kurikulum Merdeka-nya pun lengkap dan resmi.",
      rating: 5,
    },
    {
      name: "Bagas Pratama",
      role: "Siswa Kelas 5 SD",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
      content: "Gambar-gambarnya jelas dan cerita fabelnya seru banget! Aku suka baca sebelum tidur karena bisa dibuka langsung dari HP ibu tanpa iklan.",
      rating: 5,
    },
    {
      name: "Pak Hendra Wijaya",
      role: "Orang Tua Siswa",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      content: "Sangat tenang membiarkan anak membaca di sini karena kontennya 100% aman dan bersumber dari Kemendikdasmen. Tampilan halamannya juga rapi.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-[#FDFDFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#1F6F4A]">
              Testimoni Pengguna
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Apa Kata Guru, Siswa, &amp; Orang Tua?
          </h2>
          <p className="text-sm sm:text-base text-[#5C6B64]">
            Pengalaman nyata dalam memanfaatkan platform membaca digital di lingkungan sekolah dan keluarga.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-[#D8E6DE] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, rIdx) => (
                    <StarIcon key={rIdx} className="w-4 h-4" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#5C6B64] italic leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D8E6DE]/60 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#D8E6DE]"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#1A1A1A]">
                    {t.name}
                  </h4>
                  <p className="text-[10px] text-[#5C6B64]">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   11. FAQ SECTION (DARI LandingFaq.jsx)
   ========================================================================== */

function LandingFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Apakah seluruh buku di Digilibrary bebas biaya dan resmi?",
      a: "Ya, seluruh buku berasal dari katalog Sistem Informasi Perbukuan Indonesia (SIBI) yang diterbitkan resmi oleh Pusat Perbukuan BSKAP Kemendikdasmen untuk mendukung pembelajaran sekolah secara gratis dan legal.",
    },
    {
      q: "Bagaimana cara membaca buku lengkap di aplikasi ini?",
      a: "Cukup masuk akun dengan email sekolah atau akun Google Anda. Setelah masuk, Anda akan langsung diarahkan ke Dashboard Siswa/Guru untuk membaca seluruh katalog dengan pembaca kanvas berwatermark.",
    },
    {
      q: "Apakah ada fitur pembatasan durasi atau pelacak waktu membaca?",
      a: "Ya, sistem dilengkapi Live Reading Tracker yang otomatis mencatat durasi membaca aktif Anda. Jika pembaca diam di halaman yang sama lebih dari 1 menit tanpa membalik halaman, timer otomatis dijeda demi keakuratan data.",
    },
    {
      q: "Bisakah guru dan admin mengelola dan mengunggah buku baru?",
      a: "Admin sekolah memiliki akses ke Panel Admin khusus untuk mengunggah file buku PDF asli, memperbarui metadata, mengelola akun guru/siswa, serta memantau grafik tren membaca 7 hari terakhir.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white border-t border-[#D8E6DE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-3">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#1F6F4A]">
              Pertanyaan Umum
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="text-sm text-[#5C6B64]">
            Jawaban lengkap seputar aksesibilitas, kurikulum, dan perlindungan hak cipta buku digital.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                  ? "border-[#1F6F4A]/40 bg-white shadow-sm ring-1 ring-[#1F6F4A]/10"
                  : "border-[#D8E6DE] bg-[#F8FAF9] hover:border-[#1F6F4A]/30 hover:bg-white"
                  }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className={`w-full p-5 text-left font-bold text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer transition-colors duration-200 group ${isOpen ? "text-[#1F6F4A]" : "text-[#1A1A1A] hover:text-[#1F6F4A]"
                    }`}
                >
                  <span>{faq.q}</span>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${isOpen
                      ? "rotate-180 bg-[#1F6F4A] text-white shadow-2xs"
                      : "bg-white border border-[#D8E6DE] text-[#5C6B64] group-hover:border-[#1F6F4A]/40 group-hover:text-[#1F6F4A]"
                      }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`px-5 pb-5 text-xs sm:text-sm text-[#5C6B64] leading-relaxed border-t border-[#D8E6DE]/60 pt-4 bg-white transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                        }`}
                    >
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   12. FOOTER SECTION (DARI LandingFooter.jsx)
   ========================================================================== */

function LandingFooter({ onActionClick }) {
  const [activePolicyModal, setActivePolicyModal] = useState(null);

  return (
    <footer className="bg-white border-t border-[#D8E6DE] pt-16 pb-12 text-[#5C6B64] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Kolom 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1F6F4A] flex items-center justify-center text-white shadow-xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-[#1F6F4A]">Digilibrary SD</span>
            </Link>

            <p className="text-xs leading-relaxed max-w-sm">
              Platform perpustakaan digital resmi Sekolah Dasar untuk mendukung pembelajaran Kurikulum Merdeka dan Gerakan Literasi Sekolah dengan buku berstandar Kemendikdasmen.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              Navigasi
            </h4>
            <ul className="space-y-2">
              <li><a href="#beranda" className="hover:text-[#1F6F4A] transition-colors">Beranda</a></li>
              <li><a href="#kategori" className="hover:text-[#1F6F4A] transition-colors">Kategori SIBI</a></li>
              <li><a href="#koleksi" className="hover:text-[#1F6F4A] transition-colors">Katalog Buku SD</a></li>
              <li><a href="#keunggulan" className="hover:text-[#1F6F4A] transition-colors">Standar Keamanan</a></li>
              <li><a href="#kurikulum" className="hover:text-[#1F6F4A] transition-colors">Fase A, B & C</a></li>
            </ul>
          </div>

          {/* Kolom 3: Layanan Literasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              Akses Bacaan
            </h4>
            <ul className="space-y-2">
              <li>
                <button type="button" onClick={onActionClick} className="hover:text-[#1F6F4A] transition-colors cursor-pointer text-left">
                  Buku Cerita Bergambar
                </button>
              </li>
              <li>
                <button type="button" onClick={onActionClick} className="hover:text-[#1F6F4A] transition-colors cursor-pointer text-left">
                  Buku Teks Kurikulum Merdeka
                </button>
              </li>
              <li>
                <button type="button" onClick={onActionClick} className="hover:text-[#1F6F4A] transition-colors cursor-pointer text-left">
                  Literasi Budaya & Cerita Rakyat
                </button>
              </li>
              <li>
                <button type="button" onClick={onActionClick} className="hover:text-[#1F6F4A] transition-colors cursor-pointer text-left">
                  Penguatan Karakter Anak
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Tautan Resmi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              Rujukan Resmi
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="https://buku.kemendikdasmen.go.id" target="_blank" rel="noreferrer" className="hover:text-[#1F6F4A] transition-colors flex items-center gap-1">
                  <span>SIBI Kemendikdasmen</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#1F6F4A] transition-colors font-semibold text-[#1F6F4A]">
                  Masuk Akun Pengguna &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Hak Cipta & Disclaimer */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px]">
          <p>
            &copy; {new Date().getFullYear()} Digilibrary SD. Hak Cipta Buku & Materi Dilindungi oleh Kementerian Pendidikan Dasar dan Menengah RI.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActivePolicyModal("privacy")}
              className="hover:text-[#1F6F4A] hover:underline transition-colors cursor-pointer"
            >
              Privasi Siswa
            </button>
            <span className="w-px h-3 bg-slate-300 inline-block" />
            <button
              type="button"
              onClick={() => setActivePolicyModal("terms")}
              className="hover:text-[#1F6F4A] hover:underline transition-colors cursor-pointer"
            >
              Syarat Penggunaan
            </button>
            <span className="w-px h-3 bg-slate-300 inline-block" />
            <button
              type="button"
              onClick={() => setActivePolicyModal("help")}
              className="hover:text-[#1F6F4A] hover:underline transition-colors cursor-pointer"
            >
              Bantuan Teknis
            </button>
          </div>
        </div>
      </div>

      {/* Modal Interaktif Kebijakan & Bantuan */}
      <LandingPolicyModal
        isOpen={Boolean(activePolicyModal)}
        type={activePolicyModal}
        onClose={() => setActivePolicyModal(null)}
      />
    </footer>
  );
}

/* ==========================================================================
   13. MASTER ALL-IN-ONE LANDING CLONE (DEFAULT EXPORT)
   ========================================================================== */

export default function LandingPageClone() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("Semua Koleksi");
  const [searchQuery, setSearchQuery] = useState("");

  const handleActionClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans antialiased selection:bg-[#E7F3EC] selection:text-[#1F6F4A] flex flex-col">
      {/* Header Navbar */}
      <LandingHeader isLoggedIn={isLoggedIn} user={user} />

      <main className="flex-1">
        {/* Hero Section */}
        <LandingHero
          featuredBook={LANDING_PREVIEW_BOOKS[0]}
          onActionClick={handleActionClick}
        />

        {/* Stats Counter Section */}
        <LandingStats />

        {/* Categories Section */}
        <LandingCategories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Book Showcase & Modal Preview */}
        <LandingBookShowcase
          books={LANDING_PREVIEW_BOOKS}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onBookClick={handleActionClick}
        />

        {/* Features Section */}
        <LandingFeatures />

        {/* Curriculum Section */}
        <LandingCurriculum onActionClick={handleActionClick} />

        {/* Testimonials Section */}
        <LandingTestimonials />

        {/* FAQ Accordion Section */}
        <LandingFaq />
      </main>

      {/* Footer Section & Modals */}
      <LandingFooter onActionClick={handleActionClick} />
    </div>
  );
}
