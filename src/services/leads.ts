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

export interface LeadDetailed {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  cpfCnpj?: string;
  cep?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state?: string;
  propertyType: string;
  monthlyBill: number;
  averageConsumption?: number;
  estimatedMonthlySavings?: number;
  estimatedAnnualSavings?: number;
  message?: string;
  source: string;
  status: 'Novo Lead' | 'Contactado' | 'Em Negociação' | 'Simulação Aprovada' | 'Proposta Enviada' | 'Fechado' | 'Perdido' | string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Cadastra um novo Lead.
 */
export async function createLeadInFirestore(input: LeadDetailed): Promise<any> {
  const now = new Date().toISOString();
  const billVal = Number(input.monthlyBill) || 0;
  const calculatedConsumption = input.averageConsumption || Math.round(billVal * 1.1);

  // O preço estimado é calculado como 90% da conta (ou seja, economia de 90%)
  const estSavingsMonthly = input.estimatedMonthlySavings !== undefined ? input.estimatedMonthlySavings : Math.round(billVal * 0.9);
  const estSavingsAnnual = input.estimatedAnnualSavings !== undefined ? input.estimatedAnnualSavings : Math.round(estSavingsMonthly * 12);
  
  const leadData: Omit<LeadDetailed, 'id'> = {
    name: input.name,
    phone: input.phone,
    email: input.email || '',
    cpfCnpj: input.cpfCnpj || '',
    cep: input.cep || '',
    address: input.address || '',
    number: input.number || '',
    complement: input.complement || '',
    neighborhood: input.neighborhood || '',
    city: input.city,
    state: input.state || 'SP',
    propertyType: input.propertyType || 'Residencial',
    monthlyBill: billVal,
    averageConsumption: calculatedConsumption,
    estimatedMonthlySavings: estSavingsMonthly,
    estimatedAnnualSavings: estSavingsAnnual,
    message: input.message || '',
    source: input.source || 'Site IGREEN',
    status: input.status || 'Novo Lead',
    assignedTo: input.assignedTo || '',
    createdAt: input.createdAt || now,
    updatedAt: now
  };

  if (isConfigured && db) {
    try {
      const colRef = collection(db, 'leads');
      const docRef = await addDoc(colRef, leadData);
      return { id: docRef.id, ...leadData };
    } catch (e) {
      console.error('Erro ao salvar Lead no Firestore:', e);
      throw e;
    }
  } else {
    console.warn('Banco Firestore não configurado; operação indisponível.');
    return { id: 'offline_' + Date.now(), ...leadData };
  }
}

/**
 * Carrega todos os Leads cadastrados.
 */
export async function getLeadsFromFirestore(): Promise<LeadDetailed[]> {
  if (isConfigured && db) {
    try {
      const colRef = collection(db, 'leads');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetched: LeadDetailed[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const bill = data.monthlyBill || 0;
        const estMonthly = data.estimatedMonthlySavings !== undefined ? data.estimatedMonthlySavings : Math.round(bill * 0.9);
        const estAnnual = data.estimatedAnnualSavings !== undefined ? data.estimatedAnnualSavings : Math.round(estMonthly * 12);

        fetched.push({ 
          id: docSnap.id, 
          ...data,
          estimatedMonthlySavings: estMonthly,
          estimatedAnnualSavings: estAnnual
        } as LeadDetailed);
      });
      return fetched;
    } catch (e) {
      console.error('Erro ao ler Leads do Firestore:', e);
      throw e;
    }
  } else {
    return [];
  }
}

/**
 * Busca por um Lead específico por ID.
 */
export async function getLeadById(id: string): Promise<LeadDetailed | null> {
  if (isConfigured && db) {
    try {
      const docRef = doc(db, 'leads', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        const bill = data.monthlyBill || 0;
        const estMonthly = data.estimatedMonthlySavings !== undefined ? data.estimatedMonthlySavings : Math.round(bill * 0.9);
        const estAnnual = data.estimatedAnnualSavings !== undefined ? data.estimatedAnnualSavings : Math.round(estMonthly * 12);

        return { 
          id: snap.id, 
          ...data,
          estimatedMonthlySavings: estMonthly,
          estimatedAnnualSavings: estAnnual
        } as LeadDetailed;
      }
      return null;
    } catch (e) {
      console.error('Erro ao buscar Lead do Firestore:', e);
      return null;
    }
  } else {
    return null;
  }
}

/**
 * Atualiza status do Lead.
 */
export async function updateLeadStatusInFirestore(id: string, status: string): Promise<void> {
  const now = new Date().toISOString();
  if (isConfigured && db) {
    try {
      const docRef = doc(db, 'leads', id);
      await updateDoc(docRef, {
        status,
        updatedAt: now
      });
    } catch (e) {
      console.error('Erro ao atualizar status do Lead:', e);
      throw e;
    }
  }
}

/**
 * Atualiza detalhes completos do Lead.
 */
export async function updateLeadDetailed(id: string, updates: Partial<LeadDetailed>): Promise<void> {
  const now = new Date().toISOString();
  
  if (updates.monthlyBill !== undefined) {
    const billVal = Number(updates.monthlyBill) || 0;
    if (updates.averageConsumption === undefined) {
      updates.averageConsumption = Math.round(billVal * 1.1);
    }
    if (updates.estimatedMonthlySavings === undefined) {
      updates.estimatedMonthlySavings = Math.round(billVal * 0.9);
    }
    if (updates.estimatedAnnualSavings === undefined) {
      updates.estimatedAnnualSavings = Math.round((updates.estimatedMonthlySavings || Math.round(billVal * 0.9)) * 12);
    }
  }

  const payload = {
    ...updates,
    updatedAt: now
  };

  if (isConfigured && db) {
    try {
      const docRef = doc(db, 'leads', id);
      await updateDoc(docRef, payload);
    } catch (e) {
      console.error('Erro ao atualizar Lead:', e);
      throw e;
    }
  }
}

/**
 * Exclui Lead.
 */
export async function deleteLeadFromFirestore(id: string): Promise<void> {
  if (isConfigured && db) {
    try {
      const docRef = doc(db, 'leads', id);
      await deleteDoc(docRef);
    } catch (e) {
      console.error('Erro ao deletar Lead:', e);
      throw e;
    }
  }
}
