import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'erpnext.animenl.nl'
			}
		]
	}
};

export default nextConfig;
