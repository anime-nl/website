import ErpNextHelper from '@/app/Helpers/ErpNextHelper';
import ErrorPage from '@/components/errorPage';
import ItemInfo from '@/components/itemInfo';
import NotFoundNotif from '@/components/notFoundNotif';
import { Metadata } from 'next';

type Props = {
	params: Promise<{ itemId: string }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
	const {itemId} = await params;

	const item = await ErpNextHelper.getItemById(itemId);

	return {
		title: item?.item_name ?? 'Niet Gevonden',
		description: item?.description,
		openGraph: {
			images: `https://erpnext.animenl.nl${item?.image}`
		}
	};
}

export default async function ItemPage({params}: Props) {
	const {itemId} = await params;

	if (!Number(itemId)) {
		return (
			<div className="dark mx-8 sm:mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
				<main className="flex flex-col gap-16 items-center h-full w-full">
					<NotFoundNotif/>
				</main>
			</div>
		);
	}

	const item = await ErpNextHelper.getItemById(itemId);

	if (!item) {
		return <ErrorPage error="Item could not be found."/>;
	}

	const images = await ErpNextHelper.getImagesForItem(itemId);

	return (
		<div className="dark mx-8 sm:mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-16 items-center h-full w-full">
				<ItemInfo item={item} images={images?.sort() ?? []}/>
			</main>
		</div>
	);
}
