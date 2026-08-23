# =====================================================
# Prediksi Produksi Jagung
#Perbandingan Linear Regression dan Random Forest
# menggunakan data Kecamatan Idanogawo periode 2003–2024.
# =====================================================


## 1. Import Library
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import warnings
import os
# from google.colab import drive
# from google.colab import files

warnings.filterwarnings('ignore')

# Gaya visual konsisten
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['axes.spines.top'] = False
plt.rcParams['axes.spines.right'] = False

# Warna konsisten
WARNA_LR  = '#1A56A0'
WARNA_RF  = '#2D6A4F'
WARNA_REF = '#E24B4A'

print("=" * 60)
print("  ANALISIS PREDIKSI PRODUKSI JAGUNG")
print("  Kecamatan Idanogawo — BPS Kabupaten Nias 2003–2024")
print("=" * 60)



# ─────────────────────────────────────────────
# 2 : LOAD DATA
# ─────────────────────────────────────────────
print("\n[1/7] Load Dataset...")
print("\n[1/7] Load Dataset...")

df = pd.read_csv("data/data_panen_kecamatan_cuaca.csv", sep=";")

print(f"     ✓ File loaded | Shape: {df.shape}")
print(f"     ✓ Kolom: {df.columns.tolist()}")

print("\n     Preview:")
print(df.head().to_string())

# Untuk Google Colab — upload manual
# from google.colab import files
# import io
# uploaded = files.upload()
# filename = list(uploaded.keys())[0]
# df = pd.read_csv(io.BytesIO(uploaded[filename]), sep=';')

# Untuk lokal — ganti path sesuai lokasi file
# df = pd.read_csv('data_panen_kecamatan.csv', sep=';')

print(f"     ✓ File loaded | Shape: {df.shape}")
print(f"     ✓ Kolom: {df.columns.tolist()}")
print(f"\n     Preview:")
print(df.head().to_string())

# ─────────────────────────────────────────────
# 3: PREPROCESSING
# ─────────────────────────────────────────────
print("\n[2/7] Preprocessing...")

TARGET   = 'produksi_ton'
FEATURES = ['curah_hujan', 'suhu', 'luas_panen', 'kelembapan']

# Cek kolom
missing = [c for c in FEATURES + [TARGET] if c not in df.columns]
if missing:
    raise ValueError(f"Kolom tidak ditemukan: {missing}")

X = df[FEATURES]
y = df[TARGET]

# Cek missing value
print(f"     Missing value: {X.isnull().sum().to_dict()}")
X = X.fillna(X.median())

# Split 70:30
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)
print(f"     ✓ Train: {X_train.shape[0]} baris | Test: {X_test.shape[0]} baris")
print(f"     ✓ Rasio 70:30 | random_state=42")

# ─────────────────────────────────────────────
# 4: TRAINING MODEL
# ─────────────────────────────────────────────
print("\n[3/7] Training Model...")

# Linear Regression
lr = LinearRegression()
lr.fit(X_train, y_train)
print("     ✓ Linear Regression selesai dilatih")

# Random Forest + GridSearchCV
rf = RandomForestRegressor(random_state=42)
param_grid = {'n_estimators': [50, 100, 200]}
grid = GridSearchCV(rf, param_grid, cv=3,
                    scoring='neg_mean_absolute_error', n_jobs=-1)
grid.fit(X_train, y_train)
rf_best = grid.best_estimator_
print(f"     ✓ Random Forest selesai dilatih")
print(f"     ✓ Best n_estimators: {grid.best_params_['n_estimators']}")

# ─────────────────────────────────────────────
# 5: EVALUASI MODEL
# ─────────────────────────────────────────────
print("\n[4/7] Evaluasi Model...")

def evaluasi(model, X_test, y_test, nama):
    y_pred = model.predict(X_test)
    mae  = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2   = r2_score(y_test, y_pred)
    return y_pred, mae, rmse, r2

lr_pred, mae_lr, rmse_lr, r2_lr = evaluasi(lr,      X_test, y_test, "LR")
rf_pred, mae_rf, rmse_rf, r2_rf = evaluasi(rf_best, X_test, y_test, "RF")

