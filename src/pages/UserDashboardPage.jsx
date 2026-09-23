import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bookService, categoryService } from "../services";

// Modular Components
import UserSidebar from "../components/user/UserSidebar";
import UserOverviewTab from "../components/user/UserOverviewTab";
import UserHistoryTab from "../components/user/UserHistoryTab";
import UserProfileTab from "../components/user/UserProfileTab";
import TeacherClassOverviewTab from "../components/teacher/TeacherClassOverviewTab";
import BookReaderModal from "../components/BookReaderModal";
import LogoutConfirmModal from "../components/ui/LogoutConfirmModal";

export default function UserDashboardPage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const isGuru = user?.role === "guru";

  // Active Tab: 'guru' | 'books' | 'history' | 'profile'
  const [activeTab, setActiveTab] = useState(() => (user?.role === "guru" ? "guru" : "books"));
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Data States
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedKelas, setSelectedKelas] = useState("all");

  // Modal State
  const [readerBook, setReaderBook] = useState(null);
  const [previewBook, setPreviewBook] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, catsRes, historyRes] = await Promise.all([
        bookService.getBooks({ per_page: 100 }),
        categoryService.getCategories(),
        bookService.getReadingHistory().catch(() => ({ data: { data: [] } })),
      ]);

      if (booksRes.data?.status === "success") {
        setBooks(booksRes.data.data?.data || []);
      }
      if (catsRes.data?.status === "success") {
        setCategories(catsRes.data.data || []);
      }
      if (historyRes.data?.data) {
        setReadingHistory(historyRes.data.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  // Mengambil progres membaca tersimpan (dari readingHistory atau localStorage)
  const getBookProgress = (bookId) => {
    const log = readingHistory.find((l) => String(l.book_id || l.book?.id) === String(bookId));
    if (log?.halaman_terakhir && Number(log.halaman_terakhir) >= 1) {
      return Number(log.halaman_terakhir);
    }
    const saved = typeof window !== "undefined" ? localStorage.getItem(`digilib_progress_${user?.id || "guest"}_${bookId}`) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.page && Number(parsed.page) >= 1) return Number(parsed.page);
      } catch {}
    }
    return null;
  };

  // Buka buku dari riwayat Terakhir Baca (menjamin file_path utuh dan initialPage tepat)
  const handleOpenRecentRead = (log) => {
    if (!log) return;
    const bId = log.book_id || log.book?.id;
    const catalogBook = books.find((b) => String(b.id) === String(bId));
    const merged = {
      ...(catalogBook || {}),
      ...(log.book || {}),
      id: catalogBook?.id || log.book?.id || bId,
      file_path: catalogBook?.file_path || log.book?.file_path,
      total_halaman: catalogBook?.total_halaman || log.book?.total_halaman || 36,
      initialPage: Number(log.halaman_terakhir) || 1,
    };
    setReaderBook(merged);
  };

  // Buka buku dari katalog (otomatis cek apakah pernah dibaca sebelumnya untuk resume)
  const handleOpenCatalogBook = (book, customPage = null) => {
    const savedPage = customPage !== null ? customPage : getBookProgress(book.id);
    setReaderBook({
      ...book,
      initialPage: savedPage || 1,
    });
  };

  // Callback update real-time progress dari BookReaderModal ke dashboard state
  const updateReadingProgressLocal = (bookId, newPage) => {
    setReadingHistory((prevLogs) => {
      const existingIdx = prevLogs.findIndex((l) => String(l.book_id || l.book?.id) === String(bookId));
      if (existingIdx >= 0) {
        const updated = [...prevLogs];
        updated[existingIdx] = {
          ...updated[existingIdx],
          halaman_terakhir: newPage,
          read_at: new Date().toISOString(),
        };
        return updated;
      } else {
        const bookObj = books.find((b) => String(b.id) === String(bookId));
        return [
          {
            id: Date.now(),
            user_id: user?.id,
            book_id: bookId,
            book: bookObj,
            halaman_terakhir: newPage,
            durasi_detik: 15,
            read_at: new Date().toISOString(),
          },
          ...prevLogs,
        ];
      }
    });
  };

  const handleCloseReader = () => {
    setReaderBook(null);
    api.get("/user/reading-history")
      .then((res) => {
        if (res.data?.data) {
          setReadingHistory(res.data.data);
        }
      })
      .catch(() => {});
  };

  // Unikkan riwayat membaca berdasarkan book_id agar tidak ada duplikasi buku di baris terakhir dibaca
  const uniqueRecentReads = readingHistory.reduce((acc, log) => {
    const bId = log.book_id || log.book?.id;
    if (!bId) return acc;
    if (!acc.some((item) => String(item.book_id || item.book?.id) === String(bId))) {
      acc.push(log);
    }
    return acc;
  }, []);

  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.penulis?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      selectedCat === "all" || b.category_id?.toString() === selectedCat;
    const matchKelas =
      selectedKelas === "all" || b.tingkat_kelas?.toString() === selectedKelas;
    return matchSearch && matchCat && matchKelas;
  });

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1A1A1A] font-sans antialiased flex flex-col lg:flex-row selection:bg-[#E7F3EC] selection:text-[#39BF81]">
      {/* ================= SIDEBAR SISWA ================= */}
      <UserSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        booksCount={books.length}
        historyCount={readingHistory.length}
        user={user}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        onLogout={handleLogout}
      />

      {/* ================= AREA KONTEN UTAMA ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-[#D8E6DE] sticky top-0 z-30 shadow-2xs">
          <div className="px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight">
                {activeTab === "guru" &&
                  (isGuru
                    ? user?.kelas &&
                      !["none", "tidak ada", "belum ditugaskan", "-", ""].includes(
                        String(user.kelas).trim().toLowerCase()
                      )
                      ? `Ruang Wali ${user.kelas}`
                      : "Ruang Guru (Belum Ditugaskan)"
                    : "Pemantauan 24 Kelas SD")}
                {activeTab === "books" && "Koleksi Buku & Bacaan"}
                {activeTab === "history" && "Aktivitas & Riwayat Membaca"}
                {activeTab === "profile" && "Profil Saya & Keamanan"}
              </h1>
              <p className="text-[10px] sm:text-xs text-[#5C6B64] font-medium hidden sm:block">
                Perpustakaan Digital SD | Kurikulum Merdeka
              </p>
            </div>
          </div>
        </header>

        {/* Main Body View */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {/* TAB 0: RUANG GURU & PANTAU KELAS */}
          {activeTab === "guru" && (
            <TeacherClassOverviewTab
              user={user}
              onClassChanged={(newClass) => updateUser({ kelas: newClass })}
            />
          )}

          {/* TAB 1: KOLEKSI BUKU */}
          {activeTab === "books" && (
            <UserOverviewTab
              user={user}
              books={books}
              categories={categories}
              filteredBooks={filteredBooks}
              uniqueRecentReads={uniqueRecentReads}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCat={selectedCat}
              setSelectedCat={setSelectedCat}
              selectedKelas={selectedKelas}
              setSelectedKelas={setSelectedKelas}
              loading={loading}
              onOpenRecentRead={handleOpenRecentRead}
              onOpenCatalogBook={handleOpenCatalogBook}
              onPreviewBook={(b) => setPreviewBook(b)}
              getBookProgress={getBookProgress}
            />
          )}

          {/* TAB 2: AKTIVITAS & RIWAYAT */}
          {activeTab === "history" && (
            <UserHistoryTab
              readingHistory={readingHistory}
              books={books}
              onOpenRecentRead={handleOpenRecentRead}
            />
          )}

          {/* TAB 3: PROFIL SAYA */}
          {activeTab === "profile" && (
            <UserProfileTab
              user={user}
              onProfileUpdated={(updated) => updateUser(updated)}
            />
          )}
        </main>
      </div>

      {/* ================= MODAL PREVIEW BUKU ================= */}
      {previewBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#D8E6DE] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-20 h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-[#D8E6DE] shadow-2xs">
                <img
                  src={previewBook.cover_path || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80"}
                  alt={previewBook.judul}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-[#1A1A1A] leading-snug">{previewBook.judul}</h3>
                <p className="text-[11px] text-[#5C6B64] mt-0.5">Penulis: {previewBook.penulis}</p>
                <p className="text-[11px] text-[#5C6B64] mt-0.5">
                  Penerbit: {previewBook.penerbit || "Pusat Perbukuan Kemendikdasmen"}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#E7F3EC] text-[#39BF81] border border-[#D8E6DE]">
                    {previewBook.category?.nama || "Pelajaran"}
                  </span>
                </div>
              </div>
            </div>

            {previewBook.deskripsi && (
              <p className="text-xs text-[#5C6B64] leading-relaxed border-t border-[#D8E6DE] pt-3">
                {previewBook.deskripsi}
              </p>
            )}

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#D8E6DE]">
                <span className="text-sm font-bold text-[#1A1A1A] block">{previewBook.total_halaman}</span>
                <span className="text-[10px] text-[#5C6B64]">Halaman</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#D8E6DE]">
                <span className="text-sm font-bold text-[#1A1A1A] block">{previewBook.total_dibaca}x</span>
                <span className="text-[10px] text-[#5C6B64]">Dibaca</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#D8E6DE]">
                <span className="text-sm font-bold text-[#1A1A1A] block capitalize">{previewBook.jenjang?.split(" (")[0] || "SD"}</span>
                <span className="text-[10px] text-[#5C6B64]">Jenjang</span>
              </div>
            </div>

            {/* Sesi Terakhir Dibaca Banner jika ada */}
            {(() => {
              const prevPage = getBookProgress(previewBook.id);
              if (prevPage && prevPage > 1) {
                return (
                  <div className="p-3 rounded-2xl bg-[#E7F3EC] border border-[#D8E6DE] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#39BF81]"></span>
                      <span className="text-xs font-bold text-[#39BF81]">
                        Sesi Tersimpan: Halaman {prevPage} dari {previewBook.total_halaman}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#39BF81]">
                      {Math.min(100, Math.round((prevPage / Math.max(1, previewBook.total_halaman)) * 100))}%
                    </span>
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              {(() => {
                const prevPage = getBookProgress(previewBook.id);
                if (prevPage && prevPage > 1) {
                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          handleOpenCatalogBook(previewBook, prevPage);
                          setPreviewBook(null);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        Lanjutkan dari Hal. {prevPage}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleOpenCatalogBook(previewBook, 1);
                          setPreviewBook(null);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#E7F3EC] text-[#369D6D] hover:text-[#107a55] border border-[#D8E6DE] text-xs font-bold transition-colors cursor-pointer"
                      >
                        Mulai Hal. 1
                      </button>
                    </>
                  );
                }
                return (
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenCatalogBook(previewBook, 1);
                      setPreviewBook(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    Baca Sekarang
                  </button>
                );
              })()}
              <button
                type="button"
                onClick={() => setPreviewBook(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5C6B64] text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL E-READER ================= */}
      {readerBook && (
        <BookReaderModal
          book={readerBook}
          onClose={handleCloseReader}
          currentUser={user}
          onProgressUpdate={updateReadingProgressLocal}
        />
      )}

      {/* ================= MODAL KONFIRMASI LOGOUT ================= */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Yakin Ingin Keluar?"
        message="Apakah Anda yakin ingin keluar dari akun perpustakaan ini?"
        userName={user?.name}
      />
    </div>
  );
}
