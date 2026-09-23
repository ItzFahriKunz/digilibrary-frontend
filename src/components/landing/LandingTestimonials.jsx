import { StarIcon } from "./LandingIcons";
import RevealOnScroll from "../ui/RevealOnScroll";

export default function LandingTestimonials() {
  const testimonials = [
    {
      name: "Ibu Nurhayati, S.Pd.",
      role: "Wali Kelas 4 SD Negeri 01",
      avatar: "N",
      content: "Fitur pemantauan membacanya sangat membantu saya mengetahui siswa mana yang rajin membaca di rumah. Buku Kurikulum Merdeka-nya pun lengkap dan resmi.",
      rating: 5,
    },
    {
      name: "Bagas Pratama",
      role: "Siswa Kelas 5 SD",
      avatar: "B",
      content: "Gambar-gambarnya jelas dan cerita fabelnya seru banget! Aku suka baca sebelum tidur karena bisa dibuka langsung dari HP ibu tanpa iklan.",
      rating: 5,
    },
    {
      name: "Pak Hendra Wijaya",
      role: "Orang Tua Siswa",
      avatar: "H",
      content: "Sangat tenang membiarkan anak membaca di sini karena kontennya 100% aman dan bersumber dari Kemendikdasmen. Tampilan halamannya juga rapi.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-[#FDFDFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="up" distance={16} duration={600}>
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#39BF81]">
                Testimoni Pengguna
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              Apa Kata Guru, Siswa, &amp; Orang Tua?
            </h2>
            <p className="text-sm sm:text-base text-[#5C6B64]">
              Pengalaman nyata dalam memanfaatkan platform membaca digital di lingkungan sekolah dan keluarga.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <RevealOnScroll key={idx} delay={idx * 80} distance={16} direction="up">
              <div
                className="p-6 rounded-3xl bg-white border border-[#D8E6DE] hover:border-[#39BF81]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, rIdx) => (
                      <StarIcon key={rIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C6B64] italic leading-relaxed">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#D8E6DE]/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E7F3EC] text-[#39BF81] font-bold flex items-center justify-center text-sm shrink-0 border border-[#D8E6DE]">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-[#5C6B64]">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
