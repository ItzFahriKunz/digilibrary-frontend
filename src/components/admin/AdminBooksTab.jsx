import { useState, useMemo } from "react";
import CustomSelect from "../ui/CustomSelect";

export default function AdminBooksTab({
  books,
  categories,
  bookCatFilter,
  setBookCatFilter,
  bookSearch,
  setBookSearch,
  loading,
  onOpenAddBook,
  onOpenEditBook,
  onDeleteBook,
  onPreviewBook,
}) {
  // Batas item per halaman agar tabel tidak terlalu panjang ke bawah
  const PAGE_SIZE = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "judul", direction: "asc" });

  // Handle Sort Toggle
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    setCurrentPage(1);
  };

  // Filter & Sort Data
  const filteredAndSortedBooks = useMemo(() => {
    const q = (bookSearch || "").toLowerCase().trim();
    const result = books.filter((b) => {
      const matchCat = bookCatFilter === "all" || b.category_id?.toString() === bookCatFilter;
      const matchSearch =
        !q ||
        b.judul?.toLowerCase().includes(q) ||
        b.penulis?.toLowerCase().includes(q) ||
        b.category?.nama?.toLowerCase().includes(q) ||
        b.jenjang?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = "";
        let bVal = "";

        if (sortConfig.key === "judul") {
          aVal = a.judul || "";
          bVal = b.judul || "";
        } else if (sortConfig.key === "kategori") {
          aVal = a.category?.nama || "";
          bVal = b.category?.nama || "";
        } else if (sortConfig.key === "jenjang") {
          aVal = a.jenjang || "";
          bVal = b.jenjang || "";
        } else if (sortConfig.key === "total_dibaca") {
          aVal = Number(a.total_dibaca || 0);
          bVal = Number(b.total_dibaca || 0);
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        } else if (sortConfig.key === "total_halaman") {
          aVal = Number(a.total_halaman || 0);
          bVal = Number(b.total_halaman || 0);
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        const comparison = aVal
          .toString()
          .localeCompare(bVal.toString(), undefined, { numeric: true, sensitivity: "base" });
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [books, bookCatFilter, bookSearch, sortConfig]);

  // Perhitungan Pagination
  const totalItems = filteredAndSortedBooks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * PAGE_SIZE;
  const paginatedBooks = filteredAndSortedBooks.slice(startIndex, startIndex + PAGE_SIZE);
  const displayStart = totalItems === 0 ? 0 : startIndex + 1;
  const displayEnd = Math.min(startIndex + PAGE_SIZE, totalItems);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Helper render sort icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return (
        <svg
          className="w-3 h-3 text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return sortConfig.direction === "asc" ? (
      <svg className="w-3 h-3 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <section className="bg-white rounded-3xl border border-[#D8E6DE] p-6 shadow-xs space-y-5">
      {/* Header Top: Title & Actions Toolbar (Tanpa tombol tambah dobel di desktop) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#1A1A1A]">Katalog Buku Perpustakaan</h3>
          <p className="text-xs text-[#5C6B64]">
            Kelola buku teks pelajaran dan buku nonteks literasi SIBI
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Tombol Tambah Buku khusus mobile (di desktop sudah ada di header atas admin) */}
          <button
            type="button"
            onClick={onOpenAddBook}
            className="sm:hidden w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            + Tambah Buku
          </button>

          {/* Filter Kategori Custom Modern */}
          <CustomSelect
            value={bookCatFilter}
            onChange={(val) => {
              setBookCatFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: "all", label: `Semua Kategori (${books.length})` },
              ...categories.map((c) => ({ value: c.id, label: c.nama })),
            ]}
            className="w-full sm:w-auto"
          />

          {/* Kotak Pencarian */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari judul / penulis..."
              value={bookSearch}
              onChange={(e) => {
                setBookSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-2 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] transition-all"
            />
            <svg
              className="w-3.5 h-3.5 text-[#5C6B64] absolute left-2.5 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto rounded-2xl border border-[#D8E6DE]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAF9] border-b border-[#D8E6DE] text-[#5C6B64] uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th
                onClick={() => handleSort("judul")}
                className="py-3 px-4 cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                title="Klik untuk mengurutkan Judul"
              >
                <div className="flex items-center gap-1.5">
                  <span className={sortConfig.key === "judul" ? "text-[#39BF81] font-bold" : ""}>
                    Buku & Penulis
                  </span>
                  {renderSortIcon("judul")}
                </div>
              </th>

              <th
                onClick={() => handleSort("kategori")}
                className="py-3 px-4 cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                title="Klik untuk mengurutkan Kategori"
              >
                <div className="flex items-center gap-1.5">
                  <span className={sortConfig.key === "kategori" ? "text-[#39BF81] font-bold" : ""}>
                    Kategori & Tipe
                  </span>
                  {renderSortIcon("kategori")}
                </div>
              </th>

              <th
                onClick={() => handleSort("jenjang")}
                className="py-3 px-4 cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                title="Klik untuk mengurutkan Jenjang"
              >
                <div className="flex items-center gap-1.5">
                  <span className={sortConfig.key === "jenjang" ? "text-[#39BF81] font-bold" : ""}>
                    Jenjang
                  </span>
                  {renderSortIcon("jenjang")}
                </div>
              </th>

              <th
                onClick={() => handleSort("total_dibaca")}
                className="py-3 px-4 text-center cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                title="Klik untuk mengurutkan Total Dibaca"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className={sortConfig.key === "total_dibaca" ? "text-[#39BF81] font-bold" : ""}>
                    Dibaca
                  </span>
                  {renderSortIcon("total_dibaca")}
                </div>
              </th>

              <th
                onClick={() => handleSort("total_halaman")}
                className="py-3 px-4 text-center cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                title="Klik untuk mengurutkan Halaman"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className={sortConfig.key === "total_halaman" ? "text-[#39BF81] font-bold" : ""}>
                    Halaman
                  </span>
                  {renderSortIcon("total_halaman")}
                </div>
              </th>

              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8E6DE]/60">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-xs text-[#5C6B64]">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#39BF81] border-t-transparent rounded-full animate-spin" />
                    <span>Memuat katalog buku...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedBooks.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-xs text-[#5C6B64]">
                  Tidak ada data buku yang sesuai.
                </td>
              </tr>
            ) : (
              paginatedBooks.map((b) => (
                <tr key={b.id} className="hover:bg-[#F8FAF9]/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-13 rounded-lg overflow-hidden border border-[#D8E6DE] bg-slate-100 shrink-0 shadow-2xs">
                        <img
                          src={
                            b.cover_path ||
                            "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"
                          }
                          alt={b.judul}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <span className="font-bold text-[#1A1A1A] line-clamp-1">
                          {b.judul}
                        </span>
                        <span className="text-[11px] text-[#5C6B64] block truncate">
                          {b.penulis} {b.penerbit ? `• ${b.penerbit}` : ""}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold bg-[#E7F3EC] text-[#39BF81] border border-[#D8E6DE]">
                      {b.category?.nama || "Pelajaran"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#5C6B64] font-medium">
                    {b.jenjang || "SD"}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-[#39BF81] font-mono">
                    {b.total_dibaca || 0}x
                  </td>
                  <td className="py-3 px-4 text-center text-[#5C6B64] font-medium font-mono">
                    {b.total_halaman || 0} hlm
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onPreviewBook(b)}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-[#E7F3EC] text-[#5C6B64] hover:text-[#39BF81] border border-[#D8E6DE] transition-colors cursor-pointer"
                        title="Pratinjau Lembar Baca"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenEditBook(b)}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-[#5C6B64] hover:text-amber-700 border border-[#D8E6DE] transition-colors cursor-pointer"
                        title="Edit Buku"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteBook(b.id, b.judul)}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-[#5C6B64] hover:text-rose-700 border border-[#D8E6DE] transition-colors cursor-pointer"
                        title="Hapus Buku"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Bersih: Info & Tombol Pagination < 1 dari 2 > Berada di Tengah */}
      <div className="flex flex-col items-center justify-center gap-2 pt-2 text-xs text-[#5C6B64]">
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl px-2.5 py-1 shadow-2xs">
            {/* Tombol < (Sebelumnya) */}
            <button
              type="button"
              disabled={validCurrentPage === 1}
              onClick={() => handlePageChange(validCurrentPage - 1)}
              className="w-7 h-7 rounded-lg bg-white border border-[#D8E6DE] text-[#5C6B64] hover:text-[#39BF81] hover:border-[#39BF81] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shadow-2xs"
              title="Halaman Sebelumnya"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Label: 1 dari 2 */}
            <span className="text-xs text-[#5C6B64] font-medium px-2.5 select-none">
              <strong className="text-[#1A1A1A] font-bold">{validCurrentPage}</strong> dari{" "}
              <strong className="text-[#1A1A1A] font-bold">{totalPages}</strong>
            </span>

            {/* Tombol > (Selanjutnya) */}
            <button
              type="button"
              disabled={validCurrentPage === totalPages}
              onClick={() => handlePageChange(validCurrentPage + 1)}
              className="w-7 h-7 rounded-lg bg-white border border-[#D8E6DE] text-[#5C6B64] hover:text-[#39BF81] hover:border-[#39BF81] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shadow-2xs"
              title="Halaman Selanjutnya"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Info data buku: Ditampilkan rapi di tengah */}
        <p className="text-center">
          Menampilkan <span className="font-semibold text-[#1A1A1A]">{displayStart} - {displayEnd}</span> dari{" "}
          <span className="font-semibold text-[#1A1A1A]">{totalItems}</span> buku
        </p>
      </div>
    </section>
  );
}
