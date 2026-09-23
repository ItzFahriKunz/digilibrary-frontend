import CustomSelect from "../ui/CustomSelect";

export default function AdminBookModal({
  isOpen,
  onClose,
  editingBook,
  bookFormData,
  setBookFormData,
  categories,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#D8E6DE] space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#D8E6DE] pb-4">
          <div>
            <h3 className="text-base font-bold text-[#1A1A1A]">
              {editingBook ? "Edit Data Buku" : "Tambah Buku Baru"}
            </h3>
            <p className="text-[11px] text-[#5C6B64]">Katalog SIBI Kemendikdasmen</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-[#5C6B64] cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Judul Buku</label>
            <input
              type="text"
              required
              placeholder="Contoh: Matematika untuk SD/MI Kelas 2"
              value={bookFormData.judul}
              onChange={(e) => setBookFormData({ ...bookFormData, judul: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Penulis</label>
              <input
                type="text"
                required
                placeholder="Nama penulis"
                value={bookFormData.penulis}
                onChange={(e) => setBookFormData({ ...bookFormData, penulis: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Penerbit</label>
              <input
                type="text"
                placeholder="Pusat Perbukuan Kemendikdasmen"
                value={bookFormData.penerbit || ""}
                onChange={(e) => setBookFormData({ ...bookFormData, penerbit: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Kategori</label>
              <CustomSelect
                value={bookFormData.category_id}
                onChange={(val) => setBookFormData({ ...bookFormData, category_id: val })}
                options={categories.map((c) => ({ value: c.id, label: c.nama }))}
                className="w-full"
                fullWidthMenu={true}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Jenjang</label>
              <input
                type="text"
                required
                placeholder="SD Kelas 4 (Fase B)"
                value={bookFormData.jenjang}
                onChange={(e) => setBookFormData({ ...bookFormData, jenjang: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Tingkat Kelas (1-6)</label>
            <input
              type="number"
              min="1"
              max="6"
              placeholder="1-6"
              value={bookFormData.tingkat_kelas}
              onChange={(e) => setBookFormData({ ...bookFormData, tingkat_kelas: parseInt(e.target.value) || 1 })}
              className="w-full px-3.5 py-2 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81]"
            />
          </div>

          {/* Unggah File PDF Asli */}
          <div className="p-3.5 rounded-2xl bg-[#E7F3EC]/50 border border-[#D8E6DE] space-y-2">
            <label className="block text-xs font-bold text-[#39BF81]">
              File PDF Asli (.pdf)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setBookFormData({ ...bookFormData, pdf_file: e.target.files[0] })}
                className="w-full text-xs text-[#5C6B64] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#369D6D] file:text-white hover:file:bg-[#107a55] file:cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#5C6B64]">atau URL PDF:</span>
              <input
                type="url"
                placeholder="https://.../buku.pdf"
                value={bookFormData.file_path}
                onChange={(e) => setBookFormData({ ...bookFormData, file_path: e.target.value })}
                className="flex-1 px-2.5 py-1 bg-white border border-[#D8E6DE] rounded-lg text-[11px] text-[#1A1A1A] focus:outline-none focus:border-[#39BF81]"
              />
            </div>
            {bookFormData.pdf_file && (
              <p className="text-[10px] text-[#39BF81] font-semibold">
                File terpilih: {bookFormData.pdf_file.name} ({(bookFormData.pdf_file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Unggah Cover Buku */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1A1A1A]">Cover Buku (Gambar)</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBookFormData({ ...bookFormData, cover_file: e.target.files[0] })}
                className="w-full text-xs text-[#5C6B64] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-[#1A1A1A] hover:file:bg-slate-200 file:cursor-pointer"
              />
            </div>
            <input
              type="url"
              placeholder="Atau masukkan URL Cover https://..."
              value={bookFormData.cover_path}
              onChange={(e) => setBookFormData({ ...bookFormData, cover_path: e.target.value })}
              className="w-full px-3.5 py-1.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Total Halaman</label>
              <input
                type="number"
                min="1"
                placeholder="36"
                value={bookFormData.total_halaman}
                onChange={(e) => setBookFormData({ ...bookFormData, total_halaman: parseInt(e.target.value) || 36 })}
                className="w-full px-3.5 py-2 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Rating Awal</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                placeholder="5.0"
                value={bookFormData.rating}
                onChange={(e) => setBookFormData({ ...bookFormData, rating: parseFloat(e.target.value) || 5.0 })}
                className="w-full px-3.5 py-2 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Deskripsi / Sinopsis</label>
            <textarea
              rows="3"
              placeholder="Ringkasan materi atau sinopsis..."
              value={bookFormData.deskripsi}
              onChange={(e) => setBookFormData({ ...bookFormData, deskripsi: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D8E6DE]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5C6B64] text-xs font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              {editingBook ? "Simpan Perubahan" : "Tambahkan Buku"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
