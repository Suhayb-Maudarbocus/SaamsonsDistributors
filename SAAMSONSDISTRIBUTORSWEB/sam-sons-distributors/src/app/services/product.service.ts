import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../constants';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getBatch(skip: number, take: number, search: string = ''): Observable<Product[]> {
    const encodedSearch = encodeURIComponent(search.trim());
    const searchParam = search.trim() ? `&search=${encodedSearch}` : '';
    return this.http.get<Product[]>(
      `${this.apiUrl}?skip=${skip}&take=${take}${searchParam}`
    );
}

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id: number, product: Product): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
