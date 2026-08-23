# =====================================================
# FLASK API — MODEL PREDIKSI PRODUKSI JAGUNG
# Desa Hilimoasio, Kec. Idanogawo, Kab. Nias
#
# ARSITEKTUR YANG BENAR:
# Flask HANYA bertugas menjalankan model.
# Semua parameter dikirim dari Laravel.
# Flask tidak tahu dan tidak peduli
# dari mana parameter berasal.
#
# Input  : curah_hujan, suhu, luas_panen, kelembapan
# Output : estimasi_ton
# =====================================================

from flask import Flask, request, jsonify
import joblib
import numpy as np
import os
import sys

app = Flask(__name__)

# ─────────────────────────────────────────────────
# LOAD MODEL — dengan debug path yang jelas
# ─────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model_rf.pkl')

print("=" * 50)
print("Flask RF API — Prediksi Produksi Jagung")
print("=" * 50)
print(f"Direktori  : {BASE_DIR}")
print(f"Model path : {MODEL_PATH}")
print(f"Model ada  : {os.path.exists(MODEL_PATH)}")

# Tampilkan semua file di direktori untuk debug
print(f"\nFile di direktori:")
for f in os.listdir(BASE_DIR):
    print(f"  - {f}")

model = None

if not os.path.exists(MODEL_PATH):
    print("\nERROR: model_rf.pkl tidak ditemukan!")
    print("Pastikan model_rf.pkl ada di folder yang sama dengan api_prediksi.py")
    print("Cara download dari Google Colab:")
    print("  files.download('model_rf.pkl')")
else:
    try:
        model = joblib.load(MODEL_PATH)
        print(f"\nModel berhasil dimuat!")
        print(f"Tipe   : {type(model).__name__}")
        print(f"Fitur  : {model.n_features_in_}")
    except Exception as e:
        print(f"\nGagal muat model: {e}")
        model = None

print("=" * 50)

# ─────────────────────────────────────────────────
# URUTAN FITUR — harus sama persis dengan training
# FEATURES = ['curah_hujan', 'suhu', 'luas_panen', 'kelembapan']
# ─────────────────────────────────────────────────
URUTAN_FITUR = ['curah_hujan', 'suhu', 'luas_panen', 'kelembapan']


# ─────────────────────────────────────────────────
# ENDPOINT: GET /status
# Cek apakah Flask API berjalan normal
# ─────────────────────────────────────────────────
@app.route('/status', methods=['GET'])
def status():
    return jsonify({
        'berhasil'    : True,
        'pesan'       : 'Flask RF API aktif',
        'model_dimuat': model is not None,
        'model_path'  : MODEL_PATH,
        'model_ada'   : os.path.exists(MODEL_PATH),
    })



@app.route('/prediksi', methods=['POST'])
def prediksi():

    # Cek model tersedia
    if model is None:
        return jsonify({
            'berhasil': False,
            'pesan'   : 'Model tidak tersedia. Pastikan model_rf.pkl ada.',
        }), 500

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'berhasil': False,
                'pesan'   : 'Body request kosong. Kirim JSON.',
            }), 400

        # Validasi semua parameter wajib ada
        parameter_wajib = ['curah_hujan', 'suhu', 'luas_panen', 'kelembapan']
        parameter_hilang = [p for p in parameter_wajib if p not in data]

        if parameter_hilang:
            return jsonify({
                'berhasil'          : False,
                'pesan'             : f'Parameter tidak lengkap',
                'parameter_hilang'  : parameter_hilang,
                'parameter_wajib'   : parameter_wajib,
            }), 400

        # Konversi ke float
        curah_hujan = float(data['curah_hujan'])
        suhu        = float(data['suhu'])
        luas_panen  = float(data['luas_panen'])
        kelembapan  = float(data['kelembapan'])

        # Validasi nilai luas lahan
        if luas_panen <= 0:
            return jsonify({
                'berhasil': False,
                'pesan'   : 'luas_panen harus lebih dari 0',
            }), 400

        if luas_panen > 500:
            return jsonify({
                'berhasil': False,
                'pesan'   : 'luas_panen tidak wajar, maksimal 500 Ha',
            }), 400

        # Susun fitur sesuai urutan saat training
        # URUTAN PENTING: ['curah_hujan','suhu','luas_panen','kelembapan']
        fitur = np.array([[
            curah_hujan,
            suhu,
            luas_panen,
            kelembapan,
        ]])

        # Jalankan prediksi
        hasil    = model.predict(fitur)[0]
        estimasi = round(float(hasil), 2)

        return jsonify({
            'berhasil'    : True,
            'estimasi_ton': estimasi,
        }), 200

    except ValueError as e:
        return jsonify({
            'berhasil': False,
            'pesan'   : f'Nilai tidak valid: {str(e)}',
        }), 400

    except Exception as e:
        return jsonify({
            'berhasil': False,
            'pesan'   : f'Terjadi kesalahan: {str(e)}',
        }), 500


# ─────────────────────────────────────────────────
# JALANKAN SERVER
# ─────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )