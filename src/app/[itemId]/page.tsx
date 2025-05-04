import ErrorPage from '@/components/errorPage';
import ItemInfo from '@/components/itemInfo';
import Notification, { NotificationType } from '@/components/notification';
import Database from '@/database/connector';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export default async function ItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;

  console.log(Number(itemId));
  if (!Number(itemId)) {
    return <Notification notificationType={NotificationType.danger} />;
  }

  const con = await Database.getConnection();
  const item = await Database.getItemById(con, Number(itemId));

  if (!item) {
    return <ErrorPage error="Item could not be found." />;
  }

  con.release();

  const description = await remark()
    .use(remarkHtml)
    .process(
      item.description ??
        "Er is geen beschrijving voor dit product beschikbaar",
    );
  const specifications = await remark()
    .use(remarkHtml)
    .process(item.specifications ?? "");

  return (
    <div className="dark mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16 items-center h-full w-full">
        <ItemInfo
          description={description.toString()}
          item={item}
          specifications={specifications.toString()}
        />
      </main>
    </div>
  );
}
