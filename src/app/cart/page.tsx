'use client';
import Cart from '@/types/cart';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { NumberInput } from '@heroui/number-input';
import Image from 'next/image';

export default function CartPage() {
	const cart = JSON.parse(localStorage.getItem('cart') ?? '{"items": [], "amount": []}') as Cart;

	return (
		<div className="dark mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-16 justify-center h-full w-full">
				<div className="flex flex-col gap-8 w-2/3 mx-auto">
					<h1 className="mx-auto text-6xl border-b-2 border-white/15 p-2 font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						Winkelwagen
					</h1>
					{cart.items.map((item, i) => {
						return (
							<Card key={item.id} className="w-full">
								<CardBody>
									<div className="flex justify-between">
										<div className="relative w-32 mx-8">
											<Image
												src={`https://cdn.animenl.nl/images/${item.id}/${item.mainImageIndex}.webp`}
												alt={item.id.toFixed(0)}
												fill={true}
												className="object-contain"
											/>
										</div>
										<div className="w-full my-8">
											<h1 className="font-bold text-2xl">{item.name}</h1>
											{item.discountPercentage != 0 ? (
												<span className="flex gap-4">
													<p className="font-thin text-xl line-through">€{item.price}</p>
													<p className="font-thin text-xl text-red-500">
														€{(item.price * (1 - item.discountPercentage / 100)).toFixed(2)}
													</p>
												</span>
											) : (
												<p className="font-thin text-xl">€{item.price}</p>
											)}
											<div
												className="my-2 mr-2 h-0.5 w-full bg-gradient-to-r from-foreground to-90% to-transparent"/>
											<span className="flex gap-4">
												{item.preOrder ? (
													<Chip color="primary">
														<p className="font-bold">Pre-order</p>
													</Chip>
												) : (
													<Chip color="success">
														<p className="font-bold">Op Voorraad</p>
													</Chip>
												)}
											</span>
										</div>
										<div className="h-fit my-auto">
											<NumberInput
												className="w-32"
												minValue={1}
												maxValue={item.preOrder ? 1 : cart.amount[i]}
												defaultValue={1}
											/>
										</div>
									</div>
								</CardBody>
							</Card>
						);
					})}
				</div>
			</main>
		</div>
	);
}
