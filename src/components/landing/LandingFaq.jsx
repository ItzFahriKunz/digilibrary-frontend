import { useState } from "react";
import RevealOnScroll from "../ui/RevealOnScroll";

export default function LandingFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Apakah seluruh buku di Digilibrary bebas biaya dan resmi?",
      a: "Ya, seluruh buku berasal dari katalog Sistem Informasi Perbukuan Indonesia (SIBI) yang diterbitkan resmi oleh Pusat Perbukuan BSKAP Kemendikdasmen untuk mendukung pembelajaran sekolah secara gratis dan legal.",
    },
    {
      q: "Bagaimana cara membaca buku lengkap di aplikasi ini?",
      a: "Cukup masuk akun dengan email sekolah atau akun Google Anda. Setelah masuk, Anda akan langsung diarahkan ke Dashboard Siswa/Guru untuk membaca seluruh katalog dengan pembaca kanvas berwatermark.",
    },
    {
      q: "Apakah ada fitur pembatasan durasi atau pelacak waktu membaca?",
      a: "Ya, sistem dilengkapi Live Reading Tracker yang otomatis mencatat durasi membaca aktif Anda. Jika pembaca diam di halaman yang sama lebih dari 1 menit tanpa membalik halaman, timer otomatis dijeda demi keakuratan data.",
    },
    {
      q: "Bisakah guru dan admin mengelola dan mengunggah buku baru?",
      a: "Admin sekolah memiliki akses ke Panel Admin khusus untuk mengunggah file buku PDF asli, memperbarui metadata, mengelola akun guru/siswa, serta memantau grafik tren membaca 7 hari terakhir.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white border-t border-[#D8E6DE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="up" distance={16} duration={600}>
          <div className="text-center mb-14 space-y-3">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#39BF81]">
                Pertanyaan Umum
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-sm text-[#5C6B64]">
              Jawaban lengkap seputar aksesibilitas, kurikulum, dan perlindungan hak cipta buku digital.
            </p>
          </div>
        </RevealOnScroll>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <RevealOnScroll key={idx} delay={idx * 60} distance={12} direction="up">
                <div
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                    ? "border-[#39BF81]/40 bg-white shadow-sm ring-1 ring-[#39BF81]/10"
                    : "border-[#D8E6DE] bg-[#F8FAF9] hover:border-[#39BF81]/30 hover:bg-white"
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className={`w-full p-5 text-left font-bold text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer transition-colors duration-200 group ${isOpen ? "text-[#39BF81]" : "text-[#1A1A1A] hover:text-[#39BF81]"
                      }`}
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${isOpen
                        ? "rotate-180 bg-[#39BF81] text-white shadow-2xs"
                        : "bg-white border border-[#D8E6DE] text-[#5C6B64] group-hover:border-[#39BF81]/40 group-hover:text-[#39BF81]"
                        }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={`px-5 pb-5 text-xs sm:text-sm text-[#5C6B64] leading-relaxed border-t border-[#D8E6DE]/60 pt-4 bg-white transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                          }`}
                      >
                        {faq.a}
                      </div>
                    </div>
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
