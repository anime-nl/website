export default interface Cart {
	items: {
		name: string;
		item_name: string;
		standard_rate: number;
		images: string[];
		quantity: number;
		custom_current_stock: number;
		stock_uom: string;
		custom_is_preorder: number;
		custom_release_date: string;
		max_discount: number;
	}[];
	shipping: {
		method: number;
		carrier: string;
		price: number;
	};
}
