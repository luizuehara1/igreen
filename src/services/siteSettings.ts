import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface SiteSettings {
  logoUrl: string;
  faviconUrl: string;
  whatsapp: string;
  instagram: string;
  email: string;
  address: string;
  cityRegion: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  aboutTitle: string;
  aboutText: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  footerText: string;
  projectsCompleted: number;
  totalPowerInstalled: number;
  averageSavingsPercent: number;
  cleanEnergyPercent: number;
  monthlySavingsGenerated: number;
  updatedAt?: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  logoUrl: 'https://i.postimg.cc/QCqkVd5g/Design-sem-nome-(15).png',
  faviconUrl: 'https://i.postimg.cc/QCqkVd5g/Design-sem-nome-(15).png',
  whatsapp: '(15) 99876-5432',
  instagram: 'https://instagram.com/igreen_itarare_itapeva',
  email: 'contato@igreenitarareitapeva.com.br',
  address: 'Av. Paulina de Morais, 450 - Centro, Itapeva - SP | Rua XV de Novembro, 1200 - Centro, Itararé - SP',
  cityRegion: 'Itapeva, Itararé e Região Sudoeste Paulista',
  heroTitle: 'Transforme sua conta de energia em economia todos os meses.',
  heroSubtitle: 'Soluções completas e homologadas em energia solar para residências, empresas e propriedades rurais em Itararé, Itapeva e região. Até 95% de desconto de forma segura, garantida e sem investimento inicial pesado.',
  heroImageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
  aboutTitle: 'Engenharia de alta performance e compromisso ambiental real',
  aboutText: 'A IGREEN ITARARÉ / ITAPEVA nasceu da união entre engenheiros e consultores financeiros focados na descentralização da matriz elétrica. Entendemos que pagar contas de energia caras e imprevisíveis é uma das maiores barreiras de liquidez de famílias, comércios e cooperativas agrárias.\n\nCom escritórios estratégicos estruturados nas cidades de Itararé e Itapeva, cobrimos integralmente mais de 15 municípios da região sul de São Paulo. Adotamos padrões de rigor técnico incontestáveis: utilizamos exclusivamente inversores de primeira linha com eficiência superior e módulos de silício monocristalino de altíssima conversão homologados pelo Inmetro.',
  primaryCtaText: 'Simular Economia Já',
  secondaryCtaText: 'Conversar no WhatsApp',
  footerText: 'IGREEN ITARARÉ / ITAPEVA - Todos os direitos reservados. Solução líder em energia fotovoltaica.',
  projectsCompleted: 500,
  totalPowerInstalled: 2.5,
  averageSavingsPercent: 95,
  cleanEnergyPercent: 100,
  monthlySavingsGenerated: 150000
};

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
 * Obtém as configurações do site. Retorna os padrões locais caso o doc não exista no Firestore.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!db) return DEFAULT_SETTINGS;
  const path = 'site_settings/main';
  try {
    const docRef = doc(db, 'site_settings', 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...DEFAULT_SETTINGS, ...snap.data() } as SiteSettings;
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Atualiza ou cria as configurações de siteSettings no Firestore.
 */
export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  if (!db) throw new Error('Firebase não está configurado.');
  const path = 'site_settings/main';
  try {
    const docRef = doc(db, 'site_settings', 'main');
    await setDoc(docRef, {
      ...settings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
