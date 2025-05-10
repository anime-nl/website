'use client';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { Link } from '@heroui/link';
import { useSearchParams } from 'next/navigation';

export default function AboutPage() {
	const searchParams = useSearchParams()

	return (
		<div className="dark mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-16 justify-center h-full w-full">
				<h1 className='text-4xl mx-auto font-bold'>Veelgestelde Vragen</h1>
				<Accordion variant="splitted" defaultExpandedKeys={(searchParams.get('default') ?? "").split(',')}>
					<AccordionItem key="1" aria-label="Wij zijn wij" title="Wie zijn wij" className='font-bold'>
						<hr className='text-white/15 mb-2' />
						<p className='font-light'>Wij zijn een klein bedrijfje gebaseerd in de regio Eindhoven. Wij hebben een droge, verwarmde opslagruimte in Deurne waaruit wij al onze items versturen. Wij hebben dit bedrijf opgestart uit onze passie voor de Japanse Anime cultuur en om meer mensen in de verzamelhobby te krijgen. Al onze items worden direct geimporteerd vanuit Japan waar mogelijk, en wij zijn ook bereid om items te importeren die misschien niet op onze website staan. Bij een klein bedrijf is natuurlijk veel meer mogelijk dan bij een grote corporatie.</p>
					</AccordionItem>
					<AccordionItem key="2" aria-label="Waar kan ik mijn bestellingen vinden?" title="Waar kan ik mijn bestellingen vinden?" className='font-bold'>
						<hr className='text-white/15 mb-2' />
						<p className='font-light'>Wij maken geen gebruik van accounts, om een lijst van al jouw bestellingen te kunnen vinden zul je dus door jouw mail moeten zoeken. Wel kun je op onze site de status van een bepaalde bestellingen bekijken door naar de "Mijn Bestellingen" pagina te gaan en daar het ordernummer en jouw postcode in te voeren.</p>
					</AccordionItem>
					<AccordionItem key="3" aria-label="Mijn pre-order staat al een tijd op 'In afwachting van levering', wat betekend dit?" title="Mijn pre-order staat al een tijd op 'In afwachting van levering', wat betekend dit?" className='font-bold'>
						<hr className='text-white/15 mb-2' />
						<p className='font-light'>Nadat de eind-datum van de pre-orders is geweest, wordt het product eerst nog geproduceerd bij de fabrikant voordat het naar ons wordt opgestuurd. Afhankelijk van de populariteit van het product, kan het soms wat langer duren voordat wij het product ontvangen. Wij hebben hier helaas geen zeggen in en zijn volledig afhankelijk van waar wij op de lijst bij de fabrikant staan.</p>
					</AccordionItem>
					<AccordionItem key="4" aria-label="Kan ik mijn (pre)-order annuleren?" title="Kan ik mijn (pre)-order annuleren?" className='font-bold'>
						<hr className='text-white/15 mb-2' />
						<p className='font-light'>Jazeker! Maar let wel op, er zitten hier regels aan.</p>
						<h2 className='text-lg underline mt-2'>Mijn order is nog niet verzonden en bevat geen pre-order producten</h2>
						<p className='font-light'>Deze kun je kosteloos annuleren! Neem wel zo snel mogelijk contact op met ons via <Link href='mailto:info@animenl.nl?subject=Order%20annuleren'>info@animenl.nl</Link> en zorg dat je jouw ordernummer in de mail zet.</p>
						<h2 className='text-lg underline mt-2'>Mijn order is nog niet verzonden, maar bevat wel pre-order producten</h2>
						<p className='font-light'>In de meeste gevallen is het mogelijk om deze order kosteloos te annuleren, er zitten hier wel uitzonderingen aan. Doordat het een pre-order is maken wij kosten als jij deze order annuleert. Bij sommige van onze leveranciers is het namelijk niet mogelijk een pre-order te annuleren, en al helemaal niet na de sluitingsdatum van de pre-order. In deze gevallen mogen wij extra kosten in rekening brengen.</p>
						<div className='ml-4 font-light'>
							<li>Is het niet meer mogelijk voor ons om de order bij de fabrikant te annuleren, dan zullen de verzendkosten van het product in rekening gebracht worden, wij gebruiken vaak EMS voor het importeren van onze producten, dus het bedrag zal niet super hoog liggen, maar je moet hier wel rekening mee houden. Ook worden eventuele extra kosten die wij maken bij het importeren meegerekend. Neem de 4.7% invoerrecht voor producten boven de 150 euro als voorbeeld.</li>
							<li>Is jouw order meer dan 500 euro waard? Dan wordt er nog een extra 10% van de totaalprijs (exclusief BTW) in rekening gebracht.</li>
						</div>
						<h2 className='text-lg underline mt-2'>Mijn order is al verzonden</h2>
						<p className='font-light'>Check de instrucies onder het kopje "Ik wil mijn order retour sturen, hoe doe ik dit?"</p>
					</AccordionItem>
					<AccordionItem key="5" aria-label="Ik wil mijn order retour sturen, hoe doe ik dit?" title="Ik wil mijn order retour sturen, hoe doe ik dit?" className='font-bold'>
						<hr className='text-white/15 mb-2' />
						<p className='font-light'>Helemaal geen probleem, volgens het europees herroepingsrecht heb jij 14 dagen bedenktijd op alle online aankopen die jij doet zonder reden op te hoeven geven. Let wel op de regels die hieraan vast zitten</p>
						<div className='ml-4 font-light'>
							<li>Je moet ons binnen 14 dagen na ontvangst duidelijk laten weten dat jij het product wilt retourneren. Na de melding heb je nog eens 14 dagen om het product te versturen.</li>
							<li>Het product moet in originele staat bij ons terug komen. Is het product opengemaakt of beschadigd? Dan zullen wij een waardevermindering in rekening brengen omdat wij dit product niet meer voor de originele prijs kunnen verkopen.</li>
							<li>Je bent zelf verantwoorderlijk voor het retour, dit betekend dat jij zelf voor alle eventuele kosten opdraait.</li>
							<li>Na het verstrijken van de 14 dagen bedenktijd, nemen wij <u><b>GEEN</b></u> retours meer aan.</li>
						</div>
					</AccordionItem>
					<AccordionItem key="6" aria-label="Waar kan ik reviews achterlaten / feedback geven?" title="Waar kan ik reviews achterlaten / feedback geven?" className='font-bold'>
						<hr className='text-white/15 mb-2' />
						<p className='font-light'>Je kan reviews achterlaten op onze <Link href='https://nl.trustpilot.com/review/animenl.nl'>Trustpilot</Link> of op Google Maps. Uiteraard mag je natuurlijk ook altijd een mailtje naar ons sturen op <Link href='mailto:info@animenl.nl?subject=Feedback'>info@animenl.nl</Link></p>
					</AccordionItem>
					<AccordionItem key="7" aria-label="Hoe kan ik jullie bereiken" title="Hoe kan ik jullie bereiken?" className='font-bold'>
						<hr className='text-white/15 mb-2' />
						<p className='font-light'>Wij zijn iedere dag bereikbaar op <Link href='mailto:info@animenl.nl?subject=Vraag'>info@animenl.nl</Link>, wij proberen zo snel mogelijk te reageren.</p>
					</AccordionItem>
					<AccordionItem key="8" aria-label="Ik heb problemen met een product" title="Ik heb problemen met een product" className='font-bold'>
						<hr className='text-white/15 mb-2' />
						<p className='font-light'>Zeer vervelend om te horen! Graag ontvangen wij een beschrijven van het probleem samen met wat foto's of een video van het probleem op <Link href='mailto:info@animenl.nl?subject=Probleem%20met%20product'>info@animenl.nl</Link></p>
					</AccordionItem>
				</Accordion>
			</main>
		</div>
	)
}