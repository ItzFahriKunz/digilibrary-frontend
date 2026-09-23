# Digilibrary — Skema Database & Arsitektur API

Dokumen ini adalah acuan teknis perancangan database MySQL, migrasi Laravel, relasi model Eloquent, serta kontrak API (*API Contract*) untuk platform **Digilibrary Sekolah Dasar** (Web React & Mobile Kotlin).

---

## 1. Konsep Data & Klasifikasi Buku

Sesuai standar Sistem Informasi Perbukuan Indonesia (SIBI Kemendikdasmen), koleksi buku perpustakaan digital sekolah terbagi menjadi 2 tipe utama:

1. **Buku Teks Pelajaran (Kurikulum Merdeka SD)**
   - Berjenjang per kelas (Kelas 1 s.d. Kelas 6 / Fase A, B, C).
   - Mata pelajaran: IPAS, Matematika, Bahasa Indonesia, Pendidikan Pancasila, PJOK, Seni Rupa, Bahasa Inggris (*My Next Words*), dll.
2. **Buku Nonteks (Pengayaan Literasi & Cerita)**
   - Bersifat lintas kelas atau berdasarkan jenjang pembaca (Pembaca Awal, Madya, Mahir).
   - Genre: Cerita Rakyat Nusantara, Fabel Bergambar, Penguatan Karakter/Budi Pekerti, Sains Populer & Lingkungan.

---

## 2. Diagram Relasi Entitas (ERD)

```text
┌─────────────────────────┐             ┌─────────────────────────┐
│       categories        │             │          users          │
├─────────────────────────┤             ├─────────────────────────┤
│ id (PK)                 │             │ id (PK)                 │
│ nama: string            │             │ name: string            │
│ slug: string (unique)   │             │ email: string (unique)  │
│ tipe: enum              │◄──────┐     │ password: string (null) │
│ icon: string (nullable) │       │     │ firebase_uid: str (null)│
│ created_at / updated_at │       │     │ avatar: text (nullable) │
└─────────────────────────┘       │     │ role: enum              │
                                  │     │ created_at / updated_at │
                                  │     └────────────┬────────────┘
┌─────────────────────────┐       │                  │
│          books          │       │                  │
├─────────────────────────┤       │                  │
│ id (PK)                 │       │                  │
│ category_id (FK)        ├───────┘                  │
│ judul: string           │                          │
│ slug: string (unique)   │                          │
│ penulis: string         │                          │
│ penerbit: string        │                          │
│ jenjang: string         │                          │
│ tingkat_kelas: int/null │                          │
│ deskripsi: text         │                          │
│ cover_path: string/null │                          │
│ file_path: string (PDF) │                          │
│ total_halaman: int      │                          │
│ rating: decimal(3,1)    │                          │
│ total_dibaca: int       │◄────────────┐            │
│ is_active: boolean      │             │            │
│ created_at / updated_at │             │            │
└────────────┬────────────┘             │            │
             │                          │            │
             │     ┌────────────────────┴────────────┴────┐
             └────►│             reading_logs             │
                   ├──────────────────────────────────────┤
                   │ id (PK)                              │
                   │ user_id: bigint (FK, nullable)       │
                   │ book_id: bigint (FK)                 │
                   │ platform: enum ('web', 'mobile')     │
                   │ halaman_terakhir: int                │
                   │ durasi_detik: int                    │
                   │ read_at: timestamp                   │
                   │ created_at / updated_at              │
                   └──────────────────────────────────────┘
```

---

## 3. Spesifikasi Struktur Tabel & Migration Laravel

### 3.1 Tabel `users`
Menampung data akun pengguna (Admin, Siswa, Guru) yang terhubung ke Firebase Google Auth maupun login email reguler.

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password')->nullable(); // Nullable jika login lewat Google OAuth
    $table->string('firebase_uid')->nullable()->unique();
    $table->text('avatar')->nullable();
    $table->enum('role', ['admin', 'siswa', 'guru'])->default('siswa');
    $table->rememberToken();
    $table->timestamps();
});
```

### 3.2 Tabel `categories`
Klasifikasi buku teks pelajaran vs buku nonteks literasi.

```php
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('nama', 100);
    $table->string('slug', 120)->unique();
    $table->enum('tipe', ['pelajaran', 'bacaan'])->default('pelajaran');
    $table->string('icon', 50)->nullable(); // Identifier nama icon
    $table->timestamps();
});
```

### 3.3 Tabel `books`
Katalog metadata buku dan referensi file PDF.

```php
Schema::create('books', function (Blueprint $table) {
    $table->id();
    $table->foreignId('category_id')->constrained('categories')->onDelete('restrict');
    $table->string('judul', 255);
    $table->string('slug', 280)->unique();
    $table->string('penulis', 150);
    $table->string('penerbit', 150)->default('Pusat Perbukuan Kemendikdasmen');
    $table->string('jenjang', 100); // Misal: "SD Kelas 4 (Fase B)" atau "Semua Kelas"
    $table->unsignedTinyInteger('tingkat_kelas')->nullable(); // 1, 2, 3, 4, 5, 6 (khusus tipe pelajaran)
    $table->text('deskripsi')->nullable();
    $table->string('cover_path')->nullable(); // Path di storage/covers/
    $table->string('file_path'); // Path file PDF di storage/books/
    $table->unsignedSmallInteger('total_halaman')->default(0);
    $table->decimal('rating', 2, 1)->default(5.0);
    $table->unsignedInteger('total_dibaca')->default(0); // Counter agregat bacaan
    $table->boolean('is_active')->default(true);
    $table->timestamps();

    $table->index(['category_id', 'tingkat_kelas']);
    $table->index('is_active');
});
```

### 3.4 Tabel `reading_logs`
Pencatatan statistik pembacaan secara realtime untuk dashboard admin.

```php
Schema::create('reading_logs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
    $table->foreignId('book_id')->constrained('books')->onDelete('cascade');
    $table->enum('platform', ['web', 'mobile'])->default('web');
    $table->unsignedSmallInteger('halaman_terakhir')->default(1);
    $table->unsignedInteger('durasi_detik')->default(0);
    $table->timestamp('read_at')->useCurrent();
    $table->timestamps();

    $table->index(['book_id', 'read_at']);
    $table->index(['user_id', 'read_at']);
});
```

---

## 4. Relasi Eloquent Model (Laravel)

### 4.1 `App\Models\Category`
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['nama', 'slug', 'tipe', 'icon'];

    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }
}
```

