// src/app/components/print-preview/print-preview.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ClientsService } from '../../services/client.service';
import { CartItem } from '../../models/cart';
import { Client } from '../../models/client';
import { COMPANY } from '../../constants/company';
import { ClientHandlerService } from '../../services/clientHandler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-print-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print-preview.component.html',
  styleUrls: ['./print-preview.component.scss']
})
export class PrintPreviewComponent implements OnInit, OnDestroy {
  company = COMPANY;

  userId = '';
  clientId!: number;
  invoiceNumber = ''; // optional “pro-forma” number user typed in cart

  loading = false;
  items: CartItem[] = [];
  client: Client | null = null;

  subtotal = 0;
  totalDiscount = 0;
  total = 0;
  today = new Date();

  private readonly destroy$ = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private clientsService: ClientsService,
    private clientHandlerService: ClientHandlerService
  ) {}
  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParamMap.get('userId') || '';
    this.invoiceNumber = this.route.snapshot.queryParamMap.get('invoiceNumber') || '';
    const cid = this.route.snapshot.queryParamMap.get('clientId');
    this.clientId = cid ? +cid : 0;

    if (!this.userId || !this.clientId) {
      // missing info → return to cart
      this.router.navigate(['/cart']);
      return;
    }

    this.fetch();
  }

  fetch(): void {
    this.loading = true;
    this.cartService.getCartForClient(this.userId, this.clientId).subscribe({
      next: data => {
        this.items = data || [];
        const first = this.items[0];
        if (first?.clientId) {
          this.clientsService.getById(first.clientId).subscribe({
            next: c => (this.client = c),
            complete: () => { this.computeTotals(); this.loading = false; }
          });
        } else {
          this.computeTotals();
          this.loading = false;
        }
      },
      error: () => { this.loading = false; }
    });

    //Retrieve client from ClientHandlerService
    // this.destroy$.add(
    this.clientHandlerService.client$.subscribe(client => { 
    this.client = client;
    console.log('Client received in PrintPreviewComponent:', this.client);
    })
  // );
  }

  priceOf(i: CartItem): number {
    // prefer selling snapshot; fallback to unit snapshot
    const sell = (i as any).sellingPriceAtTime ?? i.product?.sellingPrice ?? 0;
    const unit = (i as any).unitPriceAtTime ?? i.product?.unitPrice ?? 0;
    return sell || unit || 0;
  }

  computeTotals(): void {
    let sub = 0, disc = 0, tot = 0;
    for (const i of this.items) {
      const unit = this.priceOf(i);
      const qty = i.quantity ?? 0;
      const gross = unit * qty;
      const lineDiscount = (i as any).totalDiscount ?? 0; // from cart line if stored
      const net = (i as any).total ?? (gross - lineDiscount);

      sub += gross;
      disc += lineDiscount;
      tot += net;
    }
    this.subtotal = sub;
    this.totalDiscount = disc;
    this.total = tot;
  }

  printNow(): void {
    window.print();
  }
}
