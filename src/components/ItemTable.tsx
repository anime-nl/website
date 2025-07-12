'use client';

import Item from '@/types/item';
import { Order } from '@/types/Order';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';

export default function ItemTable(props: { items: Item[]; order: Order }) {
	return (
		<Table aria-label="Order" className="col-span-2 sm:col-span-3">
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
								<TableCell>
									<p className="text-nowrap">{item.name}</p>
								</TableCell>
								<TableCell>
									<p className="text-nowrap">{item.item_name}</p>
								</TableCell>
								<TableCell>
									<p className="text-nowrap">
										{item.custom_is_pre_order ? 'Pre-order' : 'Op vooraad'}
									</p>
								</TableCell>
								<TableCell>
									<p className="text-nowrap">€{item.standard_rate.toFixed(2)}</p>
								</TableCell>
								<TableCell>
									<p className="text-nowrap">
										{props.order.items.find((_) => _.name == item.name)?.qty || 1}
									</p>
								</TableCell>
							</TableRow>
						);
					})}
					<TableRow key="shipping">
						<TableCell>Verzendkosten</TableCell>
						<TableCell> </TableCell>
						<TableCell> </TableCell>
						<TableCell>
							€
							{props.order.shipping == '0'
								? 10.35
								: props.order.shipping == '1'
									? 9.85
									: props.order.shipping == '2'
										? 6.45
										: props.order.shipping == '3'
											? 5.45
											: 10.35}
						</TableCell>
						<TableCell>1</TableCell>
					</TableRow>
				</>
			</TableBody>
		</Table>
	);
}
