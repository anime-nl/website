import Item from '@/types/item';

export default interface Cart {
	items: Item[];
	amount: number[];
}
