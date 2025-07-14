import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  allProducts: Product[] = [];
  displayedProducts: Product[] = [];
  loadingMore = false;
  batchSize = 50;
  searchTerm: string = '';
  private searchTimeout: any;

  quantities: { [productId: number]: number } = {};
  buttonLoading: { [productId: number]: boolean } = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getBatch(this.displayedProducts.length, this.batchSize).subscribe({
      next: (data) => {
        this.displayedProducts = [...this.displayedProducts, ...data];
        this.loadingMore = false;
      },
      error: (err) => console.error('Error loading products', err)
    });
  }

  addToCart(productId: number): void {
    const quantity = this.quantities[productId];
    if (!quantity || quantity <= 0) return;

    this.buttonLoading[productId] = true;

    setTimeout(() => {
      // Simulate API call
      console.log(`Added product ${productId} x${quantity} to cart`);
      this.buttonLoading[productId] = false;
      this.quantities[productId] = 0;
    }, 1000);
  }

  public loadMoreProducts(): void {
    this.loadingMore = true;
    this.batchSize += 50;
    this.productService
      .getBatch(this.displayedProducts.length, this.batchSize)
      .subscribe({
        next: (data) => {
          this.displayedProducts = [...this.displayedProducts, ...data];
          this.loadingMore = false;
        },
        error: () => {
          this.loadingMore = false;
        }
      });
  }

  onSearchChange(): void {
  clearTimeout(this.searchTimeout);

  this.searchTimeout = setTimeout(() => {
    this.displayedProducts = [];
    this.loadMoreProducts();
  }, 400);
}
}
