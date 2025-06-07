import ErpNextHelper from '@/app/Helpers/ErpNextHelper';
import ClearCart from '@/components/clearCart';
import ItemTable from '@/components/ItemTable';
import { Card, CardBody } from '@heroui/card';
import { Link } from '@heroui/link';
import createMollieClient from '@mollie/api-client';
import { Metadata } from 'next';

type Props = {
	params: Promise<{ orderId: string }>;
	searchParams: Promise<{ clear?: boolean }>;
};

export async function generateMetadata(
	{params}: Props
): Promise<Metadata> {
	const {orderId} = await params;

	return {
		title: `Order ${orderId}`,
		description: `Order ${orderId}`
	};

}

export default async function PaymentSuccessPage({params, searchParams}: Props) {
	const {orderId} = await params;
	const {clear} = await searchParams;

	const order = await ErpNextHelper.getOrderById(orderId);

	if (!order) {
		return (
			<div className="dark mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
				<main className="flex flex-col gap-16 items-center h-full w-full">
					<h1>We konden jouw order niet vinden</h1>
					<p>
						Probeer het later opniew of stuur een email naar{' '}
						<Link href="mailto:info@animenl.nl?subject=Order%20niet%20gevonden">info@animenl.nl</Link>
					</p>
				</main>
			</div>
		);
	}

	const mollieClient = createMollieClient({apiKey: process.env.MOLLIE_KEY as string});

	const payment = await mollieClient.payments.get(order.payment_id);

	let paymentStatus = payment.status.toString();
	switch (payment.status) {
		case 'expired':
			paymentStatus = 'Verlopen';
			break;

		case 'authorized':
			paymentStatus = 'Geauthorizeerd';
			break;

		case 'canceled':
			paymentStatus = 'Geannuleerd';
			break;

		case 'failed':
			paymentStatus = 'Gefaald';
			break;

		case 'pending':
			paymentStatus = 'In Behandeling';
			break;

		case 'open':
			paymentStatus = 'Open';
			break;

		case 'paid':
			paymentStatus = 'Betaald';
			break;
	}

	const items = await Promise.all(
		order.items.map(async (item) => {
			const actualItem = await ErpNextHelper.getItemById(item.item_code);
			if (!actualItem) throw new Error('Item not found');

			return actualItem;
		})
	);

	const trackingUrl =
		order.shipping == '1' || order.shipping == '2'
			? `https://jouw.postnl.nl/track-and-trace/${order.shipment_tracking_code}-NL-${order.postal_code.replace(/ /g, '').toUpperCase()}`
			: `https://www.dhl.com/nl-nl/home/traceren.html?tracking-id=${order.shipment_tracking_code}&submit=1`;

	const paymentUrl = payment.getStatusUrl() ?? payment.getCheckoutUrl() ?? null;

	return (
		<div className="dark mx-4 sm:mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-16 justify-center h-full w-full">
				<ClearCart shouldClear={clear ?? false}/>
				<div className="flex flex-col gap-8 w-full mx-auto">
					<h1 className="mx-auto text-2xl sm:text-6xl border-b-2 border-white/15 p-2 font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						Order
					</h1>
					<div className="w-full sm:w-2/3 mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
						<Card isHoverable={true} className="border-2 border-transparent aria-selected:border-primary">
							<CardBody className="gap-4">
								<h1 className="font-bold text-2xl sm:text-3xl mx-auto w-full text-center">
									Order Nummer
								</h1>
								<p className="text-foreground/70 mx-auto w-full text-center">{orderId}</p>
							</CardBody>
						</Card>
						<Card isHoverable={true} className="border-2 border-transparent aria-selected:border-primary">
							<CardBody className="gap-4">
								<h1 className="font-bold text-2xl sm:text-3xl mx-auto w-full text-center">
									Totaal bedrag
								</h1>
								<p className="text-foreground/70 w-full text-center">{`${payment.amount.value} ${payment.amount.currency}`}</p>
							</CardBody>
						</Card>
						<Card isHoverable={true} className="border-2 border-transparent aria-selected:border-primary">
							<CardBody className="gap-4">
								<h1 className="font-bold text-2xl sm:text-3xl mx-auto w-full text-center">
									Status Betaling
								</h1>
								<Link
									className="aria-disabled:text-foreground/70"
									/* @ts-expect-error TS2339 */
									aria-disabled={payment._links?.status?.href == null}
									/* @ts-expect-error TS2339 */
									href={paymentUrl}
									target="_blank"
								>
									<p className="mx-auto">{paymentStatus}</p>
								</Link>
							</CardBody>
						</Card>
						<Card isHoverable={true} className="border-2 border-transparent aria-selected:border-primary">
							<CardBody className="gap-4">
								<h1 className="font-bold text-2xl sm:text-3xl mx-auto w-full text-center">
									Track and Trace
								</h1>
								{order.shipment_tracking_code ? (
									<Link href={trackingUrl} target="_blank">
										<p className="text-primary mx-auto">{order.shipment_tracking_code}</p>
									</Link>
								) : (
									<p className="text-foreground/70 mx-auto w-full text-center">Nog niet verstuurd</p>
								)}
							</CardBody>
						</Card>
						<Card isHoverable={true} className="border-2 border-transparent aria-selected:border-primary">
							<CardBody className="gap-4">
								<h1 className="font-bold text-2xl sm:text-3xl mx-auto w-full text-center">
									Aantal items
								</h1>
								<p className="text-foreground/70 mx-auto w-full text-center">{order.items.length}</p>
							</CardBody>
						</Card>
						<Card isHoverable={true} className="border-2 border-transparent aria-selected:border-primary">
							<CardBody className="gap-4">
								<h1 className="font-bold text-2xl sm:text-3xl mx-auto w-full text-center">
									Bestel Datum
								</h1>
								<p className="text-foreground/70 mx-auto w-full text-center">
									{new Date(order.creation).toLocaleString()}
								</p>
							</CardBody>
						</Card>
						<ItemTable items={items} order={order}/>
						<h1 className="text-2xl font-bold col-span-2 sm:col-span-3 text-center">
							Heb je vragen of problemen met de order?
						</h1>
						<p className="col-span-2 sm:col-span-3 text-center">
							Stuur een email naar{' '}
							<Link href="mailto:info@animenl.nl?subject=Problemen met mijn order">info@animenl.nl</Link>,
							Wij proberen binnen 24 uur te reageren
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
