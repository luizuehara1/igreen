import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Global mock of process.env for bundlers that do not define it in the browser
if (typeof globalThis !== 'undefined' && !(globalThis as any).process) {
  (globalThis as any).process = { env: {} };
}

// Populate process.env keys safely behind a runtime check
const envSource = (import.meta as any).env || {};
if (typeof process !== 'undefined' && process.env) {
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || envSource.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfigJson?.apiKey || '';
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || envSource.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfigJson?.authDomain || '';
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || envSource.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfigJson?.projectId || '';
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || envSource.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson?.messagingSenderId || '';
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || envSource.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfigJson?.appId || '';
}

// 2. Simple and exact Firebase configuration format matching request
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 6. Display only PROJECT ID and AUTH DOMAIN under console, DO NOT log API Key
console.log("Firebase Project ID:", firebaseConfig.projectId);
console.log("Firebase Auth Domain:", firebaseConfig.authDomain);

const missingVars: string[] = [];
if (!firebaseConfig.apiKey) missingVars.push('NEXT_PUBLIC_FIREBASE_API_KEY');
if (!firebaseConfig.projectId) missingVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
if (!firebaseConfig.appId) missingVars.push('NEXT_PUBLIC_FIREBASE_APP_ID');

if (missingVars.length > 0) {
  console.error("Firebase env vars ausentes:", missingVars);
}

// 4. Corrigir inicialização duplicada
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 1. Remover databaseId customizado - usar apenas getFirestore(app)
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export const isConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

// 4. Criar teste simples de conexão
async function testFirestore() {
  try {
    const snap = await getDocs(collection(db, "site_settings"));
    console.log("Firestore OK: Conexão estocástica estabelecida com sucesso. Documentos de configurações:", snap.size);
  } catch (error: any) {
    console.error("Firestore erro real:", error?.code, error?.message, error);
    if (error?.code === 'unavailable' || String(error).includes('unavailable') || String(error).includes('failed to connect')) {
      console.error("Erro Firestore: Não foi possível conectar ao Firestore. Verifique internet, variáveis Firebase e se o Firestore está ativado.");
    }
  }
}

// Chamar a função apenas em ambiente de desenvolvimento
const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV;
if (isDev) {
  testFirestore();
}
