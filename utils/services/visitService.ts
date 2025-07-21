import db from '../database/database';
import { Visit } from '../types/Visit';
import { withTableCheck } from '../database/ensureTable';

export const getVisitsByPatientId = async (patientId: string): Promise<Visit[]> => {
    return withTableCheck('visits', async () => {
        const rows = await db.getAllAsync<Visit>(
            'SELECT * FROM visits WHERE patient_id = ? AND is_deleted != 1',
            [patientId]
        );

        return rows ?? [];
    });
};

export const getUnsyncedVisits = async (patientId: string): Promise<Visit[]> => {
    return withTableCheck('visits', async () => {
        const rows = await db.getAllAsync<Visit>(
            'SELECT * FROM visits WHERE sync = 0 AND patient_id = ?',
            [patientId]
        );

        return rows ?? [];
    });
};

export const saveVisit = async (visit: Visit) => {
    return withTableCheck('visits', async () => {
        // @ts-ignore
        await db.execAsync(async (tx) => {
            await tx.executeSqlAsync(
                `INSERT OR REPLACE INTO visits 
          (id, patient_id, date, notes, services, used_products, sold_products, photos, sync, is_deleted, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    visit.id,
                    visit.patient_id,
                    visit.date,
                    visit.notes,
                    JSON.stringify(visit.services ?? []),
                    JSON.stringify(visit.used_products ?? []),
                    JSON.stringify(visit.sold_products ?? []),
                    JSON.stringify(visit.photos ?? []),
                    0, // Not synced
                    0, // Not deleted
                    visit.created_at,
                    visit.updated_at,
                ]
            );
        });
    });
};

export const deleteVisit = async (id: string) => {
    return withTableCheck('visits', async () => {
        // @ts-ignore
        await db.execAsync(async (tx) => {
            await tx.executeSqlAsync(
                `UPDATE visits SET is_deleted = 1, sync = 0 WHERE id = ?`,
                [id]
            );
        });
    });
};
