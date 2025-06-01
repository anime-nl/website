'use client';

import Item from '@/types/item';
import { Order } from '@/types/Order';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';

export default function ItemTable(props: { items: Item[], order: Order }) {
	return (
		<Table aria-label="Order" className="col-span-3">
			<TableHeader>
				<TableColumn>ITEM NR</TableColumn>
				<TableColumn>NAAM</TableColumn>
				<TableColumn>STATUS</TableColumn>
				<TableColumn>PRIJS PER STUK</TableColumn>
				<TableColumn>AANTAL</TableColumn>
			</TableHeader>
			<TableBody>
				<>
					{props.items.map((item) => {
						return (
							<TableRow key={item.name}>
								<TableCell>{item.name}</TableCell>
								<TableCell>{item.item_name}</TableCell>
								<TableCell>{item.custom_is_pre_order ? 'Pre-order' : 'Op vooraad'}</TableCell>
								<TableCell>€{item.standard_rate}</TableCell>
								<TableCell>{props.order.items.find((_) => _.name == item.name)?.qty || 1}</TableCell>
							</TableRow>
						);
					})}
					<TableRow key="shipping">
						<TableCell>Verzendkosten</TableCell>
						<TableCell> </TableCell>
						<TableCell> </TableCell>
						<TableCell>€{
							props.order.shipping == '0'
								? 10.35
								: props.order.shipping == '1'
									? 9.85
									: props.order.shipping == '2'
										? 6.45
										: props.order.shipping == '3'
											? 5.45
											: 10.35}</TableCell>
						<TableCell>1</TableCell>
					</TableRow>
				</>
			</TableBody>
		</Table>
	);
}