import { CLASS_GRADES, SUB_CLASSES } from "../../constants/classes";

export default function TeacherClassSelector({
  selectedGrade,
  selectedClassCode,
  classesSummary = [],
  onSelectGrade,
  onSelectSub,
  formatClassName,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#D8E6DE] p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D8E6DE]/60">
        <div>
          <h3 className="text-sm font-bold text-[#1A1A1A]">
            Inspeksi 24 Jajaran Kelas SD (Khusus Admin)
          </h3>
          <p className="text-[11px] text-[#5C6B64] mt-0.5">
            Pilih jenjang kelas 1–6 dan sub-kelas A–D untuk memantau data kelas sekolah
          </p>
        </div>

        <div className="text-[11px] text-[#5C6B64] font-medium">
          Memantau: <strong className="text-[#39BF81] font-bold">{formatClassName(selectedClassCode)}</strong>
        </div>
      </div>

      {/* Tab Jenjang 1 - 6 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CLASS_GRADES.map((grade) => {
          const isSelected = selectedGrade === grade;
          return (
            <button
              key={grade}
              type="button"
              onClick={() => onSelectGrade(grade)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? "bg-[#369D6D] text-white shadow-xs"
                  : "bg-[#F8FAF9] text-[#5C6B64] hover:text-[#1A1A1A] hover:bg-slate-100 border border-[#D8E6DE]"
              }`}
            >
              Tingkat Kelas {grade}
            </button>
          );
        })}
      </div>

      {/* Tombol Sub-kelas A, B, C, D */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {SUB_CLASSES.map((sub) => {
          const code = `${selectedGrade}${sub}`;
          const isCurrent = selectedClassCode === code;
          const classInfo = classesSummary.find((c) => c.code === code);

          return (
            <button
              key={code}
              type="button"
              onClick={() => onSelectSub(sub)}
              className={`relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isCurrent
                  ? "bg-[#E7F3EC] border-[#39BF81] shadow-xs"
                  : "bg-[#F8FAF9] border-[#D8E6DE] hover:bg-white hover:border-[#39BF81]/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm sm:text-base font-bold ${isCurrent ? "text-[#369D6D]" : "text-[#1A1A1A]"}`}>
                  Kelas {code}
                </span>
                {classInfo?.wali_kelas && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-[#369D6D]">
                    Ada Wali
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-[#5C6B64]">
                <span>{classInfo?.total_students || 0} Siswa</span>
                <span className="truncate max-w-22.5" title={classInfo?.wali_kelas || "Belum ada wali"}>
                  {classInfo?.wali_kelas ? classInfo.wali_kelas.split(" ")[0] : "—"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
