import { useState, useEffect, useRef } from "react";
import { bookService } from "../../services";
import CustomSelect from "../ui/CustomSelect";

// Helper normalisasi URL Cover Buku
function getBookCoverUrl(url) {
  if (!url) return null;
  const strUrl = String(url).trim();
  if (
    strUrl.startsWith("http://") ||
    strUrl.startsWith("https://") ||
    strUrl.startsWith("data:") ||
    strUrl.startsWith("blob:")
  ) {
    return strUrl;
  }
  const cleanPath = strUrl.startsWith("/") ? strUrl : `/${strUrl}`;
  return `http://127.0.0.1:8000${cleanPath}`;
}

export default function AdminBookDetailView({
  bookId,
  initialBookData,
  categories = [],
  onBack,
  onBookSaved,
  onBookDeleted,
  onPreviewBook,
}) {
  const isEdit = Boolean(bookId || initialBookData?.id);
  const [book, setBook] = useState(initialBookData || null);
  const [loading, setLoading] = useState(isEdit && !initialBookData);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [coverImgError, setCoverImgError] = useState(false);

  // Form Fields
  const [judul, setJudul] = useState(initialBookData?.judul || "");
  const [penulis, setPenulis] = useState(initialBookData?.penulis || "");
  const [penerbit, setPenerbit] = useState(
    initialBookData?.penerbit || "Pusat Perbukuan Kemendikdasmen"
  );
  const [categoryId, setCategoryId] = useState(
    initialBookData?.category_id || categories[0]?.id || ""
  );
  const [jenjang, setJenjang] = useState(initialBookData?.jenjang || "SD Kelas 4 (Fase B)");
  const [tingkatKelas, setTingkatKelas] = useState(initialBookData?.tingkat_kelas || 4);
  const [deskripsi, setDeskripsi] = useState(initialBookData?.deskripsi || "");

  // Cover Image (Manual File Upload)
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(
    initialBookData?.cover_path || initialBookData?.cover || ""
  );
  const coverInputRef = useRef(null);

  // PDF Access (Upload File or Link URL)
  const [pdfSourceMode, setPdfSourceMode] = useState(
    initialBookData?.file_path && initialBookData.file_path.startsWith("http") ? "url" : "file"
  );
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(initialBookData?.file_path || "");
  const [detectedPdfPages, setDetectedPdfPages] = useState(null);
  const pdfInputRef = useRef(null);

  // Sync state when initialBookData changes to another book (React state adjustment pattern)
  const [prevBookId, setPrevBookId] = useState(initialBookData?.id);
  if (initialBookData && initialBookData.id !== prevBookId) {
    setPrevBookId(initialBookData.id);
    setBook(initialBookData);
    setJudul(initialBookData.judul || "");
    setPenulis(initialBookData.penulis || "");
    setPenerbit(initialBookData.penerbit || "Pusat Perbukuan Kemendikdasmen");
    setCategoryId(initialBookData.category_id || categories[0]?.id || "");
    setJenjang(initialBookData.jenjang || "SD Kelas 4 (Fase B)");
    setTingkatKelas(initialBookData.tingkat_kelas || 4);
    setDeskripsi(initialBookData.deskripsi || "");
    setCoverPreviewUrl(initialBookData.cover_path || initialBookData.cover || "");
    setCoverImgError(false);
    setPdfUrl(initialBookData.file_path || "");
    setPdfSourceMode(initialBookData.file_path && initialBookData.file_path.startsWith("http") ? "url" : "file");
  }

  const fetchBookDetail = async (id) => {
    setLoading(true);
    setError("");
    try {
      const res = await bookService.getBookDetail(id);
      if (res.data?.status === "success") {
        const b = res.data.data;
        setBook(b);
        setJudul(b.judul || "");
        setPenulis(b.penulis || "");
        setPenerbit(b.penerbit || "Pusat Perbukuan Kemendikdasmen");
        setCategoryId(b.category_id || categories[0]?.id || "");
        setJenjang(b.jenjang || "SD Kelas 4 (Fase B)");
        setTingkatKelas(b.tingkat_kelas || 4);
        setDeskripsi(b.deskripsi || "");
        setCoverPreviewUrl(b.cover_path || "");
        setPdfUrl(b.file_path || "");
        if (b.file_path && b.file_path.startsWith("http")) {
          setPdfSourceMode("url");
        } else {
          setPdfSourceMode("file");
        }
      }
    } catch (err) {
      console.error("Fetch Book Detail Error:", err);
      setError("Gagal memuat detail data buku.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId && !initialBookData) {
      fetchBookDetail(bookId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, initialBookData]);

  // Handle Cover File Selection
  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const objUrl = URL.createObjectURL(file);
      setCoverPreviewUrl(objUrl);
    }
  };

  // Handle PDF File Selection & Automatic Page Detection
  const handlePdfFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFile(file);
    setDetectedPdfPages(null);

    // Try automatic page detection using client-side pdfjsLib if available
    try {
      if (typeof window !== "undefined" && window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const buffer = await file.arrayBuffer();
        const doc = await window.pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
        if (doc && doc.numPages) {
          setDetectedPdfPages(doc.numPages);
        }
      }
    } catch (err) {
      console.warn("Auto-detecting PDF page count:", err);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("judul", judul.trim());
      formDataToSend.append("penulis", penulis.trim());
      formDataToSend.append("penerbit", penerbit.trim() || "Pusat Perbukuan Kemendikdasmen");
      formDataToSend.append("category_id", categoryId);
      formDataToSend.append("jenjang", jenjang.trim());
      formDataToSend.append("tingkat_kelas", tingkatKelas);
      formDataToSend.append("deskripsi", deskripsi.trim());

      // Auto-detect or default total_halaman & rating (removed from user inputs)
      const pageCount = detectedPdfPages || book?.total_halaman || 36;
      formDataToSend.append("total_halaman", pageCount);
      formDataToSend.append("rating", book?.rating || 5.0);

      // Manual Cover File Upload
      if (coverFile) {
        formDataToSend.append("cover_file", coverFile);
      } else if (coverPreviewUrl && !coverPreviewUrl.startsWith("blob:")) {
        formDataToSend.append("cover_path", coverPreviewUrl);
      }

      // PDF File or Link URL
      if (pdfSourceMode === "file" && pdfFile) {
        formDataToSend.append("pdf_file", pdfFile);
      } else if (pdfSourceMode === "url" && pdfUrl.trim()) {
        formDataToSend.append("file_path", pdfUrl.trim());
      } else if (book?.file_path) {
        formDataToSend.append("file_path", book.file_path);
      }

      if (isEdit) {
        formDataToSend.append("_method", "PUT");
        const res = await bookService.updateBook(book?.id || bookId, formDataToSend);
        if (res.data?.status === "success") {
          setSuccessMsg(`Buku "${judul}" berhasil diperbarui.`);
          if (onBookSaved) onBookSaved(res.data.data);
        }
      } else {
        const res = await bookService.createBook(formDataToSend);
        if (res.data?.status === "success") {
          setSuccessMsg(`Buku baru "${judul}" berhasil ditambahkan ke katalog.`);
          if (onBookSaved) onBookSaved(res.data.data);
        }
      }
    } catch (err) {
      console.error("Save Book Error:", err);
      setError(err.response?.data?.message || "Gagal menyimpan perubahan data buku.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    const currentId = book?.id || bookId;
    if (!currentId) return;
    if (!window.confirm(`Apakah Anda yakin ingin menghapus buku "${judul || book?.judul}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setDeleting(true);
    setError("");
    try {
      const res = await bookService.deleteBook(currentId);
      if (res.data?.status === "success") {
        if (onBookDeleted) {
          onBookDeleted(currentId, judul || book?.judul);
        }
        onBack();
      }
    } catch (err) {
      console.error("Delete Book Error:", err);
      setError(err.response?.data?.message || "Gagal menghapus buku.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-[#39BF81] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#5C6B64] font-medium">Memuat rincian buku...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Top Breadcrumb */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C6B64] hover:text-[#39BF81] transition-colors cursor-pointer group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Katalog Buku</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#39BF81] text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg("")}
            className="text-[#39BF81] font-bold text-xs hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {error && (
        <div className="px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-rose-600 font-bold text-xs hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl border border-[#D8E6DE] p-5 sm:p-7 shadow-xs space-y-6">
        {/* Card Header */}
        <div className="text-center border-b border-[#D8E6DE] pb-4">
          <h2 className="text-base font-bold text-[#1A1A1A]">
            {isEdit ? "Detail & Edit Buku" : "Tambah Buku Baru"}
          </h2>
          <p className="text-xs text-[#5C6B64] mt-0.5">
            Katalog SIBI Kemendikdasmen | Kurikulum Merdeka
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cover Showcase: Manual Image Upload */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAF9] border border-[#D8E6DE] flex flex-col sm:flex-row items-center gap-5">
            {/* Cover Preview */}
            <div className="w-28 h-38 sm:w-32 sm:h-44 rounded-xl overflow-hidden border-2 border-[#D8E6DE] bg-slate-100 shadow-sm shrink-0 flex items-center justify-center">
              {coverPreviewUrl && !coverImgError ? (
                <img
                  src={getBookCoverUrl(coverPreviewUrl)}
                  alt={judul || "Sampul Buku"}
                  onError={() => setCoverImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-3 space-y-1 text-[#5C6B64]">
                  <svg className="w-8 h-8 mx-auto opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] block leading-tight">Belum ada sampul</span>
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="space-y-2.5 text-center sm:text-left flex-1 min-w-0">
              <div>
                <h3 className="text-xs font-bold text-[#1A1A1A]">Sampul Buku (Gambar)</h3>
                <p className="text-[11px] text-[#5C6B64] mt-0.5">
                  Unggah file gambar sampul buku langsung dari perangkat Anda.
                </p>
              </div>

              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverChange}
                className="hidden"
              />

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-[#E7F3EC] hover:bg-[#d5ebd0] text-[#369D6D] text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 border border-[#D8E6DE]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>{coverPreviewUrl ? "Ganti File Sampul" : "Pilih File Sampul"}</span>
                </button>

                {coverFile && (
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D8E6DE] text-[11px] text-[#39BF81] font-semibold truncate max-w-50">
                    ✓ {coverFile.name} ({(coverFile.size / 1024).toFixed(0)} KB)
                  </span>
                )}
              </div>

              <p className="text-[10px] text-[#5C6B64]">
                Format yang didukung: <strong>JPG, PNG, WebP</strong> (Disarankan rasio 3:4).
              </p>
            </div>
          </div>

          {/* Judul Buku */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Judul Buku <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Matematika untuk SD/MI Kelas 4"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:bg-white transition-all"
            />
          </div>

          {/* Penulis & Penerbit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Penulis <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Nama penulis atau penyusun"
                value={penulis}
                onChange={(e) => setPenulis(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Penerbit
              </label>
              <input
                type="text"
                placeholder="Contoh: Pusat Perbukuan Kemendikdasmen"
                value={penerbit}
                onChange={(e) => setPenerbit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Kategori & Jenjang */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Kategori <span className="text-rose-500">*</span>
              </label>
              <CustomSelect
                value={categoryId}
                onChange={(val) => setCategoryId(val)}
                options={categories.map((c) => ({ value: c.id, label: c.nama }))}
                className="w-full"
                fullWidthMenu={true}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Jenjang <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: SD Kelas 4 (Fase B)"
                value={jenjang}
                onChange={(e) => setJenjang(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Tingkat Kelas */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Tingkat Kelas <span className="text-rose-500">*</span>
            </label>
            <CustomSelect
              value={tingkatKelas}
              onChange={(val) => setTingkatKelas(parseInt(val) || 1)}
              options={[
                { value: 1, label: "Kelas 1 SD (Fase A)" },
                { value: 2, label: "Kelas 2 SD (Fase A)" },
                { value: 3, label: "Kelas 3 SD (Fase B)" },
                { value: 4, label: "Kelas 4 SD (Fase B)" },
                { value: 5, label: "Kelas 5 SD (Fase C)" },
                { value: 6, label: "Kelas 6 SD (Fase C)" },
              ]}
              className="w-full"
              fullWidthMenu={true}
            />
          </div>

          {/* File PDF Asli: Upload File ATAU Tautan Link */}
          <div className="p-4 rounded-2xl bg-[#E7F3EC]/40 border border-[#D8E6DE] space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#39BF81]">
                Akses Berkas PDF Buku
              </label>
              {/* Option Selector: File vs Link */}
              <div className="flex items-center bg-white border border-[#D8E6DE] rounded-lg p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPdfSourceMode("file")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${pdfSourceMode === "file"
                      ? "bg-[#369D6D] text-white shadow-xs"
                      : "text-[#5C6B64] hover:text-[#1A1A1A]"
                    }`}
                >
                  Unggah Berkas (.pdf)
                </button>
                <button
                  type="button"
                  onClick={() => setPdfSourceMode("url")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${pdfSourceMode === "url"
                      ? "bg-[#369D6D] text-white shadow-xs"
                      : "text-[#5C6B64] hover:text-[#1A1A1A]"
                    }`}
                >
                  Tautan Link URL
                </button>
              </div>
            </div>

            {/* Mode 1: File Upload */}
            {pdfSourceMode === "file" && (
              <div className="space-y-2">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfFileChange}
                  className="hidden"
                />
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{pdfFile ? "Ganti File PDF" : "Pilih File PDF"}</span>
                  </button>

                  <span className="text-xs text-[#5C6B64] truncate">
                    {pdfFile
                      ? `${pdfFile.name} (${(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)`
                      : book?.file_path && !book.file_path.startsWith("http")
                        ? "Berkas PDF saat ini telah terpasang di sistem."
                        : "Belum ada berkas PDF yang dipilih."}
                  </span>
                </div>

                {detectedPdfPages && (
                  <p className="text-[11px] text-[#39BF81] font-semibold flex items-center gap-1">
                    <span>✓ Terbaca: Berkas PDF memiliki {detectedPdfPages} halaman.</span>
                  </p>
                )}
              </div>
            )}

            {/* Mode 2: Link URL */}
            {pdfSourceMode === "url" && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://domain.sch.id/buku-matematika-kelas4.pdf"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81]"
                  />
                  {pdfUrl && (
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-2 rounded-xl bg-white border border-[#D8E6DE] text-[#5C6B64] hover:text-[#39BF81] text-xs font-semibold"
                      title="Buka Tautan"
                    >
                      Buka Link ↗
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Deskripsi / Sinopsis */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Deskripsi / Sinopsis Materi
            </label>
            <textarea
              rows="3"
              placeholder="Ringkasan materi, capaian pembelajaran, atau kata pengantar buku..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] focus:bg-white transition-all resize-y"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#D8E6DE]">
            <div>
              {isEdit && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {deleting ? "Menghapus..." : "Hapus Buku"}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {isEdit && (book?.file_path || pdfUrl) && onPreviewBook && (
                <button
                  type="button"
                  onClick={() => onPreviewBook(book || initialBookData)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#E7F3EC] text-[#5C6B64] hover:text-[#39BF81] text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Pratinjau Baca</span>
                </button>
              )}

              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5C6B64] text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>{isEdit ? "Simpan Perubahan" : "Tambahkan Buku"}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
