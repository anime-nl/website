import Item from '@/types/item';
import { createPool, Pool, PoolConnection, RowDataPacket } from 'mysql2/promise';

export default class Database {
  private static pool: Pool = createPool(this.createConnectionUri());

  private static createConnectionUri() {
    const user = process.env.DB_USER ?? "root";
    const password = process.env.DB_PASSWORD ?? "admin";
    const host = process.env.DB_HOST ?? "localhost";
    const port = process.env.DB_PORT ?? "3306";
    const name = process.env.DB_NAME ?? "anime-nl";

    return `mysql://${user}:${password}@${host}:${port}/${name}`;
  }

  public static async getConnection(): Promise<PoolConnection> {
    return await this.pool.getConnection();
  }

  public static async getItemById(
    con: PoolConnection,
    id: number,
  ): Promise<(Item & { stock: number }) | undefined> {
    const [results] = await con.query<RowDataPacket[]>(
      "select i.*, COUNT(s.id) as stock from items i LEFT JOIN stock s on i.id = s.itemId where i.id = ?",
      [id],
    );
    if (results[0].id == null) return undefined;

    // Convert to basic types
    results[0].preOrder = Boolean(results[0].preOrder);

    return results[0] as (Item & { stock: number });
  }
}
