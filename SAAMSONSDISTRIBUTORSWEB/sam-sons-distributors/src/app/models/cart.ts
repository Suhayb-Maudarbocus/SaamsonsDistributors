import { Decimal, ISODateString } from './common';
import { Product } from './product';

export enum CartStatus {
  In_Progress = 0,
  Pending = 1,
  Delivered = 2,
}

export interface CartItem {
  id: number;
  productId: number;
  product?: Product | null;

  userId: string;
  clientId: number;

  quantity: number;

  unitPriceAtTime: Decimal;       // snapshot price at add-to-cart time
  discountPerProduct: Decimal;    // absolute discount per item
  percentageDiscount: Decimal;    // e.g., 7.50 = 7.5%
  totalDiscount: Decimal;         // total discount for this line
  total: Decimal;                 // line total after discounts

  invoiceNumber?: string | null;

  createdDate: ISODateString;
  status: CartStatus;
}
