# Sistem Prediksi Produksi Jagung

Sistem prediksi produksi jagung berbasis Random Forest dan API cuaca untuk mendukung ketahanan pangan Desa Hilimoasio.

Penelitian ini mengembangkan model prediksi produksi jagung menggunakan algoritma Random Forest dan membandingkannya dengan Linear Regression. Model kemudian diimplementasikan sebagai REST API menggunakan Flask dan diintegrasikan dengan sistem informasi berbasis Laravel.

## Komponen Sistem

Proyek ini terdiri dari beberapa komponen utama:

1. **Model Machine Learning**
   * Random Forest Regression
   * Linear Regression
   * Data historis produksi jagung Kecamatan Idanogawo periode 2003–2024
   * Data cuaca NASA POWER MERRA-2
   * Evaluasi menggunakan MAE, RMSE, dan R²
   * Validasi silang menggunakan LOOCV dan K-Fold

2. **REST API**
   * Flask Python
   * Model Random Forest
   * Menyediakan endpoint prediksi produksi jagung

3. **Sistem Informasi Web**
   * Laravel
   * Inertia.js
   * React
   * Sistem prediksi produksi
   * Dashboard informasi cuaca
   * Rekomendasi operasional pertanian
   * Data historis
   * Pencatatan hasil panen aktual
   * Ekspor data

4. **API Cuaca**
   * Open-Meteo
   * Menyediakan informasi cuaca untuk kebutuhan dashboard dan rekomendasi operasional pertanian

## Struktur Proyek

```
BACKUP_SKRIPSI_FINAL/
│
├── flask-api-model/
│   ├── api_prediksi.py
│   ├── model_rf.pkl
│   └── requirements.txt
│
├── jagung-predict/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── lang/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── tests/
│   ├── artisan
│   ├── composer.json
│   ├── composer.lock
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── model-training/
│   ├── data/
│   ├── hasil_evaluasi.csv
│   ├── statistik_deskriptif.csv
│   └── ujimodel_skripsi.py
│
├── .gitignore
└── README.md
```

## Hasil Model

Berdasarkan hasil pengujian pada penelitian:

| Model | MAE | R² |
| :--- | :--- | :--- |
| **Random Forest** | 26,58 ton | 0,948 |
| **Linear Regression** | 46,67 ton | 0,904 |

Random Forest menghasilkan nilai MAE yang lebih rendah dan R² yang tinggi, sehingga dipilih sebagai model utama dalam sistem.

## Teknologi

* **Machine Learning:** Python, Pandas, NumPy, Scikit-Learn, Joblib
* **REST API:** Flask, Flask-CORS
* **Web Application:** Laravel, React, Inertia.js, MySQL
* **Weather API:** Open-Meteo

## Cara Menjalankan Proyek

### 1. Menjalankan Model API (Flask)

Masuk ke folder API:

```bash
cd flask-api-model
```

Buat dan aktifkan virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

Install dependency & jalankan API:

```bash
pip install -r requirements.txt
python api_prediksi.py
```

### 2. Menjalankan Sistem Web (Laravel)

Masuk ke folder Laravel:

```bash
cd jagung-predict
```

Install dependency PHP & JavaScript:

```bash
composer install
npm install
```

Konfigurasi Environment & Database:

```bash
copy .env.example .env
php artisan key:generate
```

(Sesuaikan konfigurasi database pada file `.env` terlebih dahulu)

Jalankan migrasi database & server Laravel:

```bash
php artisan migrate
php artisan serve
```

Pada terminal terpisah, jalankan asset bundler:

```bash
cd jagung-predict
npm run dev
```

## Pengujian Sistem

Pengujian sistem dilakukan menggunakan:

* Black-box testing
* System Usability Scale (SUS) - Memperoleh rata-rata skor 70,75
* Evaluasi model machine learning (LOOCV & K-Fold Cross Validation)

## Catatan

File `.env`, `vendor/`, `node_modules/`, dan `venv/` tidak disertakan dalam repository karena dikelola via dependency manager. Repository ini dibuat sebagai
