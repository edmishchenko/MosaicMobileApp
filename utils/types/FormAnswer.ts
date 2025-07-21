export interface FormAnswer {
    id: string;
    patient_id: string;
    form_id: string;
    question_id: string;
    answer: string;
    sync: boolean;
    created_at: string;
    updated_at: string;
}
