import { useState } from "react";
import CustomSelect from "../ui/CustomSelect";

export default function UserOverviewTab({
  user,
  books,
  categories,
  filteredBooks,
  uniqueRecentReads,
  searchQuery,
  setSearchQuery,
  selectedCat,
  setSelectedCat,
  selectedKelas,
  setSelectedKelas,
  loading,
  onOpenRecentRead,
  onOpenCatalogBook,
  onPreviewBook,
  getBookProgress,
}) {
  const userInitial = user?.name ? user.name[0].toUpperCase() : "S";

  // Fitur Buku Favorit (Pin Buku) tersimpan per user di localStorage
  const storageKey = `digilib_favorites_${user?.id || "guest"}`;
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const toggleFavorite = (bookId) => {
    setFavorites((prev) => {
      const exists = prev.includes(bookId);
      const updated = exists ? prev.filter((id) => id !== bookId) : [...prev, bookId];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Filter daftar buku berdasarkan pencarian, kategori, dan filter favorit
  const displayedBooks = filteredBooks.filter((b) => {
    if (showOnlyFavorites) {
      return favorites.includes(b.id);
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* ================= HERO WELCOME BANNER ================= */}
      <section className="bg-white rounded-3xl border border-[#D8E6DE] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shrink-0 border-2 border-[#D8E6DE] shadow-sm flex items-center justify-center bg-[#369D6D] text-white text-xl font-bold relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="w-full h-full object-cover"
                />
              ) : null}
              <span className={user?.avatar ? "sr-only" : "block"}>{userInitial}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#39BF81] bg-[#E7F3EC] px-2.5 py-0.5 rounded-full border border-[#D8E6DE]">
                  {user?.kelas ? (user.kelas.toLowerCase().startsWith("kelas") ? user.kelas : `Kelas ${user.kelas}`) : "Siswa Aktif"}
                </span>
                <span className="text-[11px] text-[#5C6B64] font-medium hidden sm:inline">
                  Selamat Datang Kembali!
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[#1A1A1A] tracking-tight mt-1">
                Halo, {user?.name || "Teman Pembaca"}!
              </h1>
              <p className="text-xs sm:text-sm text-[#5C6B64] mt-0.5">
                Pilih buku kesukaanmu hari ini dan tingkatkan wawasanmu bersama Digilibrary.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end">
            <div className="px-4 py-2 rounded-2xl bg-[#F8FAF9] border border-[#D8E6DE] text-center min-w-24">
              <span className="text-sm sm:text-base font-bold text-[#369D6D] block">
                {books.length}
              </span>
              <span className="text-[10px] text-[#5C6B64] font-medium">Buku Tersedia</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-[#F8FAF9] border border-[#D8E6DE] text-center min-w-24">
              <span className="text-sm sm:text-base font-bold text-[#369D6D] block">
                {uniqueRecentReads.length}
              </span>
              <span className="text-[10px] text-[#5C6B64] font-medium">Buku Dibaca</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TERAKHIR DIBACA SECTION ================= */}
      {uniqueRecentReads.length > 0 && !showOnlyFavorites && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <svg className="w-4 h-4 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Lanjutkan Membaca</span>
            </h2>
            <span className="text-xs text-[#5C6B64]">
              {uniqueRecentReads.length} buku dalam progres
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
            {uniqueRecentReads.slice(0, 6).map((log) => {
              const fullBook = books.find((b) => String(b.id) === String(log.book_id || log.book?.id));
              const coverImg = fullBook?.cover_path || log.book?.cover_path;
              const totalHal = Number(fullBook?.total_halaman || log.book?.total_halaman || 36);
              const lastHal = Number(log.halaman_terakhir || 1);
              const percent = Math.min(100, Math.round((lastHal / Math.max(1, totalHal)) * 100));

              return (
                <div
                  key={log.id}
                  onClick={() => onOpenRecentRead(log)}
                  className="bg-white rounded-2xl border border-[#D8E6DE] p-3 hover:border-[#39BF81]/50 transition-all cursor-pointer group flex flex-col justify-between shadow-2xs hover:shadow-xs"
                >
                  <div>
                    <div className="aspect-3/4 rounded-xl overflow-hidden bg-slate-100 relative mb-2.5">
                      <img
                        src={coverImg || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80"}
                        alt={fullBook?.judul || log.book?.judul || "Buku"}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-1.5 left-1.5 bg-black/75 px-2 py-0.5 rounded-md">
                        <span className="text-white text-[10px] font-bold">
                          {percent}% Selesai
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-[#1A1A1A] line-clamp-1 group-hover:text-[#39BF81] transition-colors">
                      {fullBook?.judul || log.book?.judul || "Judul Buku"}
                    </h3>
                    <p className="text-[10px] text-[#5C6B64] mt-0.5 truncate">
                      {fullBook?.penulis || log.book?.penulis || "Penulis"}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#369D6D] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#5C6B64]">
                      <span className="font-semibold text-[#39BF81]">
                        Hal. {lastHal}/{totalHal}
                      </span>
                      <span>{Math.floor((log.durasi_detik || 0) / 60)} mnt dibaca</span>
                    </div>

                    <button
                      type="button"
                      className="w-full mt-1 py-1.5 rounded-lg bg-[#E7F3EC] group-hover:bg-[#369D6D] text-[#369D6D] group-hover:text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Lanjut Baca</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= FILTER & SEARCH BAR ================= */}
      <section className="bg-white rounded-3xl border border-[#D8E6DE] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Cari judul buku atau nama penulis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:bg-white transition-all"
            />
            <svg className="w-4 h-4 text-[#5C6B64] absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Tombol Kategori Favorit */}
          <button
            type="button"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
              showOnlyFavorites
                ? "bg-[#369D6D] text-white border border-[#369D6D]"
                : "bg-[#F8FAF9] hover:bg-[#E7F3EC] text-[#5C6B64] hover:text-[#39BF81] border border-[#D8E6DE]"
            }`}
            title="Filter Buku Favorit Saya"
          >
            <svg
              className={`w-4 h-4 ${showOnlyFavorites ? "text-amber-300 fill-amber-300" : "text-[#5C6B64]"}`}
              fill={showOnlyFavorites ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={showOnlyFavorites ? "1" : "2"}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <span>{showOnlyFavorites ? "Buku Favorit (Aktif)" : "Buku Favorit"}</span>
          </button>

          <CustomSelect
            value={selectedCat}
            onChange={(val) => setSelectedCat(val)}
            options={[
              { value: "all", label: "Semua Kategori" },
              ...categories.map((c) => ({ value: String(c.id), label: c.nama })),
            ]}
            className="w-full sm:w-auto"
          />

          <CustomSelect
            value={selectedKelas}
            onChange={(val) => setSelectedKelas(val)}
            options={[
              { value: "all", label: "Semua Jenjang Kelas" },
              ...[1, 2, 3, 4, 5, 6].map((k) => ({ value: String(k), label: `Kelas ${k} SD` })),
            ]}
            className="w-full sm:w-auto"
          />
        </div>
      </section>

      {/* ================= KATALOG SEMUA BUKU / FAVORIT ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#1A1A1A]">
              {showOnlyFavorites ? "Koleksi Buku Favorit Saya" : "Daftar Buku Pelajaran & Bacaan"}
            </h2>
            {showOnlyFavorites && (
              <button
                type="button"
                onClick={() => setShowOnlyFavorites(false)}
                className="text-xs text-[#39BF81] hover:underline font-semibold cursor-pointer"
              >
                (Tampilkan Semua)
              </button>
            )}
          </div>
          <span className="text-xs text-[#5C6B64] font-medium">
            {displayedBooks.length} buku ditampilkan
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-sm text-[#5C6B64] bg-white rounded-3xl border border-[#D8E6DE]">
            Memuat koleksi buku perpustakaan...
          </div>
        ) : displayedBooks.length === 0 ? (
          showOnlyFavorites ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#D8E6DE] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F8FAF9] text-[#39BF81] flex items-center justify-center mx-auto border border-[#D8E6DE]">
                <svg className="w-6 h-6 text-amber-500 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-[#1A1A1A]">Belum Ada Buku Favorit</h4>
              <p className="text-xs text-[#5C6B64] max-w-sm mx-auto">
                Kamu belum menandai buku favorit. Klik ikon bintang pada buku di katalog untuk mem-pin buku favoritmu di sini.
              </p>
              <button
                type="button"
                onClick={() => setShowOnlyFavorites(false)}
                className="px-4 py-2 rounded-xl bg-[#369D6D] text-white text-xs font-bold hover:bg-[#107a55] transition-colors cursor-pointer"
              >
                Lihat Semua Buku
              </button>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#D8E6DE] space-y-2">
              <svg className="w-12 h-12 text-[#D8E6DE] mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h4 className="text-sm font-bold text-[#1A1A1A]">Tidak Ada Buku yang Sesuai</h4>
              <p className="text-xs text-[#5C6B64]">Coba ubah kata kunci pencarian atau ganti filter kategori.</p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayedBooks.map((book) => {
              const savedPage = getBookProgress(book.id);
              const hasProgress = savedPage && savedPage > 1;
              const isFav = favorites.includes(book.id);

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl border border-[#D8E6DE] overflow-hidden hover:border-[#39BF81]/40 transition-colors group flex flex-col justify-between relative"
                >
                  <div>
                    {/* Cover Image */}
                    <div className="aspect-3/4 overflow-hidden bg-slate-100 relative">
                      <img
                        src={book.cover_path || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80"}
                        alt={book.judul}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Jenjang Badge */}
                      {book.jenjang && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#39BF81] border border-[#D8E6DE]">
                          {book.jenjang.split(" (")[0]}
                        </span>
                      )}

                      {/* Tombol Bintang Favorit (Pin Buku Siswa) - Menggantikan Rating */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(book.id);
                        }}
                        className={`absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer z-10 ${
                          isFav
                            ? "bg-amber-400 text-white shadow-xs scale-105"
                            : "bg-white/85 backdrop-blur-xs text-slate-400 hover:text-amber-500 hover:bg-white border border-[#D8E6DE]"
                        }`}
                        title={isFav ? "Hapus dari Buku Favorit" : "Tandai sebagai Buku Favorit (Pin)"}
                      >
                        <svg
                          className="w-4 h-4 transition-transform"
                          fill={isFav ? "currentColor" : "none"}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={isFav ? "1" : "2"}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                          />
                        </svg>
                      </button>

                      {/* Saved progress pill */}
                      {hasProgress && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#369D6D]/90 backdrop-blur-xs text-[10px] font-bold text-white shadow-xs">
                          Hal. {savedPage} / {book.total_halaman}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 space-y-2">
                      <div>
                        <h3 className="text-xs font-bold text-[#1A1A1A] line-clamp-2 leading-snug group-hover:text-[#39BF81] transition-colors">
                          {book.judul}
                        </h3>
                        <p className="text-[10px] text-[#5C6B64] mt-0.5 truncate">{book.penulis}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#5C6B64] font-mono">
                          {book.total_halaman} hal.
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#E7F3EC] text-[#39BF81]">
                          {book.category?.nama?.split(" ")[0] || "Pelajaran"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-3 pt-0">
                    <div className="flex gap-2 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onPreviewBook(book)}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#5C6B64] text-xs font-semibold transition-colors border border-slate-200/60"
                      >
                        Info
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenCatalogBook(book)}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-semibold transition-colors shadow-xs"
                      >
                        {hasProgress ? `Lanjut (${savedPage})` : "Baca"}
                      </button>
                    </div>
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
