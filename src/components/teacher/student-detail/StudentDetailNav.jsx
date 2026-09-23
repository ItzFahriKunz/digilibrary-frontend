import CustomSelect from "../../ui/CustomSelect";

export default function StudentDetailNav({
  currentClass,
  userClass,
  student,
  allStudents = [],
  onBack,
  onSelectOtherStudent,
  formatClassName,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#E7F3EC] text-[#369D6D] hover:text-[#107a55] border border-[#D8E6DE] text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer group w-fit"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Kembali ke Pemantauan {formatClassName(currentClass?.name || userClass)}</span>
      </button>

      {/* Quick Jump Siswa Lain di Kelas yang Sama */}
      {allStudents.length > 1 && onSelectOtherStudent && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#5C6B64] font-medium hidden sm:inline">Pindah Siswa:</span>
          <CustomSelect
            value={student.id}
            onChange={(val) => {
              const target = allStudents.find((s) => String(s.id) === String(val));
              if (target) onSelectOtherStudent(target);
            }}
            options={allStudents.map((s) => ({
              value: s.id,
              label: `${s.name} (${s.books_count} buku)`,
            }))}
            align="right"
          />
        </div>
      )}
    </div>
  );
}
