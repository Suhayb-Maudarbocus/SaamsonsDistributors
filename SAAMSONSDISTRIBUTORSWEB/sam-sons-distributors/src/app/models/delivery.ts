import { Decimal, ISODateString } from './common';
import { Product } from './product';

export enum DeliveryStatus {
  Pending = 'Pending',
  OutForDelivery = 'OutForDelivery',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}

export interface Delivery {
  id: number;
  productId: number;
  product?: Product | null;

  clientId: number;
  userId: string;

  invoiceNumber: string;
  status: DeliveryStatus;

  quantity: number;

  unitPriceAtTime: Decimal;
  discountPerProduct: Decimal;
  percentageDiscount: Decimal;
  totalDiscount: Decimal;
  total: Decimal;

  createdDate: ISODateString;
}
