import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { getUserId } from '../../utils/user';
import { CartItem } from '../../models/cart';
import Swal from 'sweetalert2';
import { Client } from '../../models/client';
import { ClientsService } from '../../services/client.service';
import { Router } from '@angular/router';
import { ClientHandlerService } from '../../services/clientHandler.service';

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
  clients: Client[] = [];
  clientsLoading = false;       // choose how you set this (from UI or context)
  invoiceNumber: string = '';

  public get clientId(): number {
    return this._clientId;
  }

  public set clientId(value: number) {
    this._clientId = value;
    let client = this.clients.find(c => c.id === value);
    if (client) {
      this.clientHandlerService.client$.next(client);
    }
  }

  private _clientId: number = 0;


  ngOnInit(): void {
    this.loadCart();
    this.loadClients();
  }

  constructor(private cartService: CartService,
              private clientService: ClientsService,
              private router: Router,
              private clientHandlerService: ClientHandlerService
  ) {}

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

  public openPrintPreview() {
  if (!this.clientId || this.items.length === 0) return;
  this.router.navigate(['/print-preview'], {
    queryParams: {
      userId: this.userId,
      clientId: this.clientId,
      invoiceNumber: this.invoiceNumber || ''
    }
  });
}

  private loadClients(): void {
  this.clientsLoading = true;
  // Pull first 100 active clients; adjust as you wish
  this.clientService.list('', 0, 100, true).subscribe({
    next: (data) => {
      // Add initial value
      this.clients = [{ id: 0, name: 'Select Client', isActive: true }, ...data];
      // Optional: preselect the first client if none chosen
      if (!this.clientId && this.clients.length) {
        this.clientId = this.clients[0].id;
      }
      this.clientsLoading = false;
    },
    error: () => { this.clientsLoading = false; }
  });
}
}
