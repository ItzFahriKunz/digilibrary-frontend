import { useState } from "react";
import { DEFAULT_FALLBACK_COVER, LANDING_PREVIEW_BOOKS } from "../../data/landingBooks";
import { StarIcon } from "./LandingIcons";
import RevealOnScroll from "../ui/RevealOnScroll";

export default function LandingHero({ featuredBook: initialFeatured, onActionClick }) {
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);

  // 3 Buku pilihan showcase di hero section: Fabel Bilingual, Karakter, Lingkungan
  const showcaseList = [
    initialFeatured || LANDING_PREVIEW_BOOKS[0], // Fabel Bilingual
    LANDING_PREVIEW_BOOKS[1], // Karakter
    LANDING_PREVIEW_BOOKS[4], // Lingkungan
  ].filter(Boolean);

  const activeBook = showcaseList[selectedBookIndex] || showcaseList[0];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const elem = document.getElementById("koleksi");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-[#16A34A] to-[#064E3B] text-white"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">

          {/* Kolom Kiri: Teks & CTA */}
          <div className="lg:col-span-7">
            <RevealOnScroll direction="up" distance={20} duration={650}>
              <div className="space-y-7 text-center lg:text-left">

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.16]">
                  Buku Cerita & Pelajaran SD,{" "}
                  <span className="text-[#3DD68C]">Kapan Saja</span> Tanpa Antre!
                </h1>

                <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Akses langsung buku teks Kurikulum Merdeka resmi (Kelas 1–6) dan buku cerita nonteks pengayaan literasi anak dari Pusat Perbukuan Kemendikdasmen secara gratis.
                </p>

                {/* Quick Exploration Search Bar */}
                <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0">
                  <div className="relative flex items-center shadow-xs rounded-2xl bg-white border border-[#D8E6DE] hover:border-[#2EA879]/60 transition-colors p-1.5">
                    <div className="pl-3 text-[#5C6B64]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Cari judul buku pelajaran, cerita fabel, sains SD..."
                      className="w-full px-3 py-2 text-xs sm:text-sm text-[#1A1A1A] placeholder-[#5C6B64]/70 bg-transparent focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#2EA879] hover:bg-[#238b5b] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      Cari Koleksi
                    </button>
                  </div>

                  {/* Quick Keywords Navigation */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-2.5 text-xs text-white">
                    <span className="font-semibold text-white/90">Pilihan Cepat:</span>
                    <a
                      href="#koleksi"
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-emerald-50 text-[#10A871] font-semibold transition-colors shadow-2xs"
                    >
                      IPAS Kelas 4
                    </a>
                    <a
                      href="#koleksi"
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-emerald-50 text-[#10A871] font-semibold transition-colors shadow-2xs"
                    >
                      Matematika SD
                    </a>
                    <a
                      href="#koleksi"
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-emerald-50 text-[#10A871] font-semibold transition-colors shadow-2xs"
                    >
                      Cerita Fabel
                    </a>
                    <a
                      href="#koleksi"
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-emerald-50 text-[#10A871] font-semibold transition-colors shadow-2xs"
                    >
                      Kelas 1–6
                    </a>
                  </div>
                </form>

                {/* CTA Action Buttons */}
                <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                  <button
                    type="button"
                    onClick={onActionClick}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-[#2EA879] hover:bg-[#238b5b] text-white text-sm sm:text-base font-bold transition-all shadow-md shadow-[#0B754E]/25 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                  >
                    <span>Mulai Membaca Buku SD</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>

                  <a
                    href="#koleksi"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#1A1A1A] text-sm sm:text-base font-bold transition-colors shadow-sm"
                  >
                    <span>Lihat Katalog Koleksi</span>
                  </a>
                </div>

                {/* Key Quality Points */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-white/90 font-medium">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Buku Teks & Cerita Resmi SIBI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Format Digital Ramah Anak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Bebas Akses Kapan Saja</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Kolom Kanan: Showcase Card */}
          <div className="lg:col-span-5 relative lg:pl-2">
            <RevealOnScroll direction="up" distance={24} duration={700} delay={120}>
              <div className="relative mx-auto max-w-md lg:max-w-none">

                {/* Main Showcase Card */}
                <div className="relative bg-white border border-[#D8E6DE] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-[#1A1A1A]">

                  {/* Showcase Header & Tab Switcher */}
                  <div className="border-b border-[#D8E6DE]/80 pb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#10A871]">
                        Buku Pilihan Hari Ini
                      </span>
                      <span className="text-xs text-[#5C6B64] font-medium">SIBI Kemendikdasmen</span>
                    </div>

                    {/* 3 Quick Switcher Tabs */}
                    <div className="grid grid-cols-3 gap-1.5 bg-[#F8FAF9] p-1 rounded-xl border border-[#D8E6DE] text-xs">
                      {showcaseList.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedBookIndex(idx)}
                          className={`py-1.5 px-2 rounded-lg font-bold text-center transition-all cursor-pointer truncate ${
                            selectedBookIndex === idx
                              ? "bg-white text-[#10A871] shadow-2xs"
                              : "text-[#5C6B64] hover:text-[#1A1A1A]"
                          }`}
                        >
                          {item.badgeLabel || `Buku ${idx + 1}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Book Details Container */}
                  <div className="flex gap-4 sm:gap-5 items-start">
                    {/* Book Cover */}
                    <div className="w-28 sm:w-34 h-38 sm:h-46 rounded-2xl overflow-hidden shadow-md shrink-0 bg-[#E7F3EC] relative border border-[#D8E6DE]">
                      <img
                        src={activeBook?.cover || DEFAULT_FALLBACK_COVER}
                        alt={activeBook?.title || "Buku"}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_FALLBACK_COVER;
                        }}
                      />
                      <div className="absolute top-2 left-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#10A871] text-white shadow-xs">
                          {activeBook?.badgeLabel || "Pilihan"}
                        </span>
                      </div>
                    </div>

                    {/* Book Metadata */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{activeBook?.rating || "4.9"}</span>
                        <span className="text-[#5C6B64] font-normal">({activeBook?.pages || "36 Hal"})</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] leading-snug line-clamp-2">
                        {activeBook?.title}
                      </h3>

                      <p className="text-xs text-[#5C6B64] line-clamp-1 font-medium">
                        Oleh: {activeBook?.author || "Pusat Perbukuan Kemendikdasmen"}
                      </p>

                      <p className="text-xs text-[#5C6B64] line-clamp-2 leading-relaxed pt-1">
                        {activeBook?.desc}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-2 flex items-center justify-between border-t border-[#D8E6DE]/60">
                    <span className="text-xs font-semibold text-[#10A871]">
                      {activeBook?.jenjang || "SD Kelas 1 - 3 (Pembaca Awal)"}
                    </span>

                    <button
                      type="button"
                      onClick={onActionClick}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2EA879] hover:bg-[#238b5b] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <span>Baca Buku Ini</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

        </div>
      </div>
    </section>
  );
}
