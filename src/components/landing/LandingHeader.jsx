import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserAvatar from "../ui/UserAvatar";

const NAV_ITEMS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#kategori", label: "Kategori SIBI" },
  { href: "#koleksi", label: "Koleksi Buku SD" },
  { href: "#keunggulan", label: "Keunggulan" },
  { href: "#kurikulum", label: "Kurikulum" },
  { href: "#faq", label: "FAQ" },
];

export default function LandingHeader({ isLoggedIn, user }) {
  const [activeNav, setActiveNav] = useState("#beranda");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sinkronisasi otomatis item aktif dengan posisi scroll section
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

  // Handler klik tombol nav dengan smooth scrolling offset header
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

        {/* Logo Brand */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-[#39BF81] flex items-center justify-center text-white shadow-md shadow-[#39BF81]/20 group-hover:bg-[#2BA76E] transition-colors shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-[#39BF81] leading-none whitespace-nowrap">
                Digilibrary
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#E7F3EC] text-[#39BF81] border border-[#D8E6DE] inline-flex items-center justify-center leading-none translate-y-[1.5px] shrink-0">
                SD
              </span>
            </div>
            <p className="text-[11px] text-[#5C6B64] font-medium hidden xl:block mt-1 whitespace-nowrap">
              Perpustakaan Digital Sekolah Dasar
            </p>
          </div>
        </Link>

        {/* Navigasi Desktop */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8 text-xs xl:text-sm font-medium shrink-0">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`group relative py-2 select-none active:scale-95 cursor-pointer transition-colors duration-200 whitespace-nowrap shrink-0 ${isActive
                  ? "text-[#39BF81] font-semibold"
                  : "text-[#5C6B64] font-medium hover:text-[#39BF81]"
                  }`}
              >
                <span>{item.label}</span>

                {/* Transisi Underline Horizontal dari Kiri ke Kanan saat Mouse Hover */}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#39BF81] transition-transform duration-300 ease-out origin-left ${isActive
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                    }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Tombol Aksi: Masuk atau Dashboard */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:shadow-[#39BF81]/20 active:scale-[0.98] whitespace-nowrap shrink-0"
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
                <span className="text-xs font-semibold text-[#1A1A1A] max-w-28 truncate group-hover:text-[#39BF81] transition-colors">
                  {user?.name}
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="group relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#5C6B64] hover:text-[#39BF81] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Masuk Akun</span>
                <span className="absolute bottom-1 left-3 right-3 h-[2px] rounded-full bg-[#39BF81] transition-transform duration-300 ease-out origin-left scale-x-0 group-hover:scale-x-100" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:shadow-[#39BF81]/20 active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <span>Daftar Gratis</span>
              </Link>
            </>
          )}

          {/* Tombol Hamburger Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#5C6B64] hover:text-[#1A1A1A] hover:bg-[#F8FAF9] border border-[#D8E6DE] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Dropdown Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D8E6DE] bg-white/95 backdrop-blur-md px-4 py-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User info if logged in on mobile */}
          {isLoggedIn && (
            <div className="pb-3 mb-2 border-b border-[#D8E6DE]/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserAvatar
                  src={user?.avatar}
                  name={user?.name}
                  size="xs"
                  className="w-7 h-7 rounded-full border border-[#D8E6DE]"
                />
                <span className="text-xs font-bold text-[#1A1A1A]">{user?.name}</span>
              </div>
              <span className="text-[10px] font-bold text-[#39BF81] bg-[#E7F3EC] px-2 py-0.5 rounded-md border border-[#D8E6DE]">
                {user?.role || "Siswa"}
              </span>
            </div>
          )}

          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`group relative px-3 py-2.5 text-sm select-none active:scale-[0.98] flex items-center justify-between transition-colors duration-200 ${isActive
                  ? "text-[#39BF81] font-semibold"
                  : "text-[#5C6B64] font-medium hover:text-[#39BF81]"
                  }`}
              >
                <span className="relative inline-block py-0.5">
                  <span>{item.label}</span>
                  <span
                    className={`absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-[#39BF81] transition-transform duration-300 ease-out origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                  />
                </span>

                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isActive ? "text-[#39BF81] translate-x-0.5" : "text-[#9EAEA5]"
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
