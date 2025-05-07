import ItemCard from '@/components/itemCard';
import ItemSearch from '@/components/itemSearch';
import Database from '@/database/connector';
import Item from '@/types/item';

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string, series?: string, categories?: string, manufacturers?: string }> }) {
	const query = await searchParams;
	const con = await Database.getConnection();

	const series = (await Database.getSeries(con)) ?? [];
	const categories = (await Database.getCategories(con)) ?? [];
	const manufacturers = (await Database.getManufacturers(con)) ?? [];

	const items =
		(await Database.getSearchedItems(con, {
			textMatch: query?.search ?? undefined,
			series: query?.series?.split(',') ?? undefined,
			categories: query?.categories?.split(',') ?? undefined,
			manufacturers: query?.manufacturers?.split(',') ?? undefined,
			limit: 20,
			offset: 0,
		})) ?? [];

	con.release();

	const cols = 5;
	let gridItems: Item[][] = Array.from({ length: cols }, () => []);
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
				<hr className="text-white/15 w-full" />
				<div className="flex w-full gap-4">
					<div className="w-fit">
						<ItemSearch series={series} categories={categories} manufacturers={manufacturers} />
					</div>
					<div className="grid grid-cols-5 gap-8 w-full">
						{gridItems.map((itemCol, i) => {
							return (
								<div key={i} className="flex flex-col gap-4 w-full">
									{itemCol.map((item) => {
										return <ItemCard key={item.id} item={item} />;
									})}
								</div>
							);
						})}
					</div>
				</div>
			</main>
		</div>
	);
}
