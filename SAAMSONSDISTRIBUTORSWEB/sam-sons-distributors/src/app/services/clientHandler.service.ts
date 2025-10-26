import { Injectable } from "@angular/core";
import { Client } from "../models/client";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ClientHandlerService {
  public client$: BehaviorSubject<Client | null> = new BehaviorSubject<Client | null>(null);
}