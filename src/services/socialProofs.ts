import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { OperationType } from './siteSettings';

export interface SocialProof {
  id?: string;
  clientName: string;
  city: string;
  propertyType: 'Residencial' | 'Comercial' | 'Rural' | 'Industrial';
  imageUrl?: string;
  monthlyBillBefore: number;
  monthlyBillAfter: number;
  monthlySavings: number;
  annualSavings: number;
  testimonial: string;
  systemPowerKwp: number;
  status: 'Ativo' | 'Inativo';
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Obtém todas as provas sociais (para listar no Admin).
 */
export async function getAllSocialProofs(): Promise<SocialProof[]> {
  if (!db) return [];
  const path = 'social_proofs';
  try {
    const colRef = collection(db, 'social_proofs');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SocialProof[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Obtém as provas sociais ativas.
 */
export async function getActiveSocialProofs(): Promise<SocialProof[]> {
  if (!db) return [];
  const path = 'social_proofs';
  try {
    const colRef = collection(db, 'social_proofs');
    const q = query(colRef, where('status', '==', 'Ativo'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SocialProof[];
  } catch (error) {
    // Se falhar porque o índice não foi construído ou por permissões, tenta carregar localmente ou faz fallback elegante
    console.warn('Query filtrada falhou. Tentando listagem simples e filtragem local.', error);
    try {
      const snap = await getDocs(collection(db, 'social_proofs'));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SocialProof[];
      return list.filter(p => p.status === 'Ativo').sort((a,b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    } catch (errInner) {
      handleFirestoreError(errInner, OperationType.LIST, path);
      return [];
    }
  }
}

/**
 * Obtém as provas sociais ativas marcadas como destaque (Home).
 */
export async function getFeaturedSocialProofs(): Promise<SocialProof[]> {
  if (!db) return [];
  const path = 'social_proofs';
  try {
    const colRef = collection(db, 'social_proofs');
    const q = query(colRef, where('status', '==', 'Ativo'), where('featured', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SocialProof[];
  } catch (error) {
    console.warn('Query composta falhou. Tentando filtragem local para destaque.', error);
    try {
      const active = await getActiveSocialProofs();
      return active.filter(p => p.featured === true);
    } catch (errInner) {
      handleFirestoreError(errInner, OperationType.LIST, path);
      return [];
    }
  }
}

/**
 * Cadastra uma nova prova social.
 */
export async function createSocialProof(proof: Omit<SocialProof, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (!db) throw new Error('Firebase não configurado.');
  const path = 'social_proofs';
  try {
    const colRef = collection(db, 'social_proofs');
    const savings = Number(proof.monthlyBillBefore) - Number(proof.monthlyBillAfter);
    const addedDoc = await addDoc(colRef, {
      ...proof,
      monthlySavings: savings,
      annualSavings: savings * 12,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return addedDoc.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}

/**
 * Edita uma prova social existente.
 */
export async function updateSocialProof(id: string, proof: Partial<SocialProof>): Promise<void> {
  if (!db) throw new Error('Firebase não configurado.');
  const path = `social_proofs/${id}`;
  try {
    const docRef = doc(db, 'social_proofs', id);
    
    // Se mudou as faturas, recalcula savings
    const updates = { ...proof };
    if (proof.monthlyBillBefore !== undefined || proof.monthlyBillAfter !== undefined) {
      // Carrega os dados antigos primeiro se um deles faltar
      const snap = await getDoc(docRef);
      const currentData = snap.data();
      const before = proof.monthlyBillBefore !== undefined ? Number(proof.monthlyBillBefore) : Number(currentData?.monthlyBillBefore || 0);
      const after = proof.monthlyBillAfter !== undefined ? Number(proof.monthlyBillAfter) : Number(currentData?.monthlyBillAfter || 0);
      const savings = before - after;
      updates.monthlySavings = savings;
      updates.annualSavings = savings * 12;
    }
    
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Exclui uma prova social.
 */
export async function deleteSocialProof(id: string): Promise<void> {
  if (!db) throw new Error('Firebase não configurado.');
  const path = `social_proofs/${id}`;
  try {
    const docRef = doc(db, 'social_proofs', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
