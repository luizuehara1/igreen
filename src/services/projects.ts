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

export type ProjectStatus =
  | 'Contrato assinado'
  | 'Aguardando documentação'
  | 'Projeto em análise'
  | 'Aguardando concessionária'
  | 'Equipamentos comprados'
  | 'Instalação agendada'
  | 'Em instalação'
  | 'Vistoria'
  | 'Homologação'
  | 'Sistema ativado'
  | 'Concluído';

export interface ProjectInput {
  contractId?: string;
  clientName: string;
  clientPhone: string;
  cep: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  systemPowerKwp: number;
  panelsQuantity: number;
  technicianName: string;
  scheduledDate: string;
  status: ProjectStatus;
}

export interface Project extends ProjectInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = 'igreen_projects';

function getFallbackProjects(): Project[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveFallbackProjects(projects: Project[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Falha ao gravar no localStorage:', e);
  }
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const now = new Date().toISOString();
  const projectData = {
    ...input,
    createdAt: now,
    updatedAt: now
  };

  if (isConfigured && db) {
    try {
      const colRef = collection(db, 'projects');
      const docRef = await addDoc(colRef, projectData);
      return { id: docRef.id, ...projectData } as Project;
    } catch (e) {
      console.error('Erro ao criar projeto no Firestore:', e);
      throw e;
    }
  } else {
    const id = 'project_' + Math.random().toString(36).substring(2, 11);
    const newProject: Project = { id, ...projectData } as Project;
    const existing = getFallbackProjects();
    saveFallbackProjects([newProject, ...existing]);
    return newProject;
  }
}

export async function getAllProjects(): Promise<Project[]> {
  if (isConfigured && db) {
    try {
      const colRef = collection(db, 'projects');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const results: Project[] = [];
      snapshot.forEach((snap) => {
        results.push({ id: snap.id, ...snap.data() } as Project);
      });
      return results;
    } catch (e) {
      console.error('Erro ao ler projetos do Firestore:', e);
      return getFallbackProjects();
    }
  } else {
    return getFallbackProjects();
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (isConfigured && db && !id.startsWith('project_')) {
    try {
      const docRef = doc(db, 'projects', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Project;
      }
      return null;
    } catch (e) {
      console.error('Erro ao buscar o projeto por ID:', e);
      return null;
    }
  } else {
    const list = getFallbackProjects();
    return list.find(p => p.id === id) || null;
  }
}

export async function updateProject(id: string, updates: Partial<ProjectInput>): Promise<void> {
  const now = new Date().toISOString();
  if (isConfigured && db && !id.startsWith('project_')) {
    try {
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: now
      });
    } catch (e) {
      console.error('Erro ao atualizar projeto no Firestore:', e);
      throw e;
    }
  } else {
    const list = getFallbackProjects();
    const updated = list.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          updatedAt: now
        } as Project;
      }
      return p;
    });
    saveFallbackProjects(updated);
  }
}

export async function removeProject(id: string): Promise<void> {
  if (isConfigured && db && !id.startsWith('project_')) {
    try {
      const docRef = doc(db, 'projects', id);
      await deleteDoc(docRef);
    } catch (e) {
      console.error('Erro ao excluir projeto no Firestore:', e);
      throw e;
    }
  } else {
    const list = getFallbackProjects();
    const filtered = list.filter(p => p.id !== id);
    saveFallbackProjects(filtered);
  }
}
