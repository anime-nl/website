'use client';

import ItemCard from '@/components/itemCard';
import Item from '@/types/item';
import { Link } from '@heroui/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function InfiniteScroller(props: {
	items: Item[][], filter: {
		key: string;
		operator: string;
		value: string;
	}[]
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentParams = new URLSearchParams(searchParams.toString());
	const currentPage = Number(currentParams.get('page') ?? 1);
	const {ref, inView} = useInView();

	useEffect(() => {
		const scroll = Number(localStorage.getItem('scroll') ?? 0);

		window.scroll(0, scroll);

		localStorage.setItem('scroll', '0');
	}, [currentPage]);


	useEffect(() => {
		if (inView && currentPage * 25 <= props.items[4].length * 5) {
			currentParams.set('page', (currentPage + 1).toFixed(0));
			localStorage.setItem('scroll', window.scrollY.toString());

			// window.location.href = `/?${currentParams.toString()}`;
			router.push(`?${currentParams.toString()}`);
		}
	}, [inView, currentPage, props.items, currentParams, router]);

	return (
		<>
			{props.items.map((itemCol, iCol) => {
				return (
					<div key={iCol} className="flex flex-col gap-4 w-full">
						{itemCol.map((item, i) => {
							return (
								<div key={item.name} className="w-full">
									{(itemCol.length - 2 == i && iCol == 0) ?
										<div ref={ref}></div> : undefined}
									<ItemCard item={item}/>
								</div>
							);
						})}
					</div>
				);
			})}
			<div className="col-span-5 flex flex-col gap-4 w-full">
				<h1 className="text-3xl w-fit mx-auto font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
					Niet gevonden waar je naar zocht?
				</h1>
				<p className="mx-auto">
					Stuur een email naar{' '}
					<Link
						href="mailto:info@animenl.nl?subject=Vraag%20beschikbaarheid%20artikel"
						target="_blank"
					>
						info@animenl.nl
					</Link>
					, dan kijken wij wat we voor je kunnen betekenen
				</p>
			</div>
		</>
	);
}