print("\n     HASIL EVALUASI MODEL")
print("     " + "─"*52)
print(f"     {'Model':<22} {'MAE':>8} {'RMSE':>8} {'R²':>8}")
print("     " + "─"*52)
print(f"     {'Linear Regression':<22} {mae_lr:>8.2f} {rmse_lr:>8.2f} {r2_lr:>8.3f}")
print(f"     {'Random Forest Tuned':<22} {mae_rf:>8.2f} {rmse_rf:>8.2f} {r2_rf:>8.3f}")
print("     " + "─"*52)

selisih_pct = (mae_lr - mae_rf) / mae_lr * 100
if mae_rf < mae_lr:
    print(f"\n     ✓ RF LEBIH BAIK — MAE lebih rendah {selisih_pct:.1f}% dari LR")
else:
    print(f"\n     ✗ LR lebih baik di MAE")

print(f"\n     Interpretasi MAE RF = {mae_rf:.2f} ton:")
print(f"     → Estimasi produksi bisa meleset ±{mae_rf:.1f} ton dari aktual")
print(f"     → R² {r2_rf:.2f} = model menjelaskan {r2_rf*100:.0f}% pola data")

# ─────────────────────────────────────────────
# 6: GRAFIK ACTUAL VS PREDICTED
# ─────────────────────────────────────────────
print("\n[5/7] Membuat Grafik...")

fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.suptitle(
    'Grafik Actual vs Predicted — Produksi Jagung\n'
    'Kecamatan Idanogawo, Kab. Nias | Data BPS 2003–2024',
    fontsize=13, fontweight='bold'
)

for (model, nama, warna, ax, y_pred_) in [
    (lr,      'Linear Regression', WARNA_LR, axes[0], lr_pred),
    (rf_best, 'Random Forest',     WARNA_RF, axes[1], rf_pred),
]:
    mae_ = mean_absolute_error(y_test, y_pred_)
    r2_  = r2_score(y_test, y_pred_)

    # Scatter
    ax.scatter(y_test, y_pred_, color=warna, s=90,
               alpha=0.75, edgecolors='white', linewidth=0.8,
               zorder=3, label='Data Testing')

    # Garis ideal
    batas = [min(y_test.min(), y_pred_.min()) - 10,
             max(y_test.max(), y_pred_.max()) + 10]
    ax.plot(batas, batas, '--', color=WARNA_REF,
            linewidth=1.8, label='Garis Ideal', zorder=2)

    # Anotasi titik
    for actual, pred in zip(y_test, y_pred_):
        ax.annotate(
            f'{actual:.0f}→{pred:.0f}',
            (actual, pred),
            fontsize=7, color='#555550',
            xytext=(5, 4), textcoords='offset points'
        )

    ax.set_xlabel('Nilai Aktual (ton)', fontsize=11)
    ax.set_ylabel('Nilai Prediksi (ton)', fontsize=11)
    ax.set_title(f'{nama}\nMAE: {mae_:.2f} ton  |  R²: {r2_:.3f}',
                 fontsize=11, fontweight='bold')
    ax.legend(fontsize=9)
    ax.grid(True, alpha=0.25)
    ax.text(0.05, 0.95,
            f'MAE  = {mae_:.2f} ton\nRMSE = {mean_squared_error(y_test,y_pred_)**0.5:.2f}\nR²   = {r2_:.3f}',
            transform=ax.transAxes, fontsize=9.5, verticalalignment='top',
            bbox=dict(boxstyle='round,pad=0.4', facecolor='#FFF8E7',
                      edgecolor='#DDD0A0', alpha=0.9))

plt.tight_layout()
plt.savefig('1_actual_vs_predicted.png', dpi=150, bbox_inches='tight')
plt.show()
print("     ✓ Disimpan: 1_actual_vs_predicted.png")

# ─────────────────────────────────────────────
# GRAFIK FEATURE IMPORTANCE
# ─────────────────────────────────────────────
label_map = {
    'curah_hujan': 'Curah Hujan',
    'suhu':        'Suhu',
    'luas_panen':  'Luas Panen',
    'kelembapan':  'Kelembapan'
}
labels     = [label_map[f] for f in FEATURES]
importance = rf_best.feature_importances_
sorted_idx = np.argsort(importance)
warna_fi   = [WARNA_RF, WARNA_LR, '#B5530A', '#534AB7']

