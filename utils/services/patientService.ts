import db from '../database/database';
import { Patient } from '../types/Patient';
import { withTableCheck } from '../database/ensureTable';


export const getAllPatients = async (): Promise<Patient[]> => {
    return withTableCheck('patients', async () => {
        try {
            console.log("About to execute query...");
            const rows = await db.getAllAsync(
                'SELECT * FROM patients WHERE is_deleted != 1'
            );
            console.log("Query executed successfully, rows:", rows?.length);
            return (rows ?? []) as Patient[];
        } catch (error) {
            console.error("Database query failed:", error);
            throw error;
        }
    });
}

export const getPatientById = async (id: string): Promise<Patient | null> => {
    return withTableCheck('patients', async () => {
        const rows = await db.getAllAsync(
            'SELECT * FROM patients WHERE id = ? AND is_deleted != 1',
            [id]
        );

        const typedRows = rows as Patient[] | undefined;

        return typedRows && typedRows.length > 0 ? typedRows[0] : null;
    });
};

export const getUnsyncedPatients = async (): Promise<Patient[]> => {
    return withTableCheck('patients', async () => {
        const rows = await db.getAllAsync(
            'SELECT * FROM patients WHERE sync = 0',
            []
        );

        return (rows ?? []) as Patient[];
    });
};


// Add or update a patient locally
export const savePatient = async (patient: Patient) => {
    return withTableCheck('patients', async () => {
        await db.execAsync(async (tx: { executeSqlAsync: (arg0: string, arg1: (string | number)[]) => any; }) => {
            await tx.executeSqlAsync(
                `INSERT OR REPLACE INTO patients 
          (id, first_name, last_name, email, phone, date_of_birth, photo, notes, sync, is_deleted, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    patient.id,
                    patient.first_name,
                    patient.last_name,
                    patient.email,
                    patient.phone,
                    patient.date_of_birth,
                    patient.photo,
                    patient.notes,
                    0, // Marked for sync
                    0, // Not deleted
                    patient.created_at,
                    patient.updated_at,
                ]
            );
        });
    });
};

// Delete a patient locally
export const deletePatient = async (id: string) => {
    return withTableCheck('patients', async () => {
        await db.execAsync(async (tx: { executeSqlAsync: (arg0: string, arg1: string[]) => any; }) => {
            await tx.executeSqlAsync(
                `UPDATE patients SET is_deleted = 1, sync = 0 WHERE id = ?`,
                [id]
            );
        });
    });
};
