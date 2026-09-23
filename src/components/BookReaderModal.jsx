import { useState, useEffect, useRef } from "react";
import { bookService } from "../services";
import api from "../services/api";
import CustomSelect from "./ui/CustomSelect";

export default function BookReaderModal({ book, onClose, currentUser, onProgressUpdate }) {
  // Ambil halaman awal: prioritas dari prop initialPage, lalu localStorage, default 1
  const getInitialPage = () => {
    if (book?.initialPage && Number(book.initialPage) >= 1) {
      return Number(book.initialPage);
    }
    const storageKey = `digilib_progress_${currentUser?.id || "guest"}_${book?.id || book?.slug}`;
    const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.page && Number(parsed.page) >= 1) {
          return Number(parsed.page);
        }
      } catch {
        if (!isNaN(Number(saved)) && Number(saved) >= 1) {
          return Number(saved);
        }
      }
    }
    return 1;
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [showResumeBanner, setShowResumeBanner] = useState(() => getInitialPage() > 1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fitMode, setFitMode] = useState("comfort"); // 'comfort' (lebar nyaman ~880px) | 'fit-width' | 'fit-height'
  const [_isFullscreen, setIsFullscreen] = useState(false);
  const [readingSeconds, setReadingSeconds] = useState(0);
  const [viewMode, setViewMode] = useState("single"); // 'single' | 'spread'
  const [showPageJumper, setShowPageJumper] = useState(false);

  // PDF.js State
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [totalPages, setTotalPages] = useState(book?.total_halaman || 36);

  const mainContainerRef = useRef(null);
  const canvasRefLeft = useRef(null);
  const canvasRefRight = useRef(null);
  const renderTaskLeftRef = useRef(null);
  const renderTaskRightRef = useRef(null);

  const [containerDimensions, setContainerDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight - 140 : 800,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (mainContainerRef.current) {
        setContainerDimensions({
          width: mainContainerRef.current.clientWidth,
          height: mainContainerRef.current.clientHeight,
        });
      } else if (typeof window !== "undefined") {
        setContainerDimensions({
          width: window.innerWidth,
          height: window.innerHeight - 140,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const userName = currentUser?.name || currentUser?.displayName || "Siswa Pembaca";
  const userEmail = currentUser?.email || "siswa@digilibrary.sch.id";
  const logIdRef = useRef(null);

  // URL Stream relatif via proxy Vite agar 100% same-origin tanpa terkena CORS
  const streamUrl = book?.id ? `/api/books/${book.id}/stream` : (
    book?.file_path?.startsWith("http") ? book.file_path : null
  );

  const hasRealPdf = Boolean(book?.file_path && !book.file_path.includes("books/dummy") && (book?.id || book?.file_path?.startsWith("http")));

  // 1. Helper get PDF.js
  const getPdfjsLib = () => {
    if (typeof window !== "undefined" && window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      return window.pdfjsLib;
    }
    return null;
  };

  // 2. Load PDF Document via PDF.js (Fetch ArrayBuffer Langsung)
  useEffect(() => {
    if (!hasRealPdf || !streamUrl) {
      return;
    }

    let isMounted = true;
    setPdfLoading(true);
    setPdfError(null);

    const initPdf = async () => {
      // Pastikan script pdfjs sudah ready di window
      let lib = getPdfjsLib();
      let attempts = 0;
      while (!lib && attempts < 25) {
        await new Promise((r) => setTimeout(r, 100));
        lib = getPdfjsLib();
        attempts++;
      }

      if (!lib) {
        if (isMounted) {
          setPdfError("Library PDF.js belum selesai dimuat.");
          setPdfLoading(false);
        }
        return;
      }

      try {
        // Ambil file PDF langsung via fetch ArrayBuffer (Aman dari isu CORS & cross-origin worker)
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(streamUrl, {
          headers,
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Server merespons ${response.status}: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();

        const loadingTask = lib.getDocument({
          data: new Uint8Array(buffer),
          cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (isMounted) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setPdfLoading(false);
          // Pastikan currentPage tidak melebihi jumlah halaman sebenarnya dari PDF
          setCurrentPage((curr) => Math.min(Math.max(1, curr), doc.numPages));
        }
      } catch (err) {
        console.error("PDF.js load error:", err);
        if (isMounted) {
          setPdfError(err.message || "Gagal memproses file PDF.");
          setPdfLoading(false);
        }
      }
    };

    initPdf();

    return () => {
      isMounted = false;
    };
  }, [hasRealPdf, streamUrl, book?.total_halaman]);

  // 3. Render Canvas Page(s) when currentPage, zoomLevel, viewMode, fitMode, containerDimensions, or pdfDoc changes
  useEffect(() => {
    if (!pdfDoc) return;

    const renderPage = async (pageNumber, canvasRef, taskRef) => {
      if (!canvasRef.current || pageNumber > pdfDoc.numPages || pageNumber < 1) return;

      try {
        if (taskRef.current) {
          try {
            taskRef.current.cancel();
          } catch { }
        }

        const page = await pdfDoc.getPage(pageNumber);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const baseViewport = page.getViewport({ scale: 1.0 });
        const availWidth = Math.max(320, (containerDimensions.width || window.innerWidth) - (window.innerWidth < 640 ? 24 : 80));
        const availHeight = Math.max(300, (containerDimensions.height || window.innerHeight - 140) - 48);

        let baseTargetWidth;
        if (fitMode === "fit-height") {
          // Sesuaikan tinggi agar 1 halaman muat pas vertikal tanpa perlu scroll
          const scaleHeight = availHeight / baseViewport.height;
          let targetW = baseViewport.width * scaleHeight;
          if (viewMode === "spread" && (targetW * 2 + 24) > availWidth) {
            targetW = (availWidth - 24) / 2;
          }
          baseTargetWidth = targetW;
        } else if (fitMode === "fit-width") {
          // Lebar penuh sesuai lebar layar monitor
          baseTargetWidth = viewMode === "spread" ? (availWidth - 32) / 2 : availWidth;
        } else {
          // Mode Nyaman (Default):
          // Di layar Desktop lebar 880px (sangat lega, huruf & tabel besar dan mudah dibaca oleh siswa)
          // Di layar mode 2 halaman (spread), bagi ruang untuk 2 lembar berdampingan
          const maxComfortWidth = viewMode === "spread" ? 640 : 880;
          const effectiveAvailWidth = viewMode === "spread" ? (availWidth - 32) / 2 : availWidth;
          baseTargetWidth = Math.min(effectiveAvailWidth, maxComfortWidth);
        }

        // Terapkan faktor zoom (100% normal, 125%, 150%, 200%, dsb)
        const scale = (baseTargetWidth / baseViewport.width) * (zoomLevel / 100);
        const viewport = page.getViewport({ scale });

        // HiDPI Pixel Ratio (2x) agar teks dokumen/tabel sangat tajam dan tidak pecah
        const pixelRatio = Math.max(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        taskRef.current = renderTask;
        await renderTask.promise;
      } catch (err) {
        if (err?.name !== "RenderingCancelledException") {
          console.error("Canvas render error:", err);
        }
      }
    };

    renderPage(currentPage, canvasRefLeft, renderTaskLeftRef);

    if (viewMode === "spread" && currentPage < pdfDoc.numPages) {
      renderPage(currentPage + 1, canvasRefRight, renderTaskRightRef);
    }
  }, [pdfDoc, currentPage, zoomLevel, viewMode, fitMode, containerDimensions]);

  // Idle tracking & real-time wall-clock timer (Menjamin 1 detik UI = 1 detik waktu nyata)
  const [isIdlePaused, setIsIdlePaused] = useState(false);
  const lastPageTurnTimeRef = useRef(Date.now());
  const lastInteractionRef = useRef(Date.now());
  const lastTickTimeRef = useRef(Date.now());
  const accumulatedSecondsRef = useRef(0);
  const lastSyncedSecondRef = useRef(0);

  // Pantau interaksi nyata & status tab visibility agar waktu membaca akurat
  useEffect(() => {
    lastPageTurnTimeRef.current = Date.now();
    lastInteractionRef.current = Date.now();
    lastTickTimeRef.current = Date.now();

    const recordInteraction = () => {
      lastInteractionRef.current = Date.now();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsIdlePaused(true);
      } else {
        lastTickTimeRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("scroll", recordInteraction, { passive: true });
    window.addEventListener("keydown", recordInteraction, { passive: true });
    window.addEventListener("touchstart", recordInteraction, { passive: true });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("scroll", recordInteraction);
      window.removeEventListener("keydown", recordInteraction);
      window.removeEventListener("touchstart", recordInteraction);
    };
  }, []);

  // Reset timer idle setiap kali pengguna berpindah halaman
  useEffect(() => {
    lastPageTurnTimeRef.current = Date.now();
    lastInteractionRef.current = Date.now();
    setIsIdlePaused(false);
  }, [currentPage]);

  // 4. Initial Tracking: Catat sesi membaca saat buku dibuka dengan halaman awal yang sesuai
  useEffect(() => {
    if (!book?.id) return;

    bookService.trackReading(book.id, {
      platform: "web",
      halaman_terakhir: currentPage,
      durasi_detik: 0,
    })
      .then((res) => {
        if (res.data?.data?.log_id) {
          logIdRef.current = res.data.data.log_id;
        }
      })
      .catch((err) => {
        console.warn("Initial track-read error:", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book?.id]);

  // 4b. Sinkronisasi progress baca ke localStorage & callback dashboard setiap halaman berubah
  useEffect(() => {
    if (!book?.id && !book?.slug) return;
    const storageKey = `digilib_progress_${currentUser?.id || "guest"}_${book?.id || book?.slug}`;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          page: currentPage,
          totalPages: totalPages || book.total_halaman,
          updatedAt: Date.now(),
        })
      );
    } catch { }

    if (onProgressUpdate && book?.id) {
      onProgressUpdate(book.id, currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages, book?.id, book?.slug, currentUser?.id]);

  // Otomatis sembunyikan notifikasi banner "Melanjutkan membaca" setelah 6 detik
  useEffect(() => {
    if (showResumeBanner) {
      const timer = setTimeout(() => {
        setShowResumeBanner(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showResumeBanner]);

  // 5. Timer durasi membaca presisi berbasis wall-clock (Hanya berjalan jika ada aktivitas pindah halaman)
  useEffect(() => {
    lastTickTimeRef.current = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();

      // Jeda jika halaman PDF masih loading, terjadi error, atau tab tidak aktif
      if (pdfLoading || pdfError || (typeof document !== "undefined" && document.hidden)) {
        lastTickTimeRef.current = now;
        return;
      }

      const timeOnCurrentPageMs = now - lastPageTurnTimeRef.current;
      const timeSinceInteractionMs = now - lastInteractionRef.current;

      // Berhenti/jeda mencatat jika:
      // 1. Berada di halaman yang sama > 45 detik tanpa pindah halaman (mencegah manipulasi waktu baca)
      // 2. Tidak ada interaksi apapun > 30 detik
      const MAX_PAGE_STAY_MS = 45000;
      const MAX_IDLE_MS = 30000;

      if (timeOnCurrentPageMs >= MAX_PAGE_STAY_MS || timeSinceInteractionMs >= MAX_IDLE_MS) {
        setIsIdlePaused(true);
        lastTickTimeRef.current = now;
        return;
      }

      setIsIdlePaused(false);

      // Hitung pertambahan waktu nyata (dalam detik) berdasarkan selisih timestamp
      const elapsedSeconds = (now - lastTickTimeRef.current) / 1000;
      lastTickTimeRef.current = now;

      accumulatedSecondsRef.current += elapsedSeconds;
      const currentSeconds = Math.floor(accumulatedSecondsRef.current);

      setReadingSeconds(currentSeconds);

      // Periodic sync ke backend setiap kelipatan 15 detik
      if (
        currentSeconds > 0 &&
        currentSeconds % 15 === 0 &&
        lastSyncedSecondRef.current !== currentSeconds &&
        book?.id
      ) {
        lastSyncedSecondRef.current = currentSeconds;
        bookService.trackReading(book.id, {
          log_id: logIdRef.current,
          platform: "web",
          halaman_terakhir: currentPage,
          durasi_detik: currentSeconds,
        })
          .then((res) => {
            if (res.data?.data?.log_id) {
              logIdRef.current = res.data.data.log_id;
            }
          })
          .catch(() => { });
      }
    }, 500);

    return () => clearInterval(timer);
  }, [book?.id, currentPage, pdfLoading, pdfError]);

  // Preset skala zoom terstandardisasi
  const ZOOM_PRESETS = [50, 75, 100, 125, 150, 175, 200, 250];

  const handleZoomIn = () => {
    setZoomLevel((curr) => {
      const next = ZOOM_PRESETS.find((z) => z > curr);
      return next !== undefined ? next : curr;
    });
  };

  const handleZoomOut = () => {
    setZoomLevel((curr) => {
      const prev = [...ZOOM_PRESETS].reverse().find((z) => z < curr);
      return prev !== undefined ? prev : curr;
    });
  };

  const handleNextPage = () => {
    const step = viewMode === "spread" ? 2 : 1;
    setCurrentPage((prev) => Math.min(totalPages, prev + step));
  };

  const handlePrevPage = () => {
    const step = viewMode === "spread" ? 2 : 1;
    setCurrentPage((prev) => Math.max(1, prev - step));
  };

  const handleCloseModal = () => {
    if (book?.id) {
      bookService.trackReading(book.id, {
        log_id: logIdRef.current,
        platform: "web",
        halaman_terakhir: currentPage,
        durasi_detik: Math.max(1, readingSeconds),
      }).catch(() => { });
    }
    if (onProgressUpdate && book?.id) {
      onProgressUpdate(book.id, currentPage);
    }
    onClose();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
        setIsFullscreen(false);
      }
    }
  };

  // 6. Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === "Escape") {
        handleCloseModal();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      } else if (e.key === "0") {
        setZoomLevel(100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages, viewMode]);

  if (!book) return null;

  const bookTitle = book.judul || book.title || "Buku Kurikulum SD";
  const bookAuthor = book.penulis || book.author || "Pusat Perbukuan Kemendikdasmen";
  const bookCategoryName = book.category?.nama || book.category || "Kurikulum Merdeka SD";
  const bookCoverSrc = book.cover_path || book.cover;
  const bookJenjangName = book.jenjang || "SD";
  const bookPublisherName = book.penerbit || "Pusat Perbukuan Kemendikdasmen";
  const bookDescriptionText = book.deskripsi || book.desc || "Buku ini menyajikan materi kontekstual dengan pendekatan pembelajaran aktif. Siswa diajak untuk mengamati, membaca, menanya, serta merefleksikan materi secara mandiri maupun berkelompok.";

  // Fallback Lembar Simulasi jika belum ada file PDF fisik
  const renderSimulatedPage = (pageNum) => {
    if (pageNum > totalPages) return null;

    if (pageNum === 1) {
      return (
        <div className="h-full flex flex-col items-center justify-between p-8 text-center space-y-4">
          <div className="w-full flex justify-between items-center text-[10px] text-[#5C6B64] font-semibold border-b border-slate-100 pb-2">
            <span className="text-[#39BF81]">{bookCategoryName}</span>
            <span>Sampul Buku</span>
          </div>

          <div className="my-auto space-y-4 max-w-xs">
            <div className="w-48 h-64 mx-auto rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 relative group">
              <img
                src={bookCoverSrc}
                alt={bookTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1A1A] leading-snug">{bookTitle}</h3>
              <p className="text-xs text-[#5C6B64] mt-1">{bookAuthor}</p>
            </div>
            <span className="inline-block text-[10px] font-bold px-3 py-1 rounded-full bg-[#E7F3EC] text-[#39BF81] border border-[#D8E6DE]">
              {bookPublisherName}
            </span>
          </div>

          <div className="w-full text-center text-[10px] text-[#5C6B64] border-t border-slate-100 pt-2">
            Digilibrary E-Reader | Halaman 1
          </div>
        </div>
      );
    }

    const babNum = Math.min(8, Math.ceil(pageNum / 4));
    return (
      <div className="h-full flex flex-col justify-between p-8 text-left space-y-4">
        <div className="flex items-center justify-between text-[11px] text-[#5C6B64] border-b border-slate-100 pb-2.5">
          <span className="font-semibold text-[#39BF81] truncate max-w-55">{bookTitle}</span>
          <span className="font-mono font-bold text-[#1A1A1A]">Hal. {pageNum}</span>
        </div>

        <div className="flex-1 space-y-4 overflow-hidden my-auto">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#39BF81] bg-[#E7F3EC] px-2 py-0.5 rounded border border-[#D8E6DE]">
              Bab {babNum} <span className="inline-block w-px h-2 bg-emerald-600/30 align-middle mx-1.5" /> Bagian {pageNum}
            </span>
            <h4 className="text-base font-bold text-[#1A1A1A] leading-snug">
              Materi & Aktivitas Pembelajaran Literasi Siswa
            </h4>
          </div>

          <p className="text-xs text-[#4A5568] leading-relaxed text-justify">
            {bookDescriptionText}
          </p>

          <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#D8E6DE] space-y-2">
            <h5 className="text-[11px] font-bold text-[#1A1A1A] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39BF81]"></span>
              Capaian Pembelajaran (Fase SD):
            </h5>
            <ul className="text-[11px] text-[#5C6B64] space-y-1 list-disc list-inside">
              <li>Memahami isi teks bacaan dan memperkaya kosakata.</li>
              <li>Menumbuhkan karakter bernalar kritis dan kecintaan membaca.</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#5C6B64] border-t border-slate-100 pt-2">
          <span>Hak Cipta Dilindungi &copy; Kemendikdasmen</span>
          <span className="font-mono">Hal. {pageNum} dari {totalPages}</span>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0B1120]/95 backdrop-blur-md flex flex-col justify-between select-none font-sans"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ================= TOP TOOLBAR ================= */}
      <header className="bg-white/95 border-b border-[#D8E6DE] px-4 sm:px-6 py-3 flex items-center justify-between text-[#1A1A1A] shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#369D6D] text-white flex items-center justify-center shrink-0 shadow-xs">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="truncate">
            <h2 className="text-xs sm:text-sm font-bold text-[#1A1A1A] truncate">{bookTitle}</h2>
            <p className="text-[10px] sm:text-[11px] text-[#5C6B64] truncate flex items-center">
              <span>{bookAuthor}</span>
              <span className="inline-block w-px h-2.5 bg-slate-300 mx-1.5 shrink-0" />
              <span>{bookJenjangName}</span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Fit Mode Controls (Besar/Nyaman, Lebar Penuh, Pas Layar) */}
          <div className="hidden md:flex items-center bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl p-0.5 text-xs">
            <button
              type="button"
              onClick={() => {
                setFitMode("comfort");
                setZoomLevel(100);
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${fitMode === "comfort" ? "bg-white text-[#39BF81] shadow-xs font-bold" : "text-[#5C6B64] hover:text-[#1A1A1A]"
                }`}
              title="Tampilan nyaman & huruf besar (Sangat cocok untuk siswa)"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Besar & Jelas</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFitMode("fit-width");
                setZoomLevel(100);
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${fitMode === "fit-width" ? "bg-white text-[#39BF81] shadow-xs font-bold" : "text-[#5C6B64] hover:text-[#1A1A1A]"
                }`}
              title="Lebar Penuh Memenuhi Layar Monitor"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              </svg>
              <span>Lebar Penuh</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFitMode("fit-height");
                setZoomLevel(100);
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${fitMode === "fit-height" ? "bg-white text-[#39BF81] shadow-xs font-bold" : "text-[#5C6B64] hover:text-[#1A1A1A]"
                }`}
              title="Muat 1 Layar Utuh Tanpa Scroll Vertikal"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4v16m8-16v16" />
              </svg>
              <span>Pas Layar</span>
            </button>
          </div>

          {/* View Mode: Single vs Spread */}
          <div className="hidden xl:flex items-center bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("single")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${viewMode === "single" ? "bg-white text-[#39BF81] shadow-xs" : "text-[#5C6B64]"
                }`}
            >
              1 Halaman
            </button>
            <button
              type="button"
              onClick={() => setViewMode("spread")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${viewMode === "spread" ? "bg-white text-[#39BF81] shadow-xs" : "text-[#5C6B64]"
                }`}
            >
              2 Halaman
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={handleZoomOut}
              className="px-2 py-0.5 hover:text-[#39BF81] font-bold cursor-pointer transition-colors"
              title="Perkecil (-)"
            >
              -
            </button>
            <CustomSelect
              value={zoomLevel}
              onChange={(val) => setZoomLevel(Number(val))}
              options={[
                ...(!ZOOM_PRESETS.includes(zoomLevel) ? [{ value: zoomLevel, label: `${zoomLevel}%` }] : []),
                { value: 50, label: "50%" },
                { value: 75, label: "75%" },
                { value: 100, label: "100% (Standar)" },
                { value: 125, label: "125% (Besar)" },
                { value: 150, label: "150% (Sangat Jelas)" },
                { value: 175, label: "175% (Ekstra)" },
                { value: 200, label: "200% (Maksimal)" },
                { value: 250, label: "250%" },
              ]}
              buttonClassName="py-0.5 px-2 bg-transparent border-0 shadow-none text-[11px] font-mono font-bold"
              align="right"
            />
            <button
              type="button"
              onClick={handleZoomIn}
              className="px-2 py-0.5 hover:text-[#39BF81] font-bold cursor-pointer transition-colors"
              title="Perbesar (+)"
            >
              +
            </button>
          </div>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white hover:bg-[#E7F3EC] text-[#5C6B64] hover:text-[#39BF81] border border-[#D8E6DE] transition-colors cursor-pointer hidden sm:block"
            title="Layar Penuh (F)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          {/* Progress Pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#F8FAF9] border border-[#D8E6DE]">
            <span className="text-[11px] font-bold text-[#1A1A1A]">
              Hal. {currentPage}/{totalPages}
            </span>
            <span className="text-[10px] font-bold text-[#39BF81] bg-[#E7F3EC] px-1.5 py-0.5 rounded">
              {Math.min(100, Math.round((currentPage / Math.max(1, totalPages)) * 100))}%
            </span>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleCloseModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-[#5C6B64] hover:text-rose-700 border border-[#D8E6DE] text-xs font-bold transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Tutup (Esc)</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN READER CANVAS VIEW ================= */}
      <main
        ref={mainContainerRef}
        className="flex-1 overflow-auto p-4 sm:p-8 flex flex-col items-center justify-start relative bg-[#0B1120]"
      >
        {/* Floating Resume Notification Banner */}
        {showResumeBanner && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#369D6D] text-white shadow-2xl border border-emerald-400/40 animate-fade-in">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-semibold">
              {currentPage >= totalPages ? (
                <>Kamu berada di halaman terakhir (<strong>Hal. {currentPage} / {totalPages}</strong>)</>
              ) : (
                <>Melanjutkan membaca dari <strong>Halaman {currentPage}</strong></>
              )}
            </span>
            <div className="flex items-center gap-2 ml-1">
              <button
                type="button"
                onClick={() => {
                  setCurrentPage(1);
                  setShowResumeBanner(false);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-xs"
                title="Mulai membaca ulang dari Halaman 1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{currentPage >= totalPages ? "Baca Ulang dari Awal" : "Baca dari Hal. 1"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowResumeBanner(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                title="Tutup notifikasi"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        {/* Anti-Piracy Watermark Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center gap-16 opacity-[0.06] rotate-[-22deg] select-none z-20">
          <span className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-slate-200">
            {userName} · {userEmail}
          </span>
          <span className="text-2xl font-bold uppercase tracking-wider text-emerald-400">
            Digilibrary SD · SIBI Kemendikdasmen
          </span>
          <span className="text-xl font-mono text-slate-200">
            Halaman {currentPage} · {new Date().toLocaleDateString("id-ID")}
          </span>
        </div>

        {/* Loading Spinner for Real PDF */}
        {pdfLoading && (
          <div className="flex flex-col items-center gap-3 text-white z-30 my-auto">
            <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-300 font-medium">Memuat lembaran PDF asli via Canvas...</p>
          </div>
        )}

        {/* Error Notification if PDF failed */}
        {pdfError && (
          <div className="absolute top-6 z-40 bg-rose-600/95 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xl backdrop-blur-xs border border-rose-400">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{pdfError}</span>
          </div>
        )}

        {/* Real PDF.js Canvas Renderer (No Iframe, No Browser Scrollbars!) */}
        {pdfDoc ? (
          <div className="w-fit mx-auto flex items-center justify-center gap-6 my-auto transition-all duration-200 z-10">
            {/* Left Canvas Page */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-300 flex items-center justify-center ring-1 ring-black/10">
              <canvas ref={canvasRefLeft} className="block" />
            </div>

            {/* Right Canvas Page (Spread Mode) */}
            {viewMode === "spread" && currentPage < totalPages && (
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-300 hidden lg:flex items-center justify-center ring-1 ring-black/10">
                <canvas ref={canvasRefRight} className="block" />
              </div>
            )}
          </div>
        ) : (
          /* Fallback Simulated Book Sheets */
          !pdfLoading && (
            <div
              className={`flex items-center justify-center gap-4 transition-transform duration-150 relative z-10 ${viewMode === "spread" ? "max-w-5xl" : "max-w-xl"
                }`}
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "center center",
              }}
            >
              <div className="bg-[#FCFCFA] rounded-2xl shadow-2xl border border-slate-300 w-95 sm:w-110 h-135 sm:h-150 overflow-hidden relative flex flex-col justify-between">
                {renderSimulatedPage(currentPage)}
              </div>

              {viewMode === "spread" && currentPage < totalPages && (
                <div className="bg-[#FCFCFA] rounded-2xl shadow-2xl border border-slate-300 w-95 sm:w-110 h-135 sm:h-150 overflow-hidden relative flex-col justify-between hidden md:flex">
                  {renderSimulatedPage(currentPage + 1)}
                </div>
              )}
            </div>
          )
        )}
      </main>

      {/* ================= BOTTOM NAVIGATION BAR ================= */}
      <footer className="bg-white/95 border-t border-[#D8E6DE] px-4 sm:px-6 py-3 flex items-center justify-between text-[#1A1A1A] shrink-0 shadow-lg z-30">
        {/* Durasi Membaca & Status Idle */}
        <div className="text-xs text-[#5C6B64] font-medium hidden sm:flex items-center gap-2">
          {pdfLoading ? (
            <span className="text-[11px] text-[#5C6B64] italic flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Memuat halaman PDF...</span>
            </span>
          ) : isIdlePaused ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Timer dijeda (tidak ada gerak pindah halaman). Pindah halaman untuk lanjut.</span>
            </span>
          ) : (
            <span>
              Waktu membaca: <strong className="text-[#39BF81]">{Math.floor(readingSeconds / 60)}m {readingSeconds % 60}s</strong>
            </span>
          )}
        </div>

        {/* Page Nav Buttons */}
        <div className="flex items-center gap-3 mx-auto sm:mx-0">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#E7F3EC] text-[#1A1A1A] hover:text-[#39BF81] border border-[#D8E6DE] text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden xs:inline">Sebelumnya</span>
          </button>

          {/* Page Jumper */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPageJumper(!showPageJumper)}
              className="text-xs font-bold text-[#1A1A1A] font-mono px-3 py-1.5 rounded-xl bg-[#F8FAF9] hover:bg-[#E7F3EC] border border-[#D8E6DE] cursor-pointer transition-colors"
              title="Klik untuk loncat ke halaman"
            >
              Hal. {currentPage} {viewMode === "spread" && currentPage < totalPages ? `– ${currentPage + 1}` : ""} / {totalPages}
            </button>

            {showPageJumper && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white rounded-2xl p-3 shadow-2xl border border-[#D8E6DE] w-48 space-y-2 z-50">
                <span className="text-[10px] font-bold text-[#5C6B64] block">Loncat ke Halaman:</span>
                <input
                  type="range"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                  className="w-full accent-[#369D6D]"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#5C6B64]">
                  <span>1</span>
                  <span className="font-bold text-[#39BF81]">Hal. {currentPage}</span>
                  <span>{totalPages}</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="px-3.5 py-1.5 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <span className="hidden xs:inline">Selanjutnya</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Protection badge */}
        <div className="text-[11px] text-[#5C6B64] font-medium hidden md:flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>E-Reader Canvas | Anti-Download</span>
        </div>
      </footer>
    </div>
  );
}
