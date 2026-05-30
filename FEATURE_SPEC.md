# Spesifikasi Fitur Sinau.id

Dokumen ini menjelaskan secara rinci seluruh fitur yang ada di platform Sinau.id dari sudut pandang pengguna akhir (user experience), tanpa menggunakan istilah teknis atau pemrograman.

---

## 1. Sistem Akun dan Profil Pengguna

### Pendaftaran dan Masuk (Login & Sign Up)
- Pengguna dapat membuat akun baru menggunakan alamat email dan kata sandi.
- Pengguna dapat masuk ke akun yang sudah ada dengan aman.
- Sistem menyediakan fitur "Lupa Kata Sandi" untuk memulihkan akses akun.

### Orientasi Pengguna Baru (Onboarding)
- Saat pertama kali mendaftar, pengguna akan diarahkan ke halaman orientasi singkat.
- Pengguna dapat mengatur profil dasar (nama, tingkat pendidikan/sekolah).
- Pengguna dapat menetapkan tujuan belajar utama mereka di platform ini.

---

## 2. Dasbor Utama (Dashboard)

Dasbor adalah halaman utama yang pertama kali dilihat pengguna setelah masuk. Halaman ini berfungsi sebagai pusat kendali ringkas.

- **Ringkasan Aktivitas:** Menampilkan ucapan selamat datang personal dan ringkasan aktivitas belajar hari ini.
- **Tugas Terdekat:** Menampilkan daftar tugas atau PR yang tenggat waktunya paling dekat agar pengguna tidak lupa.
- **Jadwal Hari Ini:** Menampilkan jadwal pelajaran, kuliah, atau sesi belajar yang harus diikuti pada hari tersebut.
- **Akses Cepat:** Tombol-tombol pintas untuk langsung menuju ke halaman Jadwal, Tugas, atau Mode Fokus.

---

## 3. Manajemen Tugas (Studio/Tugas)

Fitur ini dirancang seperti papan virtual interaktif agar pengguna dapat mengelola tugas dan proyek sekolah/kuliah mereka dengan sangat visual.

### Papan Interaktif (Kanban Board)
- **Kolom Kategori:** Tugas dibagi ke dalam beberapa kolom status, contohnya: "Belum Dikerjakan", "Sedang Dikerjakan", dan "Selesai".
- **Geser dan Lepas (Drag-and-Drop):** Pengguna dapat memindahkan kartu tugas dari satu kolom ke kolom lainnya hanya dengan menggeser dan melepaskannya menggunakan mouse atau layar sentuh.
- **Responsif dan Cepat:** Perubahan status tugas terjadi secara instan di layar tanpa perlu memuat ulang (refresh) halaman, sementara data tersimpan dengan aman di latar belakang.

### Detail Tugas
- **Pembuatan Tugas Baru:** Pengguna dapat menambahkan tugas baru dengan mengisi judul, deskripsi singkat, tenggat waktu (deadline), dan tingkat prioritas (Tinggi, Sedang, Rendah).
- **Pengeditan Tugas:** Setiap tugas dapat diklik untuk melihat detailnya, mengubah deskripsi, atau memperbarui tenggat waktu.
- **Penghapusan Tugas:** Tugas yang sudah tidak relevan dapat dihapus dari papan.

---

## 4. Manajemen Jadwal (Jadwal)

Fitur ini membantu pengguna mengatur waktu belajar, jadwal kelas, dan tenggat waktu tugas.

### Tampilan Kalender & Daftar
- Pengguna dapat melihat jadwal dalam format kalender bulanan/mingguan atau dalam format daftar agenda berurutan.
- Setiap jadwal yang dimasukkan akan memiliki penanda warna (color-coding) untuk membedakan antara kelas, waktu belajar mandiri, dan tenggat waktu tugas.

### Pengelolaan Agenda
- **Tambah Agenda:** Pengguna dapat memasukkan jadwal baru (misal: "Kelas Matematika") lengkap dengan waktu mulai, waktu selesai, dan lokasi/tautan kelas.
- **Pengingat Harian:** Sistem akan menyorot agenda apa saja yang harus diselesaikan pada hari ini.

---

## 5. Mode Fokus (Fokus)

Fitur ini khusus dirancang untuk membantu pengguna berkonsentrasi penuh saat belajar, meminimalisir gangguan.

### Timer Belajar
- **Metode Pembagian Waktu:** Pengguna dapat menggunakan timer bawaan untuk mengatur durasi belajar dan istirahat berulang (contoh: 25 menit belajar, 5 menit istirahat).
- **Tampilan Bebas Gangguan:** Saat timer berjalan, antarmuka akan menjadi sangat bersih dan minimalis, menyembunyikan menu-menu lain agar pengguna bisa fokus pada tugas yang sedang dikerjakan.

### Integrasi dengan Tugas
- Pengguna dapat memilih satu tugas spesifik dari daftar "Tugas" mereka untuk dikerjakan selama sesi fokus ini berjalan.

---

## 6. Antarmuka dan Pengalaman Pengguna (UI/UX)

- **Desain Gelap yang Nyaman (Dark Mode):** Seluruh tampilan platform menggunakan tema gelap yang modern dan elegan, sehingga tidak membuat mata cepat lelah saat belajar di malam hari.
- **Animasi Halus:** Terdapat efek transisi dan animasi visual yang lembut saat pengguna berinteraksi dengan tombol atau pindah antar halaman, memberikan kesan premium dan hidup.
- **Aksesibilitas Multi-Perangkat:** Tampilan platform akan menyesuaikan secara otomatis (responsif) sehingga tetap nyaman dan mudah digunakan baik di layar komputer, laptop, maupun tablet.
