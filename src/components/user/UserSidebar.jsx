import { useState } from "react";
import { Link } from "react-router-dom";

export default function UserSidebar({
  activeTab,
  setActiveTab,
  booksCount,
  historyCount,
  user,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  onLogout,
}) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("digilibrary_user_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("digilibrary_user_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  const avatarUrl = user?.avatar;
  const userInitial = user?.name ? user.name[0].toUpperCase() : "S";
  const isGuru = user?.role === "guru";
  const roleBadge = user?.role === "admin" ? "Admin" : isGuru ? "Guru" : "Siswa";

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-[#D8E6DE] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#369D6D] flex items-center justify-center text-white font-bold text-sm shadow-xs">
            D
          </div>
          <span className="font-bold text-[#369D6D] text-base">Digilibrary</span>
          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#E7F3EC] text-[#39BF81] border border-[#D8E6DE]">
            {roleBadge}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-xl border border-[#D8E6DE] bg-[#F8FAF9] text-[#1A1A1A] cursor-pointer hover:bg-slate-100"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Main Sidebar Aside */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-[#D8E6DE] flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 shadow-xs ${
          isCollapsed ? "lg:w-20" : "lg:w-72"
        } ${isMobileSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"}`}
      >
        {/* Desktop Floating Toggle Button (Curut Kiri & Kanan untuk Resize / Balik) */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden lg:flex absolute -right-3.5 top-6 z-30 w-7 h-7 rounded-full bg-white border border-[#D8E6DE] shadow-sm items-center justify-center text-[#5C6B64] hover:text-[#39BF81] hover:border-[#39BF81] hover:bg-[#E7F3EC] cursor-pointer transition-all duration-200 hover:scale-110"
          title={isCollapsed ? "Perluas Sidebar" : "Ciutkan Sidebar ke Pojok Kiri"}
          aria-label={isCollapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : "rotate-0"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Top Brand Logo */}
        <div className={`border-b border-[#D8E6DE]/60 transition-all ${isCollapsed ? "p-4 flex justify-center" : "p-6"}`}>
          <div className="flex items-center justify-between w-full">
            <Link
              to="/"
              className={`flex items-center ${isCollapsed ? "justify-center w-full" : "gap-3"} group`}
              title="Digilibrary Perpustakaan Digital SD"
            >
              <div className="w-10 h-10 rounded-xl bg-[#369D6D] flex items-center justify-center text-white shadow-sm group-hover:bg-[#107a55] transition-colors shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-lg font-bold tracking-tight text-[#369D6D] leading-none">
                      Digilibrary
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#E7F3EC] text-[#39BF81] border border-[#D8E6DE]">
                      {roleBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5C6B64] font-medium mt-0.5">
                    Perpustakaan SD Digital
                  </p>
                </div>
              )}
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-[#5C6B64] hover:bg-slate-100 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sidebar Menu Items (Bebas Scrollbar Horizontal & Bersih) */}
        <div
          className={`flex-1 space-y-1.5 overflow-y-auto no-scrollbar ${
            isCollapsed ? "px-2 py-4" : "px-4 py-6"
          }`}
        >
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#5C6B64]">
              Menu {isGuru ? "Guru & Kelas" : "Siswa"}
            </div>
          )}

          {/* Menu Khusus Guru / Wali Kelas */}
          {(isGuru || user?.role === "admin") && (
            <button
              type="button"
              onClick={() => {
                setActiveTab("guru");
                setIsMobileSidebarOpen(false);
              }}
              title={isCollapsed ? "Pantau Kelas & Siswa" : undefined}
              className={`w-full flex items-center ${
                isCollapsed ? "justify-center p-3" : "justify-between px-3.5 py-2.5"
              } rounded-2xl text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === "guru"
                  ? "bg-[#369D6D] text-white shadow-sm"
                  : "text-[#369D6D] hover:bg-[#E7F3EC] bg-[#E7F3EC]/50 font-bold"
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                {!isCollapsed && <span>Pantau Kelas & Siswa</span>}
              </div>
              {!isCollapsed ? (
                <span
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                    activeTab === "guru" ? "bg-white/20 text-white" : "bg-[#369D6D] text-white"
                  }`}
                >
                  {user?.role === "admin" ? "24 Kelas" : user?.kelas || "Wali Kelas"}
                </span>
              ) : (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#39BF81] ring-2 ring-white" />
              )}
            </button>
          )}

          {/* Menu 1: Koleksi Buku */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("books");
              setIsMobileSidebarOpen(false);
            }}
            title={isCollapsed ? `Koleksi Buku (${booksCount})` : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center p-3" : "justify-between px-3.5 py-2.5"
            } rounded-2xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === "books"
                ? "bg-[#369D6D] text-white shadow-sm"
                : "text-[#5C6B64] hover:text-[#1A1A1A] hover:bg-[#F8FAF9]"
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {!isCollapsed && <span>Koleksi Buku</span>}
            </div>
            {!isCollapsed ? (
              booksCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === "books" ? "bg-white/20 text-white" : "bg-[#E7F3EC] text-[#39BF81]"
                  }`}
                >
                  {booksCount}
                </span>
              )
            ) : booksCount > 0 ? (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#39BF81] ring-2 ring-white" />
            ) : null}
          </button>

          {/* Menu 2: Aktivitas & Riwayat */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("history");
              setIsMobileSidebarOpen(false);
            }}
            title={isCollapsed ? `Aktivitas Membaca (${historyCount})` : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center p-3" : "justify-between px-3.5 py-2.5"
            } rounded-2xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === "history"
                ? "bg-[#369D6D] text-white shadow-sm"
                : "text-[#5C6B64] hover:text-[#1A1A1A] hover:bg-[#F8FAF9]"
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {!isCollapsed && <span>Aktivitas Membaca</span>}
            </div>
            {!isCollapsed ? (
              historyCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === "history" ? "bg-white/20 text-white" : "bg-[#E7F3EC] text-[#39BF81]"
                  }`}
                >
                  {historyCount}
                </span>
              )
            ) : historyCount > 0 ? (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#39BF81] ring-2 ring-white" />
            ) : null}
          </button>

          {/* Menu 3: Profil Saya */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("profile");
              setIsMobileSidebarOpen(false);
            }}
            title={isCollapsed ? "Profil Saya" : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center p-3" : "justify-between px-3.5 py-2.5"
            } rounded-2xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === "profile"
                ? "bg-[#369D6D] text-white shadow-sm"
                : "text-[#5C6B64] hover:text-[#1A1A1A] hover:bg-[#F8FAF9]"
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {!isCollapsed && <span>Profil Saya</span>}
            </div>
            {!isCollapsed && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === "profile" ? "bg-white/20 text-white" : "bg-slate-100 text-[#5C6B64]"
                }`}
              >
                Akun
              </span>
            )}
          </button>

          {/* Tautan Khusus Admin jika akun ber-role admin */}
          {user?.role === "admin" && (
            <div className={`mt-3 pt-3 border-t border-[#D8E6DE]/60 ${isCollapsed ? "px-0" : "space-y-1.5"}`}>
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#5C6B64]">
                  Akses Khusus
                </div>
              )}
              <Link
                to="/admin"
                title={isCollapsed ? "Masuk Panel Admin" : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? "justify-center p-3" : "gap-3 px-3.5 py-2.5"
                } rounded-2xl text-xs font-bold text-[#369D6D] bg-[#E7F3EC] hover:bg-[#d8ebd2] transition-colors shadow-2xs`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {!isCollapsed && <span>Masuk Panel Admin</span>}
              </Link>
            </div>
          )}

          {/* Tautan Beranda */}
          <div className="pt-2">
            <Link
              to="/"
              title={isCollapsed ? "Landing Page Depan" : undefined}
              className={`w-full flex items-center ${
                isCollapsed ? "justify-center p-3" : "gap-3 px-3.5 py-2.5"
              } rounded-2xl text-xs font-medium text-[#5C6B64] hover:bg-[#F8FAF9] transition-all`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {!isCollapsed && <span>Landing Page Depan</span>}
            </Link>
          </div>
        </div>

        {/* Bottom User Profile Section */}
        <div className={`border-t border-[#D8E6DE]/60 space-y-3 bg-[#F8FAF9]/60 transition-all ${isCollapsed ? "p-3" : "p-4"}`}>
          <div
            onClick={() => {
              setActiveTab("profile");
              setIsMobileSidebarOpen(false);
            }}
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"} p-2 rounded-2xl hover:bg-white transition-colors cursor-pointer`}
            title={isCollapsed ? `${user?.name || "Pengguna"} (${user?.email})` : undefined}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#D8E6DE] flex items-center justify-center bg-[#369D6D] text-white font-bold text-sm shadow-xs relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || "Avatar"}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="w-full h-full object-cover"
                />
              ) : null}
              <span className={avatarUrl ? "sr-only" : "block"}>{userInitial}</span>
            </div>
            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#1A1A1A] truncate hover:text-[#39BF81] transition-colors">
                    {user?.name || (isGuru ? "Guru Pembimbing" : "Siswa Pembaca")}
                  </h4>
                  <p className="text-[10px] text-[#5C6B64] truncate capitalize">
                    {user?.kelas ? (isGuru ? `Wali ${user.kelas}` : user.kelas) : isGuru ? "Guru SD" : "Siswa SD"}
                  </p>
                </div>
                <svg className="w-4 h-4 text-[#5C6B64] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            title={isCollapsed ? "Keluar Akun (Logout)" : undefined}
            className={`w-full flex items-center justify-center ${
              isCollapsed ? "p-2.5" : "gap-2 py-2 px-3"
            } rounded-xl bg-white hover:bg-rose-50 text-[#5C6B64] hover:text-rose-700 text-xs font-bold border border-[#D8E6DE] hover:border-rose-200 transition-colors cursor-pointer shadow-2xs`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isCollapsed && <span>Keluar Akun</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
