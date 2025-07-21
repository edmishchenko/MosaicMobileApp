export interface SoldProduct {
    product_id: string;
    quantity: number;
}

export interface Visit {
    id: string;
    patient_id: string;
    date: string;
    notes: string;
    services: string[]; // service IDs
    used_products: string[]; // product IDs
    sold_products: SoldProduct[];
    photos: string[]; // URLs or local paths
    sync: boolean;
    created_at: string;
    updated_at: string;
}
