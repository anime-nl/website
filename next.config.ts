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
	}
};

export default nextConfig;
