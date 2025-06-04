import { Providers } from '@/app/providers';
import Nav from '@/components/nav';
import { Link } from '@heroui/link';
import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import React from 'react';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
});

const crashbow = localFont({
	variable: '--font-crashbow',
	src: '../../public/fonts/crashbow.otf'
});

export const metadata: Metadata = {
	title: 'Anime NL',
	description:
		'De webwinkel voor al jouw anime spullen! · Goedkope Figures · Plushies · Sleutelhangers · En nog veel meer! · Jouw one-stop shop voor alle Japanse Otaku Merchandise · Niet gevonden wat je zocht? Wij importeren het voor je!',
	icons: {
		icon: 'https://animenl.nl/android-chrome-512x512.png',
		apple: 'https://animenl.nl/apple-touch-icon.png'
	}
};

const nav: { name: string; route: string }[] = [
	{
		name: 'Home',
		route: '/'
	},
	{
		name: 'Over ons',
		route: '/about'
	},
	{
		name: 'Mijn bestellingen',
		route: '/order'
	}
];

export default async function RootLayout({
	                                         children
                                         }: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className="scrollbar-thin scrollbar-thumb-secondary scrollbar-track-background scrollbar-thumb-rounded-full"
		>
		<body className={`${geistSans.variable} ${geistMono.variable} ${crashbow.variable} antialiased`}>
		<Providers>
			<Nav nav={nav}/>
			{children}
			<hr className="text-white/15 mt-8"/>
			<div
				className="grid grid-rows-3 sm:grid-rows-1 sm:grid-cols-5 sm:grid-flow-row px-0 sm:px-[30%] py-4 sm:py-8 bg-black/25 h-fit gap-8 sm:gap-0">
				<div className="flex flex-col gap-4 sm:text-end text-center row-start-2 sm:col-start-1 sm:row-start-1">
					<h1 className="font-bold text-2xl">Klantenservice</h1>
					<hr className="w-2/3 mx-auto visible sm:invisible"/>
					<p>
						<Link href="/about?default=5" className="text-foreground">
							Retourneren
						</Link>
					</p>
					<p>
						<Link href="/about?default=8" className="text-foreground">
							Problemen met een product
						</Link>
					</p>
					<p>
						<Link href="/about" className="text-foreground">
							Veelgestelde Vragen
						</Link>
					</p>
					<p>
						<Link href="/about?default=7" className="text-foreground">
							Contact
						</Link>
					</p>
				</div>
				<span
					className="w-0 border-2 border-white/15 mx-auto hidden sm:block row-start-4 sm:col-start-2 sm:row-start-1"></span>
				<div className="flex flex-col gap-4 text-center row-start-1 sm:col-start-3 sm:row-start-1">
					<p
						className={`font-[family-name:var(--font-crashbow)] text-4xl bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text`}
					>
						Anime NL
					</p>
					<p>KVK 97160865</p>
					<p>VAT NL005252326B52</p>
				</div>
				<span
					className="w-0 border-2 border-white/15 mx-auto hidden sm:block row-start-5 sm:col-start-4 sm:row-start-1"></span>
				<div
					className="flex flex-col gap-4 sm:text-start text-center row-start-3 sm:col-start-5 sm:row-start-1">
					<h1 className="font-bold text-2xl">Onze Winkel</h1>
					<hr className="w-2/3 mx-auto visible sm:invisible"/>
					<p>
						<Link href="/about?default=1" className="text-foreground">
							Over ons
						</Link>
					</p>
					<p>
						<Link href="/sitemap.xml" className="text-foreground">
							Sitemap
						</Link>
					</p>
				</div>
			</div>
		</Providers>
		</body>
		</html>
	);
}
