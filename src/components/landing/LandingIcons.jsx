// SVG Icon Components untuk menggantikan emoji di landing page
// Setiap ikon dibuat sebagai inline SVG yang konsisten dengan design system

// --- LandingStats Icons ---

export function BookStackIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  );
}

export function GraduationCapIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10l-10-5L2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
      <path d="M22 10v6" />
    </svg>
  );
}

export function ShieldCheckIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function SparklesIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
      <path d="M19 2l.5 1.5L21 4l-1.5.5L19 6l-.5-1.5L17 4l1.5-.5L19 2z" />
    </svg>
  );
}

// --- LandingCategories Icons ---

export function FrogStoryIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Telinga Panjang Kelinci Fabel */}
      <path d="M8 2.5C6.5 2.5 5.5 4.5 6 7.5L7.5 10.5" />
      <path d="M16 2.5C17.5 2.5 18.5 4.5 18 7.5L16.5 10.5" />
      {/* Garis Dalam Telinga */}
      <path d="M7.3 4.8c-.3.6-.2 1.6.3 2.7" strokeWidth="1.2" />
      <path d="M16.7 4.8c.3.6.2 1.6-.3 2.7" strokeWidth="1.2" />
      {/* Kontur Kepala & Pipi Menggemaskan */}
      <path d="M5 12c-1.5 2-1 4.5.5 6 2 2 4.5 2.5 6.5 2.5s4.5-.5 6.5-2.5c1.5-1.5 2-4 .5-6-1.5-2-3.5-2.5-6.5-2.5s-5 .5-6.5 2.5z" />
      {/* Mata Hewan Berbinar */}
      <circle cx="8.5" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
      {/* Hidung & Senyum */}
      <path d="M12 14.8l-1 1.2h2l-1-1.2z" fill="currentColor" stroke="none" />
      <path d="M10.5 16.8c.5.4 1 .6 1.5.6s1-.2 1.5-.6" />
      {/* Kumis Hewan Fabel */}
      <path d="M3.5 14h2.5M3.5 16h2.5M20.5 14h-2.5M20.5 16h-2.5" strokeWidth="1.4" />
    </svg>
  );
}

// Alias untuk AnimalFableIcon jika dipanggil dengan nama lain
export const AnimalFableIcon = FrogStoryIcon;

export function HeartHandIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z" />
    </svg>
  );
}

export function MapCompassIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Lingkaran Luar Kompas */}
      <circle cx="12" cy="12" r="9" />
      {/* Jarum Kompas: Utara Solid Kontras & Selatan Bergaris */}
      <polygon points="12 4.5 14.5 12 12 10.5 9.5 12" fill="currentColor" stroke="currentColor" strokeWidth="1" />
      <polygon points="12 19.5 14.5 12 12 13.5 9.5 12" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Titik Poros Tengah */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      {/* Tanda Mata Angin N-S-E-W */}
      <line x1="12" y1="1.5" x2="12" y2="3" strokeWidth="2" />
      <line x1="12" y1="21" x2="12" y2="22.5" strokeWidth="2" />
      <line x1="1.5" y1="12" x2="3" y2="12" strokeWidth="2" />
      <line x1="21" y1="12" x2="22.5" y2="12" strokeWidth="2" />
    </svg>
  );
}

export function LeafScienceIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" />
      <path d="M9 14c0 0 2-1 4-1" />
    </svg>
  );
}

export function BookOpenIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

// --- LandingTestimonials Star Icon ---

export function StarIcon({ className = "w-4 h-4", filled = true }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
