# Digilibrary — Landing Page (UI Prototype)

Dokumen ini menjelaskan gambaran desain dan struktur landing page **Digilibrary**, sebuah platform perpustakaan digital sekolah yang menyediakan akses baca e-book secara gratis (*free to read*) tanpa sistem peminjaman maupun pengembalian.

> **Catatan status:** Versi ini adalah **prototype tampilan (UI only)**. Tombol login/akses buku bersifat statis untuk keperluan pratinjau desain, dan **belum terhubung ke autentikasi Firebase Google Sign-In**. Alur login akan diaktifkan pada tahap integrasi berikutnya.

---

## 1. Tentang Digilibrary

Digilibrary dibuat untuk menjawab kebutuhan sekolah akan akses bacaan digital yang mudah dan tidak berbelit. Berbeda dari perpustakaan konvensional, seluruh koleksi buku dapat dibaca langsung secara daring tanpa proses pinjam-kembali. Siswa maupun guru cukup masuk ke akun masing-masing untuk mulai membaca.

Landing page ini berfungsi sebagai halaman pengenalan sebelum pengguna masuk ke dalam sistem, sekaligus etalase singkat koleksi buku yang tersedia.

---

## 2. Sistem Warna (Design System)

Palet warna mengusung kesan bersih, akademik, dan tenang — **hijau dan putih**, tanpa elemen neon atau gradasi mencolok.

| Peran Warna | Kode Hex | Penggunaan |
|---|---|---|
| Primary (Hijau Utama) | `#1F6F4A` | Logo, tombol utama, aksen navigasi |
| Primary Hover | `#17573A` | State hover/aktif pada tombol & tautan |
| Secondary (Hijau Muda) | `#E7F3EC` | Latar section, latar kartu |
| Background | `#FFFFFF` | Latar utama halaman |
| Teks Utama | `#1A1A1A` | Judul, isi konten |
| Teks Sekunder | `#5C6B64` | Deskripsi, keterangan tambahan |
| Border/Divider | `#D8E6DE` | Garis pemisah, outline kartu |

**Prinsip desain:** flat, tanpa bayangan tajam atau efek glow; kontras dijaga tetap nyaman dibaca (aksesibel); tipografi sans-serif yang rapi dan tidak dekoratif berlebihan.

---

## 3. Struktur Halaman

### 3.1 Header
- Logo **Digilibrary** (kiri)
- Menu navigasi: `Beranda`, `Koleksi Buku`, `Tentang`
- Tombol **Masuk** (kanan, statis — belum terhubung fungsi login pada versi ini)
- Sticky di bagian atas saat scroll

### 3.2 Main Content

**a. Hero Section**
- Judul utama: *"Baca Buku Sekolah, Kapan Saja, Tanpa Antre Pinjam"*
- Sub-judul singkat menjelaskan konsep *free to read*
- Tombol CTA: **Mulai Membaca** (statis, mengarah ke placeholder)
- Ilustrasi/visual pendukung di sisi kanan (opsional, gaya flat)

**b. Section Keunggulan**
- 3 poin singkat dalam format kartu ringan (ikon + judul + deskripsi 1 baris), contoh:
  - Gratis & Tanpa Batas Pinjam
  - Bisa Diakses dari Web & Mobile
  - Koleksi Sesuai Kurikulum Sekolah

**c. Section Koleksi Buku (Kartu Akses Buku)**
- Menampilkan grid kartu buku sebagai **hiasan statis** (dummy data), masing-masing kartu berisi:
  - Cover buku (placeholder)
  - Judul buku
  - Kategori/mata pelajaran
  - Tombol kecil **Baca** (non-fungsional di versi ini)
- Grid responsif: 4 kolom (desktop) → 2 kolom (tablet) → 1 kolom (mobile)

### 3.3 Footer
- Logo & tagline singkat Digilibrary
- Tautan cepat: `Beranda`, `Koleksi Buku`, `Tentang`
- Informasi kontak/institusi sekolah
- Copyright: `© 2026 Digilibrary — Perpustakaan Digital Sekolah`

---

## 4. Batasan Versi Prototype Ini

- Tombol **Masuk** dan **Baca** bersifat dekoratif, belum terhubung ke Firebase Auth maupun API Laravel.
- Data buku pada section koleksi adalah data statis/dummy, bukan hasil query dari backend.
- Tujuan versi ini murni untuk validasi tampilan (UI/UX) sebelum tahap integrasi fungsional (Google Sign-In via Firebase, koneksi ke Laravel API).

---

## 5. Rencana Lanjutan

- Integrasi Firebase Authentication (Google Sign-In) pada tombol **Masuk**
- Hubungkan grid koleksi buku ke endpoint `GET /api/books` dari Laravel
- Tambahkan halaman detail buku & PDF viewer setelah proses login berhasil
