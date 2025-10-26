import { Routes } from '@angular/router';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { ClientsPageComponent } from './components/client/client.component';
import { PrintPreviewComponent } from './components/print-preview/print-preview.component';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'create-product', component: CreateProductComponent },
  { path: 'clients', component: ClientsPageComponent },
  { path: 'print-preview', component: PrintPreviewComponent }
];