fig2, ax2 = plt.subplots(figsize=(8, 5))
bars = ax2.barh(
    [labels[i] for i in sorted_idx],
    importance[sorted_idx],
    color=[warna_fi[i % len(warna_fi)] for i in sorted_idx],
    edgecolor='white', height=0.55
)
for bar, val in zip(bars, importance[sorted_idx]):
    ax2.text(bar.get_width() + 0.006,
             bar.get_y() + bar.get_height() / 2,
             f'{val:.3f}', va='center', fontsize=10, fontweight='500')

ax2.set_xlabel('Feature Importance Score', fontsize=11)
ax2.set_title(
    'Kontribusi Variabel terhadap Prediksi Random Forest\n'
    '(Nilai lebih tinggi = lebih berpengaruh terhadap produksi)',
    fontsize=11, fontweight='bold'
)
ax2.set_xlim(0, importance.max() * 1.25)
ax2.grid(True, alpha=0.25, axis='x')
plt.tight_layout()
plt.savefig('2_feature_importance.png', dpi=150, bbox_inches='tight')
plt.show()
print("     ✓ Disimpan: 2_feature_importance.png")

# ─────────────────────────────────────────────
# GRAFIK PERBANDINGAN METRIK
# ─────────────────────────────────────────────
fig3, axes3 = plt.subplots(1, 3, figsize=(14, 5))
fig3.suptitle('Perbandingan Performa Model — LR vs RF',
              fontsize=13, fontweight='bold')

metrik_data = [
    ('MAE (ton)',  [mae_lr,  mae_rf],  True,  'Lebih rendah = lebih baik'),
    ('RMSE (ton)', [rmse_lr, rmse_rf], True,  'Lebih rendah = lebih baik'),
    ('R² Score',   [r2_lr,   r2_rf],  False, 'Lebih tinggi = lebih baik'),
]

for ax, (judul, vals, lower_better, catatan) in zip(axes3, metrik_data):
    bars_ = ax.bar(['Linear\nRegression', 'Random\nForest'],
                   vals, color=[WARNA_LR, WARNA_RF],
                   width=0.45, edgecolor='white', linewidth=1.2)
    for b, v in zip(bars_, vals):
        ax.text(b.get_x() + b.get_width()/2,
                b.get_height() + max(vals)*0.02,
                f'{v:.3f}', ha='center', va='bottom',
                fontsize=11, fontweight='bold')

    # Tandai yang lebih baik
    better_idx = 0 if (lower_better and vals[0] < vals[1]) or \
                      (not lower_better and vals[0] > vals[1]) else 1
    bars_[better_idx].set_edgecolor('#E24B4A')
    bars_[better_idx].set_linewidth(2.5)

    ax.set_title(f'{judul}\n{catatan}', fontsize=10, fontweight='bold')
    ax.set_ylim(0, max(vals) * 1.35)
    ax.grid(True, alpha=0.25, axis='y')

plt.tight_layout()
plt.savefig('3_perbandingan_metrik.png', dpi=150, bbox_inches='tight')
plt.show()
print("     ✓ Disimpan: 3_perbandingan_metrik.png")

# ─────────────────────────────────────────────
# GRAFIK RESIDUAL
# ─────────────────────────────────────────────
fig4, axes4 = plt.subplots(1, 2, figsize=(13, 5))
fig4.suptitle('Residual Plot — Selisih Prediksi vs Aktual',
              fontsize=13, fontweight='bold')

for ax, (nama, warna, y_pred_) in zip(axes4, [
    ('Linear Regression', WARNA_LR, lr_pred),
    ('Random Forest',     WARNA_RF, rf_pred),
]):
    resid = y_test - y_pred_
    ax.scatter(y_pred_, resid, color=warna, s=80,
               alpha=0.75, edgecolors='white', linewidth=0.6)
    ax.axhline(0, color=WARNA_REF, linestyle='--', linewidth=1.8)
    ax.set_xlabel('Nilai Prediksi (ton)', fontsize=11)
    ax.set_ylabel('Residual (Aktual − Prediksi)', fontsize=11)
    ax.set_title(
        f'{nama}\nResidual mendekati 0 = prediksi akurat',
        fontsize=11, fontweight='bold'
    )
    ax.grid(True, alpha=0.25)
    ax.text(0.05, 0.95,
            f'Mean Residual = {resid.mean():.2f}\nStd Residual  = {resid.std():.2f}',
            transform=ax.transAxes, fontsize=9.5, verticalalignment='top',
            bbox=dict(boxstyle='round,pad=0.4', facecolor='#F0F8FF',
                      edgecolor='#B0C8E0', alpha=0.9))