### 4.2 `App\Models\Book`
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $fillable = [
        'category_id', 'judul', 'slug', 'penulis', 'penerbit',
        'jenjang', 'tingkat_kelas', 'deskripsi', 'cover_path',
        'file_path', 'total_halaman', 'rating', 'total_dibaca', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'rating' => 'float',
        'total_halaman' => 'integer',
        'total_dibaca' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function readingLogs(): HasMany
    {
        return $this->hasMany(ReadingLog::class);
    }
}
```

### 4.3 `App\Models\ReadingLog`
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReadingLog extends Model
{
    protected $fillable = [
        'user_id', 'book_id', 'platform',
        'halaman_terakhir', 'durasi_detik', 'read_at'
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
```

---

## 5. Kontrak Endpoint REST API

Semua respons API menggunakan struktur JSON seragam:

```json
{
  "status": "success",
  "message": "Data berhasil diambil",
  "data": {}
}
```

### 5.1 Endpoint Publik (Katalog & Baca)

| Method | Endpoint | Keterangan | Query Params |
|---|---|---|---|
| `GET` | `/api/categories` | Mengambil daftar kategori | `tipe=pelajaran|bacaan` |
| `GET` | `/api/books` | Mengambil daftar buku (dengan pagination) | `category_id`, `tingkat_kelas`, `search`, `page` |
| `GET` | `/api/books/{slug}` | Detail buku & info halaman | - |
| `POST` | `/api/books/{id}/track-read` | Mencatat sesi baca ke `reading_logs` | Body: `{ platform: 'web'|'mobile', last_page: 5 }` |
| `GET` | `/api/books/{id}/stream` | Mengambil URL file PDF terproteksi (*Signed Stream*) | Memeriksa otorisasi sebelum mengalirkan byte PDF |

### 5.2 Endpoint Autentikasi (`/api/auth`)

| Method | Endpoint | Keterangan |
|---|---|---|
| `POST` | `/api/auth/google` | Verifikasi ID Token Firebase & generate Laravel Sanctum Token |
| `POST` | `/api/auth/login` | Login menggunakan email & password |
| `POST` | `/api/auth/register` | Pendaftaran akun siswa/guru baru |
| `GET` | `/api/auth/me` | Mengambil profil user yang sedang login |
| `POST` | `/api/auth/logout` | Mencabut token Sanctum |

### 5.3 Endpoint Admin & Statistik (`/api/admin`) *(Perlu Middleware: auth:sanctum & role:admin)*

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/admin/stats` | Statistik agregat (Total Buku, Total Pembaca, Total Log Hari Ini, Buku Terpopuler) |
| `POST` | `/api/admin/books` | Menambah judul buku & upload file PDF + Cover |
| `PUT` | `/api/admin/books/{id}` | Memperbarui metadata buku |
| `DELETE` | `/api/admin/books/{id}` | Menghapus buku (soft delete atau delete fisik file) |

---

## 6. Efisiensi Server Shared Hosting (Rumahweb)

Agar server hosting tidak kehabisan CPU / Memory saat puluhan siswa membaca PDF secara bersamaan:

1. **Pemisahan Aliran File**: File PDF disimpan di storage lokal Laravel (`storage/app/private/books/`). PHP hanya memvalidasi hak akses dan mengirim *Response Header* streaming standar (HTTP `206 Partial Content`), membiarkan web server (LiteSpeed/Apache) mengalirkan chunk byte data.
2. **Lazy-Load PDF Viewer**:
   - Di Web (React): Menggunakan library `pdf.js` dengan opsi *Range Request* (hanya memuat halaman yang sedang dibuka di viewport).
   - Di Android (Kotlin): Menggunakan `PdfRenderer` native atau `AndroidPdfViewer` berbasis bitmap cache lokal.
3. **Kompresi PDF Pra-Upload**: File PDF modul ajar/cerita dikompresi (target ukuran 5MB–15MB per buku) sebelum diunggah ke server.
