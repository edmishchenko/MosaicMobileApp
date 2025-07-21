export interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    photo: string; // URL or local path
    notes: string;
    sync: boolean;
    created_at: string; // ISO string or Firestore timestamp
    updated_at: string;
}
