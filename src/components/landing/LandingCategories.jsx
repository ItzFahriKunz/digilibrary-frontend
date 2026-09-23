import { FrogStoryIcon, HeartHandIcon, MapCompassIcon, LeafScienceIcon, BookOpenIcon } from "./LandingIcons";
import RevealOnScroll from "../ui/RevealOnScroll";

export default function LandingCategories({ selectedCategory, onSelectCategory }) {
  const categories = [
    {
      nama: "Cerita & Fabel Bergambar",
      icon: FrogStoryIcon,
      badge: "Buku Nonteks",
      desc: "Kisah fabel binatang dan cerita anak bilingual bergambar.",
    },
    {
      nama: "Penguatan Karakter Anak",
      icon: HeartHandIcon,
      badge: "Buku Nonteks",
      desc: "Menumbuhkan budi pekerti, kemandirian, dan empati siswa.",
    },
    {
      nama: "Literasi Budaya & Cerita Rakyat",
      icon: MapCompassIcon,
      badge: "Buku Nonteks",
      desc: "Legenda nusantara dan keragaman adat istiadat Indonesia.",
    },
    {
      nama: "Literasi Sains & Lingkungan",
      icon: LeafScienceIcon,
      badge: "Buku Nonteks",
      desc: "Eksplorasi alam, kelautan nusantara, dan peduli lingkungan.",
    },
    {
      nama: "Buku Teks Kurikulum Merdeka",
      icon: BookOpenIcon,
      badge: "Buku Pelajaran",
      desc: "Buku teks utama IPAS, Matematika, B. Indonesia Fase A–C.",
    },
  ];

  return (
    <section id="kategori" className="bg-gradient-to-r from-[#19BC71] from-[16%] to-[#1B9A60] to-[77%] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <RevealOnScroll direction="up" distance={16} duration={600}>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#86EFAC] uppercase block mb-3">
              Klasifikasi Buku SIBI
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.18] max-w-3xl mx-auto">
              Kategori Bacaan Berkualitas untuk Setiap Fase Belajar
            </h2>
            <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto pt-3 leading-relaxed font-normal">
              Pilih kategori buku bacaan yang sesuai dengan minat dan jenjang kelas peserta didik Sekolah Dasar.
            </p>
          </div>
        </RevealOnScroll>

        {/* Categories Grid (Sesuai Mockup) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <RevealOnScroll key={idx} delay={idx * 60} distance={16} direction="up">
                <div
                  onClick={() => {
                    onSelectCategory(cat.nama);
                    const elem = document.getElementById("koleksi");
                    if (elem) {
                      elem.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer h-full group text-left border border-white/20"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#E7F3EC] flex items-center justify-center text-[#19BC71] shrink-0">
                        <IconComponent className="w-6 h-6 stroke-[1.8]" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-white text-[#5C6B64] border border-[#D8E6DE]">
                        {cat.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] mt-5 mb-2 leading-snug group-hover:text-[#19BC71] transition-colors">
                      {cat.nama}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C6B64] leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-xs font-semibold text-[#1A1A1A] group-hover:text-[#19BC71] transition-colors">
                    <span>Jelajahi Kategori</span>
                    <svg
                      className="w-4 h-4 text-[#1A1A1A] group-hover:text-[#19BC71] group-hover:translate-x-0.5 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
