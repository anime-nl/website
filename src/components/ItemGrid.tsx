'use client';

import ErpNextHelper from '@/app/Helpers/ErpNextHelper';
import ItemCard from '@/components/itemCard';
import Item from '@/types/item';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const cols = 5;

export default function ItemGrid() {
	const searchParams = useSearchParams();
	const [items, setItems] = useState<Item[]>([]);

	useEffect(() => {
		const fetchItems = async () => {
			const filter: { key: string; operator: string; value: string }[] = [];
			const query = Object.fromEntries(searchParams.entries());

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

			const fetchedItems = await ErpNextHelper.getItemsByQuery(filter, 25, 0);
			setItems(fetchedItems);
		};

		fetchItems();
	}, [searchParams]);

	const gridItems: Item[][] = Array.from({length: cols}, () => []);
	items.forEach((item, i) => {
		gridItems[i % cols].push(item);
	});

	return (
		<>
			{gridItems.map((itemCol, iCol) => (
				<div
					key={iCol}
					className={`flex flex-col gap-4 w-full col-span-5 sm:col-span-1 col-start-1 sm:col-start-${iCol + 1}`}
				>
					{itemCol.map((item) => (
						<div key={item.name} className="w-full">
							<ItemCard item={item}/>
						</div>
					))}
				</div>
			))}
		</>
	);
}
