import Item from '@/types/item';

export default class ErpNextHelper {
	private static getHeaders() {
		return {
			'Authorization': `token ${process.env.API_KEY}:${process.env.API_SECRET}`,
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		};
	}

	static async getCharacters(): Promise<string[] | undefined> {
		const data = await fetch(`${process.env.ERPNEXT_URL}/resource/Character`, {
			method: 'GET',
			headers: this.getHeaders()
		});
		if (!data.ok) return;

		const json: {
			data: {
				name: string;
			}[];
		} = await data.json();

		return json.data.map((character: { name: string }) => character.name);
	}

	static async getSources(): Promise<string[] | undefined> {
		const data = await fetch(`${process.env.ERPNEXT_URL}/resource/Source`, {
			method: 'GET',
			headers: this.getHeaders()
		});
		if (!data.ok) return;

		const json: {
			data: {
				name: string;
			}[];
		} = await data.json();

		return json.data.map((source: { name: string }) => source.name);
	}

	static async getItemById(id: string): Promise<Item | undefined> {
		const data = await fetch(`${process.env.ERPNEXT_URL}/resource/Item/${id}`, {
			method: 'GET',
			headers: this.getHeaders()
		});
		if (!data.ok) return;

		const json: {
			data: Item;
		} = await data.json();

		json.data.standard_rate = (await this.getPriceById(json.data.name)) ?? json.data.standard_rate;

		return json.data;
	}

	static async getPriceById(id: string): Promise<number | undefined> {
		const data = await fetch(
			`${process.env.ERPNEXT_URL}/resource/Item Price?fields=["price_list_rate"]&filters=[["item_code","=","${id}"]]`,
			{
				method: 'GET',
				headers: this.getHeaders()
			}
		);
		if (!data.ok) return;

		const json: {
			data: { price_list_rate: number }[];
		} = await data.json();

		return json.data[0].price_list_rate;
	}

	static async getImagesForItem(id: string): Promise<string[] | undefined> {
		const data = await fetch(
			`${process.env.ERPNEXT_URL}/resource/File?fields=["file_url"]&filters=[["attached_to_name", "=", "${id}"]]`,
			{
				method: 'GET',
				headers: this.getHeaders()
			}
		);

		if (!data.ok) return;

		const json: {
			data: {
				file_url: string;
			}[];
		} = await data.json();

		return json.data.map((image: { file_url: string }) => image.file_url);
	}

	static async getItemGroups(): Promise<string[] | undefined> {
		const data = await fetch(
			`${process.env.ERPNEXT_URL}/resource/Item Group?filters=[["parent_item_group", "=", "products"]]`,
			{
				method: 'GET',
				headers: this.getHeaders()
			}
		);

		if (!data.ok) return;

		const json: {
			data: {
				name: string;
			}[];
		} = await data.json();

		return json.data.map((itemGroup: { name: string }) => itemGroup.name);
	}

	static async getItemBrands(): Promise<string[] | undefined> {
		const data = await fetch(`${process.env.ERPNEXT_URL}/resource/Brand`, {
			method: 'GET',
			headers: this.getHeaders()
		});

		if (!data.ok) return;

		const json: {
			data: {
				name: string;
			}[];
		} = await data.json();

		return json.data.map((brand: { name: string }) => brand.name);
	}

	static async getItemsByQuery(
		query: {
			key: string;
			operator: string;
			value: string;
		}[],
		limit: number,
		offset: number
	): Promise<Item[]> {
		const filters: string[][] = query.map((filter: { key: string; operator: string; value: string }) => [
			filter.key,
			filter.operator,
			filter.value
		]);

		const fields: string[] = [
			'name',
			'owner',
			'creation',
			'modified',
			'modified_by',
			'docstatus',
			'idx',
			'naming_series',
			'item_code',
			'item_name',
			'item_group',
			'stock_uom',
			'custom_release_date',
			'disabled',
			'allow_alternative_item',
			'is_stock_item',
			'has_variants',
			'opening_stock',
			'valuation_rate',
			'standard_rate',
			'is_fixed_asset',
			'auto_create_assets',
			'is_grouped_asset',
			'over_delivery_receipt_allowance',
			'over_billing_allowance',
			'image',
			'description',
			'brand',
			'custom_character',
			'shelf_life_in_days',
			'end_of_life',
			'default_material_request_type',
			'valuation_method',
			'weight_per_unit',
			'weight_uom',
			'allow_negative_stock',
			'custom_height',
			'custom_width',
			'custom_length',
			'custom_measurement_uom',
			'has_batch_no',
			'create_new_batch',
			'has_expiry_date',
			'retain_sample',
			'sample_quantity',
			'has_serial_no',
			'variant_based_on',
			'enable_deferred_expense',
			'no_of_months_exp',
			'enable_deferred_revenue',
			'no_of_months',
			'purchase_uom',
			'min_order_qty',
			'safety_stock',
			'is_purchase_item',
			'custom_is_pre_order',
			'lead_time_days',
			'last_purchase_rate',
			'is_customer_provided_item',
			'delivered_by_supplier',
			'country_of_origin',
			'sales_uom',
			'grant_commission',
			'is_sales_item',
			'max_discount',
			'inspection_required_before_purchase',
			'inspection_required_before_delivery',
			'include_item_in_manufacturing',
			'is_sub_contracted_item',
			'customer_code',
			'total_projected_qty',
			'doctype'
		];

		const data = await fetch(
			`${process.env.ERPNEXT_URL}/resource/Item?fields=["${fields.join('","')}"]&filters=[${filters.map((filter) => `["${filter.join('","')}"]`)}]&limit_start=${offset}&limit_page_length=${limit}`,
			{
				method: 'GET',
				headers: this.getHeaders()
			}
		);

		if (!data.ok) return [];

		const json: {
			data: Item[];
		} = await data.json();

		const prices = await this.getPricesByQuery(
			json.data.map((item) => item.name),
			limit,
			offset
		);

		json.data = json.data.map((item) => {
			item.standard_rate =
				prices.find((_) => _.item_code == item.item_code)?.price_list_rate ?? item.standard_rate;
			return item;
		});

		return json.data;
	}

	static async getPricesByQuery(
		ids: string[],
		limit: number,
		offset: number
	): Promise<
		{
			item_code: string;
			price_list_rate: number;
		}[]
	> {
		const data = await fetch(
			`${process.env.ERPNEXT_URL}/resource/Item Price?fields=["item_code", "price_list_rate"]&filters=[["item_code", "in", "${ids.join(',')}"]]&limit_start=${offset}&limit_page_length=${limit}`,
			{
				method: 'GET',
				headers: this.getHeaders()
			}
		);
		if (!data.ok) return [];

		const json: {
			data: { item_code: string; price_list_rate: number }[];
		} = await data.json();

		return json.data;
	}
}
