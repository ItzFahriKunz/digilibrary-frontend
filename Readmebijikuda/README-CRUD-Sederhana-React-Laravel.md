# CRUD Sederhana — React + Laravel

Dokumen ini dibuat sebagai panduan untuk membuat **halaman CRUD sederhana** menggunakan:

- **React** sebagai frontend
- **Laravel** sebagai backend/API
- **MySQL** sebagai database

Tujuan utama halaman ini adalah **tes komunikasi React ↔ Laravel ↔ Database** sebelum sistem dikembangkan menjadi fitur yang lebih kompleks.

---

# 1. Tujuan

CRUD adalah singkatan dari:

```text
C = Create
R = Read
U = Update
D = Delete
```

Pada halaman tes ini, user dapat:

```text
Tambah Data
    ↓
Tampilkan Data
    ↓
Edit Data
    ↓
Hapus Data
```

Flow sederhananya:

```text
┌──────────────┐
│    React     │
│ CRUD Page    │
└──────┬───────┘
       │
       │ HTTP Request
       ▼
┌──────────────┐
│   Laravel    │
│   REST API   │
└──────┬───────┘
       │
       │ Query
       ▼
┌──────────────┐
│    MySQL     │
│   Database   │
└──────────────┘
```

---

# 2. Prasyarat

Pastikan sudah tersedia:

- [ ] Project React
- [ ] Project Laravel
- [ ] Node.js dan npm
- [ ] PHP
- [ ] Composer
- [ ] MySQL
- [ ] Database Laravel sudah terhubung
- [ ] React dapat menjalankan project
- [ ] Laravel API dapat dijalankan

---

# 3. Contoh Data

Untuk tes CRUD, kita gunakan data sederhana berupa:

```text
Product
```

Field:

```text
id
name
description
price
created_at
updated_at
```

Contoh:

```text
ID: 1
Name: Keyboard
Description: Mechanical Keyboard
Price: 350000
```

---

# 4. Database Laravel

Pastikan `.env` Laravel sudah mempunyai konfigurasi database yang benar.

Contoh:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=root
DB_PASSWORD=
```

Sesuaikan dengan konfigurasi MySQL lokal.

---

# 5. Membuat Model dan Migration

Di folder Laravel jalankan:

```bash
php artisan make:model Product -m
```

Laravel akan membuat:

```text
app/
└── Models/
    └── Product.php

database/
└── migrations/
    └── xxxx_xx_xx_xxxxxx_create_products_table.php
```

---

# 6. Migration Products

Buka migration `create_products_table`.

Contoh:

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->decimal('price', 15, 2);
    $table->timestamps();
});
```

Kemudian jalankan:

```bash
php artisan migrate
```

Jika berhasil, tabel:

```text
products
```

akan dibuat di MySQL.

---

# 7. Model Product

Buka:

```text
app/Models/Product.php
```

Contoh:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
    ];
}
```

`$fillable` digunakan agar field tersebut dapat diisi menggunakan mass assignment.

---

# 8. Membuat Controller

Buat controller:

```bash
php artisan make:controller Api/ProductController --api
```

File:

```text
app/
└── Http/
    └── Controllers/
        └── Api/
            └── ProductController.php
```

Contoh controller:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(
            Product::latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product berhasil dibuat',
            'data' => $product,
        ], 201);
    }

    public function show(Product $product)
    {
        return response()->json([
            'data' => $product,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Product berhasil diperbarui',
            'data' => $product,
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Product berhasil dihapus',
        ]);
    }
}
```

---

# 9. API Routes

Buka:

```text
routes/api.php
```

Tambahkan:

```php
use App\Http\Controllers\Api\ProductController;

Route::apiResource('products', ProductController::class);
```

Laravel otomatis menyediakan endpoint:

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/products` | Read semua data |
| POST | `/api/products` | Create data |
| GET | `/api/products/{id}` | Read satu data |
| PUT/PATCH | `/api/products/{id}` | Update data |
| DELETE | `/api/products/{id}` | Delete data |

---

# 10. Jalankan Laravel

Jalankan:

```bash
php artisan serve
```

Biasanya API tersedia di:

```text
http://127.0.0.1:8000
```

Tes endpoint:

```text
GET http://127.0.0.1:8000/api/products
```

Jika belum ada data, hasilnya kurang lebih:

```json
[]
```

---

# 11. Setup React

Masuk ke folder React.

Jika project sudah menggunakan Vite, jalankan:

```bash
npm run dev
```

Install Axios jika ingin digunakan untuk request API:

```bash
npm install axios
```

---

# 12. Membuat API Client

Contoh struktur:

```text
src/
├── api/
│   └── axios.js
├── pages/
│   └── Products.jsx
└── App.jsx
```

Buat:

```text
src/api/axios.js
```

Isi:

```javascript
import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        Accept: "application/json",
    },
});

