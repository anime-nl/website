'use client';
import Cart from '@/types/cart';
import Item from '@/types/item';
import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { NumberInput } from '@heroui/number-input';
import { addToast } from '@heroui/toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ItemInfo(props: { item: Item; images: string[] }) {
	const [selectedImage, setSelectedImage] = useState<number>(0);
	const [selectedCount, setSelectedCount] = useState<number>(1);

	const router = useRouter();

	const onAddToCart = () => {
		if (!localStorage.getItem('cart'))
			localStorage.setItem(
				'cart',
				JSON.stringify({
					items: [],
					shipping: {method: 1, carrier: 'PostNL Afhaalpunt', price: 9.85}
				})
			);
		const cart = JSON.parse(localStorage.getItem('cart')!) as Cart;

		let cartItem: number = -1;

		cart.items.forEach((item, i) => {
			if (item.name == props.item.name) {
				cartItem = i;
			}
		});

		// If pre-order and already ordered, don't add another
		if (cartItem >= 0) {
			addToast({
				title: 'Hey!',
				description: 'Dit product zit al in jouw winkelwagen',
				color: 'warning',
				variant: 'solid',
				timeout: 3000
			});
			return;
		}

		cart.items.push({
			name: props.item.name,
			item_name: props.item.item_name,
			standard_rate: props.item.standard_rate,
			images: props.images,
			quantity: selectedCount,
			custom_current_stock: props.item.custom_current_stock,
			stock_uom: props.item.stock_uom,
			custom_is_preorder: props.item.custom_is_pre_order,
			custom_release_date: props.item.custom_release_date,
			max_discount: props.item.max_discount
		});

		localStorage.setItem('cart', JSON.stringify(cart));
		router.push('/cart');
	};

	const switchImage = (changeBy: number) => {
		if (selectedImage + changeBy < 0) {
			setSelectedImage(0);
			return;
		}

		if (selectedImage + changeBy > props.images.length - 1) {
			setSelectedImage(props.images.length - 1);
			return;
		}

		setSelectedImage(selectedImage + changeBy);
	};

	return (
		<div
			className="grid grid-cols-1 sm:grid-cols-2 grid-flow-row sm:grid-flow-col gap-4 sm:gap-0 w-full h-full sm:m-16">
			<div className="mx-auto w-full">
				<Card className="h-[50vh] sm:h-full">
					<CardBody className="w-full h-full sm:w-2/3 mx-auto flex flex-col gap-4">
						<div className="mx-auto flex gap-4">
							<Button onPress={() => switchImage(-1)} variant="bordered" className="my-auto">
								&lt;
							</Button>
							<Button onPress={() => switchImage(1)} variant="bordered" className="my-auto">
								&gt;
							</Button>
						</div>
						<div className="mx-auto relative h-full w-full">
							<Image
								alt={'image'}
								src={`https://erpnext.animenl.nl/${props.images[selectedImage]}`}
								fill
								className="object-contain"
							/>
						</div>
					</CardBody>
					<CardFooter>
						<p className="text-foreground/30 w-full text-end">Aantal foto&apos;s: {props.images.length}</p>
					</CardFooter>
				</Card>
			</div>
			<div className="w-full h-fit flex flex-col gap-2 sm:px-8">
				<h1 className="text-2xl sm:text-4xl">{props.item.item_name}</h1>
				<hr/>
				<span className="flex gap-2">
					<h1 className="text-lg">€{props.item.standard_rate.toFixed(2)}</h1>
					<p className="text-foreground/50 text-sm my-auto">(inc. VAT)</p>
				</span>
				<div className="ml-6 mb-6 h-full" dangerouslySetInnerHTML={{__html: props.item.description}}></div>
				{props.item.custom_is_pre_order ? (
					<p className="my-auto text-orange-400">
						Pre-order eindigt op {new Date(props.item.custom_release_date).toLocaleDateString()}
					</p>
				) : props.item.custom_current_stock == 0 ? (
					<p className="my-auto text-orange-500">Binnen 7 werkdagen op voorraad</p>
				) : (
					<p className="my-auto text-green-500">{props.item.custom_current_stock} op voorraad</p>
				)}

				<span className="flex justify-center gap-4 my-2">
					<NumberInput
						className="w-32"
						minValue={1}
						maxValue={props.item.custom_is_pre_order ? 1 : 50}
						defaultValue={1}
						value={selectedCount}
						onValueChange={setSelectedCount}
						inputMode="decimal"
					/>
					<Button onPress={onAddToCart} className="bg-blue-500 text-xl my-auto" variant="solid">
						<p>Toevoegen</p>
					</Button>
				</span>
				<hr/>
				<div className="flex flex-col gap-4 w-full h-full py-8 sm:p-16">
					<div className="flex gap-4">
						<p className="my-auto w-1/2 text-center">Categorie</p>
						<Button
							variant="bordered"
							className="w-fit h-fit my-auto mx-auto"
							onPress={() => {
								router.push(`/?categories=${props.item.item_group}`);
							}}
						>
							<p className="text-wrap py-2">{props.item.item_group}</p>
						</Button>
					</div>
					<div className="flex gap-4">
						<p className="my-auto w-1/2 text-center">Character</p>
						<Button
							variant="bordered"
							className="w-fit h-fit my-auto mx-auto"
							onPress={() => {
								router.push(`/?characters=${props.item.custom_source}`);
							}}
						>
							<p className="text-wrap py-2">{props.item.custom_character}</p>
						</Button>
					</div>
					<div className="flex gap-4">
						<p className="my-auto w-1/2 text-center">Serie</p>
						<Button
							variant="bordered"
							className="w-fit h-fit my-auto mx-auto"
							onPress={() => {
								router.push(`/?series=${props.item.custom_source}`);
							}}
						>
							<p className="text-wrap py-2">{props.item.custom_source}</p>
						</Button>
					</div>
					<div className="flex gap-4">
						<p className="my-auto w-1/2 text-center">Fabrikant</p>
						<Button
							variant="bordered"
							className="w-fit h-fit my-auto mx-auto"
							onPress={() => {
								router.push(`/?manufacturers=${props.item.brand}`);
							}}
						>
							<p className="text-wrap py-2">{props.item.brand}</p>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
