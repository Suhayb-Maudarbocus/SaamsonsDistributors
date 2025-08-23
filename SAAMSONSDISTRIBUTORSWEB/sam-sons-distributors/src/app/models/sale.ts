import { Decimal, ISODateString } from './common';
import { Product } from './product';

export enum SaleStatus {
  Paid = 'Paid',
  Returned = 'Returned',
  Refunded = 'Refunded',
  Cancelled = 'Cancelled',
}

export interface Sale {
  id: number;
  productId: number;
  product?: Product | null;

  clientId: number;
  userId: string;

  invoiceNumber: string;
  status: SaleStatus;

  quantity: number;

  unitPriceAtTime: Decimal;
  discountPerProduct: Decimal;
  percentageDiscount: Decimal;
  totalDiscount: Decimal;
  total: Decimal;

  createdDate: ISODateString;
  deliveredDate?: ISODateString | null;
}
