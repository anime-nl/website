import OrderData from '@/types/orderData';

export default interface MollieWebhook {
	resource: string;
	id: string;
	type: string;
	entityId: string;
	createdAt: string;
	_embedded: Embedded;
	_links: Links2;
}

export interface Embedded {
	'payment-link': PaymentLink;
}

export interface PaymentLink {
	resource: string;
	id: string;
	profileId: string;
	mode: string;
	description: string;
	amount: Amount;
	archived: boolean;
	redirectUrl: string;
	createdAt: string;
	expiresAt: string;
	reusable: boolean;
	_links: Links;
	metadata: OrderData;
}

export interface Amount {
	currency: string;
	value: string;
}

export interface Links {
	self: Self;
	paymentLink: PaymentLink2;
	documentation: Documentation;
}

export interface Self {
	href: string;
	type: string;
}

export interface PaymentLink2 {
	href: string;
	type: string;
}

export interface Documentation {
	href: string;
	type: string;
}

export interface Links2 {
	'self': Self2;
	'documentation': Documentation2;
	'payment-link': PaymentLink3;
}

export interface Self2 {
	href: string;
	type: string;
}

export interface Documentation2 {
	href: string;
	type: string;
}

export interface PaymentLink3 {
	href: string;
	type: string;
}
