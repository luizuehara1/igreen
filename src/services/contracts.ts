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

export interface ContractInput {
  proposalId?: string;
  clientName: string;
  clientDocument: string; // CPF or CNPJ
  clientPhone: string;
  clientEmail: string;
  cep: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  contractValue: number;
  paymentTerms: string;
  status: 'Aguardando assinatura' | 'Assinado' | 'Cancelado';
  signedAt?: string | null;
}

export interface Contract extends ContractInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = 'igreen_contracts';

function getFallbackContracts(): Contract[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveFallbackContracts(contracts: Contract[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contracts));
  } catch (e) {
    console.error('Falha ao gravar no localStorage:', e);
  }
}

export async function createContract(input: ContractInput): Promise<Contract> {
  const now = new Date().toISOString();
  const contractData = {
    ...input,
    signedAt: input.status === 'Assinado' ? now : (input.signedAt || null),
    createdAt: now,
    updatedAt: now
  };

  if (isConfigured && db) {
    try {
      const colRef = collection(db, 'contracts');
      const docRef = await addDoc(colRef, contractData);
      return { id: docRef.id, ...contractData } as Contract;
    } catch (e) {
      console.error('Erro ao criar contrato no Firestore:', e);
      throw e;
    }
  } else {
    const id = 'contract_' + Math.random().toString(36).substring(2, 11);
    const newContract: Contract = { id, ...contractData } as Contract;
    const existing = getFallbackContracts();
    saveFallbackContracts([newContract, ...existing]);
    return newContract;
  }
}

export async function getAllContracts(): Promise<Contract[]> {
  if (isConfigured && db) {
    try {
      const colRef = collection(db, 'contracts');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const results: Contract[] = [];
      snapshot.forEach((snap) => {
        results.push({ id: snap.id, ...snap.data() } as Contract);
      });
      return results;
    } catch (e) {
      console.error('Erro ao listar contratos do Firestore:', e);
      return getFallbackContracts();
    }
  } else {
    return getFallbackContracts();
  }
}

export async function getContractById(id: string): Promise<Contract | null> {
  if (isConfigured && db && !id.startsWith('contract_')) {
    try {
      const docRef = doc(db, 'contracts', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Contract;
      }
      return null;
    } catch (e) {
      console.error('Erro ao buscar contrato por ID:', e);
      return null;
    }
  } else {
    const list = getFallbackContracts();
    return list.find(c => c.id === id) || null;
  }
}

export async function updateContract(id: string, updates: Partial<ContractInput>): Promise<void> {
  const now = new Date().toISOString();
  
  if (isConfigured && db && !id.startsWith('contract_')) {
    try {
      const docRef = doc(db, 'contracts', id);
      const dataToSave: any = {
        ...updates,
        updatedAt: now
      };
      if (updates.status === 'Assinado') {
        dataToSave.signedAt = now;
      }
      await updateDoc(docRef, dataToSave);
    } catch (e) {
      console.error('Erro ao atualizar contrato no Firestore:', e);
      throw e;
    }
  } else {
    const list = getFallbackContracts();
    const updated = list.map(c => {
      if (c.id === id) {
        return {
          ...c,
          ...updates,
          signedAt: updates.status === 'Assinado' ? now : (updates.signedAt || c.signedAt),
          updatedAt: now
        } as Contract;
      }
      return c;
    });
    saveFallbackContracts(updated);
  }
}

export async function removeContract(id: string): Promise<void> {
  if (isConfigured && db && !id.startsWith('contract_')) {
    try {
      const docRef = doc(db, 'contracts', id);
      await deleteDoc(docRef);
    } catch (e) {
      console.error('Erro ao excluir contrato no Firestore:', e);
      throw e;
    }
  } else {
    const list = getFallbackContracts();
    const filtered = list.filter(c => c.id !== id);
    saveFallbackContracts(filtered);
  }
}
