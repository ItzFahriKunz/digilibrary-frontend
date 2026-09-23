export default function TeacherLeaderboard({
  leaderboard = [],
  currentClass,
  userClass,
  formatClassName,
  onSelectStudent,
}) {
  const rankStyles = [
    {
      border: "border-amber-400",
      bg: "bg-amber-50/50",
      badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
      rankBg: "bg-amber-500 text-white",
    },
    {
      border: "border-slate-300",
      bg: "bg-slate-50/70",
      badgeBg: "bg-slate-100 text-slate-700 border-slate-300",
      rankBg: "bg-slate-600 text-white",
    },
    {
      border: "border-amber-700/20",
      bg: "bg-orange-50/40",
      badgeBg: "bg-orange-100 text-orange-900 border-orange-200",
      rankBg: "bg-amber-700 text-white",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#D8E6DE] p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D8E6DE]/60">
        <div>
          <h3 className="text-base font-bold text-[#1A1A1A]">
            Siswa Tergemar Membaca | Leaderboard {formatClassName(currentClass?.name || userClass)}
          </h3>
          <p className="text-xs text-[#5C6B64] mt-0.5">
            Peringkat siswa dengan jumlah buku terbanyak dibaca dan persentase ketuntasan tertinggi
          </p>
        </div>
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#E7F3EC] text-[#39BF81] border border-[#D8E6DE]">
          Top Pembaca Kelas
        </span>
      </div>

      {leaderboard.length === 0 ? (
        <div className="py-8 text-center text-[#5C6B64] text-xs">
          Belum ada data aktivitas membaca untuk siswa di kelas ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {leaderboard.slice(0, 3).map((item, idx) => {
            const style = rankStyles[idx] || rankStyles[2];

            return (
              <div
                key={item.id}
                className={`relative rounded-2xl border p-4 sm:p-5 shadow-xs transition-transform hover:-translate-y-0.5 ${style.border} ${style.bg}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${style.rankBg}`}>
                      #{item.rank}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#5C6B64] truncate">{item.email}</p>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${style.badgeBg}`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-[#D8E6DE]/60 text-center">
                  <div className="bg-white/80 rounded-xl p-2 border border-[#D8E6DE]/40">
                    <div className="text-base font-bold text-[#39BF81]">{item.books_count}</div>
                    <div className="text-[10px] font-semibold text-[#5C6B64]">Buku Selesai</div>
                  </div>

                  <div className="bg-white/80 rounded-xl p-2 border border-[#D8E6DE]/40">
                    <div className="text-base font-bold text-[#39BF81]">{item.avg_progress_percent}%</div>
                    <div className="text-[10px] font-semibold text-[#5C6B64]">Rata2 Progres</div>
                  </div>

                  <div className="bg-white/80 rounded-xl p-2 border border-[#D8E6DE]/40">
                    <div className="text-base font-bold text-[#1A1A1A]">{item.total_duration_minutes}m</div>
                    <div className="text-[10px] font-semibold text-[#5C6B64]">Total Durasi</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectStudent(item)}
                  className="w-full mt-3 py-1.5 px-3 rounded-xl bg-white hover:bg-[#E7F3EC] text-[#369D6D] hover:text-[#107a55] border border-[#D8E6DE] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Lihat Halaman Rincian</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
