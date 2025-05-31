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
		custom_release_date: Date;
		max_discount: number;
	}[];
	shipping?: {
		carrier: string;
		price: number;
	};
}
