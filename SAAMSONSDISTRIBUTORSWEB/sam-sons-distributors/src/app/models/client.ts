export interface Client {
  id: number;
  name: string;
  brn?: string | null;
  vatRegistrationNumber?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  contactPerson?: string | null;
  createdDate?: string; // ISO
  createdBy?: string | null;
  isActive: boolean;
}
