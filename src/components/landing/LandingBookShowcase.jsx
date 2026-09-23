import { useState } from "react";
import { LANDING_CATEGORIES, DEFAULT_FALLBACK_COVER } from "../../data/landingBooks";
import RevealOnScroll from "../ui/RevealOnScroll";

export default function LandingBookShowcase({
  books,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onBookClick,
}) {
  const [previewBook, setPreviewBook] = useState(null);

  const filteredBooks = books.filter((book) => {
    const matchCategory =
      selectedCategory === "Semua Koleksi" ||
      book.category === selectedCategory ||
      (selectedCategory === "Buku Teks Kurikulum Merdeka" && book.jenjang?.includes("SD Kelas"));

    const query = (searchQuery || "").toLowerCase().trim();
    const matchSearch =
      !query ||
      (book.title || "").toLowerCase().includes(query) ||
      (book.author || "").toLowerCase().includes(query) ||
      (book.jenjang || "").toLowerCase().includes(query) ||
      (book.desc || "").toLowerCase().includes(query);

    return matchCategory && matchSearch;
  });

  return (
    <section id="koleksi" className="py-20 bg-white border-y border-[#D8E6DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="up" distance={16} duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#39BF81]">
                  Katalog Resmi SIBI
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
                Eksplorasi Koleksi Buku SD
              </h2>
              <p className="text-sm sm:text-base text-[#5C6B64] max-w-xl">
                Koleksi bacaan resmi dari Pusat Perbukuan Kemendikdasmen untuk memperkaya literasi dan mendampingi pembelajaran siswa.
              </p>
            </div>

            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Cari judul, penulis, kelas..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-[#5C6B64]/70 focus:outline-none focus:border-[#39BF81] focus:ring-2 focus:ring-[#E7F3EC] transition-all"
              />
              <svg
                className="w-4 h-4 text-[#5C6B64] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </RevealOnScroll>

        {/* Filter Pills Kategori */}
        <RevealOnScroll direction="up" distance={12} delay={80}>
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {LANDING_CATEGORIES.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
                ? "bg-[#2BA76E] text-white shadow-xs"
                : "bg-[#F8FAF9] hover:bg-[#E7F3EC] text-[#5C6B64] border border-[#D8E6DE]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </RevealOnScroll>

      {/* Grid Buku */}
      {filteredBooks.length === 0 ? (
        <RevealOnScroll direction="up" distance={16}>
          <div className="text-center py-16 bg-[#F8FAF9] rounded-2xl border border-[#D8E6DE]">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white text-[#5C6B64] flex items-center justify-center border border-[#D8E6DE]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">Buku Tidak Ditemukan</h3>
            <p className="text-xs text-[#5C6B64] mt-1">Coba gunakan kata kunci pencarian atau kategori yang berbeda.</p>
          </div>
        </RevealOnScroll>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book, bIdx) => (
            <RevealOnScroll key={book.id} delay={(bIdx % 4) * 60} distance={16} direction="up">
              <div
                className="bg-white rounded-2xl border border-[#D8E6DE] hover:border-[#39BF81]/40 transition-all duration-200 hover:shadow-lg flex flex-col justify-between overflow-hidden group h-full"
              >
                <div>
                  <div className="aspect-3/4 overflow-hidden bg-slate-100 relative">
                    <img
                      src={book.cover || DEFAULT_FALLBACK_COVER}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_FALLBACK_COVER;
                      }}
                    />
                    <div className="absolute bottom-3 left-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md border backdrop-blur-xs ${book.tagColor || "bg-emerald-50 text-emerald-900 border-emerald-200"}`}>
                        {book.badgeLabel || "SIBI SD"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#39BF81] block">
                      {book.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#1A1A1A] leading-snug line-clamp-2 group-hover:text-[#39BF81] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-[#5C6B64] line-clamp-1">
                      {book.author}
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#5C6B64]">
                      <span>{book.jenjang}</span>
                      <span className="font-mono">{book.pages}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewBook(book)}
                    className="py-2.5 px-3 rounded-xl bg-[#F8FAF9] hover:bg-[#E7F3EC] text-[#5C6B64] hover:text-[#39BF81] text-xs font-semibold border border-[#D8E6DE] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Detail</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onBookClick(book)}
                    className="py-2.5 px-3 rounded-xl bg-[#39BF81] hover:bg-[#0f875d] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-[0.98]"
                    title="Masuk atau Buka di Dashboard untuk membaca buku lengkap"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Baca</span>
                  </button>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      )}

        <div className="mt-12 text-center text-xs text-[#5C6B64] bg-[#F8FAF9] p-4 rounded-xl border border-[#D8E6DE]">
          Sumber Data: Seluruh katalog di atas merujuk pada standar buku resmi <strong>SIBI Kemendikdasmen</strong> (<a href="https://buku.kemendikdasmen.go.id" target="_blank" rel="noreferrer" className="text-[#39BF81] font-semibold underline">buku.kemendikdasmen.go.id</a>).
        </div>
      </div>

      {/* MODAL DETAIL PREVIEW BUKU */}
      {previewBook && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#D8E6DE] shadow-2xl relative">
            <button
              onClick={() => setPreviewBook(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#5C6B64] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex gap-4 items-start">
              <div className="w-24 h-32 rounded-xl overflow-hidden shadow-md shrink-0 bg-slate-100">
                <img
                  src={previewBook.cover || DEFAULT_FALLBACK_COVER}
                  alt={previewBook.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5 flex-1 pr-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#39BF81] bg-[#E7F3EC] px-2.5 py-0.5 rounded-md border border-[#D8E6DE]">
                  {previewBook.badgeLabel || "SIBI"}
                </span>
                <h3 className="text-base font-bold text-[#1A1A1A] leading-tight">
                  {previewBook.title}
                </h3>
                <p className="text-xs text-[#5C6B64]">{previewBook.author}</p>
                <div className="text-[11px] text-[#5C6B64] pt-1">
                  <span>{previewBook.jenjang}</span> | <span>{previewBook.pages}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#1A1A1A]">Sinopsis &amp; Deskripsi:</h4>
              <p className="text-xs text-[#5C6B64] leading-relaxed">
                {previewBook.desc}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#D8E6DE] text-[11px] text-[#5C6B64] space-y-1">
              <div className="flex justify-between">
                <span>Penerbit:</span>
                <strong className="text-[#1A1A1A]">{previewBook.sumber || "Pusat Perbukuan Kemendikdasmen"}</strong>
              </div>
              <div className="flex justify-between">
                <span>Format Baca:</span>
                <strong className="text-[#39BF81]">E-Reader Canvas Interaktif</strong>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPreviewBook(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5C6B64] text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  const b = previewBook;
                  setPreviewBook(null);
                  onBookClick(b);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Buka Lembaran Buku</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
