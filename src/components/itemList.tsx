"use client";
import Item from '@/types/item';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { Image } from '@heroui/image';

export default function ItemList(props: { title: string; items: Item[] }) {
  return (
    <div className="flex flex-col w-full relative z-1">
      <span className="flex justify-between">
        <h1 className="text-3xl m-2">{props.title}</h1>
        <p className="my-auto">Meer bekijken</p>
      </span>
      <hr />
      <div className="gap-4 grid grid-cols-8 m-8">
        {props.items.map((item, i) => (
          <Card
            key={i}
            isPressable
            isHoverable
            shadow="sm"
            onPress={() => console.log("clicked")}
          >
            <CardBody className="overflow-visible p-0">
              <Image
                alt={item.name}
                className="w-72 object-cover max-h-72 pointer-events-none"
                radius="lg"
                shadow="sm"
                src="/test.png"
                width="100%"
              />
            </CardBody>
            <CardFooter className="text-small justify-between align-top h-full">
              <b>{item.name}</b>
              <span>
                <p className="text-default-500">€{item.price}</p>
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
