export default function TeacherStatsMetrics({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-white rounded-2xl border border-[#D8E6DE] p-4 sm:p-5 shadow-xs space-y-1.5">
        <span className="text-xs font-bold text-[#5C6B64] block">Total Siswa</span>
        <div className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">{stats?.total_students || 0}</div>
        <p className="text-[11px] text-[#5C6B64]">
          <strong className="text-[#39BF81]">{stats?.active_students || 0} aktif</strong> dari total murid
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#D8E6DE] p-4 sm:p-5 shadow-xs space-y-1.5">
        <span className="text-xs font-bold text-[#5C6B64] block">Rata-rata Membaca</span>
        <div className="text-xl sm:text-2xl font-bold text-[#369D6D] flex items-baseline gap-1 tracking-tight">
          <span>{stats?.average_progress || 0}%</span>
        </div>
        <div className="w-full bg-[#E7F3EC] rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#369D6D] h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${stats?.average_progress || 0}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#D8E6DE] p-4 sm:p-5 shadow-xs space-y-1.5">
        <span className="text-xs font-bold text-[#5C6B64] block">Buku Terbaca</span>
        <div className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">{stats?.total_books_read || 0}</div>
        <p className="text-[11px] text-[#5C6B64]">Judul buku dieksplorasi siswa</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#D8E6DE] p-4 sm:p-5 shadow-xs space-y-1.5">
        <span className="text-xs font-bold text-[#5C6B64] block">Total Waktu Baca</span>
        <div className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
          {stats?.total_duration_minutes || 0} <span className="text-xs font-bold text-[#5C6B64]">mnt</span>
        </div>
        <p className="text-[11px] text-[#5C6B64]">
          Setara {Math.round(((stats?.total_duration_minutes || 0) / 60) * 10) / 10} jam membaca
        </p>
      </div>
    </div>
  );
}
