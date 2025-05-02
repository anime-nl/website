export default interface Item {
	id: number;
	name: string;
	price: number;
	discountPercentage: number;
	taxPercentage: number;
	images: string[];
	mainImageIndex: number;
}