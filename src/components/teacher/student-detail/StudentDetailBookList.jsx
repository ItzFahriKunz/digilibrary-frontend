export default function StudentDetailBookList({
  displayedBooks = [],
  books = [],
  completedBooks = [],
  inProgressBooks = [],
  searchBook,
  setSearchBook,
  filterType,
  setFilterType,
  formatDate,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#D8E6DE] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D8E6DE]/60">
        <div>
          <h3 className="text-base font-bold text-[#1A1A1A]">
            Daftar Rincian Buku yang Dibaca ({displayedBooks.length})
          </h3>
          <p className="text-xs text-[#5C6B64] mt-0.5">
            Rincian progres halaman, ketuntasan membaca, dan total durasi membaca per judul buku
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-50">
            <input
              type="text"
              value={searchBook}
              onChange={(e) => setSearchBook(e.target.value)}
              placeholder="Cari judul buku..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-[#1A1A1A] placeholder-[#5C6B64]/60 focus:outline-none focus:border-[#39BF81]"
            />
            <svg
              className="w-3.5 h-3.5 text-[#5C6B64] absolute left-2.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center bg-[#F8FAF9] p-0.5 rounded-xl border border-[#D8E6DE] text-xs">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === "all"
                  ? "bg-white text-[#369D6D] shadow-2xs"
                  : "text-[#5C6B64] hover:text-[#1A1A1A]"
              }`}
            >
              Semua ({books.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("completed")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === "completed"
                  ? "bg-white text-[#369D6D] shadow-2xs"
                  : "text-[#5C6B64] hover:text-[#1A1A1A]"
              }`}
            >
              Tuntas ({completedBooks.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("reading")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === "reading"
                  ? "bg-white text-[#369D6D] shadow-2xs"
                  : "text-[#5C6B64] hover:text-[#1A1A1A]"
              }`}
            >
              Sedang Dibaca ({inProgressBooks.length})
            </button>
          </div>
        </div>
      </div>

      {/* List of Books Cards */}
      {displayedBooks.length === 0 ? (
        <div className="py-12 text-center space-y-3 bg-[#F8FAF9] rounded-2xl border border-dashed border-[#D8E6DE]">
          <div className="w-12 h-12 rounded-2xl bg-[#E7F3EC] text-[#39BF81] flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-[#1A1A1A]">Belum Ada Catatan Membaca</h4>
          <p className="text-xs text-[#5C6B64] max-w-sm mx-auto">
            {books.length === 0
              ? "Siswa ini belum mulai membaca buku apapun di katalog perpustakaan digital."
              : "Tidak ada buku yang sesuai dengan filter pencarian yang Anda pilih."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedBooks.map((b) => {
            const isFinished = Number(b.progress_percent) >= 100;

            return (
              <div
                key={b.book_id}
                className="bg-white rounded-2xl border border-[#D8E6DE] hover:border-[#39BF81]/40 p-4 sm:p-5 shadow-xs transition-all space-y-4"
              >
                <div className="flex items-start gap-3.5">
                  {/* Cover Buku */}
                  <div className="w-16 h-22 sm:w-18 sm:h-24 rounded-xl overflow-hidden bg-[#E7F3EC] shrink-0 border border-[#D8E6DE]/80 shadow-2xs">
                    {b.cover_url ? (
                      <img
                        src={b.cover_url}
                        alt={b.judul}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80";
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#39BF81] font-bold text-xs">
                        Buku
                      </div>
                    )}
                  </div>

                  {/* Meta Buku */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isFinished
                            ? "bg-emerald-100 text-[#369D6D] border border-emerald-300"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {isFinished ? "Tuntas 100%" : "Sedang Dibaca"}
                      </span>
                      <span className="text-[11px] font-bold text-[#1A1A1A]">
                        {Math.round((b.durasi_detik || 0) / 60)} menit
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#1A1A1A] line-clamp-2 leading-snug">
                      {b.judul}
                    </h4>
                    <p className="text-[11px] text-[#5C6B64] truncate">
                      Penulis: {b.penulis || "Tim Penulis Perpustakaan"}
                    </p>
                    <p className="text-[10px] text-[#5C6B64]">
                      Terakhir dibaca: {formatDate(b.last_read_at)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar & Halaman */}
                <div className="space-y-1.5 pt-2 border-t border-[#D8E6DE]/60">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#5C6B64]">
                      Halaman <strong>{b.halaman_terakhir || 1}</strong> dari {b.total_halaman} hlm
                    </span>
                    <span className="font-bold text-[#39BF81]">
                      {b.progress_percent}% Selesai
                    </span>
                  </div>

                  <div className="w-full bg-[#E7F3EC] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isFinished ? "bg-[#369D6D]" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.max(4, b.progress_percent || 0)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
