# Auto Family Tree

Aplikasi web pohon keluarga interaktif dengan tema visual **"Tempoe Doeloe"** — terinspirasi estetika kolonial-Jawa akhir abad 19. Pengunjung bisa menjelajahi silsilah keluarga secara visual dengan pan & zoom bebas, melihat detail biodata setiap anggota, dan menelusuri rantai nasab ke atas.

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Arsitektur & Struktur](#arsitektur--struktur)
- [Setup & Instalasi](#setup--instalasi)
- [Deploy ke Vercel](#deploy-ke-vercel)
- [Panduan Penggunaan](#panduan-penggunaan)
- [Struktur Data](#struktur-data)
- [API Reference](#api-reference)
- [Desain & Tema](#desain--tema)
- [Responsivitas](#responsivitas)
- [Konfigurasi](#konfigurasi)
- [Catatan Penting](#catatan-penting)

---

## Fitur Utama

| Fitur | Deskripsi |
|---|---|
| **Pohon Keluarga Visual** | Canvas interaktif dengan React Flow + Dagre auto-layout, pan & zoom bebas |
| **Tema "Tempoe Doeloe"** | Estetika kolonial-Jawa — kertas tua, tinta sepia, ornamen dekoratif, tipografi serif klasik |
| **Modal Biodata** | Klik node untuk melihat detail lengkap anggota — foto, nama, tahun lahir, umur, pasangan |
| **Rantai Nasab** | Telusuri garis keturunan ke atas (patrilineal) dalam modal — scroll horizontal dengan snap |
| **Punjer (Pendiri Moyang)** | Inisialisasi pertama — satu kali saja — anggota pangkal pohon keluarga |
| **CMS Admin** | Panel terproteksi password untuk mengelola seluruh data anggota |
| **Tambah Anak / Pasangan** | Form dengan auto-connect — relasi orang tua-anak dan pasangan otomatis terhubung bilateral |
| **Upload Foto** | Drag & drop foto anggota, maks 2MB JPG/PNG |
| **Search & Sort** | Cari anggota berdasarkan nama, sort kolom tabel |
| **Delete dengan Cleanup** | Hapus anggota — semua referensi di member lain otomatis dibersihkan |
| **Responsif** | Desktop, tablet, mobile — modal fullscreen, nasab scroll horizontal, tap target 44px |

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | **Next.js 14** (TypeScript), Pages Router |
| Tree Visualization | **React Flow** + **Dagre** (auto-layout top-to-bottom) |
| Styling | **Tailwind CSS** + CSS Custom Properties (tema tempoe doeloe) |
| Storage | **JSON flat file** (`data/members.json`) |
| Font | **Playfair Display** (heading) + **Lora** (body) |
| Icons | **Lucide React** |
| Auth CMS | Password sederhana via `localStorage` + environment variable |
| Deploy | **Vercel** (support API routes untuk baca/tulis JSON) |

---

## Arsitektur & Struktur

```
autofamilytree/
├── data/
│   ├── .gitkeep                  # Folder data (members.json di-gitignore)
│   └── members.json              # Data utama — TIDAK masuk repo
├── public/
│   ├── config.json               # Nama keluarga & subtitle (dibaca client-side)
│   └── photos/
│       ├── .gitkeep              # Folder foto (foto di-gitignore)
│       └── *.jpg / *.png         # Foto anggota — TIDAK masuk repo
├── src/
│   ├── pages/
│   │   ├── index.tsx             # Halaman publik — pohon keluarga
│   │   ├── _app.tsx              # App wrapper (global CSS)
│   │   ├── _document.tsx         # HTML document (font preload)
│   │   ├── admin/
│   │   │   ├── index.tsx         # CMS — daftar anggota + login
│   │   │   ├── add.tsx           # CMS — tambah anggota baru
│   │   │   └── edit/
│   │   │       └── [id].tsx      # CMS — edit anggota
│   │   └── api/
│   │       ├── members/
│   │       │   ├── index.ts      # GET all, POST new
│   │       │   └── [id].ts       # GET one, PUT, DELETE
│   │       └── upload.ts         # POST — upload foto (base64 → file)
│   ├── components/
│   │   ├── FamilyTree.tsx        # React Flow canvas wrapper
│   │   ├── MemberNode.tsx        # Custom node card ornamental
│   │   ├── MemberModal.tsx       # Modal detail biodata
│   │   ├── NasabChain.tsx        # Rantai nasab horizontal scrollable
│   │   ├── AdminTable.tsx        # Tabel desktop + card list mobile
│   │   ├── MemberForm.tsx        # Form tambah/edit dengan auto-connect
│   │   ├── SearchableSelect.tsx  # Dropdown searchable
│   │   ├── PhotoUpload.tsx       # Drag & drop upload foto
│   │   ├── DeleteConfirmModal.tsx # Konfirmasi hapus
│   │   └── OrnamentalDivider.tsx # Divider dekoratif ✦
│   ├── lib/
│   │   ├── members.ts            # CRUD read/write members.json
│   │   ├── tree-layout.ts        # Dagre layout → React Flow nodes/edges
│   │   ├── nasab.ts              # Kalkulasi rantai nasab ke atas
│   │   └── age.ts                # Hitung umur dari tahun lahir
│   └── styles/
│       └── globals.css            # Semua CSS variables tema + base styles
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local                    # Password admin — TIDAK masuk repo
└── .gitignore
```

---

## Setup & Instalasi

### Prasyarat

- **Node.js** v18 atau lebih baru
- **npm** v9 atau lebih baru

### Langkah Instalasi

```bash
# 1. Clone repo
git clone https://github.com/Rann27/autofamilytree.git
cd autofamilytree

# 2. Install dependencies
npm install

# 3. Buat file environment
cp .env.example .env.local
# Edit .env.local, ganti password:
# NEXT_PUBLIC_ADMIN_PASSWORD=password_anda_disini

# 4. Buat data kosong (otomatis saat pertama kali jalankan API,
#    tapi bisa juga dibuat manual)
echo '{"members":[]}' > data/members.json

# 5. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat pohon keluarga.
Buka [http://localhost:3000/admin](http://localhost:3000/admin) untuk mengakses CMS.

### Build Production

```bash
npm run build
npm start
```

> **Catatan:** Mode production membutuhkan server (bukan static hosting) karena ada API routes untuk baca/tulis `members.json`.

---

## Deploy ke Vercel

### Cara 1: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Cara 2: Dashboard Vercel

1. Buka [vercel.com](https://vercel.com) → **Add New Project**
2. Import repo `Rann27/autofamilytree` dari GitHub
3. Framework Preset: **Next.js** (auto-detected)
4. Di **Settings → Environment Variables**, tambahkan:

| Key | Value | Environment |
|---|---|---|
| `NEXT_PUBLIC_ADMIN_PASSWORD` | `<password yang diinginkan>` | Production, Preview, Development |

5. Klik **Deploy**

### Penyesuaian Nama Keluarga

Edit `public/config.json` di repo:

```json
{
  "familyName": "Keluarga Besar Contoh",
  "subtitle": "Silsilah & Nasab"
}
```

Lalu push — Vercel akan auto-deploy.

> **Catatan:** File `data/members.json` dan `public/photos/` **tidak ikut ter-deploy** dari repo karena di-gitignore. Data akan terbentuk otomatis saat pertama kali menambahkan anggota melalui CMS. Untuk persistensi data di Vercel, pertimbangkan menggunakan database eksternal (lihat [Catatan Penting](#catatan-penting)).

---

## Panduan Penggunaan

### Alur Pertama Kali (Inisialisasi)

1. Buka `/admin` → masukkan password yang sudah dikonfigurasi
2. Klik **"+ Tambah Anggota"**
3. Karena data masih kosong, otomatis masuk mode **Punjer (Pendiri Moyang)**
4. Isi data: nama lengkap, nama panggilan, jenis kelamin, tahun lahir, foto
5. Klik **Simpan**
6. Punjer tersimpan. Mode ini **tidak akan muncul lagi** — pohon keluarga sudah berakar

### Menambah Anak

1. Dari halaman admin, klik **"+ Tambah Anggota"**
2. Pilih tipe: **Anak**
3. Isi data anak
4. Pilih minimal satu orang tua (Ayah dan/atau Ibu) dari dropdown searchable
5. Simpan → relasi otomatis terhubung:
   - `childIds` di orang tua ditambah ID anak baru
   - `parentIds` di anak diisi ID orang tua yang dipilih

### Menambah Pasangan (Suami/Istri)

1. Dari halaman admin, klik **"+ Tambah Anggota"**
2. Pilih tipe: **Suami / Istri**
3. Isi data pasangan
4. Pilih pasangan (member yang sudah ada) — wajib
5. Simpan → relasi otomatis terhubung:
   - `spouseIds` di kedua belah pihak saling diisi

### Mengedit Anggota

1. Dari tabel admin, klik ikon **Edit** (pensil) pada baris anggota
2. Ubah data yang diperlukan (termasuk relasi orang tua dan pasangan)
3. Simpan

### Menghapus Anggota

1. Klik ikon **Hapus** (tempat sampah) pada baris anggota
2. Konfirmasi di modal dialog
3. Semua referensi ID anggota yang dihapus akan dibersihkan otomatis dari:
   - `spouseIds` semua member
   - `parentIds` semua member
   - `childIds` semua member

### Menjelajahi Pohon Keluarga (Halaman Publik)

- **Pan**: klik dan drag canvas
- **Zoom**: scroll mouse / pinch di mobile
- **Detail anggota**: klik node card
- **Nasab chain**: di modal detail, scroll horizontal untuk melihat garis keturunan ke atas
- **Klik mini card nasab**: untuk berpindah ke detail anggota lain
- **Fit view**: tombol di pojok kanan bawah

---

## Struktur Data

### `data/members.json`

```json
{
  "members": [
    {
      "id": "uuid-v4",
      "name": "Raden Ahmad Fauzi bin Abdullah",
      "nickname": "Pak Ahmad",
      "photo": "/photos/uuid.jpg",
      "gender": "male",
      "birthYear": 1950,
      "isAlive": true,
      "spouseIds": ["uuid-2", "uuid-5"],
      "parentIds": ["uuid-father", "uuid-mother"],
      "childIds": ["uuid-3", "uuid-4"],
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Field

| Field | Tipe | Wajib | Deskripsi |
|---|---|---|---|
| `id` | string (UUID v4) | Ya | ID unik anggota |
| `name` | string | Ya | Nama lengkap |
| `nickname` | string | Tidak | Nama panggilan |
| `photo` | string | Tidak | Path foto (`/photos/uuid.jpg`) |
| `gender` | `"male"` \| `"female"` | Ya | Jenis kelamin |
| `birthYear` | number | Tidak | Tahun lahir |
| `isAlive` | boolean | Tidak | Status hidup (default: `true`) |
| `spouseIds` | string[] | Tidak | ID pasangan (bisa >1 — poligami / menikah lagi) |
| `parentIds` | string[] | Tidak | ID orang tua (maks 2: ayah + ibu) |
| `childIds` | string[] | Tidak | ID anak-anak |
| `createdAt` | string (ISO) | Auto | Timestamp pembuatan |

### Relasi

- **Orang tua → Anak**: garis solid sepia (`var(--color-edge)`)
- **Pasangan**: garis putus-putus emas (`var(--color-edge-spouse)`, `strokeDasharray: 4 2`)
- **Nasab**: mengikuti garis ayah (patrilineal), fallback ke ibu jika tidak ada ayah
- **Poligami**: pasangan pertama digambar lebih dekat, pasangan berikutnya di samping

### Perhitungan Umur

Karena hanya menyimpan tahun lahir (bukan tanggal lengkap), umur ditampilkan sebagai `± 74 tahun` (tanda ± karena tidak tahu bulan/tanggal pasti).

---

## API Reference

### `GET /api/members/`

Mengembalikan seluruh daftar anggota.

```json
{
  "members": [...]
}
```

### `POST /api/members/`

Menambahkan anggota baru. Auto-connect relasi.

**Body:**

```json
{
  "name": "Nama Lengkap",
  "gender": "male",
  "addType": "punjer" | "child" | "spouse",
  "nickname": "Panggilan",
  "birthYear": 1990,
  "isAlive": true,
  "photo": "/photos/uuid.jpg",

  // Jika addType = "child":
  "fatherId": "uuid-ayah",
  "motherId": "uuid-ibu",

  // Jika addType = "spouse":
  "partnerId": "uuid-pasangan"
}
```

### `GET /api/members/[id]/`

Mengembalikan satu anggota.

### `PUT /api/members/[id]/`

Mengupdate data anggota.

**Body:** partial `Member` object (field yang ingin diubah).

### `DELETE /api/members/[id]/`

Menghapus anggota dan membersihkan semua referensi di member lain.

### `POST /api/upload/`

Upload foto anggota.

**Body:**

```json
{
  "photo": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Response:**

```json
{
  "path": "/photos/uuid.jpg"
}
```

---

## Desain & Tema

Aplikasi menggunakan tema **"Tempoe Doeloe"** — estetika kolonial-Jawa akhir abad 19.

### Prinsip Desain

- **Warm & aged** — tidak ada warna dingin atau neon
- **Serif everywhere** — Playfair Display + Lora
- **Ornamental borders** — frame dekoratif dengan double border dan ornamen ✦
- **Handcrafted feel** — garis sambungan tree seperti tinta
- **No sharp modern** — sudut halus (border-radius: 2px), shadow hangat

### Palet Warna

| Variable | Warna | Kegunaan |
|---|---|---|
| `--color-bg` | `#F5ECD7` | Background utama (kertas tua) |
| `--color-bg-dark` | `#EDE0C4` | Panel, header |
| `--color-parchment` | `#FAF3E0` | Card, input, modal |
| `--color-sepia` | `#8B6914` | Warna utama, tombol |
| `--color-sepia-dark` | `#5C4209` | Border kuat, hover |
| `--color-sepia-light` | `#D4A853` | Aksen, border perempuan |
| `--color-gold` | `#C9973A` | Ornamen dekoratif |
| `--color-text` | `#2C1810` | Teks utama (coklat tua) |
| `--color-text-muted` | `#6B4C2A` | Teks sekunder |
| `--color-edge` | `#8B6914` | Garis orang tua → anak |
| `--color-edge-spouse` | `#C9973A` | Garis pasangan |

### Tipografi

| Elemen | Font | Weight | Ukuran |
|---|---|---|---|
| Judul halaman | Playfair Display | 700 | clamp(22px, 4vw, 36px) |
| Section title | Playfair Display | 600 | clamp(16px, 2.5vw, 24px) |
| Body text | Lora | 400 | 15px |
| Label/caption | Lora | 600 | 12px, uppercase |
| Node nama | Playfair Display | 600 | 13px |
| Node panggilan | Lora | 400 italic | 11px |

---

## Responsivitas

### Breakpoints

| Ukuran | Breakpoint | Perilaku |
|---|---|---|
| **Mobile** | ≤ 640px | Header compact, node lebih kecil (120×140), modal fullscreen slide-up, tabel → card list, minimap tersembunyi |
| **Tablet** | ≤ 1024px | Sama seperti desktop, minimap tersembunyi |
| **Desktop** | ≥ 1025px | Full experience, minimap aktif, form dua kolom |

### Mobile-specific

- Modal detail: fullscreen (`100vw × 100vh`, animasi slide-up)
- Nasab chain: scroll horizontal dengan `scroll-snap-type: x mandatory`
- Tabel admin: hanya tampil foto + nama + tombol aksi
- Form admin: satu kolom penuh, tombol simpan sticky di bawah
- Semua tap target minimum **44×44px**
- Hover states disembunyikan di touch device (`@media (hover: none)`)

---

## Konfigurasi

### `public/config.json`

```json
{
  "familyName": "Keluarga Besar [NAMA]",
  "subtitle": "Silsilah & Nasab"
}
```

Dibaca client-side untuk menampilkan nama keluarga di header.

### `.env.local`

```env
NEXT_PUBLIC_ADMIN_PASSWORD=kata_sandi_rahasia
```

Password untuk mengakses halaman CMS admin. Disimpan di `localStorage` setelah login berhasil.

---

## Catatan Penting

### Tentang Penyimpanan Data

Data disimpan di file `data/members.json` di server. Ini cocok untuk penggunaan keluarga kecil-menengah. **Penting diperhatikan:**

- **Lokal (development)**: Data persisten di file sistem lokal — tidak ada masalah
- **Vercel (production)**: Vercel menggunakan **ephemeral filesystem** — data bisa hilang saat serverless function di-redeploy. Untuk penggunaan production yang serius, pertimbangkan migrasi ke:
  - **Vercel KV** (Redis)
  - **Vercel Postgres**
  - **Supabase** / **PlanetScale**
  - Atau database lain yang compatible

### Keamanan Admin

Sistem autentikasi menggunakan password sederhana yang disimpan di `localStorage`. Ini **bukan sistem keamanan tinggi** — dirancang untuk keluarga yang saling percaya. Password bisa diganti via environment variable dan deploy ulang.

### Backup Data

Sebaiknya lakukan backup berkala terhadap file `data/members.json` dan folder `public/photos/` — bisa manual atau via script cron.

### Jalur Nasab

Nasab mengikuti garis **patrilineal** (garis ayah). Jika ayah tidak tercatat, fallback ke ibu. Garis nasab ditampilkan dari moyang tertua hingga anggota yang sedang dilihat.
