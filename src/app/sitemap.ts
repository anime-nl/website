import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://animenl.nl',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 1
		},
		{
			url: 'https://animenl.nl/order',
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.7
		},
		{
			url: 'https://animenl.nl/about',
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.5
		}
	];
}
