import { useState, useRef, useEffect, useCallback } from "react";

export default function AvatarCropperModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
}) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0); // in degrees: 0, 90, 180, 270
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageObj, setImageObj] = useState(null);

  const CROP_SIZE = 260; // Diameter lingkaran crop di canvas view
  const OUTPUT_SIZE = 400; // Ukuran resolusi output file avatar

  // Load image object saat imageSrc berubah
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImageObj(img);
      setScale(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Render preview canvas
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Bersihkan canvas
    ctx.clearRect(0, 0, width, height);

    // Simpan context untuk transformasi gambar
    ctx.save();
    ctx.translate(width / 2 + offset.x, height / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    // Hitung dimensi gambar agar muat proporsional
    const imgAspect = imageObj.width / imageObj.height;
    let drawW, drawH;
    if (imgAspect > 1) {
      drawH = CROP_SIZE;
      drawW = CROP_SIZE * imgAspect;
    } else {
      drawW = CROP_SIZE;
      drawH = CROP_SIZE / imgAspect;
    }

    ctx.drawImage(imageObj, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Gambar Masker Gelap dengan Lubang Lingkaran di Tengah
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.65)";
    ctx.beginPath();
    // Area kotak luar
    ctx.rect(0, 0, width, height);
    // Lubang lingkaran dalam (counter-clockwise)
    ctx.arc(width / 2, height / 2, CROP_SIZE / 2, 0, Math.PI * 2, true);
    ctx.fill();

    // Garis batas lingkaran putih & aksen hijau
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, CROP_SIZE / 2, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    // Garis aksen hijau luar
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, CROP_SIZE / 2 + 3, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(57, 191, 129, 0.8)";
    ctx.stroke();
    ctx.restore();
  }, [imageObj, scale, rotation, offset]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Handle Drag / Pan dengan Mouse
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle Drag / Pan dengan Layar Sentuh (Mobile/Tablet)
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  // Handle Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
    setScale((prev) => Math.min(Math.max(0.6, prev + zoomFactor), 3.5));
  };

  // Eksekusi Pemotongan Foto ke File Blob 400x400
  const handleCropAndApply = () => {
    if (!imageObj) return;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = OUTPUT_SIZE;
    exportCanvas.height = OUTPUT_SIZE;
    const ctx = exportCanvas.getContext("2d");

    // Skala rasio antara output canvas dan preview canvas
    const ratio = OUTPUT_SIZE / CROP_SIZE;

    ctx.save();
    ctx.translate(
      OUTPUT_SIZE / 2 + offset.x * ratio,
      OUTPUT_SIZE / 2 + offset.y * ratio
    );
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale * ratio, scale * ratio);

    const imgAspect = imageObj.width / imageObj.height;
    let drawW, drawH;
    if (imgAspect > 1) {
      drawH = CROP_SIZE;
      drawW = CROP_SIZE * imgAspect;
    } else {
      drawW = CROP_SIZE;
      drawH = CROP_SIZE / imgAspect;
    }

    ctx.drawImage(imageObj, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Konversi ke JPEG blob
    exportCanvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `avatar_${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        const previewUrl = URL.createObjectURL(blob);
        onCropComplete({ file, previewUrl });
        onClose();
      },
      "image/jpeg",
      0.92
    );
  };

  // Reset ke tengah
  const handleResetPosition = () => {
    setScale(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  // Putar 90 Derajat
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#D8E6DE] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#D8E6DE] flex items-center justify-between bg-[#F8FAF9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#39BF81] flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1A1A1A]">Sesuaikan & Potong Foto</h3>
              <p className="text-[10px] text-[#5C6B64]">Geser dan perbesar agar pas di dalam lingkaran profil</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#5C6B64] hover:text-[#1A1A1A] hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Canvas Interactive Area */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-900 select-none">
          <div className="relative rounded-2xl overflow-hidden shadow-inner cursor-grab active:cursor-grabbing">
            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              onWheel={handleWheel}
              className="touch-none bg-slate-950"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-2.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Tahan & geser untuk memposisikan foto
          </span>
        </div>

        {/* Controls Bar */}
        <div className="px-6 py-4 bg-white border-t border-[#D8E6DE] space-y-3.5">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(0.6, s - 0.15))}
              className="p-1.5 rounded-lg border border-[#D8E6DE] text-[#5C6B64] hover:text-[#1A1A1A] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Perkecil"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
              </svg>
            </button>

            <div className="flex-1 flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#5C6B64] w-12">Zoom</span>
              <input
                type="range"
                min="0.6"
                max="3.5"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="flex-1 accent-[#369D6D] cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
              />
              <span className="text-[11px] font-mono text-[#5C6B64] w-10 text-right">
                {Math.round(scale * 100)}%
              </span>
            </div>

            <button
              type="button"
              onClick={() => setScale((s) => Math.min(3.5, s + 0.15))}
              className="p-1.5 rounded-lg border border-[#D8E6DE] text-[#5C6B64] hover:text-[#1A1A1A] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Perbesar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Quick Tools & Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="px-3 py-1.5 rounded-xl border border-[#D8E6DE] bg-[#F8FAF9] hover:bg-slate-100 text-[#1A1A1A] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Putar 90°</span>
              </button>

              <button
                type="button"
                onClick={handleResetPosition}
                className="px-3 py-1.5 rounded-xl border border-[#D8E6DE] bg-[#F8FAF9] hover:bg-slate-100 text-[#5C6B64] text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5C6B64] text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCropAndApply}
                className="px-5 py-2 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Potong & Terapkan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
