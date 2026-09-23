export default function UserHistoryTab({
  readingHistory,
  books,
  onOpenRecentRead,
}) {
  const totalDurationSeconds = readingHistory.reduce((acc, l) => acc + (Number(l.durasi_detik) || 0), 0);
  const totalMinutes = Math.floor(totalDurationSeconds / 60);

  // Hitung jumlah buku unik yang pernah dibaca
  const uniqueBooksCount = new Set(readingHistory.map((l) => l.book_id || l.book?.id).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      {/* ================= STATISTIK MEMBACA ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-[#D8E6DE] p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E7F3EC] text-[#39BF81] flex items-center justify-center shrink-0 border border-[#D8E6DE]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A] block tracking-tight">
              {totalMinutes} <span className="text-xs font-semibold text-[#5C6B64]">menit</span>
            </span>
            <span className="text-xs text-[#5C6B64] font-medium">Total Waktu Membaca</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#D8E6DE] p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E7F3EC] text-[#39BF81] flex items-center justify-center shrink-0 border border-[#D8E6DE]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A] block tracking-tight">
              {readingHistory.length}
            </span>
            <span className="text-xs text-[#5C6B64] font-medium">Total Sesi Membaca</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#D8E6DE] p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E7F3EC] text-[#39BF81] flex items-center justify-center shrink-0 border border-[#D8E6DE]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A] block tracking-tight">
              {uniqueBooksCount}
            </span>
            <span className="text-xs text-[#5C6B64] font-medium">Buku Berbeda Dibaca</span>
          </div>
        </div>
      </section>

      {/* ================= RIWAYAT LENGKAP ================= */}
      <section className="bg-white rounded-3xl border border-[#D8E6DE] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8E6DE] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#1A1A1A]">Riwayat Sesi Membaca</h2>
            <p className="text-xs text-[#5C6B64] mt-0.5">
              Daftar kronologis lengkap sesi membaca buku Anda di Digilibrary.
            </p>
          </div>
          <span className="text-xs text-[#5C6B64] font-semibold bg-[#F8FAF9] px-3 py-1.5 rounded-xl border border-[#D8E6DE]">
            {readingHistory.length} rekaman
          </span>
        </div>

        {readingHistory.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <svg className="w-12 h-12 text-[#D8E6DE] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-sm font-bold text-[#1A1A1A]">Belum Ada Riwayat Membaca</h4>
            <p className="text-xs text-[#5C6B64]">Buka buku di katalog untuk memulai petualangan membacamu!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {readingHistory.map((log, index) => {
              const bId = log.book_id || log.book?.id;
              const fullBook = books.find((b) => String(b.id) === String(bId)) || log.book;
              const totalHal = fullBook?.total_halaman || log.book?.total_halaman || 36;
              const pageRead = log.halaman_terakhir || 1;
              const percent = Math.min(100, Math.round((pageRead / Math.max(1, totalHal)) * 100));

              // Format tanggal
              const readDate = log.read_at ? new Date(log.read_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }) : "Baru saja";

              return (
                <div
                  key={log.id || index}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-[#F8FAF9] px-3 -mx-3 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-18 rounded-xl overflow-hidden bg-slate-100 border border-[#D8E6DE] shrink-0 shadow-2xs">
                      <img
                        src={fullBook?.cover_path || log.book?.cover_path || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"}
                        alt={fullBook?.judul || "Buku"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E7F3EC] text-[#39BF81] border border-[#D8E6DE]">
                          {fullBook?.category?.nama || "Buku Pelajaran"}
                        </span>
                        <span className="text-[10px] text-[#5C6B64] font-mono">
                          {readDate}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#1A1A1A] truncate mt-1 group-hover:text-[#39BF81] transition-colors">
                        {fullBook?.judul || log.book?.judul || "Buku Kurikulum"}
                      </h3>
                      <p className="text-xs text-[#5C6B64] mt-0.5 truncate">
                        {fullBook?.penulis || log.book?.penulis || "Pusat Kurikulum"} | {fullBook?.jenjang || "SD"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="flex items-center sm:justify-end gap-1.5">
                        <span className="text-xs font-bold text-[#1A1A1A]">
                          Halaman {pageRead} <span className="text-[10px] text-[#5C6B64]">dari {totalHal}</span>
                        </span>
                        <span className="text-[10px] font-bold text-[#39BF81] bg-[#E7F3EC] px-1.5 py-0.2 rounded">
                          {percent}%
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5C6B64] font-medium block mt-0.5">
                        Durasi: <strong className="text-[#1A1A1A]">{Math.floor((log.durasi_detik || 0) / 60)} menit</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenRecentRead(log)}
                      className="px-4 py-2 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Lanjut Baca</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
