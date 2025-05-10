import ItemCard from '@/components/itemCard';
import ItemSearch from '@/components/itemSearch';
import Paginator from '@/components/paginator';
import Database from '@/database/connector';
import Item from '@/types/item';
import { Link } from '@heroui/link';

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string, series?: string, categories?: string, manufacturers?: string, priceRange?: string, page?: string }> }) {
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
			priceRange: query?.priceRange?.split(',') ?? undefined,
			limit: 15,
			offset: (Number(query.page ?? 1 ) - 1) * 15,
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
					<div className='w-full'>
						<div className="grid grid-cols-5 gap-8 w-full">
							{
								items.length > 0
								? gridItems.map((itemCol, i) => {
										return (
											<div key={i} className="flex flex-col gap-4 w-full">
												{itemCol.map((item) => {
													return <ItemCard key={item.id} item={item} />;
												})}
											</div>
										);
									})
								: <div className="col-span-5 flex flex-col gap-4 w-full">
									<h1 className='text-3xl w-fit mx-auto font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text'>Niet gevonden waar je naar zocht?</h1>
									<p className='mx-auto'>Email ons op <Link href='mailto:info@animenl.nl?subject=Vraag%20beschikbaarheid%20artikel' target='_blank'>info@animenl.nl</Link></p>
								</div>
							}
						</div>
						<hr className='my-4 w-full' />
						<Paginator page={Number(query.page ?? 1)} lastPage={items.length < 1} />
					</div>

				</div>
			</main>
		</div>
	);
}
