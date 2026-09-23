import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AuthNavbar({
  backTo = "/login",
  backLabel = "Batal & Masuk",
  showDashboardIfLoggedIn = true,
  customRightContent = null,
}) {
  const { isLoggedIn } = useAuth();

  return (
    <header className="bg-white border-b border-[#D8E6DE] sticky top-0 z-20 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-[#369D6D] flex items-center justify-center text-white shadow-sm group-hover:bg-[#107a55] transition-colors">
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
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#369D6D] block leading-none">
              Digilibrary
            </span>
            <span className="text-[11px] text-[#5C6B64] font-medium hidden sm:block mt-1">
              Perpustakaan Digital Sekolah Dasar
            </span>
          </div>
        </Link>

        {/* Right Navigation */}
        {customRightContent ? (
          customRightContent
        ) : showDashboardIfLoggedIn && isLoggedIn ? (
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#5C6B64] hover:text-[#39BF81] hover:bg-slate-100 transition-colors"
          >
            <span>Ke Dashboard</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#5C6B64] hover:text-[#39BF81] hover:bg-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{backLabel}</span>
          </Link>
        )}
      </div>
    </header>
  );
}
