export interface AddToCartRequest {
  userId: string;
  productId: number;
  quantity: number;
  // optional: clientId, discounts if added at add-time
}

export interface UpdateCartQuantityRequest {
  quantity: number; // 0 removes
}

export interface CheckoutRequest {
  userId: string;
  clientId: number;
  invoiceNumber?: string; // backend can generate if empty
}

export interface CheckoutResponse {
  message: string;
  invoiceNumber: string;
}
