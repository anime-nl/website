import Item from '@/types/item';
import { createPool, Pool, PoolConnection, RowDataPacket } from 'mysql2/promise';

export default class Database {
	private static pool: Pool = createPool(this.createConnectionUri());

	private static createConnectionUri() {
		const user = process.env.DB_USER ?? 'root';
		const password = process.env.DB_PASSWORD ?? 'admin';
		const host = process.env.DB_HOST ?? 'localhost';
		const port = process.env.DB_PORT ?? '3306';
		const name = process.env.DB_NAME ?? 'anime-nl';

		return `mysql://${user}:${password}@${host}:${port}/${name}`;
	}

	public static async getConnection(): Promise<PoolConnection> {
		return await this.pool.getConnection();
	}

	public static async getItemById(con: PoolConnection, id: number): Promise<(Item & { stock: number }) | undefined> {
		const [results] = await con.query<RowDataPacket[]>(
			'select i.*, COUNT(s.id) as stock from items i LEFT JOIN stock s on i.id = s.itemId where i.id = ?',
			[id],
		);
		if (results[0].id == null) return undefined;

		// Convert to basic types
		results[0].preOrder = Boolean(results[0].preOrder[0]);

		return results[0] as Item & { stock: number };
	}

	public static async getSearchedItems(
		con: PoolConnection,
		options: {
			limit: number;
			offset: number;
			textMatch?: string;
			series?: string[];
			categories?: string[];
			manufacturers?: string[];
			priceRange?: string[] | number[];
		} = { limit: 50, offset: 0 },
	): Promise<Item[] | undefined> {
		let nameString = '%';
		let priceRange = [0, 500];

		if (options.textMatch) nameString = `%${decodeURI(options.textMatch)}%`;

		if (options.series) {
			options.series = options.series.map((serie) => {
				return decodeURI(serie);
			});
		} else {
			options.series = await this.getSeries(con) ?? []
		}

		if (options.categories) {
			options.categories = options.categories.map((category) => {
				return decodeURI(category)
			});
		} else {
			options.categories = await this.getCategories(con) ?? []
		}

		if (options.manufacturers) {
			options.manufacturers = options.manufacturers.map((manufacturer) => {
				return decodeURI(manufacturer)
			});
		} else {
			options.manufacturers = await this.getManufacturers(con) ?? []
		}

		if (options.priceRange) {
			priceRange = options.priceRange.map((price) => {
				return Number(price)
			})
		}

		const [results] = await con.query<RowDataPacket[]>(
			`select i.* from items i where (i.name like ? or i.description like ? or i.specifications like ? or i.series like ?) and i.series in (?) and i.category in (?) and i.manufacturer in (?) and (i.price > ? and i.price < ?) limit ? offset ?`,
			[nameString, nameString, nameString, nameString, options.series, options.categories, options.manufacturers, priceRange[0], priceRange[1], options.limit, options.offset],
		);

		// Convert to basic types
		return results.map<Item>((result) => {
			result.preOrder = Boolean(result.preOrder[0]);
			return result as Item;
		});
	}

	public static async getSeries(con: PoolConnection): Promise<string[] | undefined> {
		const [results] = await con.execute<RowDataPacket[]>('select i.series from items i GROUP BY i.series');

		return results.map<string>((result) => {
			return result.series;
		});
	}

	public static async getCategories(con: PoolConnection): Promise<string[] | undefined> {
		const [results] = await con.execute<RowDataPacket[]>('select i.category from items i GROUP BY i.category');

		return results.map<string>((result) => {
			return result.category;
		});
	}

	public static async getManufacturers(con: PoolConnection): Promise<string[] | undefined> {
		const [results] = await con.execute<RowDataPacket[]>(
			'select i.manufacturer from items i GROUP BY i.manufacturer',
		);

		return results.map<string>((result) => {
			return result.manufacturer;
		});
	}
}
