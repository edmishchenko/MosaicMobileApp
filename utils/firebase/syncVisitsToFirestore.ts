import { collection, doc, setDoc } from 'firebase/firestore';
import db from '../database/database';
import { firestore } from './firebaseConfig';

export const syncVisitsToFirestore = async (patientId: string) => {
    const results = await db.getAllAsync(
        'SELECT * FROM visits WHERE sync = 0 AND patient_id = ?',
        [patientId]
    );

    for (const visit of results) { // @ts-ignore
        const docRef = doc(firestore, `patients/${patientId}/visits`, visit.id);

        await setDoc(docRef, { // @ts-ignore
            ...visit, // @ts-ignore
            services: JSON.parse(visit.services), // @ts-ignore
            used_products: JSON.parse(visit.used_products), // @ts-ignore
            sold_products: JSON.parse(visit.sold_products), // @ts-ignore
            photos: JSON.parse(visit.photos),
            sync: true,
        });
        // @ts-ignore
        await db.runAsync('UPDATE visits SET sync = 1 WHERE id = ?', [visit.id]);
    }
};
