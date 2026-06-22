import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, isConfigured } from '../lib/firebase';

export interface ProposalInput {
  leadId?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  cep: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  propertyType: 'residencial' | 'comercial' | 'rural' | 'industrial' | string;
  monthlyBill: number;
  averageConsumption: number;
  systemPowerKwp: number;
  panelsQuantity: number;
  panelModel: string;
  inverterModel: string;
  totalValue: number;
  entryValue: number;
  installments: number;
  status: 'Rascunho' | 'Enviada' | 'Visualizada' | 'Aprovada' | 'Rejeitada' | 'Expirada';
}

export interface Proposal extends ProposalInput {
  id: string;
  monthlySavings: number;
  annualSavings: number;
  paybackMonths: number;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = 'igreen_proposals';

function getFallbackProposals(): Proposal[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveFallbackProposals(proposals: Proposal[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(proposals));
  } catch (e) {
    console.error('Falha ao gravar no localStorage:', e);
  }
}

// Helpers for automated calculations
export function calculateProposalMetrics(monthlyBill: number, totalValue: number) {
  const monthlySavings = Math.round(monthlyBill * 0.9);
  const annualSavings = monthlySavings * 12;
  const paybackMonths = monthlySavings > 0 ? Number((totalValue / monthlySavings).toFixed(1)) : 0;
  return { monthlySavings, annualSavings, paybackMonths };
}

export async function createProposal(input: ProposalInput): Promise<Proposal> {
  const metrics = calculateProposalMetrics(input.monthlyBill, input.totalValue);
  const now = new Date().toISOString();

  const proposalData = {
    ...input,
    ...metrics,
    createdAt: now,
    updatedAt: now
  };

  if (isConfigured && db) {
    try {
      const colRef = collection(db, 'proposals');
      const docRef = await addDoc(colRef, proposalData);
      return { id: docRef.id, ...proposalData } as Proposal;
    } catch (e) {
      console.error('Erro ao salvar proposta no Firestore:', e);
      throw e;
    }
  } else {
    const id = 'proposal_' + Math.random().toString(36).substring(2, 11);
    const newProposal: Proposal = { id, ...proposalData } as Proposal;
    const existing = getFallbackProposals();
    saveFallbackProposals([newProposal, ...existing]);
    return newProposal;
  }
}

export async function getAllProposals(): Promise<Proposal[]> {
  if (isConfigured && db) {
    try {
      const colRef = collection(db, 'proposals');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const results: Proposal[] = [];
      snapshot.forEach((snap) => {
        results.push({ id: snap.id, ...snap.data() } as Proposal);
      });
      return results;
    } catch (e) {
      console.error('Erro ao buscar propostas do Firestore:', e);
      return getFallbackProposals();
    }
  } else {
    return getFallbackProposals();
  }
}

export async function getProposalById(id: string): Promise<Proposal | null> {
  if (isConfigured && db && !id.startsWith('proposal_')) {
    try {
      const docRef = doc(db, 'proposals', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Proposal;
      }
      return null;
    } catch (e) {
      console.error('Erro ao buscar proposta única:', e);
      return null;
    }
  } else {
    const list = getFallbackProposals();
    return list.find(p => p.id === id) || null;
  }
}

export async function updateProposal(id: string, updates: Partial<ProposalInput>): Promise<void> {
  const now = new Date().toISOString();
  
  if (isConfigured && db && !id.startsWith('proposal_')) {
    try {
      const docRef = doc(db, 'proposals', id);
      
      // Se alterou conta de luz ou valor total, recalcula métricas
      let metricUpdates = {};
      if (updates.monthlyBill !== undefined || updates.totalValue !== undefined) {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const current = docSnap.data() as Proposal;
          const bill = updates.monthlyBill !== undefined ? updates.monthlyBill : current.monthlyBill;
          const value = updates.totalValue !== undefined ? updates.totalValue : current.totalValue;
          metricUpdates = calculateProposalMetrics(bill, value);
        }
      }

      const mergedUpdates = {
        ...updates,
        ...metricUpdates,
        updatedAt: now
      };

      await updateDoc(docRef, mergedUpdates);
    } catch (e) {
      console.error('Erro ao atualizar proposta no Firestore:', e);
      throw e;
    }
  } else {
    const list = getFallbackProposals();
    const updated = list.map(p => {
      if (p.id === id) {
        const bill = updates.monthlyBill !== undefined ? updates.monthlyBill : p.monthlyBill;
        const value = updates.totalValue !== undefined ? updates.totalValue : p.totalValue;
        const metricUpdates = calculateProposalMetrics(bill, value);
        return {
          ...p,
          ...updates,
          ...metricUpdates,
          updatedAt: now
        } as Proposal;
      }
      return p;
    });
    saveFallbackProposals(updated);
  }
}

export async function removeProposal(id: string): Promise<void> {
  if (isConfigured && db && !id.startsWith('proposal_')) {
    try {
      const docRef = doc(db, 'proposals', id);
      await deleteDoc(docRef);
    } catch (e) {
      console.error('Erro ao remover proposta do Firestore:', e);
      throw e;
    }
  } else {
    const list = getFallbackProposals();
    const filtered = list.filter(p => p.id !== id);
    saveFallbackProposals(filtered);
  }
}
