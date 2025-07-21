import { doc, setDoc } from 'firebase/firestore';
import db from '../database/database';
import { firestore } from './firebaseConfig';

export const syncServicesToFirestore = async () => {
    const results = await db.getAllAsync(
        'SELECT * FROM services WHERE sync = 0'
    );

    for (const service of results) { // @ts-ignore
        const docRef = doc(firestore, 'services', service.id);
        await setDoc(docRef, { // @ts-ignore
            ...service,
            sync: true,
        });
        // @ts-ignore
        await db.runAsync('UPDATE services SET sync = 1 WHERE id = ?', [service.id]);
    }
};