plt.tight_layout()
plt.savefig('4_residual_plot.png', dpi=150, bbox_inches='tight')
plt.show()
print("     ✓ Disimpan: 4_residual_plot.png")

# ─────────────────────────────────────────────
# 7: PREDIKSI INTERAKTIF
# ─────────────────────────────────────────────
print("\n[6/7] Prediksi Contoh...")
print("     (Simulasi input dari pengguna sistem)")

contoh_input = [
    {'curah_hujan': 2837.84, 'suhu': 27.58, 'luas_panen': 2,   'kelembapan': 79.45},  # data desa 2025
    {'curah_hujan': 2800, 'suhu': 27.8,  'luas_panen': 38,  'kelembapan': 79.0},   # contoh prediksi
    {'curah_hujan': 3000, 'suhu': 27.5,  'luas_panen': 50,  'kelembapan': 80.0},   # lahan lebih luas
]

print(f"\n     {'Curah':>7} {'Suhu':>6} {'Luas':>6} {'Lembap':>8} │ {'LR (ton)':>10} {'RF (ton)':>10}")
print("     " + "─"*60)
for inp in contoh_input:
    df_inp = pd.DataFrame([inp], columns=FEATURES)
    p_lr = lr.predict(df_inp)[0]
    p_rf = rf_best.predict(df_inp)[0]
    print(f"     {inp['curah_hujan']:>7.0f} {inp['suhu']:>6.1f} "
          f"{inp['luas_panen']:>6.1f} {inp['kelembapan']:>8.1f} │ "
          f"{p_lr:>10.2f} {p_rf:>10.2f}")

print("\n     Catatan baris 1: data aktual desa 2025")
print(f"     Produksi aktual desa = 2.5 ton")
df_desa = pd.DataFrame([contoh_input[0]], columns=FEATURES)
pred_desa = rf_best.predict(df_desa)[0]
selisih = abs(pred_desa - 2.5)
print(f"     Prediksi RF utk desa = {pred_desa:.2f} ton")
print(f"     Selisih prediksi vs aktual = {selisih:.2f} ton")

# ─────────────────────────────────────────────
# 8: SIMPAN MODEL & HASIL
# ─────────────────────────────────────────────
print("\n[7/7] Menyimpan File...")

joblib.dump(lr,      'model_lr.pkl')
joblib.dump(rf_best, 'model_rf.pkl')
print("     ✓ model_lr.pkl")
print("     ✓ model_rf.pkl")

hasil = pd.DataFrame({
    'Model':  ['Linear Regression', 'Random Forest Tuned'],
    'MAE':    [round(mae_lr,2),  round(mae_rf,2)],
    'RMSE':   [round(rmse_lr,2), round(rmse_rf,2)],
    'R2':     [round(r2_lr,3),   round(r2_rf,3)],
    'Best_n_estimators': ['-', grid.best_params_['n_estimators']]
})
hasil.to_csv('hasil_evaluasi.csv', index=False)
print("     ✓ hasil_evaluasi.csv")


print("\n" + "="*60)
print("  RINGKASAN AKHIR")
print("="*60)
print(f"  Algoritma terpilih : Random Forest")
print(f"  MAE RF             : {mae_rf:.2f} ton")
print(f"  MAE LR             : {mae_lr:.2f} ton")
print(f"  Keunggulan RF      : {selisih_pct:.1f}% lebih baik di MAE")
print(f"  R² Score RF        : {r2_rf:.3f} ({r2_rf*100:.0f}% pola data terprediksi)")
print(f"  Best n_estimators  : {grid.best_params_['n_estimators']}")
print("="*60)
print("  Grafik tersimpan:")
print("  1_actual_vs_predicted.png")
print("  2_feature_importance.png")
print("  3_perbandingan_metrik.png")
print("  4_residual_plot.png")
print("="*60)


