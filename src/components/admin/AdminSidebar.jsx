import { useState } from "react";
import { Link } from "react-router-dom";
import UserAvatar from "../ui/UserAvatar";

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  booksCount,
  usersCount,
  currentAdmin,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  onLogout,
}) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("digilibrary_admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("digilibrary_admin_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-[#D8E6DE] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#369D6D] flex items-center justify-center text-white font-bold text-sm">
            D
          </div>
          <span className="font-bold text-[#369D6D] text-base">Digilibrary Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-xl border border-[#D8E6DE] bg-[#F8FAF9] text-[#1A1A1A] cursor-pointer"
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
        {/* Desktop Floating Toggle Button (Curut Kiri & Kanan ala CodingNepal) */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden lg:flex absolute -right-3.5 top-6 z-30 w-7 h-7 rounded-full bg-white border border-[#D8E6DE] shadow-sm items-center justify-center text-[#5C6B64] hover:text-[#39BF81] hover:border-[#39BF81] hover:bg-[#E7F3EC] cursor-pointer transition-all duration-200 hover:scale-110"
          title={isCollapsed ? "Perluas Sidebar (Klik untuk membuka)" : "Ciutkan Sidebar ke Pojok Kiri"}
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
              title="Digilibrary Admin Perpustakaan"
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
                      Admin
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5C6B64] font-medium mt-0.5">
                    Perpustakaan SD
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

        {/* Sidebar Menu Items */}
        <div className={`flex-1 space-y-1.5 overflow-y-auto no-scrollbar ${isCollapsed ? "px-2 py-4" : "px-4 py-6"}`}>
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#5C6B64]">
              Menu Utama
            </div>
          )}

          {/* Menu 1: Ringkasan & Diagram */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("dashboard");
              setIsMobileSidebarOpen(false);
            }}
            title={isCollapsed ? "Ringkasan & Diagram" : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center p-3" : "gap-3 px-3.5 py-2.5"
            } rounded-2xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === "dashboard"
                ? "bg-[#369D6D] text-white shadow-sm"
                : "text-[#5C6B64] hover:text-[#1A1A1A] hover:bg-[#F8FAF9]"
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {!isCollapsed && <span>Ringkasan & Diagram</span>}
          </button>

          {/* Menu 2: Kelola Katalog Buku */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("books");
              setIsMobileSidebarOpen(false);
            }}
            title={isCollapsed ? `Kelola Buku (${booksCount})` : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center p-3" : "justify-between px-3.5 py-2.5"
            } rounded-2xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === "books" || activeTab === "book-add" || activeTab === "book-detail"
                ? "bg-[#369D6D] text-white shadow-sm"
                : "text-[#5C6B64] hover:text-[#1A1A1A] hover:bg-[#F8FAF9]"
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {!isCollapsed && <span>Kelola Buku</span>}
            </div>
            {!isCollapsed ? (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  activeTab === "books" || activeTab === "book-add" || activeTab === "book-detail"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-[#5C6B64]"
                }`}
              >
                {booksCount}
              </span>
            ) : booksCount > 0 ? (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#39BF81] ring-2 ring-white" />
            ) : null}
          </button>

          {/* Menu 3: Kelola Pengguna */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("users");
              setIsMobileSidebarOpen(false);
            }}
            title={isCollapsed ? `Kelola Pengguna (${usersCount})` : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center p-3" : "justify-between px-3.5 py-2.5"
            } rounded-2xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === "users" || activeTab === "user-add" || activeTab === "user-detail"
                ? "bg-[#369D6D] text-white shadow-sm"
                : "text-[#5C6B64] hover:text-[#1A1A1A] hover:bg-[#F8FAF9]"
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {!isCollapsed && <span>Kelola Pengguna</span>}
            </div>
            {!isCollapsed ? (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  activeTab === "users" || activeTab === "user-add" || activeTab === "user-detail"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-[#5C6B64]"
                }`}
              >
                {usersCount}
              </span>
            ) : usersCount > 0 ? (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#39BF81] ring-2 ring-white" />
            ) : null}
          </button>

          {/* Divider atau Tautan Akses Header */}
          {isCollapsed ? (
            <div className="w-8 mx-auto my-3 border-t border-[#D8E6DE]" />
          ) : (
            <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#5C6B64]">
              Tautan Akses
            </div>
          )}

          <Link
            to="/dashboard"
            title={isCollapsed ? "Buka Tampilan Siswa" : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center p-3" : "gap-3 px-3.5 py-2.5"
            } rounded-2xl text-xs font-medium text-[#369D6D] bg-[#E7F3EC] hover:bg-[#D8E6DE] transition-all relative`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {!isCollapsed && <span>Buka Tampilan Siswa</span>}
          </Link>

          <Link
            to="/"
            title={isCollapsed ? "Landing Page Depan" : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center p-3" : "gap-3 px-3.5 py-2.5"
            } rounded-2xl text-xs font-medium text-[#5C6B64] hover:bg-[#F8FAF9] transition-all relative`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {!isCollapsed && <span>Landing Page Depan</span>}
          </Link>
        </div>

        {/* Footer Sidebar: User Profile & Logout Button */}
        <div className={`border-t border-[#D8E6DE]/60 space-y-3 bg-[#F8FAF9]/50 transition-all ${isCollapsed ? "p-3" : "p-4"}`}>
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-2 py-1.5"} relative`}
            title={isCollapsed ? `${currentAdmin?.name || "Administrator"} (${currentAdmin?.email || "admin@digilibrary.sch.id"})` : undefined}
          >
            <UserAvatar
              src={currentAdmin?.avatar}
              name={currentAdmin?.name || "Administrator"}
              size="md"
              shape="rounded-xl"
              className="border border-[#D8E6DE] shrink-0"
            />
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-[#1A1A1A] truncate">
                  {currentAdmin?.name || "Administrator"}
                </h4>
                <p className="text-[10px] text-[#5C6B64] truncate">
                  {currentAdmin?.email || "admin@digilibrary.sch.id"}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            title={isCollapsed ? "Keluar Akun (Logout)" : undefined}
            className={`w-full flex items-center justify-center ${
              isCollapsed ? "p-2.5" : "gap-2 px-4 py-2.5"
            } rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer active:scale-[0.98] relative`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isCollapsed && <span>Keluar Akun (Logout)</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
