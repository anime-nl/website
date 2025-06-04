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

	const data: MollieWebhook = JSON.parse(new TextDecoder().decode(body?.value));
	const orderData = data._embedded['payment-link'].metadata;

	// Check if orderData metadata is present
	if (!orderData)
		return new Response('No metadata', {
			status: 500
		});

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
	const itemCost = orderData.items?.map((item) => item.item.standard_rate * (1 - item.item.max_discount) * item.qty).reduce((prev, cur) => prev + cur) ?? Number(data._embedded['payment-link'].amount.value);

	// Fill out template
	const completeEmail = emailTemplate({
		bedrijfnaam: 'AnimeNL',
		klantnaam: orderData.form.firstName,
		ordernummer: orderData.orderId,
		producten: orderData.items,
		bijkomende_kosten: (Number(data._embedded['payment-link'].amount.value) - itemCost).toFixed(2),
		totaalbedrag: data._embedded['payment-link'].amount.value,
		verzendnaam: `${orderData.form.firstName} ${orderData.form.middleName} ${orderData.form.lastName}`,
		verzendadres: `${orderData.form.street} ${orderData.form.houseNumber}`,
		postcode: orderData.form.postalCode,
		plaats: orderData.form.city,
		webshop_url: 'https://animenl.nl',
		retour_url: 'https://animenl.nl/about?default=5',
		jaar: new Date().getFullYear()
	});

	// Send email
	await transporter.sendMail({
		to: orderData.form.email,
		subject: 'Bedankt voor je bestelling!',
		html: completeEmail
	});

	// Return OK
	return new Response('', {
		status: 200
	});
}
