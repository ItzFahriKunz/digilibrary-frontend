import UserAvatar from "../../ui/UserAvatar";

export default function StudentDetailBanner({
  student,
  currentClass,
  userClass,
  allStudents = [],
  formatClassName,
}) {
  return (
    <div className="bg-gradient-to-r from-[#1a935f] to-[#106b44] border border-[#107a55] rounded-3xl p-6 sm:p-8 text-white shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <UserAvatar
            src={student.avatar}
            name={student.name}
            size="2xl"
            shape="rounded-2xl"
            className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-white/40 shadow-sm shrink-0"
          />
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 border border-white/25 text-[11px] font-bold text-white uppercase tracking-wider">
                {formatClassName(student.kelas || currentClass?.name || userClass)}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  student.status === "Sangat Aktif"
                    ? "bg-emerald-300 text-[#107a55]"
                    : student.status === "Cukup Aktif"
                    ? "bg-blue-200 text-blue-900"
                    : "bg-white/20 text-white"
                }`}
              >
                {student.status || "Belum Membaca"}
              </span>
              {student.badge && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[11px] font-bold shadow-2xs">
                  {student.badge}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
              {student.name}
            </h2>
            <p className="text-emerald-100 text-xs font-medium truncate">
              {student.email} | Terdaftar sebagai Murid Aktif
            </p>
          </div>
        </div>

        {/* Quick Rank Card */}
        <div className="bg-[#106b44] border border-white/15 rounded-2xl p-4 sm:min-w-55 text-left shrink-0">
          <div className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
            Peringkat Literasi Kelas
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-bold text-white flex items-baseline gap-1.5">
            <span>#{student.rank || 1}</span>
            <span className="text-xs font-semibold text-emerald-200">
              dari {allStudents.length || 1} Siswa
            </span>
          </div>
          <p className="text-[11px] text-emerald-200 mt-1 font-medium">
            Aktivitas membaca tercatat di perpustakaan digital
          </p>
        </div>
      </div>
    </div>
  );
}
