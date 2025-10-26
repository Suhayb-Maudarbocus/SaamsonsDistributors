import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../constants'; // or environments/environment
import { Client } from '../models/client';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private apiUrl = `${environment.apiBaseUrl}/clients`;

  constructor(private http: HttpClient) {}

  list(search = '', skip = 0, take = 20, activeOnly = false): Observable<Client[]> {
    let params = new HttpParams()
      .set('skip', skip)
      .set('take', take)
      .set('activeOnly', activeOnly);
    if (search.trim()) params = params.set('search', search.trim());
    return this.http.get<Client[]>(this.apiUrl, { params, observe: 'body' });
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  create(payload: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, payload);
  }

  update(id: number, payload: Partial<Client>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
