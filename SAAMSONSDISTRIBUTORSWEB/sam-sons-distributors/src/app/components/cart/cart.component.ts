import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { getUserId } from '../../utils/user';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  userId = getUserId();
  items: CartItem[] = [];
  loading = false;
  rowLoading: Record<number, boolean> = {}; // cartId -> loading

  ngOnInit(): void {
    this.loadCart();
  }

  constructor(private cartService: CartService) {}

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart(this.userId).subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  // choose sellingPrice first, fallback to unitPrice, default 0
  priceOf(item: CartItem): number {
    return (item.product?.sellingPrice ?? item.product?.unitPrice ?? 0);
  }

  lineTotal(item: CartItem): number {
    return this.priceOf(item) * (item.quantity ?? 0);
  }

  cartTotal(): number {
    return this.items.reduce((sum, it) => sum + this.lineTotal(it), 0);
  }

  onQtyChange(item: CartItem): void {
    if (item.quantity < 0) item.quantity = 0;
  }

  saveQty(item: CartItem): void {
    this.rowLoading[item.id] = true;
    this.cartService.updateQuantity(this.userId, item.id, item.quantity).subscribe({
      next: () => { this.rowLoading[item.id] = false; },
      error: () => { this.rowLoading[item.id] = false; }
    });
  }

  remove(item: CartItem): void {
    this.rowLoading[item.id] = true;
    this.cartService.removeItem(this.userId, item.id).subscribe({
      next: () => {
        this.rowLoading[item.id] = false;
        this.items = this.items.filter(i => i.id !== item.id);
      },
      error: () => { this.rowLoading[item.id] = false; }
    });
  }

  clear(): void {
    this.loading = true;
    this.cartService.clear(this.userId).subscribe({
      next: () => { this.items = []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
