# Google Login Test — React + Laravel + Firebase

Dokumen ini dibuat sebagai panduan **tes awal Google Login** menggunakan **React sebagai frontend**, **Laravel sebagai backend**, dan **Firebase Authentication** sebagai penyedia login Google.

> **Tujuan utama:** memastikan Google Login berhasil terlebih dahulu sebelum diintegrasikan lebih jauh dengan sistem autentikasi dan database Laravel.

---

## 1. Arsitektur

Flow yang ingin diuji:

```text
User
  │
  │ Klik "Continue with Google"
  ▼
React Frontend
  │
  ▼
Firebase Authentication
  │
  │ Login Google berhasil
  ▼
Firebase User
  │
  │ Ambil Firebase ID Token
  ▼
React
  │
  │ POST token
  ▼
Laravel API
  │
  │ Verifikasi token
  ▼
User Laravel / Database
```

Pada tahap tes awal, fokusnya adalah:

```text
React → Firebase → Google Login → User berhasil didapatkan
```

Integrasi Laravel dapat dilakukan setelah tahap ini berhasil.

---

# 2. Prasyarat

Pastikan sudah tersedia:

- [ ] Project React
- [ ] Project Laravel
- [ ] Node.js dan npm
- [ ] Project Firebase
- [ ] Akun Google untuk melakukan pengujian
- [ ] Browser modern seperti Chrome, Edge, atau Firefox

---

# 3. Setup Firebase

Buka:

https://console.firebase.google.com/

Pilih project Firebase yang digunakan.

## 3.1 Aktifkan Firebase Authentication

Masuk ke:

```text
Build
└── Authentication
```

Klik:

```text
Get started
```

Kemudian:

```text
Sign-in method
└── Google
```

Aktifkan:

```text
Google → Enable
```

Pilih **Project support email**, kemudian klik:

```text
Save
```

---

# 4. Daftarkan React sebagai Web App

Di Firebase Console:

```text
Project Overview
└── Add app
    └── Web </> 
```

Masukkan nama aplikasi, misalnya:

```text
React Google Login Test
```

Setelah aplikasi berhasil dibuat, Firebase akan memberikan konfigurasi seperti:

```javascript
const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
};
```

Simpan konfigurasi tersebut.

> **Catatan:** konfigurasi Web App Firebase berbeda dengan Firebase Service Account. Jangan memasukkan private key Service Account ke React.

---

# 5. Install Firebase di React

Masuk ke folder frontend React:

```bash
npm install firebase
```

Pastikan package `firebase` sudah muncul di `package.json`.

Untuk memeriksa:

```bash
npm list firebase
```

---

# 6. Buat Konfigurasi Firebase

Buat file:

```text
src/firebase/config.js
```

Isi:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "API_KEY_DARI_FIREBASE",
    authDomain: "AUTH_DOMAIN_DARI_FIREBASE",
    projectId: "PROJECT_ID_DARI_FIREBASE",
    storageBucket: "STORAGE_BUCKET_DARI_FIREBASE",
    messagingSenderId: "MESSAGING_SENDER_ID_DARI_FIREBASE",
    appId: "APP_ID_DARI_FIREBASE",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
```

Ganti nilai konfigurasi dengan konfigurasi yang diberikan Firebase.

---

# 7. Buat Halaman Tes Login

Contoh file:

```text
src/pages/GoogleLoginTest.jsx
```

Isi:

```jsx
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";

function GoogleLoginTest() {

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(
                auth,
                provider
            );

            const user = result.user;

            console.log("=== GOOGLE LOGIN BERHASIL ===");
            console.log("UID:", user.uid);
            console.log("Nama:", user.displayName);
            console.log("Email:", user.email);
            console.log("Foto:", user.photoURL);

        } catch (error) {
            console.error("=== GOOGLE LOGIN GAGAL ===");
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Google Login Test</h1>

            <button onClick={handleGoogleLogin}>
                Continue with Google
            </button>
        </div>
    );
}

export default GoogleLoginTest;
```

---

# 8. Jalankan React

Jalankan:

```bash
npm run dev
```

Kemudian buka alamat frontend yang diberikan Vite, biasanya:

```text
http://localhost:5173
```

Buka halaman Google Login Test.

Klik:

```text
Continue with Google
```

Browser akan menampilkan popup Google.

Pilih akun Google yang ingin digunakan.

---

# 9. Hasil yang Diharapkan

Jika login berhasil, Console browser akan menampilkan sesuatu seperti:

```text
=== GOOGLE LOGIN BERHASIL ===

UID: xxxxxxxxxxxxx
Nama: Nama User
Email: user@gmail.com
Foto: https://...
```

Artinya:

```text
React
  ↓
Firebase
  ↓
Google
  ↓
Authentication berhasil
  ↓
Firebase User berhasil diterima
```

Pada tahap ini **Google Login sudah berhasil**.

---

# 10. Mengambil Firebase ID Token

Setelah login berhasil, Firebase juga dapat memberikan ID Token.

Ubah function login menjadi:

```javascript
const handleGoogleLogin = async () => {
    try {
        const provider = new GoogleAuthProvider();

        const result = await signInWithPopup(
            auth,
            provider
        );

        const user = result.user;

        const idToken = await user.getIdToken();

        console.log("UID:", user.uid);
        console.log("Nama:", user.displayName);
        console.log("Email:", user.email);
        console.log("Firebase ID Token:", idToken);

    } catch (error) {
        console.error("Google Login Error:", error);
    }
};
```

ID Token inilah yang nantinya akan digunakan untuk komunikasi dengan Laravel.

---

# 11. Integrasi React → Laravel

Setelah Google Login berhasil, React dapat mengirim Firebase ID Token ke Laravel.

Contoh endpoint:

```text
POST /api/auth/google
```

React:

```javascript
const response = await fetch(
    "http://127.0.0.1:8000/api/auth/google",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            token: idToken,
        }),
    }
);

