import ErpNextHelper from '@/app/Helpers/ErpNextHelper';
import MollieWebhook from '@/types/mollieWebhook';
import Handlebars from 'handlebars';
import * as crypto from 'node:crypto';
import * as fs from 'node:fs/promises';
import { createTransport } from 'nodemailer';

export async function POST(req: Request) {
	// Request has X-Mollie-Signature header
	if (!req.headers.has('X-Mollie-Signature'))
		return new Response('', {
			status: 401
		});

	// MOLLIE_WEBHOOK_SECRET is set
	if (!process.env.MOLLIE_WEBHOOK_SECRET)
		return new Response('MOLLIE_WEBHOOK_SECRET env not defined', {
			status: 500
		});

	// Generate hashing object
	const hmac = crypto.createHmac('sha256', process.env.MOLLIE_WEBHOOK_SECRET);

	// Read JSON body
	const bodyReader = req.body?.getReader();
	const body = await bodyReader?.read();

	// Generate hash
	hmac.update(body?.value ?? '');

	// Check if hex values match
	if (req.headers.get('X-Mollie-Signature')!.replace('sha256=', '') != hmac.digest('hex')) {
		/*return new Response('', {
			status: 401
		});*/
	}

	// Get metdata
	const data: MollieWebhook = JSON.parse(new TextDecoder().decode(body?.value));
	const metadata = data._embedded['payment-link'].metadata;

	// Check if orderData metadata is present
	if (!metadata)
		return new Response('No metadata', {
			status: 500
		});

	// Get order data
	const order = await ErpNextHelper.getOrderById(metadata.orderId);

	// Check if order exists
	if (!order)
		return new Response('Order not found', {
			status: 500
		});

	// Get all items
	const items = await Promise.all(order.items.map(async (item) => await ErpNextHelper.getItemById(item.item_code)));

	// Create email client
	const transporter = createTransport({
		service: 'gmail',
		auth: {
			user: 'info@animenl.nl',
			pass: process.env.GOOGLE_APP_PASSWORD
		}
	});

	// Get email template
	const email = await fs.readFile('src/emails/orderConfirmation.html', 'utf8');

	// Create handlebars template
	const emailTemplate = Handlebars.compile(email);

	// Calculate total item cost
	const itemCost =
		order.items.map((orderItem) => {
			const item = items.find((item) => item?.item_code == orderItem.item_code);

			if (!item) return 0;

			return item.standard_rate * (1 - item.max_discount) * orderItem.qty;
		}).reduce((prev, cur) => prev + cur);

	// Fill out template
	const completeEmail = emailTemplate({
		bedrijfnaam: 'AnimeNL',
		klantnaam: order.first_name,
		ordernummer: order.name,
		producten: order.items.map((orderItem) => {
			const item = items.find((item) => item?.item_code == orderItem.item_code);

			if (!item) return {
				item_name: 'Onbekend Item',
				qty: -1,
				standard_rate: 0
			};

			return {
				item_name: item.item_name,
				qty: orderItem.qty,
				standard_rate: item.standard_rate
			};
		}),
		bijkomende_kosten: (Number(data._embedded['payment-link'].amount.value) - itemCost).toFixed(2),
		totaalbedrag: data._embedded['payment-link'].amount.value,
		verzendnaam: `${order.first_name} ${order.middle_name} ${order.last_name}`,
		verzendadres: `${order.street_name} ${order.street_number}`,
		postcode: order.postal_code,
		plaats: order.city,
		webshop_url: 'https://animenl.nl',
		retour_url: 'https://animenl.nl/about?default=5',
		jaar: new Date().getFullYear()
	});

	// Send email
	await transporter.sendMail({
		to: order.email,
		subject: 'Bedankt voor je bestelling!',
		html: completeEmail
	});

	// Return OK
	return new Response('', {
		status: 200
	});
}
