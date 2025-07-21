import db from './database';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';

export const syncPatients = async () => {
    const snapshot = await getDocs(collection(firestore, 'patients'));

    // @ts-ignore
    await db.execAsync(async (tx) => {
        for (const doc of snapshot.docs) {
            const data = doc.data();
            await tx.executeSqlAsync(
                `INSERT OR
                 REPLACE INTO patients
                 (id, first_name, last_name, email, phone, date_of_birth, photo, notes, sync, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    doc.id,
                    data.first_name,
                    data.last_name,
                    data.email,
                    data.phone,
                    data.date_of_birth,
                    data.photo,
                    data.notes,
                    1,
                    data.created_at,
                    data.updated_at,
                ]
            );
        }
    });
};

export const syncFormAnswers = async (patientId: string) => {
    const snapshot = await getDocs(
        collection(firestore, `patients/${patientId}/form_answers`)
    );

    // @ts-ignore
    await db.execAsync(async (tx) => {
        for (const doc of snapshot.docs) {
            const data = doc.data();
            await tx.executeSqlAsync(
                `INSERT OR REPLACE INTO form_answers 
         (id, patient_id, form_id, question_id, answer, sync, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    doc.id,
                    patientId,
                    data.form_id,
                    data.question_id,
                    data.answer,
                    1,
                    data.created_at,
                    data.updated_at,
                ]
            );
        }
    });
};

export const syncVisits = async (patientId: string) => {
    const snapshot = await getDocs(
        collection(firestore, `patients/${patientId}/visits`)
    );

    // @ts-ignore
    await db.execAsync(async (tx) => {
        for (const doc of snapshot.docs) {
            const data = doc.data();
            await tx.executeSqlAsync(
                `INSERT OR REPLACE INTO visits 
         (id, patient_id, date, notes, services, used_products, sold_products, photos, sync, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    doc.id,
                    patientId,
                    data.date,
                    data.notes,
                    JSON.stringify(data.services ?? []),
                    JSON.stringify(data.used_products ?? []),
                    JSON.stringify(data.sold_products ?? []),
                    JSON.stringify(data.photos ?? []),
                    1,
                    data.created_at,
                    data.updated_at,
                ]
            );
        }
    });
};

export const syncForms = async () => {
    const snapshot = await getDocs(collection(firestore, 'forms'));

    // @ts-ignore
    await db.execAsync(async (tx) => {
        for (const doc of snapshot.docs) {
            const data = doc.data();
            await tx.executeSqlAsync(
                `INSERT OR REPLACE INTO forms 
         (id, title, sync, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?)`,
                [
                    doc.id,
                    data.title,
                    1,
                    data.created_at,
                    data.updated_at,
                ]
            );
        }
    });
};

export const syncFormQuestions = async (formId: string) => {
    const snapshot = await getDocs(
        collection(firestore, `forms/${formId}/questions`)
    );

    // @ts-ignore
    await db.execAsync(async (tx) => {
        for (const doc of snapshot.docs) {
            const data = doc.data();
            await tx.executeSqlAsync(
                `INSERT OR REPLACE INTO form_questions 
         (id, form_id, question, sync, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    doc.id,
                    formId,
                    data.question,
                    1,
                    data.created_at,
                    data.updated_at,
                ]
            );
        }
    });
};

export const syncServices = async () => {
    const snapshot = await getDocs(collection(firestore, 'services'));

    // @ts-ignore
    await db.execAsync(async (tx) => {
        for (const doc of snapshot.docs) {
            const data = doc.data();
            await tx.executeSqlAsync(
                `INSERT OR REPLACE INTO services 
         (id, name, duration, description, price, sale_price, sync, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    doc.id,
                    data.name,
                    data.duration,
                    data.description,
                    data.price,
                    data.sale_price,
                    1,
                    data.created_at,
                    data.updated_at,
                ]
            );
        }
    });
};

export const syncProducts = async () => {
    const snapshot = await getDocs(collection(firestore, 'products'));

    // @ts-ignore
    await db.execAsync(async (tx) => {
        for (const doc of snapshot.docs) {
            const data = doc.data();
            await tx.executeSqlAsync(
                `INSERT OR REPLACE INTO products 
         (id, name, description, price, sale_price, sync, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    doc.id,
                    data.name,
                    data.description,
                    data.price,
                    data.sale_price,
                    1,
                    data.created_at,
                    data.updated_at,
                ]
            );
        }
    });
};