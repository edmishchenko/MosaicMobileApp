import db from '../database/database';
import { Service } from '../types/Service';
import { withTableCheck } from '../database/ensureTable';

export const getUnsyncedServices = async (): Promise<Service[]> => {
    return withTableCheck('services', async () => {
        const rows = await db.getAllAsync<Service>(
            'SELECT * FROM services WHERE sync = 0',
            []
        );

        return rows ?? [];
    });
};

export const getAllServices = async (): Promise<Service[]> => {
    return withTableCheck('services', async () => {
        const rows = await db.getAllAsync<Service>(
            'SELECT * FROM services',
            []
        );

        return rows ?? [];
    });
};

export const saveService = async (service: Service) => {
    return withTableCheck('services', async () => {
        // @ts-ignore
        await db.execAsync(async (tx) => {
            await tx.executeSqlAsync(
                `INSERT OR REPLACE INTO services 
          (id, name, duration, description, price, sale_price, sync, is_deleted, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    service.id,
                    service.name,
                    service.duration,
                    service.description,
                    service.price,
                    service.sale_price,
                    0, // Not synced
                    0, // Not deleted
                    service.created_at,
                    service.updated_at,
                ]
            );
        });
    });
};

export const deleteService = async (id: string) => {
    return withTableCheck('services', async () => {
        // @ts-ignore
        await db.execAsync(async (tx) => {
            await tx.executeSqlAsync(
                `UPDATE services SET is_deleted = 1, sync = 0 WHERE id = ?`,
                [id]
            );
        });
    });
};
