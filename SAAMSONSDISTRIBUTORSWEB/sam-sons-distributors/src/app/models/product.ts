import { Decimal } from './common';

export interface Product {
  id: number;
  code?: string | null;
  name?: string | null;
  url?: string | null;
  unitPrice?: Decimal | null;     // decimal(18,2)
  sellingPrice?: Decimal | null;  // decimal(18,2)
  supplierName?: string | null;
  quantity?: number | null;       // stock on hand
}
