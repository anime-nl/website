import ItemList from '@/components/itemList';
import Searchbar from '@/components/searchbar';
import Item from '@/types/item';

import localFont from 'next/font/local';

const crashbow = localFont({
  src: "../../public/fonts/crashbow.otf",
});

export default function Home() {

  const testItem: Item = {
    id: 1,
    name: "Test Item",
    price: 11.99,
    discountPercentage: 0,
    taxPercentage: 0,
    images: ["/test.png"],
    mainImageIndex: 0
  }

  return (
    <div className="dark mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16 items-center h-full w-full">
        <h1
          className={`${crashbow.className} text-9xl bg-gradient-to-r w-fit px-6 py-4 from-primary to-secondary text-transparent bg-clip-text`}
        >
          Anime NL
        </h1>
        <p className="text-xl underline">
          Jouw connectie tot de japanse otaku markt
        </p>
        <Searchbar />
        <ItemList title='Onlangs Toegevoegd' items={[testItem, testItem, testItem, testItem, testItem, testItem, testItem, testItem]} />
        <ItemList title='Populair' items={[testItem, testItem, testItem, testItem, testItem, testItem, testItem, testItem]} />
        <ItemList title='Recent bekeken' items={[testItem, testItem, testItem, testItem, testItem, testItem, testItem, testItem]} />
      </main>
    </div>
  );
}
