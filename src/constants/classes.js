/**
 * Standar 24 Kelas Sekolah Dasar Digilibrary (Kelas 1 - 6, Sub-kelas A, B, C, D)
 */

export const CLASS_GRADES = [1, 2, 3, 4, 5, 6];
export const SUB_CLASSES = ["A", "B", "C", "D"];

// 24 Kelas terstandarisasi:
// ['1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '3D', '4A', '4B', '4C', '4D', '5A', '5B', '5C', '5D', '6A', '6B', '6C', '6D']
export const ALL_CLASSES = CLASS_GRADES.flatMap((grade) =>
  SUB_CLASSES.map((sub) => `${grade}${sub}`)
);

/**
 * Format string kode kelas menjadi label tampilan yang ramah.
 * Contoh: "4A" -> "Kelas 4A", "Kelas 4A" -> "Kelas 4A", null / "None" -> "Belum Ditugaskan"
 */
export function formatClassName(code) {
  if (!code) return "Belum Ditugaskan";
  const str = String(code).trim();
  if (["none", "tidak ada", "belum ditugaskan", "-", ""].includes(str.toLowerCase())) {
    return "Belum Ditugaskan";
  }
  const clean = str.replace(/^Kelas\s+/i, "").trim().toUpperCase();
  return `Kelas ${clean}`;
}

/**
 * Mengambil hanya kode kelas standar (misal "4A").
 */
export function normalizeClassCode(code) {
  if (!code) return "";
  const str = String(code).trim();
  if (["none", "tidak ada", "belum ditugaskan", "-", ""].includes(str.toLowerCase())) {
    return "";
  }
  return str.replace(/^Kelas\s+/i, "").trim().toUpperCase();
}

/**
 * Pengelompokan 24 kelas berdasarkan jenjang (Tingkat 1 - 6)
 */
export const CLASSES_BY_GRADE = CLASS_GRADES.map((grade) => ({
  grade,
  label: `Kelas ${grade} SD`,
  classes: SUB_CLASSES.map((sub) => ({
    code: `${grade}${sub}`,
    sub,
    label: `Kelas ${grade}${sub}`,
  })),
}));
