import { Routes } from '@angular/router';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
  { path: 'products', component: ProductListComponent },
//   { path: 'cart', component: CartComponent },
  { path: 'create-product', component: CreateProductComponent },
//   { path: '', redirectTo: '/products', pathMatch: 'full' }
];
