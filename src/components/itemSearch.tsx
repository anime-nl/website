'use client';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { Input } from '@heroui/input';
import { Listbox, ListboxItem } from '@heroui/listbox';
import { Slider } from '@heroui/slider';
import { SharedSelection } from '@heroui/system';
import { useRouter, useSearchParams } from 'next/navigation';
import { Key, useCallback, useRef, useState } from 'react';

export default function ItemSearch(props: {
	series: string[];
	categories: string[];
	manufacturers: string[];
	characters: string[];
}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [selectedProductStatus, setSelectedProductStatus] = useState<SharedSelection>(
		searchParams.has('status') ? new Set(searchParams.get('status')?.split(',') ?? new Set()) : new Set()
	);
	const [selectedSeries, setSelectedSeries] = useState<SharedSelection>(
		searchParams.has('series') ? new Set(searchParams.get('series')?.split(',') ?? new Set()) : new Set()
	);
	const [selectedCategories, setSelectedCategories] = useState<SharedSelection>(
		searchParams.has('categories') ? new Set(searchParams.get('categories')?.split(',') ?? new Set()) : new Set()
	);
	const [selectedManufacturers, setSelectedManufacturers] = useState<SharedSelection>(
		searchParams.has('manufacturers')
			? new Set(searchParams.get('manufacturers')?.split(',') ?? new Set())
			: new Set()
	);
	const [selectedCharacters, setSelectedCharacters] = useState<SharedSelection>(
		searchParams.has('characters') ? new Set(searchParams.get('characters')?.split(',') ?? new Set()) : new Set()
	);
	const [searchTerm, setSearchTerm] = useState<string>(
		searchParams.has('search') ? (searchParams.get('search') ?? '') : ''
	);
	const [priceRange, setPriceRange] = useState<number[]>(
		searchParams.has('priceRange')
			? (searchParams
				.get('priceRange')
				?.split(',')
				.map((_) => Number(_)) ?? [0, 500])
			: [0, 500]
	);
	const queryTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

	const updateQueryParam = useCallback(
		(paramName: string, value: string | number[] | Key[]) => {
			if (queryTimeout.current) {
				clearTimeout(queryTimeout.current);
			}

			queryTimeout.current = setTimeout(() => {
				const currentParams = new URLSearchParams(searchParams.toString());

				if (Array.isArray(value)) {
					const serializedValue = value.join(',');
					if (serializedValue) {
						currentParams.set(paramName, serializedValue);
					} else {
						currentParams.delete(paramName);
					}
				} else {
					if (value) {
						currentParams.set(paramName, value);
					} else {
						currentParams.delete(paramName);
					}
				}
				router.push(`?${currentParams.toString()}`);
			}, 500);
		},
		[router, searchParams]
	);

	const onSearchTermChanged = useCallback(
		(value: string) => {
			updateQueryParam('search', value);
			setSearchTerm(value);
		},
		[updateQueryParam]
	);

	const onSeriesChanged = useCallback(
		(keys: SharedSelection) => {
			updateQueryParam('series', Array.from(keys));
			setSelectedSeries(keys);
		},
		[updateQueryParam]
	);

	const onManufacturerChanged = useCallback(
		(keys: SharedSelection) => {
			updateQueryParam('manufacturers', Array.from(keys));
			setSelectedManufacturers(keys);
		},
		[updateQueryParam]
	);

	const onCharactersChanged = useCallback(
		(keys: SharedSelection) => {
			updateQueryParam('characters', Array.from(keys));
			setSelectedCharacters(keys);
		},
		[updateQueryParam]
	);

	const onSelectedProductStatusChanged = useCallback(
		(keys: SharedSelection) => {
			updateQueryParam('status', Array.from(keys));
			setSelectedProductStatus(keys);
		},
		[updateQueryParam]
	);

	const onCategoryChanged = useCallback(
		(keys: SharedSelection) => {
			updateQueryParam('categories', Array.from(keys));
			setSelectedCategories(keys);
		},
		[updateQueryParam]
	);

	const onPriceRangeChanged = useCallback(
		(price: number[]) => {
			updateQueryParam('priceRange', price);
			setPriceRange(price);
		},
		[updateQueryParam]
	);

	return (
		<Accordion variant="splitted" defaultExpandedKeys={['Search']} selectionMode="multiple">
			<AccordionItem key="Search" aria-label="Zoeken" title="Zoeken">
				<Input
					isClearable={true}
					placeholder="Zoekterm"
					type="search"
					value={searchTerm}
					onValueChange={onSearchTermChanged}
				/>
			</AccordionItem>
			<AccordionItem key="Product Status" aria-label="Product Status" title="Product status">
				<Listbox
					disallowEmptySelection
					aria-label="Product Status"
					selectedKeys={selectedProductStatus}
					selectionMode="multiple"
					variant="flat"
					onSelectionChange={onSelectedProductStatusChanged}
				>
					<ListboxItem key="Pre-order">Pre-order</ListboxItem>
					<ListboxItem key="Op voorraad">Op voorraad</ListboxItem>
					<ListboxItem key="Uitverkocht">Uitverkocht</ListboxItem>
				</Listbox>
			</AccordionItem>
			<AccordionItem key="Price" aria-label="Prijs" title="Prijs">
				<Slider
					className="max-w-md"
					defaultValue={[0, 500]}
					formatOptions={{style: 'currency', currency: 'EUR'}}
					label=" "
					maxValue={500}
					minValue={0}
					step={10}
					value={priceRange}
					onChange={(_) => onPriceRangeChanged(_ as number[])}
				/>
			</AccordionItem>
			<AccordionItem key="Categories" aria-label="Categorie" title="Categorie">
				<Listbox
					aria-label="Categorie"
					selectedKeys={selectedCategories}
					selectionMode="multiple"
					variant="flat"
					onSelectionChange={onCategoryChanged}
				>
					{props.categories.map((category) => {
						return <ListboxItem key={category}>{category}</ListboxItem>;
					})}
				</Listbox>
			</AccordionItem>
			<AccordionItem key="Series" aria-label="Source" title="Source">
				<Listbox
					isVirtualized
					aria-label="Source"
					selectedKeys={selectedSeries}
					selectionMode="multiple"
					variant="flat"
					onSelectionChange={onSeriesChanged}
					virtualization={{
						maxListboxHeight: 400,
						itemHeight: 40
					}}
				>
					{props.series.map((serie) => {
						return <ListboxItem key={serie}>{serie}</ListboxItem>;
					})}
				</Listbox>
			</AccordionItem>
			<AccordionItem key="Characters" aria-label="Character" title="Character">
				<Listbox
					isVirtualized
					aria-label="Character"
					selectedKeys={selectedCharacters}
					selectionMode="multiple"
					variant="flat"
					onSelectionChange={onCharactersChanged}
					virtualization={{
						maxListboxHeight: 400,
						itemHeight: 40
					}}
				>
					{props.characters.map((character) => {
						return <ListboxItem key={character}>{character}</ListboxItem>;
					})}
				</Listbox>
			</AccordionItem>
			<AccordionItem key="Manufacturers" aria-label="Fabrikant" title="Fabrikant">
				<Listbox
					isVirtualized
					aria-label="Fabrikant"
					selectedKeys={selectedManufacturers}
					selectionMode="multiple"
					variant="flat"
					onSelectionChange={onManufacturerChanged}
					virtualization={{
						maxListboxHeight: 400,
						itemHeight: 40
					}}
				>
					{props.manufacturers.map((manufacturer) => {
						return <ListboxItem key={manufacturer}>{manufacturer}</ListboxItem>;
					})}
				</Listbox>
			</AccordionItem>
		</Accordion>
	);
}
