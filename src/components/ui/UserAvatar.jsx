import { useState } from "react";

/**
 * Normalisasi URL Avatar pengguna agar selalu mengarah ke server yang tepat
 * baik URL eksternal (Google OAuth), file storage backend Laravel, maupun data URL.
 */
function getAvatarUrl(url) {
  if (!url) return null;
  const strUrl = String(url).trim();
  if (
    strUrl.startsWith("http://") ||
    strUrl.startsWith("https://") ||
    strUrl.startsWith("data:") ||
    strUrl.startsWith("blob:")
  ) {
    // Tingkatkan resolusi foto akun Google ke 256px agar tajam & jernih
    if (strUrl.includes("googleusercontent.com") && strUrl.includes("=s96")) {
      return strUrl.replace("=s96", "=s256");
    }
    return strUrl;
  }
  const cleanPath = strUrl.startsWith("/") ? strUrl : `/${strUrl}`;
  return `http://127.0.0.1:8000${cleanPath}`;
}

/**
 * Reusable UserAvatar Component
 * Menampilkan foto profil pengguna jika tersedia, dengan fallback inisial nama
 * dan penanganan jika URL gambar gagal dimuat (onError).
 */
export default function UserAvatar({
  src,
  name = "Pengguna",
  size = "md",
  className = "",
  shape = "rounded-full",
  noFallback = false,
}) {
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  // Reset status error jika src berubah
  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  // Pemetaan ukuran standar
  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-9 h-9 text-xs",
    lg: "w-14 h-14 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
    "3xl": "w-24 h-24 text-3xl",
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;
  const initial = (name?.trim()?.[0] || "U").toUpperCase();

  const finalSrc = getAvatarUrl(src);
  const isImageValid = Boolean(finalSrc && !hasError);

  // Jika noFallback aktif dan tidak ada foto valid, jangan render apa-apa
  if (noFallback && !isImageValid) {
    return null;
  }

  return (
    <div
      className={`relative shrink-0 overflow-hidden flex items-center justify-center font-bold select-none ${shape} ${selectedSize} ${
        isImageValid ? "bg-slate-100" : "bg-[#369D6D]! text-white! shadow-2xs"
      } ${className}`}
    >
      {isImageValid ? (
        <img
          src={finalSrc}
          alt={name}
          className={`w-full h-full object-cover ${shape}`}
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      ) : (
        <span className="text-white uppercase font-bold select-none leading-none">
          {initial}
        </span>
      )}
    </div>
  );
}
