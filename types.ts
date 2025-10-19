export type Page = 'consejo' | 'trazo' | 'probar' | 'generar' | 'galeria' | 'agenda' | 'clientes' | 'asesor' | 'ventas';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  name: string;
}

export interface Sale {
  id: string;
  clientName: string;
  clientPhone: string;
  date: string; // YYYY-MM-DD
  tattooType: string;
  cost: number;
}