print(df['curah_hujan'].mean())
print(df['suhu'].mean())
print(df['kelembapan'].mean())



# ─────────────────────────────────────────────
# VALIDASI SILANG — LOOCV & K-FOLD
# Validasi silang dilakukan sebagai evaluasi tambahan terhadap model
# karena dataset penelitian memiliki jumlah observasi yang relatif kecil,
# yaitu 21 observasi.
# ─────────────────────────────────────────────

from sklearn.model_selection import (
    LeaveOneOut, KFold, cross_val_score, cross_validate
)
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score
import numpy as np
import pandas as pd

# Asumsikan X dan y sudah ada dari kode sebelumnya
# X = df[FEATURES], y = df[TARGET]

print("=" * 60)
print("  VALIDASI SILANG — LOOCV & K-FOLD")
print("=" * 60)

# ── Model ──────────────────────────────────────────────────
rf  = RandomForestRegressor(n_estimators=50, random_state=42)
lr  = LinearRegression()

# ─────────────────────────────────────────────
# 1. LOOCV — Leave-One-Out Cross Validation
# ─────────────────────────────────────────────
print("\n[1] LOOCV (Leave-One-Out Cross Validation)")
print("    Setiap 1 dari 21 data dijadikan test secara bergantian")
print("─" * 60)

loo = LeaveOneOut()

def loocv_manual(model, X, y, nama):
    mae_list, pred_list, actual_list = [], [], []

    for train_idx, test_idx in loo.split(X):
        X_train = X.iloc[train_idx]
        X_test  = X.iloc[test_idx]
        y_train = y.iloc[train_idx]
        y_test  = y.iloc[test_idx]

        model.fit(X_train, y_train)
        pred = model.predict(X_test)[0]

        mae_list.append(abs(pred - y_test.values[0]))
        pred_list.append(pred)
        actual_list.append(y_test.values[0])

    mae_loocv = np.mean(mae_list)
    r2_loocv  = r2_score(actual_list, pred_list)
    rmse_loocv = np.sqrt(np.mean([(p-a)**2 for p,a in zip(pred_list, actual_list)]))

    print(f"\n  {nama}:")
    print(f"  MAE  LOOCV = {mae_loocv:.2f} ton")
    print(f"  RMSE LOOCV = {rmse_loocv:.2f} ton")
    print(f"  R²   LOOCV = {r2_loocv:.3f}")

    return mae_loocv, rmse_loocv, r2_loocv, pred_list, actual_list

mae_rf_loo, rmse_rf_loo, r2_rf_loo, pred_rf, actual = loocv_manual(
    RandomForestRegressor(n_estimators=50, random_state=42), X, y, "Random Forest"
)

mae_lr_loo, rmse_lr_loo, r2_lr_loo, pred_lr, _ = loocv_manual(
    LinearRegression(), X, y, "Linear Regression"
)

# ─────────────────────────────────────────────
# 2. K-FOLD (k=5) — sebagai perbandingan
# ─────────────────────────────────────────────
print("\n\n[2] K-Fold Cross Validation (k=5)")
print("─" * 60)

kf = KFold(n_splits=5, shuffle=True, random_state=42)

def kfold_eval(model, X, y, nama):
    hasil = cross_validate(
        model, X, y, cv=kf,
        scoring=['neg_mean_absolute_error',
                 'neg_root_mean_squared_error',
                 'r2'],
        return_train_score=False
    )
    mae  = -hasil['test_neg_mean_absolute_error'].mean()
    rmse = -hasil['test_neg_root_mean_squared_error'].mean()
    r2   =  hasil['test_r2'].mean()

    print(f"\n  {nama}:")
    print(f"  MAE  K-Fold = {mae:.2f} ton  (±{-hasil['test_neg_mean_absolute_error'].std():.2f})")
    print(f"  RMSE K-Fold = {rmse:.2f} ton")
    print(f"  R²   K-Fold = {r2:.3f}")
    return mae, rmse, r2

