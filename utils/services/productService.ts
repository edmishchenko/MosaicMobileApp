import db from '../database/database';
import { Product }  from '../types/Product';
import { withTableCheck } from '../database/ensureTable';

export const getUnsyncedProducts = async (): Promise<Product[]> => {
    return withTableCheck('products', async () => {
        const rows = await db.getAllAsync<Product>(
            'SELECT * FROM products WHERE sync = 0',
            []
        );

        return rows ?? [];
    });
};

export const getAllProducts = async (): Promise<Product[]> => {
    return withTableCheck('products', async () => {
        const rows = await db.getAllAsync<Product>(
            'SELECT * FROM products',
            []
        );

        return rows ?? [];
    });
};

export const saveProduct = async (product: Product) => {
    return withTableCheck('products', async () => {
        // @ts-ignore
        await db.execAsync(async (tx) => {
            await tx.executeSqlAsync(
                `INSERT OR REPLACE INTO products 
          (id, name, description, price, sale_price, sync, is_deleted, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    product.id,
                    product.name,
                    product.description,
                    product.price,
                    product.sale_price,
                    0, // Not synced
                    0, // Not deleted
                    product.created_at,
                    product.updated_at,
                ]
            );
        });
    });
};

export const deleteProduct = async (id: string) => {
    return withTableCheck('products', async () => {
        // @ts-ignore
        await db.execAsync(async (tx) => {
            await tx.executeSqlAsync(
                `UPDATE products SET is_deleted = 1, sync = 0 WHERE id = ?`,
                [id]
            );
        });
    });
};
