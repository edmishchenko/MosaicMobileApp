import { collection, doc, setDoc } from 'firebase/firestore';
import db from '../database/database';
import { firestore } from './firebaseConfig';

export const syncFormAnswersToFirestore = async (patientId: string) => {
    const results = await db.getAllAsync(
        'SELECT * FROM form_answers WHERE sync = 0 AND patient_id = ?',
        [patientId]
    );

    for (const answer of results) { // @ts-ignore
        const docRef = doc(firestore, `patients/${patientId}/form_answers`, answer.id);
        await setDoc(docRef, { // @ts-ignore
            ...answer,
            sync: true,
        });
        // @ts-ignore
        await db.runAsync('UPDATE form_answers SET sync = 1 WHERE id = ?', [answer.id]);
    }
};
