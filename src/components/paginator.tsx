'use client';

import { Button } from '@heroui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function Paginator(props: {page: number, lastPage: boolean}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const changePage = useCallback(
		(amount: number) => {

			const currentParams = new URLSearchParams(searchParams.toString());

			if (amount) {
				currentParams.set('page', (props.page + amount).toFixed(0));
			} else {
				currentParams.delete('page');
			}
			router.push(`?${currentParams.toString()}`);
		},
		[router, searchParams],
	);

	return (
		<div className='flex gap-4 w-full justify-center'>
			<Button disabled={props.page <= 1} onPress={() => changePage(-1)} variant={'flat'} className='disabled:cursor-not-allowed'>&lt;</Button>
			<p className='my-auto text-3xl'>{props.page ?? 1}</p>
			<Button disabled={props.lastPage} onPress={() => changePage(1)} variant={'flat'} className='disabled:cursor-not-allowed'>&gt;</Button>
		</div>
	)
}