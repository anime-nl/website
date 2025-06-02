import ErpNextHelper from '@/app/Helpers/ErpNextHelper';
import ErrorPage from '@/components/errorPage';
import ItemInfo from '@/components/itemInfo';
import Notification, { NotificationType } from '@/components/notification';

export default async function ItemPage({params}: { params: Promise<{ itemId: string }> }) {
	const {itemId} = await params;

	if (!Number(itemId)) {
		return <Notification notificationType={NotificationType.danger}/>;
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