export default api;
```

---

# 13. Halaman CRUD React

Buat:

```text
src/pages/Products.jsx
```

Contoh sederhana:

```jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

function Products() {

    const [products, setProducts] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
    });

    const [editingId, setEditingId] = useState(null);

    const loadProducts = async () => {
        try {
            const response = await api.get("/products");

            setProducts(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            if (editingId) {

                await api.put(
                    `/products/${editingId}`,
                    form
                );

            } else {

                await api.post(
                    "/products",
                    form
                );

            }

            setForm({
                name: "",
                description: "",
                price: "",
            });

            setEditingId(null);

            await loadProducts();

        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (product) => {

        setEditingId(product.id);

        setForm({
            name: product.name,
            description: product.description ?? "",
            price: product.price,
        });
    };

    const handleDelete = async (id) => {

        if (!confirm("Yakin ingin menghapus data ini?")) {
            return;
        }

        try {

            await api.delete(`/products/${id}`);

            await loadProducts();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>

            <h1>Product CRUD Test</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Nama product"
                    value={form.name}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Deskripsi"
                    value={form.description}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Harga"
                    value={form.price}
                    onChange={handleChange}
                />

                <button type="submit">
                    {editingId ? "Update" : "Tambah"}
                </button>

            </form>

            <hr />

            <table>

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama</th>
                        <th>Deskripsi</th>
                        <th>Harga</th>
                        <th>Aksi</th>
                    </tr>
                </thead>

                <tbody>

                    {products.map((product) => (

                        <tr key={product.id}>

                            <td>{product.id}</td>

                            <td>{product.name}</td>

                            <td>
                                {product.description}
                            </td>

                            <td>
                                {product.price}
                            </td>

                            <td>

                                <button
                                    onClick={() =>
                                        handleEdit(product)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(product.id)
                                    }
                                >
                                    Hapus
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default Products;
```

---

# 14. Tampilkan Halaman CRUD

Untuk tes paling sederhana, `App.jsx` dapat memanggil halaman tersebut:

```jsx
import Products from "./pages/Products";

function App() {
    return (
        <Products />
    );
}

export default App;
```

Kemudian buka React.

---

# 15. Tampilan yang Diharapkan

Halaman tes kurang lebih memiliki:

```text
┌──────────────────────────────────────────────┐
│              Product CRUD Test               │
├──────────────────────────────────────────────┤
│                                              │
│ Nama Product                                 │
│ [____________________________]               │
│                                              │
│ Deskripsi                                    │
│ [____________________________]               │
│                                              │
│ Harga                                        │
│ [____________________________]               │
│                                              │
│              [ Tambah ]                      │
│                                              │
├──────────────────────────────────────────────┤
│ ID │ Nama │ Deskripsi │ Harga │ Aksi         │
├────┼──────┼───────────┼───────┼──────────────┤
│ 1  │ ...  │ ...       │ ...   │ Edit Hapus   │
│ 2  │ ...  │ ...       │ ...   │ Edit Hapus   │
└──────────────────────────────────────────────┘
```

Tampilan tersebut nantinya dapat dipercantik menggunakan CSS atau UI library yang digunakan project.

---

# 16. Pengujian CRUD

## CREATE

Masukkan:

```text
Name:
Keyboard

Description:
Mechanical Keyboard

Price:
350000
```

Klik:

```text
Tambah
```

Data harus masuk ke database.

---

## READ

Setelah data ditambahkan, React melakukan:

```text
GET /api/products
```

Data kemudian ditampilkan pada tabel.

---

## UPDATE

Klik:

```text
Edit
```

Ubah data, misalnya:

```text
Keyboard
→
Mechanical Keyboard RGB
```

Klik:

```text
Update
```

Data di database harus berubah.

---

## DELETE

Klik:

```text
Hapus
```

Konfirmasi penghapusan.

React akan mengirim:

```text
DELETE /api/products/{id}
```

Data harus hilang dari database dan tabel React.

---

# 17. Flow CRUD Lengkap

### CREATE

```text
React Form
    ↓
POST /api/products
    ↓
Laravel Controller
    ↓
Validation
    ↓
Product::create()
    ↓
MySQL
```

### READ

```text
React
    ↓
GET /api/products
    ↓
Laravel
    ↓
Product::latest()->get()
    ↓
MySQL
    ↓
JSON
    ↓
React Table
```

### UPDATE

```text
React Edit
    ↓
PUT /api/products/{id}
    ↓
Laravel
    ↓
Validation
    ↓
$product->update()
    ↓
MySQL
```

### DELETE

```text
React Delete
    ↓
DELETE /api/products/{id}
    ↓
Laravel
    ↓
$product->delete()
    ↓
MySQL
```

---

# 18. CORS

Jika React dan Laravel berjalan pada port berbeda:

```text
React:
http://localhost:5173

Laravel:
http://127.0.0.1:8000
```

browser dapat menganggapnya sebagai origin berbeda.

Jika muncul error seperti:

```text
Access to XMLHttpRequest has been blocked by CORS policy
```

periksa konfigurasi CORS Laravel.

Jangan langsung mengubah konfigurasi secara sembarangan. Pastikan origin frontend yang digunakan memang diizinkan oleh API.

---

# 19. Environment Variable React

Daripada menulis URL Laravel langsung:

```javascript
baseURL: "http://127.0.0.1:8000/api"
```

lebih baik menggunakan `.env`.

Contoh:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Kemudian:

```javascript
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Accept: "application/json",
    },
});

export default api;
```

Setelah mengubah `.env`, restart Vite:

```bash
npm run dev
```

---

# 20. Checklist Tes

## Laravel

- [ ] Database berhasil terhubung
- [ ] Migration berhasil
- [ ] Tabel `products` tersedia
- [ ] Model `Product` tersedia
- [ ] `$fillable` sudah diatur
- [ ] `ProductController` tersedia
- [ ] API routes tersedia
- [ ] Laravel server berjalan

## React

- [ ] React server berjalan
- [ ] Axios terinstall
- [ ] API client sudah dibuat
- [ ] Halaman Products tersedia
- [ ] GET berhasil
- [ ] POST berhasil
- [ ] PUT berhasil
- [ ] DELETE berhasil

## Database

- [ ] Create menambah data
- [ ] Read mengambil data
- [ ] Update mengubah data
- [ ] Delete menghapus data

---

# 21. Target Akhir

Jika semua berhasil, sistem tes harus mampu:

```text
┌──────────────────────┐
│      React UI        │
│                      │
│  [ Form Product ]    │
│                      │
│  [ Tambah ]          │
│                      │
│  ┌────────────────┐  │
│  │ Product Table  │  │
│  │                │  │
│  │ Edit | Hapus   │  │
│  └────────────────┘  │
└──────────┬───────────┘
           │
           │ Axios / HTTP
           ▼
┌──────────────────────┐
│     Laravel API      │
│                      │
│ GET    /products     │
│ POST   /products     │
│ PUT    /products/:id │
│ DELETE /products/:id │
└──────────┬───────────┘
           │
           │ Eloquent
           ▼
┌──────────────────────┐
│        MySQL         │
│      products        │
└──────────────────────┘
```

---

# 22. Pengembangan Berikutnya

Setelah CRUD sederhana berhasil, halaman ini dapat dikembangkan menjadi:

```text
CRUD
 │
 ├── Authentication
 │      └── Google Login
 │
 ├── Authorization
 │      └── Admin / User
 │
 ├── Search
 │
 ├── Pagination
 │
 ├── Filtering
 │
 ├── Image Upload
 │
 ├── Form Validation
 │
 └── Dashboard
```

Untuk project React + Laravel + Firebase, target integrasi akhirnya dapat menjadi:

```text
                 Google
                    │
                    ▼
             Firebase Auth
                    │
                    ▼
               React App
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
      Login Page          CRUD Page
                              │
                              ▼
                         Laravel API
                              │
                              ▼
                            MySQL
```

---

# 23. Kesimpulan

CRUD sederhana ini digunakan sebagai **halaman pengujian koneksi frontend dan backend**.

Jika seluruh operasi berhasil:

```text
CREATE ✅
READ   ✅
UPDATE ✅
DELETE ✅
```

maka komunikasi:

```text
React ↔ Laravel ↔ MySQL
```

sudah berjalan dengan baik.

Setelah itu, sistem dapat dilanjutkan ke integrasi **Google Login Firebase**, authentication Laravel, dashboard, dan fitur aplikasi sebenarnya.
