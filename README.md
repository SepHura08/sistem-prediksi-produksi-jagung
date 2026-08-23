# Sistem Prediksi Produksi Jagung

Sistem prediksi produksi jagung berbasis Random Forest dan API cuaca untuk mendukung ketahanan pangan Desa Hilimoasio.

Penelitian ini mengembangkan model prediksi produksi jagung menggunakan algoritma Random Forest dan membandingkannya dengan Linear Regression. Model kemudian diimplementasikan sebagai REST API menggunakan Flask dan diintegrasikan dengan sistem informasi berbasis Laravel.

## Komponen Sistem

Proyek ini terdiri dari beberapa komponen utama:

1. Model Machine Learning
   - Random Forest Regression
   - Linear Regression
   - Data historis produksi jagung Kecamatan Idanogawo periode 2003–2024
   - Data cuaca NASA POWER MERRA-2
   - Evaluasi menggunakan MAE, RMSE, dan R²
   - Validasi silang menggunakan LOOCV dan K-Fold

2. REST API
   - Flask Python
   - Model Random Forest
   - Menyediakan endpoint prediksi produksi jagung

3. Sistem Informasi Web
   - Laravel
   - Inertia.js
   - React
   - Sistem prediksi produksi
   - Dashboard informasi cuaca
   - Rekomendasi operasional pertanian
   - Data historis
   - Pencatatan hasil panen aktual
   - Ekspor data

4. API Cuaca
   - Open-Meteo
   - Menyediakan informasi cuaca untuk kebutuhan dashboard dan rekomendasi operasional pertanian

## Struktur Proyek

```text
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
├── model-taraining
│   ├── data/
│   ├── hasil_evaluasi.csv
│   ├── statistik_deskriptif.csv
│   ├── ujimodel_skripsi.py
├── .gitignore
└── README.md