import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { getUserId } from '../../utils/user';
import { CartItem } from '../../models/cart';
import Swal from 'sweetalert2';

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

  checkoutLoading = false;
  clientId: number | null = null;         // choose how you set this (from UI or context)
  invoiceNumber: string = '';

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

  // add method
checkout(): void {
  if (!this.clientId || this.clientId <= 0) {
    // basic guard—replace with your toast
    alert('Please select a valid client.');
    return;
  }
  if (!this.items.length) {
    alert('Your cart is empty.');
    return;
  }

  this.checkoutLoading = true;
  this.cartService.checkout(this.userId, this.clientId, this.invoiceNumber || undefined)
    .subscribe({
      next: (res) => {
        this.checkoutLoading = false;
        // clear local cart view
        this.items = [];
        // optional success UI (SweetAlert etc.)
        Swal.fire({ icon: 'success', title: 'Checked out', text: `Invoice: ${res.invoiceNumber}` })
        alert(`Checkout successful. Invoice: ${res.invoiceNumber}`);
        // TODO: navigate to deliveries page if you have one
        // this.router.navigate(['/deliveries'], { queryParams: { invoice: res.invoiceNumber }});
      },
      error: (err) => {
        this.checkoutLoading = false;
        console.error(err);
        alert(err?.error?.message ?? 'Checkout failed.');
      }
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
