import ErpNextHelper from '@/app/Helpers/ErpNextHelper';
import InfiniteScroller from '@/components/infiniteScroller';
import ItemSearch from '@/components/itemSearch';
import Item from '@/types/item';

const cols = 5;

export default async function Home({searchParams}: {
	searchParams: Promise<{
		search?: string;
		series?: string;
		categories?: string;
		manufacturers?: string;
		priceRange?: string;
		page?: string;
	}>;
}) {
	const query = await searchParams;

	const series = (await ErpNextHelper.getSources()) ?? [];
	const categories = (await ErpNextHelper.getItemGroups()) ?? [];
	const manufacturers = (await ErpNextHelper.getItemBrands()) ?? [];

	const filter: {
		key: string;
		operator: string;
		value: string;
	}[] = [];

	if (query.search) {
		filter.push({
			key: 'item_name',
			operator: 'like',
			value: `%${query.search}%`
		});
	}

	if (query.series) {
		filter.push({
			key: 'custom_source',
			operator: 'in',
			value: query.series
		});
	}

	if (query.categories) {
		filter.push({
			key: 'item_group',
			operator: 'in',
			value: query.categories
		});
	}

	if (query.manufacturers) {
		filter.push({
			key: 'brand',
			operator: 'in',
			value: query.manufacturers
		});
	}

	if (query.priceRange) {
		let priceRange = query.priceRange.split(',');
		filter.push({
			key: 'standard_rate',
			operator: '>=',
			value: priceRange[0]
		}, {
			key: 'standard_rate',
			operator: '<=',
			value: priceRange[1]
		});
	}

	const items: Item[] = await ErpNextHelper.getItemsByQuery(filter, 25 * (Number(query.page ?? 1)), 0);

	const gridItems: Item[][] = Array.from({length: cols}, () => []);
	items.forEach((item, i) => {
		gridItems[i % cols].push(item);
	});

	return (
		<div className="dark mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-16 items-center h-full w-full">
				<h1
					className={`font-[family-name:var(--font-crashbow)] text-9xl bg-gradient-to-r w-fit px-6 py-4 from-primary to-secondary text-transparent bg-clip-text`}
				>
					Anime NL
				</h1>
				<p className="text-xl underline">Jouw connectie tot de japanse otaku markt</p>
				<hr className="text-white/15 w-full"/>
				<div className="flex w-full gap-4">
					<div className="w-fit">
						<ItemSearch series={series} categories={categories} manufacturers={manufacturers}/>
					</div>
					<div className="w-full">
						<div id="item-cols" className="grid grid-cols-5 gap-8 w-full">
							<InfiniteScroller items={gridItems} filter={filter}/>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
