'use client';

import { Link } from '@heroui/link';
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle
} from '@heroui/navbar';
import Image from 'next/image';
import { useState } from 'react';

export default function Nav(props: { nav: { name: string; route: string }[] }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<Navbar className="pt-2 shadow-xl bg-black/50" onMenuOpenChange={setIsMenuOpen}>
			<NavbarContent>
				<NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden"/>
				<NavbarBrand>
					<Link href="/" className="text-foreground">
						<p
							className={`font-[family-name:var(--font-crashbow)] text-lg sm:text-2xl bg-gradient-to-r w-fit px-6 py-4 from-primary to-secondary text-transparent bg-clip-text`}
						>
							Anime NL
						</p>
					</Link>
				</NavbarBrand>
			</NavbarContent>
			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				{props.nav.map((item, i) => {
					return (
						<NavbarItem key={i} isActive={true}>
							<Link color="foreground" href={item.route} className={'px-2 py-1 font-thin'}>
								{item.name}
							</Link>
						</NavbarItem>
					);
				})}
			</NavbarContent>
			<NavbarContent className="hidden lg:flex gap-8" justify="end">
				<NavbarItem>
					<Link href="/cart" className="text-foreground relative h-8 w-8">
						<Image alt="cart" className="invert" src="./cart.svg" fill={true}/>
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link href="https://nl.trustpilot.com/review/animenl.nl"
					      className="text-foreground relative h-8 w-32">
						<Image alt="stars"
						       src="https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-3.5.svg"
						       width={128} height={64}/>
						<p className="my-auto text-lg ml-6"><span className="font-bold text-2xl">3.6</span> via
							TrustPilot
						</p>
					</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarMenu className="pt-4">
				<NavbarMenuItem key="reviews" className="w-full my-6">
					<Link href="https://nl.trustpilot.com/review/animenl.nl"
					      className="text-foreground relative h-8 w-full justify-center">
						<Image alt="stars"
						       src="https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-3.5.svg"
						       width={128} height={64}/>
						<p className="my-auto text-lg ml-6"><span className="font-bold text-2xl">3.6</span> via
							TrustPilot
						</p>
					</Link>
				</NavbarMenuItem>
				{props.nav.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						<Link className="w-full" color={'foreground'} href={item.route} size="lg">
							{item.name}
						</Link>
						<hr className="text-foreground/10"/>
					</NavbarMenuItem>
				))}
				<NavbarMenuItem key="winkelwagen">
					<Link className="w-full" color={'foreground'} href="/cart" size="lg">
						Winkelwagen
					</Link>
					<hr className="text-foreground/10"/>
				</NavbarMenuItem>
			</NavbarMenu>
		</Navbar>
	);
}
