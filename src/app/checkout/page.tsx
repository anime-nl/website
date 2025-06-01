'use client';
import Cart from '@/types/cart';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { Form } from '@heroui/form';
import { Input, Textarea } from '@heroui/input';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

export default function CheckoutPage() {
	const router = useRouter();

	const [cart, setCart] = useState<Cart>({
		items: [],
		shipping: {method: 1, carrier: 'PostNL Afhaalpunt', price: 9.85}
	});

	useEffect(() => {
		if (localStorage.getItem('cart'))
			setCart(JSON.parse(localStorage.getItem('cart')!) as Cart);
	}, []);

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = Object.fromEntries(new FormData(e.currentTarget).entries());

		if (cart.items.length == 0) {
			alert('Je hebt geen items in je winkelwagen');
			return false;
		}

		const data = {
			form: form,
			cart: [] as { name: string, qty: number }[],
			shipping: cart.shipping.method,
			// @ts-expect-error TS7053
			method: e.nativeEvent['submitter'].value
		};

		cart.items.forEach((item) => {
			data.cart.push({name: item.name, qty: item.quantity});
		});


		router.push(`/payment?data=${btoa(JSON.stringify(data))}`);
	};

	return (
		<div className="dark mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-16 justify-center h-full w-full">
				<div className="flex flex-col gap-8 w-2/3 mx-auto">
					<h1 className="mx-auto text-6xl border-b-2 border-white/15 p-2 font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						Betalen
					</h1>
					<Table aria-label="Order" className="w-2/3 mx-auto">
						<TableHeader>
							<TableColumn>ITEM NR</TableColumn>
							<TableColumn>NAAM</TableColumn>
							<TableColumn>STATUS</TableColumn>
							<TableColumn>PRIJS PER STUK</TableColumn>
							<TableColumn>AANTAL</TableColumn>
						</TableHeader>
						<TableBody>
							<>
								{cart.items.map((item) => {
									return (
										<TableRow key={item.name}>
											<TableCell>{item.name}</TableCell>
											<TableCell>{item.item_name}</TableCell>
											<TableCell>{item.custom_is_preorder ? 'Pre-order' : 'Op vooraad'}</TableCell>
											<TableCell>€{item.standard_rate}</TableCell>
											<TableCell>{item.quantity}</TableCell>
										</TableRow>
									);
								})}
								<TableRow key="shipping">
									<TableCell>Verzendkosten</TableCell>
									<TableCell>{cart.shipping.carrier}</TableCell>
									<TableCell> </TableCell>
									<TableCell>€{cart.shipping.price}</TableCell>
									<TableCell>1</TableCell>
								</TableRow>
							</>
						</TableBody>
					</Table>
					<div>
						<Form className="w-2/3 mx-auto grid grid-cols-6"
						      onSubmit={onSubmit}>
							<label className="col-span-6">Persoonlijke gegevens</label>
							<Input
								className="col-span-2"
								isRequired={true}
								name="firstName"
								placeholder="Voornaam"
								type="text"
								errorMessage="Voornaam is verplicht"
							/>
							<Input
								className="col-span-2"
								name="middleName"
								placeholder="Tussenvoegsel"
								type="text"
							/>
							<Input
								className="col-span-2"
								isRequired={true}
								name="lastName"
								placeholder="Achternaam"
								type="text"
								errorMessage="Achternaam is verplicht"
							/>
							<Input
								className="col-span-3"
								isRequired={true}
								name="email"
								placeholder="Email"
								type="email"
								errorMessage="Email is verplicht"
							/>
							<Input
								className="col-span-3"
								name="phone"
								placeholder="Phone"
								type="tel"
								validationBehavior="aria"
								validate={(val) => {
									if (val.length == 0) return null;

									if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(val.replace(/\s/g, '')))
										return null;

									return 'Voor a.u.b. een geldig telefoon nummer in';

								}}
							/>

							<label className="col-span-3 mt-4">Adres</label>
							<label className="col-span-3 mt-4">Opmerkingen</label>
							<Input
								className="col-span-2"
								isRequired={true}
								name="street"
								placeholder="Straatnaam"
								type="text"
								errorMessage="Straatnaam is verplicht"
							/>
							<Input
								className="col-span-1"
								isRequired={true}
								name="houseNumber"
								placeholder="Huisnummer"
								type="tel"
								errorMessage="Huisnummer is verplicht"
							/>
							<Textarea
								className="col-span-3 row-span-3 h-full"
								name="notes"
								rows={6}
								disableAutosize={true}
								placeholder="Opmerkingen over de order? Laat ze hier achter"
							/>
							<Input
								className="col-span-1"
								isRequired={true}
								name="postalCode"
								placeholder="Postcode"
								type="text"
								errorMessage="Postcode is verplicht"
							/>
							<Input
								className="col-span-2"
								name="city"
								placeholder="Stad"
								type="text"
							/>
							<Input
								className="col-span-3"
								name="country"
								placeholder="Land"
								type="text"
							/>

							<label className="col-span-6 mt-4 text-2xl font-bold">Betaal met</label>
							<button
								name="method"
								value="ideal"
								className="col-span-2"
								type="submit"
							>
								<Card
									isHoverable={true}
									className="border-2 border-transparent aria-selected:border-primary">
									<CardBody>
										<div className="mx-auto w-48 h-32 relative mb-2">
											<Image
												alt="ideal-logo"
												src="ideal.svg"
												fill
												style={{pointerEvents: 'none'}}
											/>
										</div>
										<h1 className="font-bold text-3xl">iDEAL</h1>
									</CardBody>
									<CardFooter className="text-foreground/70 justify-end">+ €0.35</CardFooter>
								</Card>
							</button>
							<button
								name="method"
								value="banktransfer"
								className="col-span-2"
								type="submit"
							>
								<Card
									isHoverable={true}
									className="border-2 border-transparent aria-selected:border-primary">
									<CardBody>
										<div className="mx-auto w-48 h-32 relative mb-2">
											<Image
												alt="card-logo"
												src="card.svg"
												fill
												style={{pointerEvents: 'none'}}
											/>
										</div>
										<h1 className="font-bold text-3xl">Bank Transfer</h1>
									</CardBody>
									<CardFooter className="text-foreground/70 justify-end">+ €0.25</CardFooter>
								</Card>
							</button>

							<button
								name="method"
								value="wise"
								className="col-span-2"
								type="submit"
							>
								<Card
									isHoverable={true}
									className="border-2 border-transparent aria-selected:border-primary">
									<CardBody>
										<div className="mx-auto w-48 h-32 relative mb-2">
											<Image
												alt="wise-logo"
												src="/wise.png"
												fill
												style={{pointerEvents: 'none'}}
											/>
										</div>
										<h1 className="font-bold text-3xl">Wise</h1>
									</CardBody>
									<CardFooter className="text-foreground/70 justify-end">Gratis</CardFooter>
								</Card>
							</button>
						</Form>
					</div>
				</div>
			</main>
		</div>
	);
}