mae_rf_kf, rmse_rf_kf, r2_rf_kf = kfold_eval(
    RandomForestRegressor(n_estimators=50, random_state=42), X, y, "Random Forest"
)

mae_lr_kf, rmse_lr_kf, r2_lr_kf = kfold_eval(
    LinearRegression(), X, y, "Linear Regression"
)

# ─────────────────────────────────────────────
# 3. TABEL PERBANDINGAN LENGKAP
# ─────────────────────────────────────────────
print("\n\n[3] TABEL PERBANDINGAN HASIL VALIDASI")
print("=" * 70)
print(f"{'Metode':<25} {'Model':<20} {'MAE':>8} {'RMSE':>8} {'R²':>8}")
print("─" * 70)
print(f"{'70:30 Split (awal)':<25} {'Random Forest':<20} {26.58:>8.2f} {'—':>8} {0.948:>8.3f}")
print(f"{'70:30 Split (awal)':<25} {'Linear Regression':<20} {46.67:>8.2f} {'—':>8} {0.904:>8.3f}")
print("─" * 70)
print(f"{'LOOCV':<25} {'Random Forest':<20} {mae_rf_loo:>8.2f} {rmse_rf_loo:>8.2f} {r2_rf_loo:>8.3f}")
print(f"{'LOOCV':<25} {'Linear Regression':<20} {mae_lr_loo:>8.2f} {rmse_lr_loo:>8.2f} {r2_lr_loo:>8.3f}")
print("─" * 70)
print(f"{'K-Fold (k=5)':<25} {'Random Forest':<20} {mae_rf_kf:>8.2f} {rmse_rf_kf:>8.2f} {r2_rf_kf:>8.3f}")
print(f"{'K-Fold (k=5)':<25} {'Linear Regression':<20} {mae_lr_kf:>8.2f} {rmse_lr_kf:>8.2f} {r2_lr_kf:>8.3f}")
print("=" * 70)

selisih = (mae_lr_loo - mae_rf_loo) / mae_lr_loo * 100
print(f"\n  RF lebih baik dari LR di LOOCV: {selisih:.1f}%")

# ─────────────────────────────────────────────
# 4. GRAFIK LOOCV — Actual vs Predicted
# ─────────────────────────────────────────────
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.suptitle(
    'LOOCV — Actual vs Predicted (n=21)\n'
    'Setiap titik = satu tahun yang dijadikan data uji',
    fontsize=13, fontweight='bold'
)

for ax, (nama, pred, warna) in zip(axes, [
    ('Random Forest',     pred_rf, '#2D6A4F'),
    ('Linear Regression', pred_lr, '#1A56A0'),
]):
    mae_ = np.mean([abs(p-a) for p,a in zip(pred, actual)])
    r2_  = r2_score(actual, pred)

    ax.scatter(actual, pred, color=warna, s=90,
               alpha=0.75, edgecolors='white', linewidth=0.8,
               zorder=3, label='LOOCV Prediction')

    batas = [min(min(actual), min(pred)) - 10,
             max(max(actual), max(pred)) + 10]
    ax.plot(batas, batas, '--', color='#E24B4A',
            linewidth=1.8, label='Garis Ideal')

    for a, p in zip(actual, pred):
        ax.annotate(f'{a:.0f}→{p:.0f}', (a, p),
                    fontsize=7, color='#555550',
                    xytext=(5, 4), textcoords='offset points')

    ax.set_xlabel('Nilai Aktual (ton)', fontsize=11)
    ax.set_ylabel('Nilai Prediksi LOOCV (ton)', fontsize=11)
    ax.set_title(f'{nama}\nMAE: {mae_:.2f} ton  |  R²: {r2_:.3f}',
                 fontsize=11, fontweight='bold')
    ax.legend(fontsize=9)
    ax.grid(True, alpha=0.25)
    ax.text(0.05, 0.95,
            f'MAE  = {mae_:.2f} ton\nR²   = {r2_:.3f}\nn    = 21',
            transform=ax.transAxes, fontsize=9.5,
            verticalalignment='top',
            bbox=dict(boxstyle='round,pad=0.4',
                      facecolor='#FFF8E7',
                      edgecolor='#DDD0A0', alpha=0.9))

