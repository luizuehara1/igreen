export type PropertyType = 'residencial' | 'comercial' | 'rural';

export interface Lead {
  id: string;
  name: string;
  whatsapp: string; // compatibility with local components
  phone?: string;    // Firestore required property
  email?: string;    // Firestore property
  city: string;
  state?: string;    // Firestore property
  propertyType: PropertyType;
  monthlyBill: number;
  averageConsumption?: number; // Firestore calculated property
  message?: string;            // Firestore contacts message
  source?: string;             // Firestore lead originator
  createdAt: string;
  updatedAt?: string;          // Firestore updated tracker
  status: 'Novo' | 'Em Contato' | 'Negociação' | 'Aprovado' | 'new' | 'contacted' | 'negotiation' | 'approved';
  
  estimatedEconomy?: number;
  estimatedAnnualEconomy?: number;
}

export interface SimulationResult {
  monthlyBill: number;
  estimatedEconomy: number;
  estimatedAnnualEconomy: number;
  paybackYears: number;
  panelsCount: number;
  co2SavedKg: number;
  treesPlantedVal: number;
}

export interface ServiceDetail {
  id: PropertyType | 'manutencao' | 'projetos' | 'consultoria';
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  imageUrl: string;
  benefits: string[];
}

export interface SolarProject {
  id: string;
  title: string;
  city: string;
  propertyType: PropertyType;
  panelsCount: number;
  powerkWp: string;
  monthlyEconomy: number;
  systemType: string;
  imageUrl: string;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  savingPercent: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}
