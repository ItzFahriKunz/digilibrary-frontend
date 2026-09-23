import { useEffect } from "react";

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Yakin Ingin Keluar?",
  message = "Apakah Anda yakin ingin keluar dari sesi akun ini? Anda harus masuk kembali untuk mengakses perpustakaan.",
  confirmText = "Ya, Keluar",
  cancelText = "Batal",
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-[#D8E6DE] text-center space-y-4 animate-in zoom-in-95 duration-150">
        {/* Warning / Logout Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-[#1A1A1A]">
            {title}
          </h3>
          <p className="text-xs text-[#5C6B64] leading-relaxed">
            {message}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5C6B64] text-xs font-bold transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
