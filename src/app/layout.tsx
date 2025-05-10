import { Providers } from '@/app/providers';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { headers } from 'next/headers';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const crashbow = localFont({
	variable: '--font-crashbow',
	src: '../../public/fonts/crashbow.otf',
});

export const metadata: Metadata = {
	title: 'Anime NL',
	description: 'Jouw connectie tot de japanse otaku markt',
};

const nav: { name: string; route: string }[] = [
	{
		name: 'home',
		route: '/',
	},
	{
		name: 'search',
		route: '/search',
	},
	{
		name: 'about us',
		route: '/about',
	},
];

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headerList = await headers();
	const pathname = headerList.get('x-current-path') ?? '/';
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
								const isActive = pathname == item.route;
								return (
									<NavbarItem key={i} isActive={isActive ? true : undefined}>
										<Link
											aria-current={isActive ? 'page' : undefined}
											color="foreground"
											href={item.route}
											className={isActive ? 'bg-white/10 px-2 py-1 rounded-lg' : undefined}
										>
											{item.name}
										</Link>
									</NavbarItem>
								);
							})}
						</NavbarContent>
						<NavbarContent justify="end">
							<NavbarItem className="hidden lg:flex">
								<Link href="/login" className="text-foreground">
									Login
								</Link>
							</NavbarItem>
							<NavbarItem>
								<Button href="/login?signup=true">Sign Up</Button>
							</NavbarItem>
						</NavbarContent>
					</Navbar>
					{children}
					<hr className="text-white/15 mt-8" />
					<div className="grid grid-cols-5 grid-flow-row px-[30%] py-8 bg-black/25">
						<div className="flex flex-col gap-4 text-end">
							<h1 className="font-bold text-2xl">Klantenservice</h1>
							<p>Retourneren</p>
							<p>Problemen met een product</p>
							<p>Veelgestelde Vragen</p>
							<p>Zakelijke Klanten</p>
							<p>Contact</p>
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
							<p>Over ons</p>
							<p>Merken</p>
							<p>Sitemap</p>
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
