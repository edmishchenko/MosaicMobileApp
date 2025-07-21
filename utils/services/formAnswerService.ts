import db from '../database/database';
import { FormAnswer } from '../types/FormAnswer';
import { withTableCheck } from '../database/ensureTable';

export const getUnsyncedFormAnswers = async (patientId: string): Promise<FormAnswer[]> => {
    return withTableCheck('form_answers', async () => {
        const rows = await db.getAllAsync<FormAnswer>(
            'SELECT * FROM form_answers WHERE sync = 0 AND patient_id = ?',
            [patientId]
        );

        return rows ?? [];
    });
};

export const saveFormAnswer = async (answer: FormAnswer) => {
    return withTableCheck('form_answers', async () => {
        // @ts-ignore
        await db.execAsync(async (tx) => {
            await tx.executeSqlAsync(
                `INSERT OR REPLACE INTO form_answers 
          (id, patient_id, form_id, question_id, answer, sync, is_deleted, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    answer.id,
                    answer.patient_id,
                    answer.form_id,
                    answer.question_id,
                    answer.answer,
                    0, // Needs sync
                    0, // Not deleted
                    answer.created_at,
                    answer.updated_at,
                ]
            );
        });
    });
};

export const deleteFormAnswer = async (id: string) => {
    return withTableCheck('form_answers', async () => {
        // @ts-ignore
        await db.execAsync(async (tx) => {
            await tx.executeSqlAsync(
                `UPDATE form_answers SET is_deleted = 1, sync = 0 WHERE id = ?`,
                [id]
            );
        });
    });
};
