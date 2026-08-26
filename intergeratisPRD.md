# PRD: Integrasi Frontend-Backend — Kissaten (Toko Kopi)

## 1. Overview

Mengintegrasikan frontend `fe-kissaten` (React + Vite + Tailwind, sudah punya struktur Context API: `CartContext`, `ProductContext`, `ThemeContext`, halaman `Admin`) dengan backend `be-kissaten` (NestJS + Prisma + PostgreSQL) yang sudah selesai dan terdokumentasi lewat Swagger.

Backend sudah production-ready: auth JWT, role-based access (ADMIN/USER), validasi Zod, dan integrasi Midtrans (simulasi). Tugas agent adalah menyambungkan FE yang sudah ada ke API ini tanpa mengubah desain/struktur UI yang sudah dibuat, kecuali diperlukan untuk state management data dari API.

## 2. Tech Stack

**Backend (sudah selesai, jangan diubah kecuali diminta eksplisit):**
- NestJS + Prisma ORM + PostgreSQL
- Auth: JWT (Bearer token), `AuthGuard` + `RolesGuard` + `@Roles()` decorator
- Validasi: Zod via `nestjs-zod` (`createZodDto`)
- Dokumentasi API: Swagger di `/api/docs`
- Base URL dev: `http://localhost:3000`

**Frontend (target integrasi):**
- React + Vite + TypeScript + Tailwind CSS
- State management existing: Context API (`CartContext`, `ProductContext`, `ThemeContext`)
- HTTP client: `axios` (sudah terinstall)
- Struktur folder existing: `src/components`, `src/context`, `src/pages`, `src/service`, `src/lib`, `src/data`, `src/utils`

## 3. Auth & Konvensi API

- Semua request yang butuh auth pakai header `Authorization: Bearer <accessToken>`.
- Token didapat dari response `POST /users/login` atau `POST /users/register`.
- Endpoint publik (tanpa token): `GET /categories`, `GET /products`, `GET /products/:id`, `POST /orders` (guest checkout — opsional pakai token).
- Endpoint admin-only (butuh role `ADMIN`): create/update/delete `categories`, create/update/delete `products`, `GET /orders` (list semua order).
- Base URL API harus dibaca dari environment variable `VITE_API_URL`, bukan hardcode.

## 4. Daftar Endpoint

### Users
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| POST | `/users/register` | - | Register user baru |
| POST | `/users/login` | - | Login, return `{ user, accessToken }` |
| GET | `/users/current` | Bearer | Ambil profil user aktif |
| PATCH | `/users/current` | Bearer | Update profil (name/email/password, semua optional) |

### Categories
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| POST | `/categories` | Bearer + ADMIN | Buat kategori |
| GET | `/categories` | - | List semua kategori |
| PATCH | `/categories/:id` | Bearer + ADMIN | Update kategori |
| DELETE | `/categories/:id` | Bearer + ADMIN | Hapus kategori |

### Products
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| POST | `/products` | Bearer + ADMIN | Buat produk |
| GET | `/products` | - | List produk, query: `categoryId?`, `page?`, `limit?` |
| GET | `/products/:id` | - | Detail produk |
| PATCH | `/products/:id` | Bearer + ADMIN | Update produk |
| DELETE | `/products/:id` | Bearer + ADMIN | Hapus produk |

### Orders
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| POST | `/orders` | Optional Bearer | Buat order (guest atau login) |
| GET | `/orders` | Bearer + ADMIN | List semua order, query: `page?`, `limit?` |
| GET | `/orders/:id` | Bearer (owner/admin) | Detail order |
| POST | `/orders/webhook/midtrans` | - | Webhook notifikasi Midtrans (backend-only, FE tidak perlu panggil) |

## 5. Shape Data Utama

```typescript
interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

interface LoginResponse {
  user: UserResponse;
  accessToken: string;
}

interface CategoryResponse {
  id: number;
  name: string;
}

interface ProductResponse {
  id: number;
  name: string;
  price: number;
  image: string | null;
  categoryId: number;
  categoryName: string;
}

interface ProductListResponse {
  data: ProductResponse[];
  total: number;
  page: number;
  limit: number;
}

interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  qty: number;
  price: number;
  subtotal: number;
}

interface OrderResponse {
  id: number;
  userId: number | null;
  customerName: string | null;
  totalAmount: number;
  snapToken: string | null;
  paymentStatus: string;
  createdAt: string;
  items: OrderItemResponse[];
}

interface OrderListResponse {
  data: OrderResponse[];
  total: number;
  page: number;
  limit: number;
}
```

