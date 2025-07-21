import { doc, setDoc } from 'firebase/firestore';
import db from '../database/database';
import { firestore } from './firebaseConfig';

export const syncProductsToFirestore = async () => {
    const results = await db.getAllAsync(
        'SELECT * FROM products WHERE sync = 0'
    );

    for (const product of results) { // @ts-ignore
        const docRef = doc(firestore, 'products', product.id);
        await setDoc(docRef, { // @ts-ignore
            ...product,
            sync: true,
        });
        // @ts-ignore
        await db.runAsync('UPDATE products SET sync = 1 WHERE id = ?', [product.id]);
    }
};
