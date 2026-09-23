import { useEffect } from "react";

export default function LandingPolicyModal({ isOpen, type, onClose }) {
  // Tutup dengan tombol ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const contentMap = {
    privacy: {
      badge: "Keamanan Data & Privasi Anak",
      title: "Kebijakan Privasi Siswa",
      subtitle: "Perlindungan data pribadi siswa dan ekosistem belajar ramah anak.",
      icon: (
        <svg className="w-6 h-6 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      sections: [
        {
          heading: "1. Komitmen Keamanan Data Anak (Ramah Anak)",
          body: "Digilibrary SD dirancang khusus untuk lingkungan pendidikan dasar. Kami tidak mengumpulkan data sensitif seperti lokasi GPS langsung, NIK, atau informasi finansial keluarga siswa.",
        },
        {
          heading: "2. Data yang Dicatat & Tujuannya",
          body: "Data akun terbatas pada: Nama lengkap, email sekolah/Google, tingkatan kelas, dan riwayat aktivitas membaca. Data ini semata-mata digunakan untuk pelaporan literasi sekolah dan pemantauan wali kelas.",
        },
        {
          heading: "3. 100% Bebas Iklan Komersial",
          body: "Platform ini sepenuhnya bersih dari iklan pihak ketiga, banner promosi, atau pelacak komersial, sehingga anak-anak dapat membaca buku cerita dan pelajaran dengan aman tanpa distraksi.",
        },
        {
          heading: "4. Akses Terbatas",
          body: "Catatan baca siswa hanya dapat diakses oleh siswa bersangkutan, wali kelas binaannya, dan admin perpustakaan sekolah. Tidak ada data yang dibagikan ke pihak luar.",
        },
      ],
    },
    terms: {
      badge: "Ketentuan Layanan Resmi",
      title: "Syarat & Ketentuan Penggunaan",
      subtitle: "Pedoman hak cipta materi SIBI dan etika penggunaan perpustakaan digital.",
      icon: (
        <svg className="w-6 h-6 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      sections: [
        {
          heading: "1. Sumber Koleksi Buku Resmi",
          body: "Seluruh buku teks pelajaran, buku panduan guru, dan buku non-teks pengayaan bersumber resmi dari Sistem Informasi Perbukuan Indonesia (SIBI) Kementerian Pendidikan Dasar dan Menengah RI.",
        },
        {
          heading: "2. Pemanfaatan Non-Komersial",
          body: "Akses buku e-book ditujukan secara eksklusif untuk sarana belajar, mengajar, dan penguatan literasi siswa SD. Pengguna dilarang keras memperjualbelikan, mendistribusikan ulang berbayar, atau memodifikasi materi hak cipta.",
        },
        {
          heading: "3. Tanggung Jawab Akun",
          body: "Setiap siswa dan guru bertanggung jawab menjaga kerahasiaan kata sandi akunnya. Satu akun guru berhak membina satu kelas resmi sesuai data penugasan dari pihak sekolah.",
        },
        {
          heading: "4. Tata Tertib Pembaca",
          body: "Pengguna diharapkan memanfaatkan fasilitas pembaca digital secara bijak demi mendukung Gerakan Literasi Sekolah (GLS) dan Profil Pelajar Pancasila.",
        },
      ],
    },
    help: {
      badge: "Pusat Bantuan & Layanan",
      title: "Bantuan Teknis & FAQ",
      subtitle: "Panduan cepat penggunaan platform dan kontak pengelola perpustakaan.",
      icon: (
        <svg className="w-6 h-6 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      sections: [
        {
          heading: "1. Lupa Kata Sandi Akun Siswa?",
          body: "Siswa dapat menggunakan menu 'Lupa Sandi' dengan memasukkan email akun, atau meminta Wali Kelas/Admin Perpustakaan untuk me-reset kata sandi sementara secara langsung.",
        },
        {
          heading: "2. Buku PDF Tidak Bisa Dibuka?",
          body: "Pastikan koneksi internet aktif saat membuka buku pertama kali. Jika layar putih, coba segarkan (refresh) halaman. E-book telah dioptimalkan agar ringan dibuka di komputer maupun ponsel pintar.",
        },
        {
          heading: "3. Tracker Halaman & Progres Baca",
          body: "Sistem otomatis menyimpan halaman terakhir yang Anda baca. Durasi membaca hanya dihitung saat Anda aktif membaca (otomatis jeda jika layar ditinggalkan atau diam lebih dari 30 detik).",
        },
        {
          heading: "4. Kontak Layanan Perpustakaan",
          body: "Email: perpus@digilibrary.sch.id | Jam Layanan: Senin – Jumat (07.30 – 15.00 WIB) di Ruang Perpustakaan Sekolah.",
        },
      ],
    },
  };

  const activeContent = contentMap[type] || contentMap.privacy;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#D8E6DE] space-y-6 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-4 border-b border-[#D8E6DE] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E7F3EC] flex items-center justify-center shrink-0 border border-[#D8E6DE]">
              {activeContent.icon}
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E7F3EC] text-[#39BF81] mb-1">
                {activeContent.badge}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
                {activeContent.title}
              </h3>
              <p className="text-xs text-[#5C6B64] mt-0.5">
                {activeContent.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-[#5C6B64] hover:text-[#1A1A1A] transition-colors cursor-pointer shrink-0"
            title="Tutup"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Isi Kebijakan */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {activeContent.sections.map((sec, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#D8E6DE] space-y-1">
              <h4 className="text-xs font-bold text-[#1A1A1A]">{sec.heading}</h4>
              <p className="text-[11px] text-[#5C6B64] leading-relaxed">{sec.body}</p>
            </div>
          ))}
        </div>

        {/* Footer Modal */}
        <div className="flex items-center justify-between pt-3 border-t border-[#D8E6DE] text-[11px] text-[#5C6B64]">
          <span>Digilibrary SD • Kurikulum Merdeka</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#369D6D] hover:bg-[#107a55] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
