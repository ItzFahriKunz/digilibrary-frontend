import { useState } from "react";
import { Link } from "react-router-dom";
import LandingPolicyModal from "./LandingPolicyModal";

export default function LandingFooter({ onActionClick }) {
  const [activePolicyModal, setActivePolicyModal] = useState(null);
  return (
    <footer className="bg-white border-t border-[#D8E6DE] pt-16 pb-12 text-[#5C6B64] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Kolom 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#39BF81] flex items-center justify-center text-white shadow-xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-[#39BF81]">Digilibrary SD</span>
            </Link>

            <p className="text-xs leading-relaxed max-w-sm">
              Platform perpustakaan digital resmi Sekolah Dasar untuk mendukung pembelajaran Kurikulum Merdeka dan Gerakan Literasi Sekolah dengan buku berstandar Kemendikdasmen.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              NAVIGASI
            </h4>
            <ul className="space-y-2">
              <li><a href="#beranda" className="hover:text-[#39BF81] transition-colors">Beranda</a></li>
              <li><a href="#kategori" className="hover:text-[#39BF81] transition-colors">Kategori SIBI</a></li>
              <li><a href="#koleksi" className="hover:text-[#39BF81] transition-colors">Katalog Buku SD</a></li>
              <li><a href="#keunggulan" className="hover:text-[#39BF81] transition-colors">Standar Keamanan</a></li>
              <li><a href="#kurikulum" className="hover:text-[#39BF81] transition-colors">Fase A, B & C</a></li>
            </ul>
          </div>

          {/* Kolom 3: Layanan Literasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              AKSES BACAAN
            </h4>
            <ul className="space-y-2">
              <li>
                <button type="button" onClick={onActionClick} className="hover:text-[#39BF81] transition-colors cursor-pointer text-left">
                  Buku Cerita Bergambar
                </button>
              </li>
              <li>
                <button type="button" onClick={onActionClick} className="hover:text-[#39BF81] transition-colors cursor-pointer text-left">
                  Buku Teks Kurikulum Merdeka
                </button>
              </li>
              <li>
                <button type="button" onClick={onActionClick} className="hover:text-[#39BF81] transition-colors cursor-pointer text-left">
                  Literasi Budaya & Cerita Rakyat
                </button>
              </li>
              <li>
                <button type="button" onClick={onActionClick} className="hover:text-[#39BF81] transition-colors cursor-pointer text-left">
                  Penguatan Karakter Anak
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Tautan Resmi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              RUJUKAN RESMI
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="https://buku.kemendikdasmen.go.id" target="_blank" rel="noreferrer" className="hover:text-[#39BF81] transition-colors flex items-center gap-1">
                  <span>SIBI Kemendikdasmen</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#39BF81] transition-colors font-semibold text-[#39BF81]">
                  Masuk Akun Pengguna &rarr;
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Hak Cipta & Disclaimer */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px]">
          <p>
            &copy; {new Date().getFullYear()} Digilibrary SD. Hak Cipta Buku & Materi Dilindungi oleh Kementerian Pendidikan Dasar dan Menengah RI.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActivePolicyModal("privacy")}
              className="hover:text-[#39BF81] hover:underline transition-colors cursor-pointer"
            >
              Privasi Siswa
            </button>
            <span className="w-px h-3 bg-slate-300 inline-block" />
            <button
              type="button"
              onClick={() => setActivePolicyModal("terms")}
              className="hover:text-[#39BF81] hover:underline transition-colors cursor-pointer"
            >
              Syarat Penggunaan
            </button>
            <span className="w-px h-3 bg-slate-300 inline-block" />
            <button
              type="button"
              onClick={() => setActivePolicyModal("help")}
              className="hover:text-[#39BF81] hover:underline transition-colors cursor-pointer"
            >
              Bantuan Teknis
            </button>
          </div>
        </div>
      </div>

      {/* Modal Interaktif Kebijakan & Bantuan */}
      <LandingPolicyModal
        isOpen={Boolean(activePolicyModal)}
        type={activePolicyModal}
        onClose={() => setActivePolicyModal(null)}
      />
    </footer>
  );
}