const data = await response.json();

console.log(data);
```

Flow-nya:

```text
Google
   ↓
Firebase Authentication
   ↓
React
   ↓
Firebase ID Token
   ↓
POST /api/auth/google
   ↓
Laravel
```

---

# 12. Verifikasi Token di Laravel

Laravel **tidak boleh langsung percaya** data user yang dikirim oleh frontend.

Laravel harus memverifikasi Firebase ID Token menggunakan Firebase Admin SDK.

Flow yang benar:

```text
React
  │
  │ Firebase ID Token
  ▼
Laravel
  │
  │ Verify Token
  ▼
Firebase Admin SDK
  │
  ├── Valid → Login / Create User
  │
  └── Invalid → Reject
```

> Service Account Firebase untuk Laravel adalah kredensial backend. Jangan pernah memasukkan file private key tersebut ke React atau repository publik.

Tahap integrasi Laravel dapat dibuat setelah tes Google Login frontend berhasil.

---

# 13. Authorized Domains

Firebase Authentication juga mempunyai daftar domain yang diizinkan.

Lokasi:

```text
Firebase Console
└── Authentication
    └── Settings
        └── Authorized domains
```

Untuk development, pastikan domain lokal yang digunakan tersedia.

Contoh:

```text
localhost
```

Untuk production, domain website harus ditambahkan sesuai kebutuhan.

---

# 14. Checklist Pengujian

## Firebase

- [ ] Firebase Project sudah tersedia
- [ ] Authentication sudah aktif
- [ ] Google Provider sudah Enabled
- [ ] Web App sudah didaftarkan
- [ ] Firebase Config sudah didapatkan
- [ ] Authorized Domain sudah benar

## React

- [ ] Firebase sudah di-install
- [ ] `src/firebase/config.js` sudah dibuat
- [ ] `GoogleAuthProvider` sudah digunakan
- [ ] `signInWithPopup()` berhasil
- [ ] Google popup muncul
- [ ] Akun Google berhasil dipilih
- [ ] `user.uid` muncul
- [ ] `user.displayName` muncul
- [ ] `user.email` muncul
- [ ] `user.getIdToken()` berhasil

## Laravel

- [ ] Endpoint `/api/auth/google` dibuat
- [ ] Laravel menerima Firebase ID Token
- [ ] Firebase ID Token diverifikasi
- [ ] User dicari berdasarkan identitas Firebase
- [ ] User baru dibuat jika belum ada
- [ ] Authentication/session/token Laravel dibuat
- [ ] React menerima response login dari Laravel

---

# 15. Troubleshooting

## Popup Google tidak muncul

Periksa:

```text
Authentication
└── Sign-in method
    └── Google
```

Pastikan statusnya:

```text
Enabled
```

---

## `auth/operation-not-allowed`

Biasanya Google Provider belum diaktifkan.

Periksa kembali:

```text
Firebase Console
→ Authentication
→ Sign-in method
→ Google
→ Enable
```

---

## `auth/popup-closed-by-user`

Popup login ditutup sebelum proses selesai.

Coba login kembali.

---

## Domain tidak diizinkan

Periksa:

```text
Authentication
→ Settings
→ Authorized domains
```

Pastikan domain frontend yang digunakan sudah diizinkan.

---

## CORS ketika React mengakses Laravel

Jika Google Login Firebase berhasil tetapi request:

```text
React → Laravel
```

mengalami error CORS, berarti masalahnya ada pada konfigurasi API Laravel, bukan pada Google Authentication.

---

# 16. Target Akhir

Setelah seluruh integrasi selesai, sistem diharapkan bekerja seperti ini:

```text
┌───────────────┐
│ React Login   │
└───────┬───────┘
        │
        │ Click Google
        ▼
┌───────────────────┐
│ Firebase Auth     │
│ Google Provider   │
└────────┬──────────┘
         │
         │ ID Token
         ▼
┌───────────────────┐
│ Laravel API       │
│ Verify Firebase   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ MySQL             │
│ Users             │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ React Dashboard   │
└───────────────────┘
```

---

# 17. Catatan Keamanan

### Jangan lakukan:

```text
React
└── Firebase Service Account Private Key
```

atau:

```text
GitHub
└── service-account.json
```

Service Account adalah kredensial backend dan harus disimpan secara aman di Laravel/server.

### Yang boleh berada di React:

Firebase Web App configuration seperti:

```javascript
apiKey
authDomain
projectId
storageBucket
messagingSenderId
appId
```

Tetap gunakan environment variable jika konfigurasi tersebut menjadi bagian dari deployment project.

---

# 18. Kesimpulan

Untuk **tes awal**, kita tidak perlu langsung membuat sistem OAuth Google dari nol.

Gunakan:

```text
React
+
Firebase Authentication
+
Google Provider
```

untuk memastikan login Google bekerja.

Setelah berhasil, baru sambungkan:

```text
React
   ↓
Firebase ID Token
   ↓
Laravel
   ↓
Verify Token
   ↓
Database
   ↓
Laravel Authentication
```

Dengan pendekatan ini, proses login Google dapat dibuat lebih cepat dan kompleksitas OAuth dapat ditangani oleh Firebase.
