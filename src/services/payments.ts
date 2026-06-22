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

export interface PaymentInput {
  contractId?: string;
  proposalId?: string;
  clientName: string;
  amount: number;
  paymentMethod: 'PIX' | 'Boleto' | 'Cartão' | 'Transferência' | 'Financiamento' | string;
  status: 'Pendente' | 'Pago' | 'Atrasado' | 'Cancelado';
  dueDate: string;
  paidAt?: string | null;
}

export interface Payment extends PaymentInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = 'igreen_payments';

function getFallbackPayments(): Payment[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveFallbackPayments(payments: Payment[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payments));
  } catch (e) {
    console.error('Falha ao gravar no localStorage:', e);
  }
}

export async function createPayment(input: PaymentInput): Promise<Payment> {
  const now = new Date().toISOString();
  const paymentData = {
    ...input,
    paidAt: input.status === 'Pago' ? now : (input.paidAt || null),
    createdAt: now,
    updatedAt: now
  };

  if (isConfigured && db) {
    try {
      const colRef = collection(db, 'payments');
      const docRef = await addDoc(colRef, paymentData);
      return { id: docRef.id, ...paymentData } as Payment;
    } catch (e) {
      console.error('Erro ao registrar pagamento no Firestore:', e);
      throw e;
    }
  } else {
    const id = 'payment_' + Math.random().toString(36).substring(2, 11);
    const newPayment: Payment = { id, ...paymentData } as Payment;
    const existing = getFallbackPayments();
    saveFallbackPayments([newPayment, ...existing]);
    return newPayment;
  }
}

export async function getAllPayments(): Promise<Payment[]> {
  if (isConfigured && db) {
    try {
      const colRef = collection(db, 'payments');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const results: Payment[] = [];
      snapshot.forEach((snap) => {
        results.push({ id: snap.id, ...snap.data() } as Payment);
      });
      return results;
    } catch (e) {
      console.error('Erro ao ler pagamentos do Firestore:', e);
      return getFallbackPayments();
    }
  } else {
    return getFallbackPayments();
  }
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  if (isConfigured && db && !id.startsWith('payment_')) {
    try {
      const docRef = doc(db, 'payments', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Payment;
      }
      return null;
    } catch (e) {
      console.error('Erro ao buscar pagamento único por ID:', e);
      return null;
    }
  } else {
    const list = getFallbackPayments();
    return list.find(p => p.id === id) || null;
  }
}

export async function updatePayment(id: string, updates: Partial<PaymentInput>): Promise<void> {
  const now = new Date().toISOString();
  if (isConfigured && db && !id.startsWith('payment_')) {
    try {
      const docRef = doc(db, 'payments', id);
      const dataToSave: any = {
        ...updates,
        updatedAt: now
      };
      if (updates.status === 'Pago') {
        dataToSave.paidAt = now;
      }
      await updateDoc(docRef, dataToSave);
    } catch (e) {
      console.error('Erro ao atualizar pagamento no Firestore:', e);
      throw e;
    }
  } else {
    const list = getFallbackPayments();
    const updated = list.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          paidAt: updates.status === 'Pago' ? now : (updates.paidAt || p.paidAt),
          updatedAt: now
        } as Payment;
      }
      return p;
    });
    saveFallbackPayments(updated);
  }
}

export async function removePayment(id: string): Promise<void> {
  if (isConfigured && db && !id.startsWith('payment_')) {
    try {
      const docRef = doc(db, 'payments', id);
      await deleteDoc(docRef);
    } catch (e) {
      console.error('Erro ao excluir pagamento do Firestore:', e);
      throw e;
    }
  } else {
    const list = getFallbackPayments();
    const filtered = list.filter(p => p.id !== id);
    saveFallbackPayments(filtered);
  }
}
