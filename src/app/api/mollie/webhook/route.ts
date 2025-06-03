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

	// Read body
	const bodyReader = req.body?.getReader();

	// Generate hash
	hmac.update((await bodyReader?.read())?.toString() ?? '');
	console.log((await bodyReader?.read())?.toString());

	// Release body reader
	bodyReader?.releaseLock();

	console.log(process.env.MOLLIE_WEBHOOK_SECRET);
	console.log(req.headers.get('X-Mollie-Signature'));
	console.log(hmac.digest('hex'));
	console.log(req.headers.get('X-Mollie-Signature') != hmac.digest('hex'));

	// Check if hex values match
	if (req.headers.get('X-Mollie-Signature') != hmac.digest('hex')) {
		return new Response('', {
			status: 200
		});
	}

	const data = await req.json();
	console.log(data);

	return new Response('', {
		status: 200
	});
}