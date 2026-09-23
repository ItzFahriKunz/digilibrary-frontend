import RevealOnScroll from "../ui/RevealOnScroll";

export default function LandingCurriculum({ onActionClick }) {
  const phases = [
    {
      phase: "Fase A",
      classes: "Kelas 1 – 2 SD",
      focus: "Membaca Dini & Fabel Sederhana",
      desc: "Menekankan fonemik, pengenalan huruf/kata dengan ilustrasi visual besar dan kalimat ramah pembaca pemula.",
      tag: "Pembaca Awal",
    },
    {
      phase: "Fase B",
      classes: "Kelas 3 – 4 SD",
      focus: "Literasi Cerita & Konsep Dasar",
      desc: "Cerita fiksi bertema budi pekerti, persahabatan, sains sehari-hari, dan buku teks mata pelajaran pokok.",
      tag: "Pembaca Madya",
    },
    {
      phase: "Fase C",
      classes: "Kelas 5 – 6 SD",
      focus: "Eksplorasi Sains & Kebangsaan",
      desc: "Kisah sejarah nusantara, kelestarian lingkungan hidup, serta penguatan literasi digital dan berpikir kritis.",
      tag: "Pembaca Mahir",
    },
  ];

  return (
    <section id="kurikulum" className="py-20 bg-white border-y border-[#D8E6DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="up" distance={16} duration={600}>
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#39BF81]">
                Kurikulum Merdeka
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              Penyesuaian Fase Membaca Peserta Didik
            </h2>
            <p className="text-sm sm:text-base text-[#5C6B64]">
              Setiap fase kurikulum didukung oleh bahan bacaan berjenjang yang sesuai dengan tingkat kognitif anak.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {phases.map((p, idx) => (
            <RevealOnScroll key={idx} delay={idx * 80} distance={16} direction="up">
              <div
                className="p-6 rounded-3xl bg-[#F8FAF9] border border-[#D8E6DE] hover:border-[#39BF81]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-[#39BF81]">
                      {p.phase}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E7F3EC] text-[#39BF81] border border-[#D8E6DE]">
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#1A1A1A] mb-1">
                    {p.classes}
                  </h3>
                  <p className="text-xs font-semibold text-[#39BF81] mb-3">
                    {p.focus}
                  </p>
                  <p className="text-xs text-[#5C6B64] leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#D8E6DE]/60 flex items-center justify-between text-xs font-bold text-[#39BF81]">
                  <span>Koleksi Terverifikasi</span>
                  <span className="w-2 h-2 rounded-full bg-[#39BF81]" />
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* CTA Banner Bawah */}
        <RevealOnScroll direction="up" distance={20} delay={120}>
          <div className="rounded-3xl bg-gradient-to-r from-[#2BA76E] via-[#369D6D] to-[#107a55] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold">
                Siap Memulai Literasi Digital di Sekolah Anda?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                Daftarkan akun sekarang secara gratis dan nikmati akses ke ribuan halaman bacaan berstandar nasional.
              </p>
            </div>
            <button
              type="button"
              onClick={onActionClick}
              className="px-6 py-3.5 rounded-2xl bg-white text-[#2BA76E] font-bold text-sm hover:bg-emerald-50 transition-colors shadow-sm shrink-0 cursor-pointer"
            >
              Daftar &amp; Mulai Baca
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
