import UserAvatar from "../ui/UserAvatar";

export default function TeacherStudentTable({
  students = [],
  filteredStudents = [],
  currentClass,
  userClass,
  formatClassName,
  searchStudent,
  setSearchStudent,
  statusFilter,
  setStatusFilter,
  onSelectStudent,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#D8E6DE] p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#D8E6DE]/60">
        <div>
          <h3 className="text-base font-bold text-[#1A1A1A]">
            Daftar Siswa & Persentase Membaca ({formatClassName(currentClass?.name || userClass)})
          </h3>
          <p className="text-xs text-[#5C6B64] mt-0.5">
            Menampilkan {filteredStudents.length} dari {students.length} siswa di kelas binaan Anda
          </p>
        </div>

        {/* Toolbar Pencarian & Filter Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-50">
            <input
              type="text"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              placeholder="Cari nama siswa..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-[#1A1A1A] placeholder-[#5C6B64]/60 focus:outline-none focus:border-[#39BF81]"
            />
            <svg className="w-3.5 h-3.5 text-[#5C6B64] absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center bg-[#F8FAF9] p-0.5 rounded-xl border border-[#D8E6DE] text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === "all" ? "bg-white text-[#369D6D] shadow-2xs" : "text-[#5C6B64] hover:text-[#1A1A1A]"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("sangat-aktif")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === "sangat-aktif" ? "bg-white text-[#369D6D] shadow-2xs" : "text-[#5C6B64] hover:text-[#1A1A1A]"
              }`}
            >
              Sangat Aktif
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("cukup-aktif")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === "cukup-aktif" ? "bg-white text-[#369D6D] shadow-2xs" : "text-[#5C6B64] hover:text-[#1A1A1A]"
              }`}
            >
              Cukup Aktif
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("belum-membaca")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === "belum-membaca" ? "bg-white text-[#369D6D] shadow-2xs" : "text-[#5C6B64] hover:text-[#1A1A1A]"
              }`}
            >
              Belum
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#D8E6DE] text-[11px] font-bold text-[#5C6B64] uppercase tracking-wider">
              <th className="py-3 px-3">Nama Siswa</th>
              <th className="py-3 px-3 text-center">Buku Terbaca</th>
              <th className="py-3 px-3">Persentase Membaca</th>
              <th className="py-3 px-3 text-center">Durasi Total</th>
              <th className="py-3 px-3 text-center">Status Keaktifan</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8E6DE]/60 text-xs">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#5C6B64]">
                  Tidak ada siswa yang sesuai dengan filter pencarian di kelas ini.
                </td>
              </tr>
            ) : (
              filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-[#F8FAF9]/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        src={st.avatar}
                        name={st.name}
                        size="md"
                        shape="rounded-xl"
                        className="w-9 h-9"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-[#1A1A1A] truncate">{st.name}</p>
                        <p className="text-[11px] text-[#5C6B64] truncate">{st.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center font-bold text-[#1A1A1A]">
                    {st.books_count > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[#39BF81]">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>{st.books_count} Judul</span>
                      </span>
                    ) : (
                      <span className="text-[#5C6B64]">—</span>
                    )}
                  </td>

                  <td className="py-3 px-3 min-w-45">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-[#39BF81]">{st.avg_progress_percent}% Selesai</span>
                        <span className="text-[#5C6B64] font-medium">{st.books_count} Buku</span>
                      </div>
                      <div className="w-full bg-[#E7F3EC] rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            st.avg_progress_percent >= 80
                              ? "bg-[#369D6D]"
                              : st.avg_progress_percent >= 40
                              ? "bg-emerald-500"
                              : st.avg_progress_percent > 0
                              ? "bg-amber-500"
                              : "bg-slate-200"
                          }`}
                          style={{ width: `${Math.max(4, st.avg_progress_percent)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center font-bold text-[#1A1A1A]">
                    {st.total_duration_minutes > 0 ? `${st.total_duration_minutes} menit` : "—"}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        st.status === "Sangat Aktif"
                          ? "bg-emerald-100 text-[#369D6D] border border-emerald-300"
                          : st.status === "Cukup Aktif"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-[#5C6B64] border border-slate-200"
                      }`}
                    >
                      {st.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectStudent(st)}
                      className="px-3 py-1.5 bg-[#F8FAF9] hover:bg-[#E7F3EC] text-[#369D6D] hover:text-[#107a55] border border-[#D8E6DE] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Halaman Rincian
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
