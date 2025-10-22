import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../constants'; // or environments/environment
import { CartItem } from '../models/cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiBaseUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart(userId: string): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}?userId=${encodeURIComponent(userId)}`);
  }

  addToCart(userId: string, productId: number, quantity: number): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, { userId, productId, quantity });
  }

  updateQuantity(userId: string, cartId: number, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${cartId}?userId=${encodeURIComponent(userId)}`, { quantity });
  }

  removeItem(userId: string, cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cartId}?userId=${encodeURIComponent(userId)}`);
  }

  clear(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?userId=${encodeURIComponent(userId)}`);
  }

  checkout(userId: string, clientId: number, invoiceNumber?: string) {
  return this.http.post<{ message: string; invoiceNumber: string }>(
    `${this.apiUrl}/checkout`,
    { userId, clientId, invoiceNumber }
  );
}
}
