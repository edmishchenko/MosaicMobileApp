import { FormQuestion } from '../types/FormQuestion';
import db from '../database/database';
import {withTableCheck} from "../database/ensureTable";

export const getAllFormQuestions = async (): Promise<FormQuestion[]> => {
    return withTableCheck('form_questions', async () => {
        const rows = await db.getAllAsync(
            'SELECT * FROM questions WHERE is_deleted != 1',
            []
        );
        return (rows ?? []) as FormQuestion[];
    });
};

export const getFormQuestionsByFormId = async (
    formId: string
): Promise<FormQuestion[]> => {
    return withTableCheck('form_questions', async () => {
        const rows = await db.getAllAsync(
            'SELECT * FROM questions WHERE form_id = ? AND is_deleted != 1',
            [formId]
        );
        return (rows ?? []) as FormQuestion[];
    });
};

export const saveFormQuestion = async (question: FormQuestion): Promise<void> => {
    await withTableCheck('form_questions', async () => {
        await db.execAsync(async (tx: any) => {
            await tx.executeSqlAsync(
                `INSERT OR REPLACE INTO questions 
          (id, form_id, question, sync, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    question.id,
                    question.form_id,
                    question.question,
                    0, // Mark as needing sync
                    question.created_at,
                    question.updated_at,
                ]
            );
        });
    });
};

export const deleteFormQuestion = async (id: string): Promise<void> => {
    await withTableCheck('form_questions', async () => {
        await db.execAsync(async (tx: any) => {
            await tx.executeSqlAsync(
                `UPDATE questions SET is_deleted = 1, sync = 0 WHERE id = ?`,
                [id]
            );
        });
    });
};
