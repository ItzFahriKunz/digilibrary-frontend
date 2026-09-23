import RevealOnScroll from "../ui/RevealOnScroll";

export default function LandingFeatures() {
  const features = [
    {
      title: "Pembaca PDF Interaktif Aman",
      desc: "Kanvas pembaca digital yang responsif dengan proteksi watermark dinamis untuk melindungi hak cipta buku kementerian.",
      icon: (
        <svg className="w-6 h-6 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "Pelacak Durasi Membaca Aktif",
      desc: "Live Reading Tracker otomatis mengukur waktu membaca aktif siswa dan otomatis menjeda saat layar ditinggalkan.",
      icon: (
        <svg className="w-6 h-6 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Kurikulum Merdeka Fase A - C",
      desc: "Struktur materi disusun rapi berdasarkan jenjang kelas 1 sampai 6 untuk memudahkan pemetaan capaian pembelajaran.",
      icon: (
        <svg className="w-6 h-6 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: "Panel Pemantauan Guru & Kelas",
      desc: "Wali kelas dapat memantau grafik membaca mingguan, total buku selesai, dan progres setiap siswa secara real-time.",
      icon: (
        <svg className="w-6 h-6 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="keunggulan" className="py-20 bg-[#FDFDFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="up" distance={16} duration={600}>
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#39BF81]">
                Keunggulan Platform
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              Fitur Terbaik untuk Literasi Sekolah Dasar
            </h2>
            <p className="text-sm sm:text-base text-[#5C6B64]">
              Dirancang khusus dengan standar kenyamanan membaca anak, kemudahan guru, dan kepatuhan perbukuan nasional.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <RevealOnScroll key={idx} delay={idx * 70} distance={16} direction="up">
              <div
                className="p-6 rounded-3xl bg-white border border-[#D8E6DE] hover:border-[#39BF81]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E7F3EC] flex items-center justify-center mb-5 border border-[#D8E6DE]">
                    {feat.icon}
                  </div>
                  <h3 className="text-base font-bold text-[#1A1A1A] mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#5C6B64] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#D8E6DE]/60 text-[11px] font-bold text-[#39BF81]">
                  Standar Kemendikdasmen
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
