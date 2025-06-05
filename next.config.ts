import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'erpnext.animenl.nl'
			},
			{
				protocol: 'https',
				hostname: 'www.postnl.nl'
			},
			{
				protocol: 'https',
				hostname: 'www.dhlexpress.nl'
			}
		]
	},
	experimental: {
		serverActions: {
			allowedOrigins: ['https://animenl.nl', '0.0.0.0:8652'],
		},
	},
	webpack: (config) => {
		// Fix webpack errors with handlebar
		config.resolve.alias = {
			...config.resolve.alias,
			'handlebars/runtime': 'handlebars/dist/cjs/handlebars.runtime',
			'handlebars': 'handlebars/dist/cjs/handlebars.runtime'
		};
		return config;
	}
};

export default nextConfig;
