export interface DataHistoris {
    id: number;
    tahun: string;              // untuk label X axis grafik
    estimasiProduksi: number;   // mapped dari estimated_ton
    aktual: number | null;      // mapped dari actual_ton
    land_area: number;
    created_at: string;
}

export interface ItemPrediksi {
    id: number;
    land_area: number;
    estimated_ton: number;
    actual_ton: number | null;
    harvest_year?: number | null;
    data_source?: string;
    created_at: string;
}