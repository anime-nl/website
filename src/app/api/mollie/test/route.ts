//import MollieWebhook from '@/types/mollieWebhook';
import * as crypto from 'node:crypto';

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
		return new Response('', {
			status: 200 // 200 for verification of webhook
		});
	}

	const data = new TextDecoder().decode(body?.value);
	console.log(data);

	return new Response('', {
		status: 200
	});
}
