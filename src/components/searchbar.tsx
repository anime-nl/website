"use client";
import Image from 'next/image';
import { useState } from 'react';

interface facts {
  current_page: number;
  data: data[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url?: string;
    label: string;
    active: boolean;
  }[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

interface data {
  fact: string;
  length: number;
}

export default function Searchbar() {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<data[]>([]);

  let searchTimeout: NodeJS.Timeout | undefined = undefined;

  const onSearchInput = async (input: string) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      submitSearch(input);
    }, 500);
  };

  const submitSearch = async (input: string) => {
    setIsSearching(true);

    const data = await fetch("https://catfact.ninja/facts");
    const result: facts = await data.json();

    if (input === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setSearchResults(
      result.data.filter((value: data) => value.fact.includes(input)) ?? [],
    );
    setIsSearching(false);
  };

  return (
    <div className="flex flex-col w-full relative z-10">
      <div className="w-1/2 mx-auto relative">
        <input
          placeholder="Search"
          className="text-lg leading-tight w-full h-full bg-white/10 p-4 rounded-t-lg outline-0"
          onChange={(e) => onSearchInput(e.target.value)}
        />
        <div className="absolute right-16 top-0 h-full flex">
          <span
            className="rounded-full h-1/2 my-auto border-r-2 animate-spin"
            style={{ visibility: isSearching ? "visible" : "hidden" }}
          ></span>
        </div>
      </div>
      <div className="w-full absolute top-full">
        <div className="w-1/2 mx-auto relative bg-material-800 rounded-b-lg">
          {searchResults.map((value: data, i) => {
            if (i >= 3) return;
            return (
              <div
                key={i}
                className="relative flex flex-col w-full h-16 items-center hover:bg-black/15"
              >
                <hr className="opacity-15 w-full" />
                <div className="grid grid-cols-8 w-full h-full justify-center">
                  <div className="w-16 h-full relative justify-start">
                    <Image
                      className="object-contain py-1"
                      src="vercel.svg"
                      alt="cover"
                      fill
                    />
                  </div>
                  <h1 className="my-auto col-span-7">{value.fact}</h1>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
