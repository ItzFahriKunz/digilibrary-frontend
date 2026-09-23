import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminService, bookService, categoryService, userService } from "../services";
import BookReaderModal from "../components/BookReaderModal";

// Modular Admin Components
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminOverviewTab from "../components/admin/AdminOverviewTab";
import AdminBooksTab from "../components/admin/AdminBooksTab";
import AdminUsersTab from "../components/admin/AdminUsersTab";
import AdminUserModal from "../components/admin/AdminUserModal";
import AdminUserAddView from "../components/admin/AdminUserAddView";
import AdminUserDetailView from "../components/admin/AdminUserDetailView";
import AdminBookDetailView from "../components/admin/AdminBookDetailView";
import LogoutConfirmModal from "../components/ui/LogoutConfirmModal";

export default function AdminDashboardPage() {
  const { user: currentAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Active Tab: 'dashboard' | 'books' | 'users'
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Data States
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filter & Search Buku
  const [bookSearch, setBookSearch] = useState("");
  const [bookCatFilter, setBookCatFilter] = useState("all");

  // Filter & Search User
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  // Dedicated View State Buku
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [readerBook, setReaderBook] = useState(null);

  // Dedicated View State Pengguna
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchInitialData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, booksRes, catsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        bookService.getBooks({ per_page: 100 }),
        categoryService.getCategories(),
        userService.getAdminUsers(),
      ]);

      if (statsRes.data?.status === "success") {
        setStats(statsRes.data.data);
      }
      if (booksRes.data?.status === "success") {
        setBooks(booksRes.data.data?.data || []);
      }
      if (catsRes.data?.status === "success") {
        setCategories(catsRes.data.data || []);
      }
      if (usersRes.data?.status === "success") {
        setUsersList(usersRes.data.data || []);
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setError("Gagal memuat data dari backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  // ================= BUKU HANDLERS =================
  const handleOpenAddBook = () => {
    setSelectedBookId(null);
    setSelectedBook(null);
    setActiveTab("book-add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenEditBook = (book) => {
    setSelectedBookId(book.id);
    setSelectedBook(book);
    setActiveTab("book-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookSaved = () => {
    fetchInitialData();
  };

  const handleDeleteBook = async (id, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus buku "${title}"?`)) return;
    try {
      const res = await bookService.deleteBook(id);
      if (res.data?.status === "success") {
        setSuccessMsg(`Buku "${title}" berhasil dihapus.`);
        setBooks((prev) => prev.filter((b) => b.id !== id));
        fetchInitialData();
      }
    } catch (err) {
      console.error("Delete Book Error:", err);
      setError("Gagal menghapus buku.");
    }
  };

  // ================= PENGGUNA HANDLERS =================
  const handleOpenAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  const handleOpenEditUser = (user) => {
    setSelectedUserId(user.id);
    setSelectedUser(user);
    setActiveTab("user-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUserCreated = (newUser) => {
    setUsersList((prev) => [newUser, ...prev]);
    setSuccessMsg(`Pengguna "${newUser.name}" berhasil ditambahkan.`);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
    );
    setSelectedUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${name}"?`)) return;
    try {
      const res = await userService.deleteAdminUser(id);
      if (res.data?.status === "success") {
        setSuccessMsg(`Pengguna "${name}" berhasil dihapus.`);
        setUsersList((prev) => prev.filter((u) => u.id !== id));
        if (activeTab === "user-detail") {
          setActiveTab("users");
        }
      }
    } catch (err) {
      console.error("Delete User Error:", err);
      setError("Gagal menghapus pengguna.");
    }
  };

  const isDedicatedView = ["user-detail", "book-add", "book-detail"].includes(activeTab);

  if (isDedicatedView) {
    return (
      <div className="min-h-screen bg-[#F0F4F2] flex flex-col text-[#1A1A1A] font-sans antialiased selection:bg-[#E7F3EC] selection:text-[#39BF81]">
        {/* Top Navbar Bersih Khusus Halaman Detail / Input Form */}
        <header className="bg-white border-b border-[#D8E6DE] px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#369D6D] flex items-center justify-center text-white shadow-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#369D6D] tracking-tight">Digilibrary</span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-[#E7F3EC] text-[#39BF81] border border-[#D8E6DE]">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-[#5C6B64]">
                {activeTab === "book-add" && "Pedataan Katalog Buku Baru"}
                {activeTab === "book-detail" && "Detail & Pengelolaan Buku"}
                {activeTab === "user-add" && "Pedataan Pengguna Baru"}
                {activeTab === "user-detail" && "Detail & Kelola Akun Pengguna"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
              title="Keluar Akun"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* Alerts & Notifications */}
        {successMsg && (
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-4">
            <div className="p-3.5 rounded-2xl bg-[#E7F3EC] border border-[#D8E6DE] text-[#369D6D] text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#369D6D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg("")} className="text-[#369D6D] hover:text-[#107a55] text-xs font-bold cursor-pointer">
                Tutup
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-4">
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
              <button onClick={() => setError("")} className="text-rose-700 hover:text-rose-900 text-xs font-bold cursor-pointer">
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Main Dedicated Content */}
        <main className="flex-1 py-8 px-4 sm:px-6 max-w-4xl mx-auto w-full">
          {activeTab === "book-add" && (
            <AdminBookDetailView
              categories={categories}
              onBack={() => setActiveTab("books")}
              onBookSaved={handleBookSaved}
            />
          )}

          {activeTab === "book-detail" && (
            <AdminBookDetailView
              bookId={selectedBookId}
              initialBookData={selectedBook}
              categories={categories}
              onBack={() => setActiveTab("books")}
              onBookSaved={handleBookSaved}
              onBookDeleted={handleDeleteBook}
              onPreviewBook={setReaderBook}
            />
          )}

          {activeTab === "user-add" && (
            <AdminUserAddView
              usersList={usersList}
              onBack={() => setActiveTab("users")}
              onUserCreated={handleUserCreated}
            />
          )}

          {activeTab === "user-detail" && (
            <AdminUserDetailView
              userId={selectedUserId}
              initialUserData={selectedUser}
              usersList={usersList}
              onBack={() => setActiveTab("users")}
              onUserUpdated={handleUserUpdated}
              onUserDeleted={handleDeleteUser}
            />
          )}
        </main>


        {/* Modal Pratinjau Baca (Reader) */}
        {readerBook && (
          <BookReaderModal
            book={readerBook}
            onClose={() => setReaderBook(null)}
            currentUser={{
              name: currentAdmin?.name || "Admin Perpustakaan",
              email: currentAdmin?.email || "admin@digilibrary.sch.id",
            }}
          />
        )}

        {/* Modal Konfirmasi Logout */}
        <LogoutConfirmModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleConfirmLogout}
          title="Keluar dari Panel Admin?"
          message="Apakah Anda yakin ingin keluar dari Panel Admin Perpustakaan?"
          userName={currentAdmin?.name}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1A1A1A] font-sans antialiased flex flex-col lg:flex-row selection:bg-[#E7F3EC] selection:text-[#39BF81]">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        booksCount={books.length}
        usersCount={usersList.length}
        currentAdmin={currentAdmin}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#D8E6DE] px-6 lg:px-8 py-4 sticky top-0 z-30 flex items-center justify-between shadow-xs">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight">
              {activeTab === "dashboard" && "Dashboard Statistik & Analitik"}
              {activeTab === "books" && "Manajemen Katalog E-Book SIBI"}
              {activeTab === "users" && "Manajemen Pengguna (Siswa, Guru, Admin)"}
            </h1>
            <p className="text-xs text-[#5C6B64] hidden sm:block">
              Perpustakaan Digital Sekolah Dasar | Kurikulum Merdeka
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === "books" && (
              <button
                type="button"
                onClick={handleOpenAddBook}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>Tambah Buku</span>
              </button>
            )}

            {activeTab === "users" && (
              <button
                type="button"
                onClick={handleOpenAddUser}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>Tambah Pengguna</span>
              </button>
            )}

          </div>
        </header>

        {/* Alerts & Notifications */}
        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
          {successMsg && (
            <div className="p-4 rounded-2xl bg-[#E7F3EC] border border-[#D8E6DE] text-[#369D6D] text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#369D6D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg("")} className="text-[#369D6D] hover:text-[#107a55] text-xs font-bold cursor-pointer">
                Tutup
              </button>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
              <button onClick={() => setError("")} className="text-rose-700 hover:text-rose-900 text-xs font-bold cursor-pointer">
                Tutup
              </button>
            </div>
          )}

          {/* Active Tab Content */}
          {activeTab === "dashboard" && (
            <AdminOverviewTab stats={stats} books={books} usersList={usersList} />
          )}

          {activeTab === "books" && (
            <AdminBooksTab
              books={books}
              categories={categories}
              bookCatFilter={bookCatFilter}
              setBookCatFilter={setBookCatFilter}
              bookSearch={bookSearch}
              setBookSearch={setBookSearch}
              loading={loading}
              onOpenAddBook={handleOpenAddBook}
              onOpenEditBook={handleOpenEditBook}
              onDeleteBook={handleDeleteBook}
              onPreviewBook={setReaderBook}
            />
          )}

          {activeTab === "users" && (
            <AdminUsersTab
              usersList={usersList}
              userRoleFilter={userRoleFilter}
              setUserRoleFilter={setUserRoleFilter}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              onOpenAddUser={handleOpenAddUser}
              onOpenEditUser={handleOpenEditUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </div>
      </div>

      {/* Modal Pratinjau Baca (Reader) */}
      {readerBook && (
        <BookReaderModal
          book={readerBook}
          onClose={() => setReaderBook(null)}
          currentUser={{
            name: currentAdmin?.name || "Admin Perpustakaan",
            email: currentAdmin?.email || "admin@digilibrary.sch.id",
          }}
        />
      )}

      {/* Modal Konfirmasi Logout */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Keluar dari Panel Admin?"
        message="Apakah Anda yakin ingin keluar dari Panel Admin Perpustakaan?"
        userName={currentAdmin?.name}
      />

      {/* Modal Card Alert Tambah Pengguna */}
      <AdminUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onUserCreated={handleUserCreated}
        usersList={usersList}
      />
    </div>
  );
}
