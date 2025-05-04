"use client";
import Item from '@/types/item';
import { Button } from '@heroui/button';
import Image from 'next/image';
import { useState } from 'react';

export default function ItemInfo(props: {
  item: Item & { stock: number };
  description: string;
  specifications: string;
}) {

  const [selectedImage, setSelectedImage] = useState<number>(props.item.mainImageIndex ?? 0);

  return (
    <div className="grid grid-cols-2 grid-flow-col w-full h-full m-16">
      <div className="w-3/4 mx-auto relative flex flex-col gap-8 bg-material-800 p-8 rounded-2xl">
        <div className="relative w-full h-10/12">
          <Image
            alt={"image"}
            src={`https://cdn.animenl.nl/images/${props.item.id}/${selectedImage}.webp`}
            fill
            className="object-contain"
          />
        </div>
        <hr className="text-white/10" />
        <div className="flex flex-row justify-center gap-8 w-full h-1/6 overflow-x-scroll scrollbar-thin scrollbar-thumb-secondary scrollbar-track-background scrollbar-thumb-rounded-full">
          {[...Array(props.item.imageCount)].map((_, index) => {
            return (
              <div key={index} className='w-16 h-full py-2'>
                <Button className='h-full' onPress={() => setSelectedImage(index)}>
                  <Image
                    alt={"image"}
                    src={`https://cdn.animenl.nl/images/${props.item.id}/${index}.webp`}
                    fill
                    className="object-cover"
                  />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full h-[50vh] flex flex-col gap-2">
        <h1 className="text-4xl">{props.item.name}</h1>
        <hr />
        <span className="flex gap-2">
          <h1 className="text-lg">€{props.item.price}</h1>
          <p className="text-foreground/50 text-sm my-auto">(exc. VAT)</p>
        </span>
        <div dangerouslySetInnerHTML={{ __html: props.description }}></div>
        <div
          className="ml-6 mb-6 h-full"
          dangerouslySetInnerHTML={{ __html: props.specifications }}
        ></div>
        <hr />
        <div className="grid grid-cols-2 grid-flow-row gap-4 w-full h-full m-16">
          {props.item.category ? (
            <>
              <p className="my-auto">Categorie</p>
              <Button className="w-fit my-auto" onPress={() => {}}>
                {props.item.category}
              </Button>
            </>
          ) : null}
          {props.item.series ? (
            <>
              <p className="my-auto">Serie</p>
              <Button className="w-fit my-auto">{props.item.series}</Button>
            </>
          ) : null}
          {props.item.manufacturer ? (
            <>
              <p className="my-auto">Fabrikant</p>
              <Button className="w-fit my-auto">
                {props.item.manufacturer}
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
