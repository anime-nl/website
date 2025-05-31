'use client';
import Cart from '@/types/cart';
import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Link } from '@heroui/link';
import { NumberInput } from '@heroui/number-input';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function CartPage() {
	const [cart, setCart] = useState<Cart>({
		items: [],
		shipping: {method: 1, carrier: 'PostNL Afhaalpunt', price: 9.85}
	});

	useEffect(() => {
		if (localStorage.getItem('cart'))
			setCart(JSON.parse(localStorage.getItem('cart')!) as Cart);
	}, []);

	const updateCart = (id: string, value: number) => {
		if (value == 0) {
			// Remove item from cart
			const newCart = {
				items: cart.items.filter((item) => item.name != id),
				shipping: cart.shipping
			};

			localStorage.setItem('cart', JSON.stringify(newCart));
			setCart(newCart);
			return;
		}

		const index = cart.items.findIndex((item) => item.name == id);

		if (value > cart.items[index].custom_current_stock) {
			alert('Niet genoeg voorraad voor dit aantal');
		}

		cart.items[index].quantity = value;
		localStorage.setItem('cart', JSON.stringify(cart));
		setCart(cart);
	};

	const updateShippingMethod = (method: number, carrier: string, price: number) => {
		const newcart = {
			items: cart.items,
			shipping: {
				method: method,
				carrier: carrier,
				price: price
			}
		};
		localStorage.setItem('cart', JSON.stringify(newcart));
		setCart(newcart);
	};

	let cartValue = {
		total: 0,
		btw: 0,
		shipping: 0
	};

	const prices = cart.items.map((item) => item.quantity * item.standard_rate);
	if (prices.length != 0) {
		const total = prices.reduce((prev, cur) => prev + cur);
		cartValue = {
			total: total,
			btw: total * 0.21,
			shipping: cart.shipping?.method == 0
				? 10.35
				: cart.shipping?.method == 1
					? 9.85
					: cart.shipping?.method == 2
						? 6.45
						: cart.shipping?.method == 3
							? 5.45
							: 0
		};
	}

	return (
		<div className="dark mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-16 justify-center h-full w-full">
				<div className="flex flex-col gap-8 w-2/3 mx-auto">
					<h1 className="mx-auto text-6xl border-b-2 border-white/15 p-2 font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						Winkelwagen
					</h1>
					{cart.items.map((item, i) => {
						return (
							<Card key={item.name} className="w-full">
								<CardBody>
									<div className="flex justify-between">
										<div className="relative w-32 mx-8">
											<Image
												src={`https://erpnext.animenl.nl/${item.images[0]}`}
												alt={item.name}
												fill={true}
												className="object-contain"
												style={{pointerEvents: 'none'}}
											/>
										</div>
										<div className="w-full my-8">
											<Link color={'foreground'} href={`/item/${item.name}`}>
												<h1 className="font-bold text-2xl">{item.item_name}</h1>
											</Link>
											{item.max_discount != 0 ? (
												<span className="flex gap-4">
														<p className="font-thin text-xl line-through">
															€{(item.standard_rate * item.quantity).toFixed(2)}
														</p>
														<p className="font-thin text-xl text-red-500">
															€
															{(
																item.standard_rate *
																(1 - item.max_discount / 100) *
																item.quantity
															).toFixed(2)}
														</p>
													</span>
											) : (
												<p className="font-thin text-xl">
													€{(item.standard_rate * item.quantity).toFixed(2)}
												</p>
											)}
											<div
												className="my-2 mr-2 h-0.5 w-full bg-gradient-to-r from-foreground to-90% to-transparent"/>
											<span className="flex gap-4">
													{item.custom_is_preorder ? (
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
												minValue={0}
												maxValue={
													item.custom_is_preorder ? 1 : cart.items[i].custom_current_stock
												}
												defaultValue={item.quantity}
												onValueChange={(value) => updateCart(item.name, value)}
											/>
										</div>
									</div>
								</CardBody>
							</Card>
						);
					})}
					<hr/>
					<div className="grid grid-cols-4 justify-between w-full text-center mx-auto gap-4">
						<button
							onClick={() => updateShippingMethod(0, 'PostNL Huisadres', 10.35)}
						>
							<Card aria-selected={cart.shipping.method == 0}
							      className="border-2 border-transparent aria-selected:border-primary">
								<CardBody>
									<div className="mx-auto w-32 h-32 relative mb-2">
										<Image
											alt="postnl-logo"
											src="https://www.postnl.nl/api/assets/blt43aa441bfc1e29f2/blt6d7e7a9878178919/64f7178a20e2ed3a8a73152f/postnl-logo-oranje.png"
											fill
											style={{pointerEvents: 'none'}}
										/>
									</div>
									<h1 className="font-bold text-3xl">PostNL</h1>
									<p>Bezorgd op huisadres</p>
								</CardBody>
								<CardFooter className="text-foreground/70 justify-end">€10.35</CardFooter>
							</Card>
						</button>

						<button
							onClick={() => updateShippingMethod(1, 'PostNL Afhaalpunt', 9.85)}
						>
							<Card aria-selected={cart.shipping.method == 1}
							      className="border-2 border-transparent aria-selected:border-primary">
								<CardBody>
									<div className="mx-auto w-32 h-32 relative mb-2">
										<Image
											alt="postnl-logo"
											src="https://www.postnl.nl/api/assets/blt43aa441bfc1e29f2/blt6d7e7a9878178919/64f7178a20e2ed3a8a73152f/postnl-logo-oranje.png"
											fill
											style={{pointerEvents: 'none'}}
										/>
									</div>
									<h1 className="font-bold text-3xl">PostNL</h1>
									<p>Bezorgd bij PostNL Afhaalpunt</p>
								</CardBody>
								<CardFooter className="text-foreground/70 justify-end">€9.85</CardFooter>
							</Card>
						</button>

						<button onClick={() => updateShippingMethod(2, 'DHL Huisadres', 6.45)}>
							<Card aria-selected={cart.shipping.method == 2}
							      className="border-2 border-transparent aria-selected:border-primary">
								<CardBody>
									<div className="mx-auto w-48 h-32 relative mb-2">
										<Image
											alt="dhl-logo"
											src="https://www.dhlexpress.nl/sites/default/files/styles/grid_image_1x/public/content/images/DHL-express-logo-recatangle.png"
											fill
											style={{pointerEvents: 'none'}}
										/>
									</div>
									<h1 className="font-bold text-3xl">DHL</h1>
									<p>Bezorgd op huisadres</p>
								</CardBody>
								<CardFooter className="text-foreground/70 justify-end">€6.45</CardFooter>
							</Card>
						</button>

						<button
							onClick={() => updateShippingMethod(3, 'DHL Afhaalpunt', 5.45)}
						>
							<Card aria-selected={cart.shipping.method == 3}
							      className="border-2 border-transparent aria-selected:border-primary">
								<CardBody>
									<div className="mx-auto w-48 h-32 relative mb-2">
										<Image
											alt="dhl-logo"
											src="https://www.dhlexpress.nl/sites/default/files/styles/grid_image_1x/public/content/images/DHL-express-logo-recatangle.png"
											fill
											style={{pointerEvents: 'none'}}
										/>
									</div>
									<h1 className="font-bold text-3xl">DHL</h1>
									<p>Bezorgd bij DHL Afhaalpunt</p>
								</CardBody>
								<CardFooter className="text-foreground/70 justify-end">€5.45</CardFooter>
							</Card>
						</button>
					</div>
					<hr/>
					<div className="grid grid-cols-2 justify-end w-fit text-right ml-auto">
						<p>Subtotaal:</p>
						<p>€{cartValue.total.toFixed(2)}</p>
						<p>Waarvan 21% BTW:</p>
						<p>€{cartValue.btw.toFixed(2)}</p>
						<p>Verzendkosten:</p>
						<p>€{cartValue.shipping.toFixed(2)}</p>
						<hr/>
						<hr/>
						<h2 className="row-span-2 text-xl font-bold">Totaal:</h2>
						<h2 className="row-span-2 text-xl font-bold">€{(cartValue.total + cartValue.shipping).toFixed(2)}</h2>
						<Link href="/checkout" className="w-full col-span-2 my-2 mt-2">
							<Button color="primary" className="w-full"><p
								className="text-3xl">Betalen</p></Button>
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}
