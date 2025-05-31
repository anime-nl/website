'use client';
import Item from '@/types/item';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { Image } from '@heroui/image';
import { useRouter } from 'next/navigation';

export default function ItemCard(props: { item: Item }) {
	const router = useRouter();

	return (
		<Card
			key={props.item.name}
			isPressable
			isHoverable
			shadow="sm"
			onPress={() => router.push(`/item/${props.item.name}`)}
			className="w-full h-fit"
		>
			<CardBody className="overflow-visible p-0 relative">
				{props.item.custom_is_pre_order ? (
					<div className="absolute w-fit bg-primary right-0 top-0 z-10 rounded-bl-full pl-6 pr-2">
						<p className="text-2xl font-bold">Pre-order</p>
					</div>
				) : (
					<div></div>
				)}
				{props.item.max_discount != 0 ? (
					<div className="absolute w-fit bg-red-500 left-0 top-0 z-10 rounded-br-full pr-6 pl-2">
						<p className="text-2xl font-bold">-{props.item.max_discount}%</p>
					</div>
				) : (
					<div></div>
				)}
				<Image
					alt={props.item.name}
					className="pointer-events-none -z-0"
					radius="lg"
					shadow="sm"
					src={`https://erpnext.animenl.nl/${props.item.image}`}
					width="100%"
				/>
			</CardBody>
			<CardFooter className="text-small justify-between align-top">
				<b>{props.item.item_name}</b>
				<span className="pl-4">
					{props.item.max_discount == 0 ? (
						<p className="text-default-500">€{props.item.standard_rate.toFixed(2)}</p>
					) : (
						<div>
							<p className="text-default-500 line-through">€{props.item.standard_rate}</p>
							<p className="text-red-500">
								€{(props.item.standard_rate * (1 - props.item.max_discount / 100)).toFixed(2)}
							</p>
						</div>
					)}
				</span>
			</CardFooter>
		</Card>
	);
}
