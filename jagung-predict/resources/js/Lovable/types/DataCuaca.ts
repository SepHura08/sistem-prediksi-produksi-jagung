export interface PrakiraanHarian {
    tanggal: string;
    hari: string;
    tanggal_indo?: string;
    suhu: number;
    curah_hujan: number;   // ← snake_case sesuai Laravel
    kelembapan?: number;
    ikon: string;
    kondisi: string;
    aman_semprot?: boolean;
    aman_pupuk?: boolean;
}

export interface CuacaHariIni {
    suhu: number;
    curah_hujan: number;
    kelembapan: number;
    ikon: string;
    kondisi: string;
}

export interface DataCuaca {
    berhasil: boolean;
    sumber: string;
    hari_ini: PrakiraanHarian;
    prakiraan: PrakiraanHarian[];
    rekomendasi: {
        pemupukan: RekomendasiItem;
        penyemprotan: RekomendasiItem;
        irigasi: RekomendasiItem;
    };
}

export interface RekomendasiItem {
    status?: string;
    warna: string;
    ikon?: string;
    judul: string;
    pesan: string;
    total_huja_7hari?: number;
}