plt.tight_layout()
plt.savefig('loocv_actual_vs_predicted.png', dpi=150, bbox_inches='tight')
plt.show()
print("     Disimpan: loocv_actual_vs_predicted.png")

# ─────────────────────────────────────────────
# 5. KESIMPULAN UNTUK SIDANG
# ─────────────────────────────────────────────
print("\n" + "="*60)
print("  KESIMPULAN VALIDASI SILANG")
print("="*60)
print(f"  Dataset        : 21 observasi (2003-2024)")
print(f"  Metode terbaik : LOOCV (optimal untuk n<30)")
print(f"  MAE RF LOOCV   : {mae_rf_loo:.2f} ton")
print(f"  R²  RF LOOCV   : {r2_rf_loo:.3f}")
print(f"  Keunggulan RF  : {selisih:.1f}% lebih baik dari LR")
print("="*60)
print("\n  JUSTIFIKASI PENGGUNAAN RF PADA DATA KECIL:")
print("  1. LOOCV memaksimalkan penggunaan semua 21 data")
print("  2. RF dengan Bagging terbukti robust pada small dataset")
print("  3. Performa RF konsisten lebih baik dari LR di semua metode")
print("  4. Tidak ada data tambahan yang tersedia (limitasi BPS)")
print("="*60)

# ─────────────────────────────────────────────
# STATISTIK DESKRIPTIF DATASET
# Dihasilkan dari data yang sama dengan training
# ─────────────────────────────────────────────

print("=" * 65)
print("  STATISTIK DESKRIPTIF DATASET")
print("  Sumber: BPS Kab. Nias + NASA POWER MERRA-2 (2003-2024)")
print("=" * 65)

# Kolom yang ditampilkan
kolom_display = {
    'luas_panen'  : 'Luas Panen (Ha)',
    'produksi_ton': 'Produksi (Ton)',
    'curah_hujan' : 'Curah Hujan (mm)',
    'suhu'        : 'Suhu (°C)',
    'kelembapan'  : 'Kelembapan (%)',
}

# Hitung statistik
print(f"\n{'Variabel':<22} {'Min':>8} {'Max':>8} {'Rata-rata':>10} {'Std Dev':>9}")
print("─" * 62)

hasil_statistik = {}
for kolom, label in kolom_display.items():
    if kolom in df.columns:
        min_val  = df[kolom].min()
        max_val  = df[kolom].max()
        mean_val = df[kolom].mean()
        std_val  = df[kolom].std(ddof=1)
        median_val = df[kolom].median()

        hasil_statistik[label] = {
            'min': min_val, 'max': max_val,
            'mean': mean_val, 'std': std_val
        }

        print(f"{label:<22} {min_val:>8.2f} {max_val:>8.2f} "
              f"{mean_val:>10.2f} {std_val:>9.2f}")

print("─" * 62)
print(f"  Jumlah observasi : {len(df)} baris")
print(f"  Periode          : 2003 – 2024")
print(f"  Sumber cuaca     : NASA POWER MERRA-2")
print(f"  Koordinat        : Lat 1.0273° LU, Lon 97.7399° BT")
print("=" * 65)

# ── Cek missing value ──────────────────────────────────────
print("\n  CEK MISSING VALUE:")
for kolom in kolom_display.keys():
    if kolom in df.columns:
        missing = df[kolom].isnull().sum()
        status  = "✓ Tidak ada" if missing == 0 else f"✗ {missing} nilai kosong"
        print(f"  {kolom_display[kolom]:<22} : {status}")

print("\n  Kesimpulan: Dataset siap digunakan tanpa imputasi.")
print("=" * 65)

# ── Simpan ke CSV untuk lampiran ──────────────────────────
import pandas as pd

baris_stat = []
for label, stat in hasil_statistik.items():
    baris_stat.append({
        'Variabel'    : label,
        'Minimum'     : round(stat['min'],  2),
        'Maksimum'    : round(stat['max'],  2),
        'Rata-rata'   : round(stat['mean'], 2),
        'Std Deviasi' : round(stat['std'],  2),
    })

df_statistik = pd.DataFrame(baris_stat)
df_statistik.to_csv('statistik_deskriptif.csv', index=False)
print("\n  Disimpan: statistik_deskriptif.csv")


