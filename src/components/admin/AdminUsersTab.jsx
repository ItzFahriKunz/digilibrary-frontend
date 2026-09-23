import { useState, useMemo } from "react";
import UserAvatar from "../ui/UserAvatar";
import CustomSelect from "../ui/CustomSelect";

export default function AdminUsersTab({
  usersList,
  userRoleFilter,
  setUserRoleFilter,
  userSearch,
  setUserSearch,
  onOpenAddUser,
  onOpenEditUser,
  onDeleteUser,
}) {
  // Batas item per halaman agar tabel tidak terlalu panjang ke bawah
  const PAGE_SIZE = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

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

  // Filter and Sort Data
  const filteredAndSortedUsers = useMemo(() => {
    const q = (userSearch || "").toLowerCase().trim();
    const result = usersList.filter((u) => {
      const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
      const matchSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.kelas?.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = "";
        let bVal = "";

        if (sortConfig.key === "name") {
          aVal = a.name || "";
          bVal = b.name || "";
        } else if (sortConfig.key === "email") {
          aVal = a.email || "";
          bVal = b.email || "";
        } else if (sortConfig.key === "role") {
          aVal = a.role || "";
          bVal = b.role || "";
        } else if (sortConfig.key === "kelas") {
          aVal = a.kelas || "";
          bVal = b.kelas || "";
        } else if (sortConfig.key === "reading_logs_count") {
          aVal = Number(a.reading_logs_count || 0);
          bVal = Number(b.reading_logs_count || 0);
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        const comparison = aVal
          .toString()
          .localeCompare(bVal.toString(), undefined, { numeric: true, sensitivity: "base" });
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [usersList, userRoleFilter, userSearch, sortConfig]);

  // Perhitungan Pagination
  const totalItems = filteredAndSortedUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * PAGE_SIZE;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, startIndex + PAGE_SIZE);
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
      {/* Header Top: Title & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#1A1A1A]">Daftar Pengguna Terdaftar</h3>
          <p className="text-xs text-[#5C6B64]">
            Kelola akun siswa, guru, dan admin perpustakaan
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Tombol Tambah Pengguna khusus mobile */}
          <button
            type="button"
            onClick={onOpenAddUser}
            className="sm:hidden w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            + Tambah Pengguna
          </button>

          {/* Filter Peran Custom Modern */}
          <CustomSelect
            value={userRoleFilter}
            onChange={(val) => {
              setUserRoleFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: "all", label: `Semua Peran (${usersList.length})` },
              { value: "siswa", label: "Siswa" },
              { value: "guru", label: "Guru" },
              { value: "admin", label: "Admin" },
            ]}
            className="w-full sm:w-auto"
          />

          {/* Kotak Pencarian */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari nama / email / kelas..."
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
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
                onClick={() => handleSort("name")}
                className="py-3 px-4 cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                title="Klik untuk mengurutkan Nama"
              >
                <div className="flex items-center gap-1.5">
                  <span className={sortConfig.key === "name" ? "text-[#39BF81] font-bold" : ""}>
                    Nama Pengguna
                  </span>
                  {renderSortIcon("name")}
                </div>
              </th>

              <th
                onClick={() => handleSort("email")}
                className="py-3 px-4 cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                title="Klik untuk mengurutkan Email"
              >
                <div className="flex items-center gap-1.5">
                  <span className={sortConfig.key === "email" ? "text-[#39BF81] font-bold" : ""}>
                    Email
                  </span>
                  {renderSortIcon("email")}
                </div>
              </th>

              <th
                onClick={() => handleSort("role")}
                className="py-3 px-4 text-center cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                title="Klik untuk mengurutkan Peran"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className={sortConfig.key === "role" ? "text-[#39BF81] font-bold" : ""}>
                    Peran
                  </span>
                  {renderSortIcon("role")}
                </div>
              </th>

              <th
                onClick={() => handleSort("kelas")}
                className="py-3 px-4 text-center cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                title="Klik untuk mengurutkan Kelas"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className={sortConfig.key === "kelas" ? "text-[#39BF81] font-bold" : ""}>
                    Kelas
                  </span>
                  {renderSortIcon("kelas")}
                </div>
              </th>

              <th
                onClick={() => handleSort("reading_logs_count")}
                className="py-3 px-4 text-center cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                title="Klik untuk mengurutkan Total Baca"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span
                    className={
                      sortConfig.key === "reading_logs_count" ? "text-[#39BF81] font-bold" : ""
                    }
                  >
                    Total Baca
                  </span>
                  {renderSortIcon("reading_logs_count")}
                </div>
              </th>

              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8E6DE]/60">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-xs text-[#5C6B64]">
                  Tidak ada pengguna yang cocok dengan filter atau pencarian.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#F8FAF9]/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar src={u.avatar} name={u.name} size="sm" />
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onOpenEditUser(u)}
                          className="font-bold text-[#1A1A1A] hover:text-[#39BF81] transition-colors text-left block truncate cursor-pointer"
                          title="Klik untuk melihat detail & mengelola akun"
                        >
                          {u.name}
                        </button>
                        {u.is_google ? (
                          <span className="text-[10px] text-teal-700 font-medium flex items-center gap-0.5">
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                            </svg>
                            Google User
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#5C6B64] font-mono text-[11px]">{u.email}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === "admin"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : u.role === "guru"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-[#5C6B64] font-medium">
                    {u.role === "guru" ? (
                      !u.kelas || ["none", "tidak ada", "belum ditugaskan", "-"].includes(String(u.kelas).trim().toLowerCase()) ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Belum Ditugaskan
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          Wali {u.kelas}
                        </span>
                      )
                    ) : u.role === "admin" ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <span className="text-[#1A1A1A] font-medium">{u.kelas || "—"}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center font-bold font-mono text-[#39BF81]">
                    {u.reading_logs_count || 0}x
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenEditUser(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-[#E7F3EC] text-[#5C6B64] hover:text-[#39BF81] border border-[#D8E6DE] transition-colors cursor-pointer text-xs font-semibold"
                        title="Lihat Detail & Kelola Akun"
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
                        <span className="hidden md:inline">Detail</span>
                      </button>
                      {u.email !== "admin@digilibrary.sch.id" && (
                        <button
                          type="button"
                          onClick={() => onDeleteUser(u.id, u.name)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-[#5C6B64] hover:text-rose-700 border border-[#D8E6DE] transition-colors cursor-pointer"
                          title="Hapus Pengguna"
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
                      )}
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

        {/* Info data pengguna: Ditampilkan rapi di tengah */}
        <p className="text-center">
          Menampilkan <span className="font-semibold text-[#1A1A1A]">{displayStart} - {displayEnd}</span> dari{" "}
          <span className="font-semibold text-[#1A1A1A]">{totalItems}</span> pengguna
        </p>
      </div>
    </section>
  );
}
