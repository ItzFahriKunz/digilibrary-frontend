import UserAvatar from "../ui/UserAvatar";

export default function TeacherHeaderBanner({
  isAdmin,
  selectedClassCode,
  currentClass,
  user,
  formatClassName,
}) {
  const waliName = currentClass?.wali_kelas?.name || (isAdmin ? "Belum ada Wali Kelas" : user?.name);
  const waliAvatar = currentClass?.wali_kelas?.avatar || (!isAdmin ? user?.avatar : null);

  return (
    <div className="bg-gradient-to-r from-[#1a935f] to-[#106b44] border border-[#107a55] rounded-3xl p-6 sm:p-8 text-white shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">
            <svg className="w-3.5 h-3.5 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            <span>{isAdmin ? "Mode Administrator: Pemantauan Sekolah" : "Ruang Khusus Wali Kelas"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {isAdmin
              ? `Pemantauan Literasi ${formatClassName(selectedClassCode)}`
              : `Ruang Wali ${formatClassName(currentClass?.name || user?.kelas)}`}
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            {isAdmin
              ? "Pantau data aktivitas membaca, persentase tuntas, dan wali kelas dari 24 jajaran kelas Sekolah Dasar."
              : "Pantau persentase ketuntasan membaca siswa, durasi baca, dan kenali siswa yang paling gemar membaca di kelas binaan Anda."}
          </p>
        </div>

        {/* Wali Kelas Card */}
        <div className="bg-black/15 backdrop-blur-xs border border-white/15 rounded-2xl p-4 sm:min-w-65 space-y-2.5 shrink-0 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
            {isAdmin ? "Wali Kelas Terpilih" : "Wali Kelas"}
          </div>
          <div className="flex items-center gap-3">
            <UserAvatar
              src={waliAvatar}
              name={waliName}
              size="md"
              shape="rounded-xl"
              noFallback={true}
              className="w-10 h-10 border border-white/30 shrink-0 shadow-xs"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {waliName}
              </p>
              <p className="text-[11px] text-emerald-200 truncate">
                {formatClassName(currentClass?.name || user?.kelas)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-200 font-semibold pt-1 border-t border-white/10">
            <svg className="w-3.5 h-3.5 text-emerald-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{isAdmin ? "Admin Memantau Kelas Ini" : "Kelas Binaan Aktif Anda"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
