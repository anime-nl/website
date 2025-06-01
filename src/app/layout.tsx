import { Providers } from '@/app/providers';
import { Link } from '@heroui/link';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import Image from 'next/image';

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
	description: 'De webwinkel voor al jouw anime spullen! · Goedkope Figures · Plushies · Sleutelhangers · En nog veel meer! · Jouw one-stop shop voor alle Japanse Otaku Merchandise · Niet gevonden wat je zocht? Wij importeren het voor je!',
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
		name: 'Order status',
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
			<Navbar className="pt-2 shadow-xl bg-black/50">
				<NavbarBrand>
					<Link href="/" className="text-foreground">
						<p
							className={`font-[family-name:var(--font-crashbow)] text-2xl bg-gradient-to-r w-fit px-6 py-4 from-primary to-secondary text-transparent bg-clip-text`}
						>
							Anime NL
						</p>
					</Link>
				</NavbarBrand>
				<NavbarContent className="hidden sm:flex gap-4" justify="center">
					{nav.map((item, i) => {
						return (
							<NavbarItem key={i} isActive={true}>
								<Link
									color="foreground"
									href={item.route}
									className={'px-2 py-1 font-thin'}
								>
									{item.name}
								</Link>
							</NavbarItem>
						);
					})}
				</NavbarContent>
				<NavbarContent justify="end">
					<NavbarItem className="hidden lg:flex">
						<Link href="/cart" className="text-foreground relative h-8 w-8">
							<Image alt="cart" className="invert" src="./cart.svg" fill={true}/>
						</Link>
					</NavbarItem>
				</NavbarContent>
			</Navbar>
			{children}
			<hr className="text-white/15 mt-8"/>
			<div className="grid grid-cols-5 grid-flow-row px-[30%] py-8 bg-black/25">
				<div className="flex flex-col gap-4 text-end">
					<h1 className="font-bold text-2xl">Klantenservice</h1>
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
				<span className="w-0 border-2 border-white/15 mx-auto"></span>
				<div className="flex flex-col gap-4 text-center">
					<p
						className={`font-[family-name:var(--font-crashbow)] text-4xl bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text`}
					>
						Anime NL
					</p>
					<p>KVK 97160865</p>
					<p>VAT NL005252326B52</p>
				</div>
				<span className="w-0 border-2 border-white/15 mx-auto"></span>
				<div className="flex flex-col gap-4 text-start">
					<h1 className="font-bold text-2xl">Onze Winkel</h1>
					<p>
						<Link href="/about?default=1" className="text-foreground">
							Over ons
						</Link>
					</p>
					<p><Link href="/sitemap.xml" className="text-foreground">
						Sitemap
					</Link></p>
				</div>
			</div>
		</Providers>
		</body>
		</html>
	);
}
