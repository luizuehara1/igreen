import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isConfigured } from '../lib/firebase';

export interface AdminUser {
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'integrator';
  ativo: boolean;
  super_admin?: boolean;
  createdAt?: any;
}

// Global active logged admin cache
let cachedAdminProfile: AdminUser | null = null;

export function getCurrentAdmin(): AdminUser | null {
  return cachedAdminProfile;
}

export function setCachedAdmin(admin: AdminUser | null) {
  cachedAdminProfile = admin;
}

/**
 * Verifica se um e-mail possui documento na coleção 'admin' e se 'ativo' é true e 'super_admin' é true.
 */
export async function checkAdminAccess(user: { email: string } | null | undefined): Promise<boolean> {
  if (!user?.email) return false;
  if (!db) return false;

  const email = user.email.toLowerCase().trim();

  try {
    const adminRef = doc(db, "admin", email);
    const adminSnap = await getDoc(adminRef);

    console.log("Email logado:", email);
    console.log("Documento admin existe:", adminSnap.exists());
    console.log("Dados admin:", adminSnap.data());

    if (!adminSnap.exists()) return false;

    const data = adminSnap.data();

    return data.ativo === true && data.super_admin === true;
  } catch (error) {
    console.error("Erro ao verificar acesso admin:", error);
    return false;
  }
}

/**
 * Realiza o login utilizando GoogleAuthProvider e valida o e-mail na coleção admin do Firestore.
 */
export async function signInWithGoogle(): Promise<AdminUser> {
  if (!auth || !db) {
    throw new Error('Serviço de Autenticação/Banco de dados indisponível.');
  }

  try {
    // Definir persistência local
    await setPersistence(auth, browserLocalPersistence);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user || !user.email) {
      throw new Error('Não foi possível obter o e-mail da conta do Google.');
    }

    const cleanEmail = user.email.trim().toLowerCase();
    
    // Verificar se existe permissão de admin
    const hasAccess = await checkAdminAccess({ email: cleanEmail });

    if (!hasAccess) {
      await signOut(auth);
      setCachedAdmin(null);
      throw new Error('Usuário sem permissão de administrador.');
    }

    // Buscar dados complementares do admin
    const adminDocRef = doc(db, 'admin', cleanEmail);
    const adminDocSnap = await getDoc(adminDocRef);
    const adminData = adminDocSnap.data() || {};

    const profile: AdminUser = {
      email: cleanEmail,
      name: adminData.name || user.displayName || cleanEmail.split('@')[0],
      role: adminData.super_admin === true ? 'super_admin' : (adminData.role || 'admin'),
      super_admin: adminData.super_admin,
      ativo: true,
      createdAt: adminData.createdAt || null
    };

    setCachedAdmin(profile);
    return profile;
  } catch (error: any) {
    console.error('Erro ao autenticar com Google:', error);
    if (error.message && (error.message.includes('permissão de administrador') || error.message.includes('não possui permissão'))) {
      throw error;
    }
    throw new Error(error.message || 'Falha ao autenticar com a conta do Google.');
  }
}

/**
 * Realiza o logout.
 */
export async function logout(): Promise<void> {
  setCachedAdmin(null);
  if (auth) {
    await signOut(auth);
  }
}

/**
 * Escuta mudanças de estado no Firebase Auth real e valida na coleção admin do Firestore.
 */
export function adminAuthListener(callback: (profile: AdminUser | null) => void) {
  // Sincroniza o perfil inicial do cache
  const initial = getCurrentAdmin();
  callback(initial);
  
  if (!auth || !db) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, async (user) => {
    if (user && user.email) {
      const email = user.email.trim().toLowerCase();
      try {
        const hasAccess = await checkAdminAccess({ email: email });
        if (hasAccess) {
          const docRef = doc(db, 'admin', email);
          const docSnap = await getDoc(docRef);
          const adminData = docSnap.data() || {};
          
          const profile: AdminUser = {
            email: email,
            name: adminData.name || user.displayName || email.split('@')[0],
            role: adminData.super_admin === true ? 'super_admin' : (adminData.role || 'admin'),
            super_admin: adminData.super_admin,
            ativo: true,
            createdAt: adminData.createdAt || null
          };
          
          setCachedAdmin(profile);
          callback(profile);
          return;
        }
        
        // Se usuário não está ativo ou não existe, desloga
        await signOut(auth);
        setCachedAdmin(null);
        callback(null);
      } catch (e) {
        console.error('Erro ao sincronizar estado de auth do admin:', e);
        setCachedAdmin(null);
        callback(null);
      }
    } else {
      setCachedAdmin(null);
      callback(null);
    }
  });
}

export { isConfigured };
