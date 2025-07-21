import { collection, doc, setDoc } from 'firebase/firestore';
import db from '../database/database';
import { firestore } from './firebaseConfig';

export const syncPatientsToFirestore = async () => {
    const results = await db.getAllAsync(
        'SELECT * FROM patients WHERE sync = 0',
        []
    );

    for (const patient of results) { // @ts-ignore
        const docRef = doc(firestore, 'patients', patient.id);
        await setDoc(docRef, { // @ts-ignore
            ...patient,
            sync: true,
        });
        // @ts-ignore
        await db.runAsync('UPDATE patients SET sync = 1 WHERE id = ?', [patient.id]);
    }
};
