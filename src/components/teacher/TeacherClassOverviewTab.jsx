import { useState, useEffect, useCallback } from "react";
import { teacherService } from "../../services";

// Modular Sub-components
import TeacherHeaderBanner from "./TeacherHeaderBanner";
import TeacherClassSelector from "./TeacherClassSelector";
import TeacherStatsMetrics from "./TeacherStatsMetrics";
import TeacherLeaderboard from "./TeacherLeaderboard";
import TeacherStudentTable from "./TeacherStudentTable";
import StudentReadingDetailPage from "./StudentReadingDetailPage";

export default function TeacherClassOverviewTab({ user }) {
  const isAdmin = user?.role === "admin";
  const teacherRawClass = user?.kelas || "";
  const isUnassigned =
    !teacherRawClass ||
    ["none", "tidak ada", "belum ditugaskan", "-", ""].includes(
      String(teacherRawClass).trim().toLowerCase()
    );

  const teacherClassCode = isUnassigned
    ? ""
    : user.kelas.replace(/^Kelas\s+/i, "").trim().toUpperCase();

  const formatClassName = (val) => {
    if (!val) return "Belum Ditugaskan";
    const str = String(val).trim();
    if (["none", "tidak ada", "belum ditugaskan", "-", ""].includes(str.toLowerCase())) {
      return "Belum Ditugaskan";
    }
    return `Kelas ${str.replace(/^Kelas\s+/i, "").trim()}`;
  };

  // Untuk Admin: bisa memilih kelas dari 24 kelas
  // Untuk Guru: hanya melihat kelas binaannya sendiri!
  const [selectedGrade, setSelectedGrade] = useState(() => {
    if (teacherClassCode) {
      const match = teacherClassCode.match(/\d/);
      return match ? parseInt(match[0], 10) : 4;
    }
    return 4;
  });

  const [selectedClassCode, setSelectedClassCode] = useState(() => {
    if (!isAdmin && teacherClassCode) {
      return teacherClassCode;
    }
    return teacherClassCode || "4A";
  });

  // Data states
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!isUnassigned);
  const [error, setError] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Halaman detail buku yang dibaca siswa (Dedicated full page view)
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);

  // Pastikan akun guru SELALU terkunci pada kelas binaannya sendiri jika prop berubah
  const [prevTeacherClass, setPrevTeacherClass] = useState(teacherClassCode);
  if (!isAdmin && teacherClassCode && teacherClassCode !== prevTeacherClass) {
    setPrevTeacherClass(teacherClassCode);
    setSelectedClassCode(teacherClassCode);
    const match = teacherClassCode.match(/\d/);
    if (match) {
      setSelectedGrade(parseInt(match[0], 10));
    }
  }

  const fetchClassOverview = useCallback(async (classCode) => {
    if (!isAdmin && isUnassigned) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const targetClass = !isAdmin ? teacherClassCode : classCode;
      const res = await teacherService.getClassOverview(targetClass);
      if (res.data?.status === "success") {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Gagal memuat data kelas:", err);
      setError("Gagal memuat data pemantauan kelas. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isUnassigned, teacherClassCode]);

  useEffect(() => {
    if (!isAdmin && isUnassigned) {
      setLoading(false);
      return;
    }
    const classToFetch = !isAdmin ? teacherClassCode : selectedClassCode;
    if (classToFetch) {
      fetchClassOverview(classToFetch);
    }
  }, [selectedClassCode, teacherClassCode, isAdmin, isUnassigned, fetchClassOverview]);

  const handleSelectGrade = (grade) => {
    if (!isAdmin) return; // Hanya admin yang boleh ganti kelas
    setSelectedGrade(grade);
    const newClassCode = `${grade}${selectedClassCode.charAt(1) || "A"}`;
    setSelectedClassCode(newClassCode);
  };

  const handleSelectSub = (sub) => {
    if (!isAdmin) return; // Hanya admin yang boleh ganti kelas
    const newClassCode = `${selectedGrade}${sub}`;
    setSelectedClassCode(newClassCode);
  };

  const currentClass = data?.current_class;
  const stats = data?.stats;
  const leaderboard = data?.leaderboard || [];
  const students = data?.students || [];
  const classesSummary = data?.classes_summary || [];

  // Jika akun guru belum ditugaskan kelas binaan (Status: None / Belum Ditugaskan)
  if (!isAdmin && (isUnassigned || data?.has_assigned_class === false)) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 my-6 animate-fadeIn">
        {/* Placeholder Card Utama */}
        <div className="bg-white rounded-3xl border border-[#D8E6DE] p-6 sm:p-10 text-center space-y-5 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Status Akun: Belum Ditugaskan (None)</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-[#E7F3EC] text-[#39BF81] flex items-center justify-center mx-auto shadow-2xs">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">
              Belum Ada Penugasan Kelas Binaan
            </h3>
            <p className="text-xs sm:text-sm text-[#5C6B64] leading-relaxed">
              Halo <strong>{user?.name || "Bpk/Ibu Guru"}</strong>, akun Anda telah terdaftar sebagai Guru (Wali Kelas) namun saat ini belum memiliki penugasan kelas binaan.
            </p>
            <p className="text-xs text-[#5C6B64] leading-relaxed bg-[#F8FAF9] p-3 rounded-xl border border-[#D8E6DE]">
              💡 <strong>Aturan Kelas:</strong> Setiap guru hanya berhak mengakses 1 kelas binaan dan 1 kelas hanya dapat dibina oleh 1 orang wali kelas agar data tidak bertabrakan. Silakan hubungi <strong>Administrator</strong> untuk penetapan kelas Anda.
            </p>
          </div>
        </div>

        {/* Kartu Pratinjau Fitur (Saat Sudah Ditugaskan) */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 opacity-80">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Fitur yang akan terbuka setelah kelas ditetapkan:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <div className="text-base">👥</div>
              <p className="text-xs font-bold text-slate-800">Daftar Siswa</p>
              <p className="text-[11px] text-slate-500">Pantau seluruh siswa & log baca kelas binaan Anda.</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <div className="text-base">🏆</div>
              <p className="text-xs font-bold text-slate-800">Leaderboard</p>
              <p className="text-[11px] text-slate-500">Peringkat siswa paling gemar membaca buku.</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <div className="text-base">📊</div>
              <p className="text-xs font-bold text-slate-800">Progres Literasi</p>
              <p className="text-[11px] text-slate-500">Persentase tuntas dan durasi baca per siswa.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Jika sedang membuka rincian buku siswa tertentu -> Tampilkan Halaman Penuh Detail Siswa
  if (selectedStudentDetail) {
    return (
      <StudentReadingDetailPage
        student={selectedStudentDetail}
        currentClass={currentClass}
        userClass={user?.kelas}
        onBack={() => setSelectedStudentDetail(null)}
        allStudents={students}
        onSelectOtherStudent={(st) => setSelectedStudentDetail(st)}
      />
    );
  }

  // Filter siswa berdasarkan pencarian & status
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.email.toLowerCase().includes(searchStudent.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "sangat-aktif" && s.status === "Sangat Aktif") ||
      (statusFilter === "cukup-aktif" && s.status === "Cukup Aktif") ||
      (statusFilter === "belum-membaca" && s.status === "Belum Membaca");
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header Banner (Solid Forest Green - NO GRADIENT) */}
      <TeacherHeaderBanner
        isAdmin={isAdmin}
        selectedClassCode={selectedClassCode}
        currentClass={currentClass}
        user={user}
        formatClassName={formatClassName}
      />

      {/* 2. Selektor 24 Kelas — HANYA TAMPIL UNTUK ADMIN! */}
      {isAdmin && (
        <TeacherClassSelector
          selectedGrade={selectedGrade}
          selectedClassCode={selectedClassCode}
          classesSummary={classesSummary}
          onSelectGrade={handleSelectGrade}
          onSelectSub={handleSelectSub}
          formatClassName={formatClassName}
        />
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-[#D8E6DE] p-12 text-center space-y-3 shadow-xs">
          <div className="w-10 h-10 mx-auto rounded-xl bg-[#369D6D] flex items-center justify-center text-white animate-pulse">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-xs text-[#5C6B64] font-medium">Memuat data kelas...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-700 text-xs font-semibold">
          {error}
        </div>
      ) : (
        <>
          {/* 3. Kartu Metrik Ringkasan Kelas */}
          <TeacherStatsMetrics stats={stats} />

          {/* 4. Leaderboard: Siswa Paling Gemar Membaca */}
          <TeacherLeaderboard
            leaderboard={leaderboard}
            currentClass={currentClass}
            userClass={user?.kelas}
            formatClassName={formatClassName}
            onSelectStudent={(st) => setSelectedStudentDetail(st)}
          />

          {/* 5. Tabel Seluruh Siswa di Kelas Ini */}
          <TeacherStudentTable
            students={students}
            filteredStudents={filteredStudents}
            currentClass={currentClass}
            userClass={user?.kelas}
            formatClassName={formatClassName}
            searchStudent={searchStudent}
            setSearchStudent={setSearchStudent}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onSelectStudent={(st) => setSelectedStudentDetail(st)}
          />
        </>
      )}
    </div>
  );
}
