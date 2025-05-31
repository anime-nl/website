'use client';
import Cart from '@/types/cart';
import Item from '@/types/item';
import { Button } from '@heroui/button';
import { NumberInput } from '@heroui/number-input';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ItemInfo(props: { item: Item; images: string[] }) {
	const [selectedImage, setSelectedImage] = useState<number>(0);
	const [selectedCount, setSelectedCount] = useState<number>(1);

	const router = useRouter();

	const onAddToCart = () => {

		if (!localStorage.getItem('cart'))
			localStorage.setItem('cart', JSON.stringify({
				items: [],
				shipping: {method: 1, carrier: 'PostNL Afhaalpunt', price: 9.85}
			}));
		const cart = JSON.parse(localStorage.getItem('cart')!) as Cart;

		let cartItem: number = -1;

		cart.items.forEach((item, i) => {
			if (item.name == props.item.name) {
				cartItem = i;
			}
		});

		// If pre-order and already ordered, don't add another
		if (cartItem >= 0) {
			alert('Dit item zit al in jouw winkelwagen');
		} else {
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
		}

		localStorage.setItem('cart', JSON.stringify(cart));
		router.push('/cart');
	};

	return (
		<div className="grid grid-cols-2 grid-flow-col w-full h-full m-16">
			<div className="w-3/4 mx-auto relative flex flex-col gap-8 bg-material-800 p-8 rounded-2xl">
				<div className="relative w-full h-10/12">
					<Image
						alt={'image'}
						src={`https://erpnext.animenl.nl/${props.images[selectedImage]}`}
						fill
						className="object-contain"
					/>
				</div>
				<hr className="text-white/10"/>
				<div
					className="flex flex-row justify-center gap-8 w-full h-1/6 overflow-x-scroll scrollbar-thin scrollbar-thumb-secondary scrollbar-track-background scrollbar-thumb-rounded-full">
					{props.images.map((image, index) => {
						return (
							<div key={index} className="w-16 h-full py-2">
								<Button className="h-full" onPress={() => setSelectedImage(index)}>
									<Image
										alt={'image'}
										src={`https://erpnext.animenl.nl/${image}`}
										fill
										className="object-cover"
									/>
								</Button>
							</div>
						);
					})}
				</div>
			</div>
			<div className="w-full h-[50vh] flex flex-col gap-2">
				<h1 className="text-4xl">{props.item.item_name}</h1>
				<hr/>
				<span className="flex gap-2">
					<h1 className="text-lg">€{props.item.standard_rate.toFixed(2)}</h1>
					<p className="text-foreground/50 text-sm my-auto">(inc. VAT)</p>
				</span>
				<div className="ml-6 mb-6 h-full" dangerouslySetInnerHTML={{__html: props.item.description}}></div>
				{props.item.custom_is_pre_order ? (
					<p className="my-auto text-orange-400">
						Pre-order eindigt op {props.item.custom_release_date?.toLocaleDateString()}
					</p>
				) : props.item.custom_current_stock == 0 ? (
					<p className="my-auto text-red-500">Uitverkocht</p>
				) : (
					<p className="my-auto text-green-500">{props.item.custom_current_stock} op voorraad</p>
				)}

				<span className="flex justify-center gap-4 my-2">
					<NumberInput
						className="w-32"
						minValue={1}
						maxValue={props.item.custom_is_pre_order ? 1 : props.item.custom_current_stock}
						defaultValue={1}
						value={selectedCount}
						onValueChange={setSelectedCount}
					/>
					<Button onPress={onAddToCart} className="bg-blue-500 text-xl my-auto" variant="solid">
						<p>Toevoegen</p>
					</Button>
				</span>
				<hr/>
				<div className="grid grid-cols-2 grid-flow-row gap-4 w-full h-full m-16">
					{props.item.item_group ? (
						<>
							<p className="my-auto">Categorie</p>
							<Button className="w-fit my-auto" onPress={() => {
							}}>
								{props.item.item_group}
							</Button>
						</>
					) : null}
					{props.item.custom_source ? (
						<>
							<p className="my-auto">Serie</p>
							<Button className="w-fit my-auto">{props.item.custom_source}</Button>
						</>
					) : null}
					{props.item.brand ? (
						<>
							<p className="my-auto">Fabrikant</p>
							<Button className="w-fit my-auto">{props.item.brand}</Button>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}
