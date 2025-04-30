// import Searchbar from '@/components/searchbar';

export default function Home() {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-16 items-center h-full w-full'>
          <h1 className='font-crashbow text-9xl bg-gradient-to-r w-fit px-6 py-4 from-primary to-secondary text-transparent bg-clip-text'>Anime NL</h1>
          <p className='text-xl underline'>Jouw connectie tot de japanse otaku markt</p>
          <h2>Opent binnenkort / Opens soon</h2>
          {/*<Searchbar />*/}
      </main>
    </div>
  );
}
