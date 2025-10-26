import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClientsService } from '../../services/client.service';
import { Client } from '../../models/client';
import { debounceTime, distinctUntilChanged, Subject, tap } from 'rxjs';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientsPageComponent implements OnInit {
  // list state
  clients: Client[] = [];
  loading = false;
  hasMore = true;
  skip = 0;
  take = 50;
  form!: FormGroup

  // search
  searchTerm = '';
  private search$ = new Subject<string>();

  // editing state
  editingId: number | null = null;
  saving = false;

  constructor(private fb: FormBuilder, private clientsService: ClientsService) {
      // form
  this.form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    brn: [''],
    vatRegistrationNumber: [''],
    address: [''],
    phoneNumber: [''],
    email: ['', []],
    contactPerson: [''],
    isActive: [true]
  });
  }

  ngOnInit(): void {
    // initial load
    this.resetAndLoad();

    // search stream
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(term => this.searchTerm = term),
      tap(() => this.resetAndLoad())
    ).subscribe();
  }

  onSearch(term: string) {
    this.search$.next(term);
  }

  resetAndLoad(): void {
    this.skip = 0;
    this.clients = [];
    this.hasMore = true;
    this.loadMore();
  }

  loadMore(): void {
    if (this.loading || !this.hasMore) return;
    this.loading = true;

    this.clientsService.list(this.searchTerm, this.skip, this.take, false)
      .subscribe({
        next: (data) => {
          this.clients = data;
          this.hasMore = data.length === this.take;
          this.skip += data.length;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
  }

  edit(client: Client) {
    this.editingId = client.id;
    this.form.reset({
      name: client.name ?? '',
      brn: client.brn ?? '',
      vatRegistrationNumber: client.vatRegistrationNumber ?? '',
      address: client.address ?? '',
      phoneNumber: client.phoneNumber ?? '',
      email: client.email ?? '',
      contactPerson: client.contactPerson ?? '',
      isActive: client.isActive
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset({
      name: '',
      brn: '',
      vatRegistrationNumber: '',
      address: '',
      phoneNumber: '',
      email: '',
      contactPerson: '',
      isActive: true
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;

    const payload = this.form.getRawValue();

    // create vs update
    if (this.editingId == null) {
      this.clientsService.create(payload).subscribe({
        next: (created) => {
          this.clients = [created, ...this.clients];
          this.saving = false;
          this.cancelEdit();
        },
        error: () => { this.saving = false; }
      });
    } else {
      this.clientsService.update(this.editingId, payload).subscribe({
        next: () => {
          // update local array
          const idx = this.clients.findIndex(c => c.id === this.editingId);
          if (idx > -1) {
            this.clients[idx] = { ...this.clients[idx], ...payload, id: this.editingId } as Client;
          }
          this.saving = false;
          this.cancelEdit();
        },
        error: () => { this.saving = false; }
      });
    }
  }

  remove(client: Client) {
    if (!confirm(`Delete client "${client.name}"?`)) return;
    this.clientsService.delete(client.id).subscribe({
      next: () => {
        this.clients = this.clients.filter(c => c.id !== client.id);
      }
    });
  }
}
