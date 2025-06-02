'use client';

import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function OrderPage() {
	const router = useRouter();

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = Object.fromEntries(new FormData(e.currentTarget).entries());

		router.replace(`/order/${form['orderId']}`);
	};

	return (
		<div className="dark mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-16 items-center h-full w-full">
				<div className="flex flex-col gap-8 w-2/3 mx-auto">
					<h1 className="mx-auto text-lg sm:text-6xl border-b-2 border-white/15 p-2 font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						Mijn Bestellingen
					</h1>
					<Form onSubmit={onSubmit} className="sm:flex-row">
						<Input name="orderId" type="text" placeholder="Order Nummer"/>
						<Button className="w-full sm:w-fit" type="submit">Zoek</Button>
					</Form>
				</div>
			</main>
		</div>
	);
}