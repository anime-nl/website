import ErpNextHelper from '@/app/Helpers/ErpNextHelper';
import OrderData from '@/types/orderData';
import { Link } from '@heroui/link';
import createMollieClient, { Locale, PaymentMethod } from '@mollie/api-client';
import { redirect } from 'next/navigation';

const errorHTML = () => {
	return (
		<div className="dark mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-16 items-center h-full w-full">
				<h1>Er is iets foutgegaan met het aanmaken van jouw betaling</h1>
				<p>Probeer het later opniew of stuur een email naar <Link
					href="mailto:info@animenl.nl?subject=Order%20problemen">info@animenl.nl</Link></p>
			</main>
		</div>
	);
};

export default async function PaymentPage({searchParams}: { searchParams: Promise<{ data: string }> }) {
	const {data} = await searchParams;
	const mollieClient = createMollieClient({apiKey: process.env.MOLLIE_KEY as string});

	const cartData: OrderData = JSON.parse(atob(data));

	let items;

	try {
		items = await Promise.all(cartData.cart.map(async (cartItem) => {
			const item = await ErpNextHelper.getItemById(cartItem.name);
			if (!item) {
				throw new Error('Item not found');
			}
			return {item: item, qty: cartItem.qty};
		}));
	} catch {
		return errorHTML();
	}

	const shippingCost =
		cartData.shipping == 0
			? 10.35
			: cartData.shipping == 1
				? 9.85
				: cartData.shipping == 2
					? 6.45
					: cartData.shipping == 3
						? 5.45
						: 10.35;

	const itemCost = items.map((item) => (item.item.standard_rate * (1 - item.item.max_discount)) * item.qty).reduce((prev, cur) => prev + cur);
	const paymentCost =
		cartData.method == 'ideal'
			? 0.35
			: cartData.method == 'banktransfer'
				? 0.25
				: 0;

	const amount = (itemCost + shippingCost + paymentCost).toFixed(2);

	const id = await ErpNextHelper.createOrder(cartData);
	if (!id) return errorHTML();

	const payment = await mollieClient.payments.create({
		amount: {
			value: amount,
			currency: 'EUR'
		},
		description: 'test',
		redirectUrl: `${process.env.MOLLIE_REDIRECT_URL}/${id}?clear=true`,
		billingAddress: {
			givenName: cartData.form.firstName,
			familyName: cartData.form.lastName,
			streetAndNumber: `${cartData.form.street} ${cartData.form.houseNumber}`,
			postalCode: cartData.form.postalCode,
			email: cartData.form.email,
			city: cartData.form.city,
			country: 'nl'
		},
		shippingAddress: {
			givenName: cartData.form.firstName,
			familyName: cartData.form.lastName,
			streetAndNumber: `${cartData.form.street} ${cartData.form.houseNumber}`,
			postalCode: cartData.form.postalCode,
			email: cartData.form.email,
			city: cartData.form.city,
			country: 'nl'
		},
		locale: 'nl_NL' as Locale,
		method: [cartData.method as PaymentMethod],
		metadata: cartData
	});

	await ErpNextHelper.updatePaymentId(id, payment.id);

	const checkoutUrl = payment.getCheckoutUrl();

	if (!checkoutUrl) {
		return errorHTML();
	}

	redirect(checkoutUrl);
}