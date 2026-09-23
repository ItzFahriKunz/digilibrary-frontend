export default function StudentDetailMetrics({
  student,
  completedBooks = [],
  formatDate,
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Metric 1 */}
      <div className="bg-white rounded-2xl border border-[#D8E6DE] p-4 sm:p-5 shadow-xs space-y-1.5">
        <span className="text-xs font-bold text-[#5C6B64] block">Buku Selesai / Dibaca</span>
        <div className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
          {student.books_count || 0} <span className="text-xs font-bold text-[#5C6B64]">Judul</span>
        </div>
        <p className="text-[11px] text-[#5C6B64]">
          <strong className="text-[#39BF81]">{completedBooks.length} tuntas 100%</strong> dibaca
        </p>
      </div>

      {/* Metric 2 */}
      <div className="bg-white rounded-2xl border border-[#D8E6DE] p-4 sm:p-5 shadow-xs space-y-1.5">
        <span className="text-xs font-bold text-[#5C6B64] block">Rata-rata Ketuntasan</span>
        <div className="text-xl sm:text-2xl font-bold text-[#369D6D] tracking-tight">
          {student.avg_progress_percent || 0}%
        </div>
        <div className="w-full bg-[#E7F3EC] rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#369D6D] h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${student.avg_progress_percent || 0}%` }}
          />
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-white rounded-2xl border border-[#D8E6DE] p-4 sm:p-5 shadow-xs space-y-1.5">
        <span className="text-xs font-bold text-[#5C6B64] block">Total Waktu Baca</span>
        <div className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
          {student.total_duration_minutes || 0} <span className="text-xs font-bold text-[#5C6B64]">Menit</span>
        </div>
        <p className="text-[11px] text-[#5C6B64]">
          Setara {((student.total_duration_minutes || 0) / 60).toFixed(1)} jam membaca
        </p>
      </div>

      {/* Metric 4 */}
      <div className="bg-white rounded-2xl border border-[#D8E6DE] p-4 sm:p-5 shadow-xs space-y-1.5">
        <span className="text-xs font-bold text-[#5C6B64] block">Sesi Terakhir Membaca</span>
        <div className="text-sm font-bold text-[#1A1A1A] pt-1 line-clamp-1">
          {formatDate(student.last_read_at)}
        </div>
        <p className="text-[11px] text-[#5C6B64]">Catatan aktivitas literasi terkini</p>
      </div>
    </div>
  );
}
