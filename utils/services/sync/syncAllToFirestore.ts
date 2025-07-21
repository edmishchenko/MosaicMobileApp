import NetInfo from '@react-native-community/netinfo';
import { getUnsyncedPatients } from '../patientService';
import { syncPatientsToFirestore } from '../../firebase/syncPatientsToFirestore';
import { syncFormAnswersToFirestore } from '../../firebase/syncFormAnswersToFirestore';
import { syncVisitsToFirestore } from '../../firebase/syncVisitsToFirestore';
import { syncServicesToFirestore } from '../../firebase/syncServicesToFirestore';
import { syncProductsToFirestore } from '../../firebase/syncProductsToFirestore';

export const syncAllToFirestore = async () => {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
        console.log('[SYNC] Device offline, skipping sync');
        return;
    }

    try {
        console.log('[SYNC] Starting sync to Firestore');

        // Step 1: Upload patients
        const unsyncedPatients = await getUnsyncedPatients();
        await syncPatientsToFirestore();

        // Step 2: Upload form answers and visits for each patient
        for (const patient of unsyncedPatients) {
            await syncFormAnswersToFirestore(patient.id);
            await syncVisitsToFirestore(patient.id);
        }

        // Step 3: Upload services
        await syncServicesToFirestore();

        // Step 4: Upload products
        await syncProductsToFirestore();

        console.log('[SYNC] Sync completed successfully ✅');
    } catch (error) {
        console.error('[SYNC] Error during sync:', error);
    }
};