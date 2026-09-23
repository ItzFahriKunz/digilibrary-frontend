import { useState } from "react";
import StudentDetailNav from "./student-detail/StudentDetailNav";
import StudentDetailBanner from "./student-detail/StudentDetailBanner";
import StudentDetailMetrics from "./student-detail/StudentDetailMetrics";
import StudentDetailBookList from "./student-detail/StudentDetailBookList";

export default function StudentReadingDetailPage({
  student,
  currentClass,
  userClass,
  onBack,
  allStudents = [],
  onSelectOtherStudent,
}) {
  const [filterType, setFilterType] = useState("all");
  const [searchBook, setSearchBook] = useState("");

  if (!student) return null;

  const books = student.books || [];
  const completedBooks = books.filter((b) => Number(b.progress_percent) >= 100);
  const inProgressBooks = books.filter((b) => Number(b.progress_percent) < 100);

  // Filter buku yang ditampilkan
  const displayedBooks = books.filter((b) => {
    const matchSearch =
      b.judul?.toLowerCase().includes(searchBook.toLowerCase()) ||
      b.penulis?.toLowerCase().includes(searchBook.toLowerCase());
    const matchFilter =
      filterType === "all" ||
      (filterType === "completed" && Number(b.progress_percent) >= 100) ||
      (filterType === "reading" && Number(b.progress_percent) < 100);
    return matchSearch && matchFilter;
  });

  const formatClassName = (val) => {
    if (!val) return "";
    return `Kelas ${val.replace(/^Kelas\s+/i, "").trim()}`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return "Belum ada riwayat";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* 1. Top Bar Navigasi & Kembali */}
      <StudentDetailNav
        currentClass={currentClass}
        userClass={userClass}
        student={student}
        allStudents={allStudents}
        onBack={onBack}
        onSelectOtherStudent={onSelectOtherStudent}
        formatClassName={formatClassName}
      />

      {/* 2. Banner Profil Siswa */}
      <StudentDetailBanner
        student={student}
        currentClass={currentClass}
        userClass={userClass}
        allStudents={allStudents}
        formatClassName={formatClassName}
      />

      {/* 3. Kartu Ringkasan Metrik Siswa */}
      <StudentDetailMetrics
        student={student}
        completedBooks={completedBooks}
        formatDate={formatDate}
      />

      {/* 4. Bagian Daftar Lengkap Buku yang Dibaca */}
      <StudentDetailBookList
        displayedBooks={displayedBooks}
        books={books}
        completedBooks={completedBooks}
        inProgressBooks={inProgressBooks}
        searchBook={searchBook}
        setSearchBook={setSearchBook}
        filterType={filterType}
        setFilterType={setFilterType}
        formatDate={formatDate}
      />

      {/* 5. Bottom Navigation Bar */}
      <div className="pt-2 flex justify-start">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 rounded-2xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Pemantauan {formatClassName(currentClass?.name || userClass)}</span>
        </button>
      </div>
    </div>
  );
}
