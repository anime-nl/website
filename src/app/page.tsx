import ErpNextHelper from '@/app/Helpers/ErpNextHelper';
import LoadMore from '@/components/infiniteScroller';
import ItemCard from '@/components/itemCard';
import ItemSearch from '@/components/itemSearch';
import Item from '@/types/item';
import { Alert } from '@heroui/alert';
import { Card, CardBody } from '@heroui/card';
import { Link } from '@heroui/link';

const cols = 5;

export default async function Home({
	                                   searchParams
                                   }: {
	searchParams: Promise<{
		search?: string;
		series?: string;
		categories?: string;
		manufacturers?: string;
		characters?: string;
		priceRange?: string;
		page?: string;
		status?: string;
	}>;
}) {
	const query = await searchParams;

	const series = (await ErpNextHelper.getSources()) ?? [];
	const categories = (await ErpNextHelper.getItemGroups()) ?? [];
	const manufacturers = (await ErpNextHelper.getItemBrands()) ?? [];
	const characters = (await ErpNextHelper.getCharacters()) ?? [];

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

	if (query.characters) {
		filter.push({
			key: 'custom_character',
			operator: 'in',
			value: query.characters
		});
	}

	if (query.priceRange) {
		const priceRange = query.priceRange.split(',');
		filter.push(
			{
				key: 'standard_rate',
				operator: '>=',
				value: priceRange[0]
			},
			{
				key: 'standard_rate',
				operator: '<=',
				value: priceRange[1]
			}
		);
	}

	if (query.status) {
		if (!query.status.includes('Pre-order')) {
			filter.push({
				key: 'custom_is_pre_order',
				operator: '=',
				value: '0'
			});
		}
		if (!query.status.includes('Op voorraad')) {
			filter.push({
				key: 'custom_current_stock',
				operator: '=',
				value: '0'
			});
		}
		if (!query.status.includes('Uitverkocht')) {
			filter.push({
				key: 'custom_current_stock',
				operator: '>=',
				value: '1'
			});
		}
	}

	async function getGridItems(
		offset: string | number | undefined,
		currentFilter: typeof filter
	): Promise<[React.JSX.Element[], number]> {
		'use server';
		const items: Item[] = await ErpNextHelper.getItemsByQuery(currentFilter, 25 + Number(offset), 0);

		const gridItems: Item[][] = Array.from({length: cols}, () => []);
		items.forEach((item, i) => {
			gridItems[i % cols].push(item);
		});

		return [
			gridItems.map((itemCol, iCol) => {
				return (
					<div
						key={Math.random()}
						className={`flex flex-col gap-4 w-full col-span-5 sm:col-span-1 col-start-1 sm:col-start-${iCol + 1}`}
					>
						{itemCol.map((item) => {
							return (
								<div key={item.name} className="w-full">
									<ItemCard item={item}/>
								</div>
							);
						})}
					</div>
				);
			}),
			Number(offset) + 25
		];
	}

	return (
		<div className="dark mx-8 sm:mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-4 sm:gap-16 items-center h-full w-full">
				<h1
					className={`font-[family-name:var(--font-crashbow)] text-4xl sm:text-9xl bg-gradient-to-r w-fit px-6 py-4 from-primary to-secondary text-transparent bg-clip-text`}
				>
					Anime NL
				</h1>
				<Alert variant="faded" color="primary"
				       title="RECENT TOEGEVOEGD! Nieuwe Plushies, Figures en Keychains!" hideIcon={true}
				       className="w-1/2 text-center"/>
				<hr className="text-white/15 w-full"/>
				<div>
					<h2 className="text-2xl font-bold text-center">Populaire zoektermen</h2>
					<div className="md:flex md:flex-row md:gap-8 grid grid-cols-2 gap-2 md:mx-16 mx-4 mt-8">
						<Card>
							<CardBody>
								<p className="my-auto h-fit text-center">
									<Link className="text-white" href="/?series=Blue+Archive">Blue
										Archive</Link>
								</p>
							</CardBody>
						</Card>

						<Card>
							<CardBody>
								<p className="my-auto h-fit text-center">
									<Link className="text-white"
									      href="/?categories=Keychains">Keychains</Link>
								</p>
							</CardBody>
						</Card>

						<Card>
							<CardBody>
								<p className="my-auto h-fit text-center">
									<Link className="text-white" href="/?characters=Hatsune+Miku">Hatsune
										Miku</Link>
								</p>
							</CardBody>
						</Card>

						<Card>
							<CardBody>
								<p className="my-auto h-fit text-center">
									<Link className="text-white"
									      href="/?categories=Plushies">Plushies</Link>
								</p>
							</CardBody>
						</Card>

						<Card>
							<CardBody>
								<p className="my-auto h-fit text-center">
									<Link className="text-white"
									      href="/?manufacturers=Good+Smile+Company%2CGood+Smile+Racing">Good Smile
										Company</Link>
								</p>
							</CardBody>
						</Card>

						<Card>
							<CardBody>
								<p className="my-auto h-fit text-center">
									<Link className="text-white"
									      href="/?priceRange=0%2C70">Prijs &lt; €70</Link>
								</p>
							</CardBody>
						</Card>
					</div>
				</div>
				<div className="flex flex-col sm:flex-row w-full gap-4">
					<div className="md:w-1/8 w-full mx-auto sm:sticky top-20 h-fit">
						<ItemSearch
							series={series}
							categories={categories}
							manufacturers={manufacturers}
							characters={characters}
						/>
					</div>
					<hr className="block sm:hidden text-foreground/20"/>
					<div className="w-full">
						<LoadMore loadMoreAction={getGridItems} initialOffset={25} filter={filter}/>
					</div>
				</div>
			</main>
		</div>
	);
}
