# 📋 PANDUAN INSTALASI — UjianKu Pro (CBT Online)

Arsitektur: **Frontend statis (GitHub Pages)** + **Google Apps Script sebagai REST API** + **Google Sheets** sebagai database.

## A. Backend (Google Apps Script)
1. Buka https://script.google.com → **Proyek baru**.
2. Ganti isi `Code.gs` dengan isi **Kode.gs** (rename file menjadi `Kode`).
3. ⚙ **Setelan Proyek** → centang *Tampilkan file manifes "appsscript.json"*, lalu ganti isinya dengan **appsscript.json** (scope Drive, Sheets, UrlFetch, Mail, Trigger).
4. Pilih fungsi `setupAppEnvironment` → ▶ **Run** — **cukup sekali** (aman diulang; rahasia tidak ditimpa). Izinkan akses.
5. Buka **Execution log** dan **catat sandi admin awal** (`admin / ...`). Tampil sekali saja.
6. (Opsional uji coba) jalankan `seedDemo` → log menampilkan 2 Token PIN contoh.
7. **Deploy → New deployment → Web app** → *Execute as:* **Me**, *Who has access:* **Anyone** → salin URL `/exec`.
8. Setelah mengubah kode di kemudian hari: **Deploy → Manage deployments → ✏ → New version** (jangan New deployment).

## B. Rahasia (Script Properties — otomatis)
| Nilai | Cara |
|---|---|
| `SESSION_SECRET`, ID Spreadsheet/Folder, hash sandi | Dibuat otomatis oleh setup — tidak ada di kode/Sheets |
| `FONNTE_TOKEN` | Isi dari aplikasi: **WhatsApp & Notifikasi → Konfigurasi** (admin). Hanya tampil tersamar |

Segera **ganti sandi admin** (Pengguna → Reset sandi). Jangan menambah editor proyek Apps Script sembarangan (editor dapat melihat Script Properties). Lupa sandi admin → jalankan `resetAdmin()`. Rotasi sesi → `rotasiSecretSesi()`.

## C. Frontend (GitHub Pages)
Folder kerja = hasil ekstrak ZIP `ujianku-pro-frontend` (**di dalamnya langsung ada `index.html`**). Di folder inilah `git init` dijalankan.
1. Edit `js/config.js` → ganti `GANTI_DENGAN_ID_DEPLOYMENT` dengan URL `/exec` Anda.
2. Buat repository **Public** baru di github.com (jangan centang README).
3. Buka terminal **di folder tersebut**, cek `dir` / `ls` — `index.html` harus terlihat paling atas. Lalu:
```
git init
git add .
git commit -m "UjianKu Pro"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```
4. GitHub → repo → **Settings → Pages** → Branch `main`, folder `/ (root)` → Save. Tunggu 1–2 menit.
5. Update berikutnya: `git add . && git commit -m "update" && git push`, lalu Ctrl+Shift+R. **Jangan upload via web GitHub** (struktur folder rusak).

## D. Alur Pemakaian
Admin login → buat akun guru → Guru: tambah siswa → bank soal → paket ujian → **Token** per kelas → bagikan PIN (atau otomatis via WA) → siswa membuka situs, memasukkan PIN → nilai otomatis, rekap real-time.

## E. WhatsApp (Fonnte) & CRM
1. fonnte.com → Device → scan QR → salin token → aplikasi: *Konfigurasi* → tempel token → nyalakan saklar → Simpan (trigger 1 menit terpasang otomatis).
2. **CRM Kontak**: klik **Sinkron** (menyatukan siswa menjadi kontak) → filter segmen/kelas, Opt-out, Tag, Deteksi WA.
3. **Blast**: pilih segmen, tulis pesan → server mengirim 1 batch (10/20/50) per menit. Mulai dari batch 10, jeda ≥5 detik agar nomor tidak diblokir.
4. Notifikasi otomatis: *Token dibuat* dan *Nilai terbit* (matriks bisa diubah per kanal).

## F. Migrasi dari App Lama
Admin → **Pengaturan → Migrasi Data**: tempel URL spreadsheet lama (akun Google yang sama) → **Pindai (Dry-run)** → **Jalankan Import**. Data lama hanya dibaca; aman diulang (tanpa duplikat) untuk delta sync sebelum cutover.

## G. Catatan Performa & Batasan Jujur
- Cache berversi (config, pengguna, soal per paket, CRM); pencarian baris via TextFinder; penulisan sesi ber-`LockService`; autosave 30 detik.
- Trigger notifikasi memakai kuota trigger harian akun Google.
- Belum diuji pada server GAS sungguhan di sesi ini — lakukan uji beban dengan beberapa siswa sebelum ujian resmi.