## 6. Task Breakdown

### Task 1 — Setup dasar
- Pastikan `src/vite-env.d.ts` ada dan mendeklarasikan `VITE_API_URL` di `ImportMetaEnv`.
- Setup axios instance terpusat di `src/lib/api.ts`: base URL dari `VITE_API_URL`, interceptor request untuk auto-attach `Authorization` header dari token tersimpan (localStorage).
- Buat file service per resource di `src/service/`: `user.service.ts`, `category.service.ts`, `product.service.ts`, `order.service.ts`. Tiap service hanya membungkus panggilan axios ke endpoint terkait — tidak berisi logic UI.

### Task 2 — Integrasi Auth
- Sambungkan flow login/register ke `POST /users/login` dan `POST /users/register`.
- Simpan `accessToken` dan data `user` setelah login berhasil (localStorage + context/state, sesuaikan dengan pola context yang sudah ada di project).
- Sambungkan `GET /users/current` untuk validasi sesi saat app pertama kali load (cek token masih valid).
- Handle logout: hapus token tersimpan.

### Task 3 — Integrasi Products & Categories
- Sambungkan `ProductContext` yang sudah ada agar mengambil data dari `GET /products` (dengan pagination) alih-alih data dummy/statis, jika sebelumnya pakai data lokal di `src/data`.
- Sambungkan halaman list kategori ke `GET /categories`.
- Implementasikan filter produk berdasarkan `categoryId` sesuai query param yang didukung backend.
- Tangani state loading dan error saat fetch data.

### Task 4 — Integrasi Cart & Checkout (Orders)
- `CartContext` yang sudah ada tetap menyimpan item cart secara lokal (tidak perlu API call per item).
- Saat checkout, kirim `POST /orders` dengan body `{ customerName?, userId?, items: [{ productId, qty }] }`. Sertakan token jika user sedang login (opsional, guest checkout tetap harus berfungsi tanpa token).
- Tampilkan hasil order (status, total, dll) dari response setelah checkout berhasil.

### Task 5 — Halaman Admin
- Sambungkan halaman `Admin.jsx` (yang sudah ada) ke endpoint admin-only: create/update/delete products & categories, list semua orders.
- Pastikan hanya user dengan role `ADMIN` yang bisa mengakses aksi-aksi ini di UI (selain proteksi di backend).

### Task 6 — Error Handling & UX
- Tangani response error dari API secara konsisten (401 → redirect ke login / hapus token, 403 → tampilkan pesan forbidden, 404/400/409 → tampilkan pesan error dari `message` di response body).
- Tambahkan loading state di setiap komponen yang melakukan fetch data.

## 7. Batasan & Catatan Penting

- **Jangan mengubah struktur/desain UI yang sudah ada** kecuali diperlukan untuk menyambungkan data — task ini murni integrasi data, bukan redesign.
- **Jangan mengubah kode backend** (`be-kissaten`) kecuali ada bug yang ditemukan saat integrasi dan disepakati untuk diperbaiki.
- Backend melakukan reset data otomatis tiap 3 jam ke seed data — ini perilaku yang disengaja (demo publik), FE tidak perlu menangani ini secara khusus.
- Ikuti struktur folder yang sudah ada di project (`context/`, `service/`, `lib/`, `pages/`, `components/`) — jangan membuat struktur folder baru yang duplikat/bertentangan.
- Base URL API wajib dari environment variable, tidak boleh hardcode `localhost:3000` di kode.

## 8. Definition of Done

- Semua endpoint pada daftar di atas berhasil dipanggil dari FE dan menampilkan data yang sesuai.
- Login/register/logout berfungsi, token tersimpan dan terpakai otomatis di request selanjutnya.
- Guest checkout maupun checkout dengan login sama-sama berfungsi.
- Halaman Admin bisa create/update/delete products & categories jika role user adalah ADMIN.
- Tidak ada data dummy/statis yang tersisa di FE untuk data yang seharusnya berasal dari API (products, categories, orders).