import { BookStackIcon, GraduationCapIcon, ShieldCheckIcon, SparklesIcon } from "./LandingIcons";
import RevealOnScroll from "../ui/RevealOnScroll";

export default function LandingStats() {
  const stats = [
    { label: "Buku SIBI Kemendikdasmen", value: "1,500+", icon: BookStackIcon },
    { label: "Kelas & Sekolah Binaan", value: "34+", icon: GraduationCapIcon },
    { label: "Akses Gratis & Berizin Resmi", value: "100%", icon: ShieldCheckIcon },
    { label: "Rating Kepuasan Membaca", value: "4.9/5", icon: SparklesIcon },
  ];

  return (
    <section className="py-12 bg-white border-y border-[#D8E6DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <RevealOnScroll key={idx} delay={idx * 70} distance={16} direction="up">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAF9] border border-[#D8E6DE]/70 hover:border-[#39BF81]/50 hover:bg-[#F2F7F4] hover:shadow-xs transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-[#E7F3EC] flex items-center justify-center text-[#39BF81] shrink-0 border border-[#D8E6DE]">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
                      {stat.value}
                    </div>
                    <div className="text-xs text-[#5C6B64] font-medium leading-snug">
                      {stat.label}
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
