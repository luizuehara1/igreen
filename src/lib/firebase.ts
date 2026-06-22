import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';

const getEnv = (key: string): string => {
  // Try import.meta.env first (Vite client-side)
  const meta = import.meta as any;
  if (typeof import.meta !== 'undefined' && meta && meta.env) {
    if (meta.env[key]) return meta.env[key] as string;
  }
  // Try process.env next (Node server-side/fallback)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[key]) return process.env[key] as string;
  }
  return '';
};

// Use environment variables or fallback to values from firebase-applet-config.json
const apiKey = getEnv('NEXT_PUBLIC_FIREBASE_API_KEY') || firebaseConfigJson.apiKey;
const authDomain = getEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN') || firebaseConfigJson.authDomain;
const projectId = getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID') || firebaseConfigJson.projectId;
const messagingSenderId = getEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID') || firebaseConfigJson.messagingSenderId;
const appId = getEnv('NEXT_PUBLIC_FIREBASE_APP_ID') || firebaseConfigJson.appId;
const databaseId = getEnv('NEXT_PUBLIC_FIREBASE_DATABASE_ID') || firebaseConfigJson.firestoreDatabaseId;

const isConfigured = !!(apiKey && projectId);

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  messagingSenderId,
  appId,
};

let app;
let db;
let auth;

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, databaseId);
    auth = getAuth(app);
  } catch (error) {
    console.error('Erro ao inicializar o Firebase:', error);
  }
} else {
  console.warn(
    'Firebase não está configurado. Por favor, adicione as variáveis de ambiente NEXT_PUBLIC_FIREBASE_ em seu painel.'
  );
}

export { app, db, auth, isConfigured };

