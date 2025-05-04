export default interface Item {
  id: number;
  name: string;
  description: string | null;
  specifications: string | null;
  category: string | null;
  series: string | null;
  manufacturer: string | null;
  price: number;
  discountPercentage: number;
  taxPercentage: number;
  imageCount: number;
  mainImageIndex: number | null;
  preOrder: boolean;
  releaseDate: string | null;
  preOrderCloseDate: string | null;
  janCode: string;
}
