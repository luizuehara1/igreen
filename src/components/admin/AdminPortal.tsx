import React, { useState, useEffect } from 'react';
import { 
  signInWithGoogle, 
  logout, 
  adminAuthListener, 
  AdminUser,
  isConfigured
} from '../../services/auth';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardView from './DashboardView';
import LeadsManager from './LeadsManager';
import ProposalsManager from './ProposalsManager';
import ContractsManager from './ContractsManager';
import ProjectsManager from './ProjectsManager';
import PaymentsManager from './PaymentsManager';
import SettingsPage from './SettingsPage';
import SocialProofsManager from './SocialProofsManager';
import { Sun, ShieldAlert, Loader, LogIn, ExternalLink } from 'lucide-react';
import { Proposal } from '../../services/proposals';
import { LeadDetailed } from '../../services/leads';

interface AdminPortalProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onBackToMain: () => void;
}

export default function AdminPortal({ currentPath, onNavigate, onBackToMain }: AdminPortalProps) {
  
  // Auth state
  const [user, setUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Layout states (derived from currentPath when logged in, or synced)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Conversion trigger queues
  const [conversionQueueProposal, setConversionQueueProposal] = useState<LeadDetailed | null>(null);
  const [conversionQueueContract, setConversionQueueContract] = useState<Proposal | null>(null);

  useEffect(() => {
    // Sincroniza listener de autenticação real do Firebase Auth
    const unsubscribe = adminAuthListener((loggedInAdmin) => {
      setUser(loggedInAdmin);
      setAuthLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Sincronização de rotas e proteção rígida (/admin/*)
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // Se não autenticado, qualquer caminho fora do /admin/login redireciona para lá
      if (currentPath !== '/admin/login') {
        onNavigate('/admin/login');
      }
    } else {
      // Se autenticado, redireciona /admin, /admin/ ou /admin/login para /admin/dashboard
      if (currentPath === '/admin' || currentPath === '/admin/' || currentPath === '/admin/login') {
        onNavigate('/admin/dashboard');
      } else {
        // Extrai a aba correspondente da URL
        const tab = currentPath.substring('/admin/'.length);
        const validTabs = ['dashboard', 'leads', 'propostas', 'contratos', 'projetos', 'pagamentos', 'configuracoes', 'prova-social'];
        if (tab && validTabs.includes(tab)) {
          setActiveTab(tab);
        } else {
          // Se for uma rota inválida ou incompleta, manda pro dashboard
          onNavigate('/admin/dashboard');
        }
      }
    }
  }, [currentPath, user, authLoading, onNavigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoggingIn(true);
      setLoginError('');
      const loggedUser = await signInWithGoogle();
      if (loggedUser) {
        setUser(loggedUser);
        onNavigate('/admin/dashboard');
      } else {
        setLoginError('Usuário sem permissão de administrador.');
      }
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || 'Falha na autenticação do Google.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    onNavigate('/admin/login');
  };

  // Convert Lead -> Proposal flow
  const convertLeadToProposal = (lead: LeadDetailed) => {
    setConversionQueueProposal(lead);
    onNavigate('/admin/propostas');
  };

  // Convert Proposal -> Contract flow
  const convertProposalToContract = (prop: Proposal) => {
    setConversionQueueContract(prop);
    onNavigate('/admin/contratos');
  };

  // Render correct sub-view
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigateTab={(tab) => onNavigate('/admin/' + tab)} />;
      case 'leads':
        return <LeadsManager onConvertToProposal={convertLeadToProposal} />;
      case 'propostas':
        return (
          <ProposalsManager 
            onConvertToContract={convertProposalToContract}
            conversionQueueProposal={conversionQueueProposal}
            onClearConversionQueue={() => setConversionQueueProposal(null)}
          />
        );
      case 'contratos':
        return (
          <ContractsManager 
            onConvertToProject={() => {}}
            conversionQueueContract={conversionQueueContract}
            onClearConversionQueue={() => setConversionQueueContract(null)}
          />
        );
      case 'projetos':
        return <ProjectsManager />;
      case 'pagamentos':
        return <PaymentsManager />;
      case 'prova-social':
        return <SocialProofsManager />;
      case 'configuracoes':
        return <SettingsPage />;
      default:
        return <DashboardView onNavigateTab={(tab) => onNavigate('/admin/' + tab)} />;
    }
  };

  // If Auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen h-screen flex flex-col items-center justify-center bg-zinc-950 font-sans space-y-4 text-center">
        <Sun className="w-10 h-10 text-igreen animate-spin" />
        <span className="text-zinc-500 text-xs font-semibold">Carregando painel de controle corporativo...</span>
      </div>
    );
  }

  // Not logged in -> Show Login form (Force /admin/login)
  if (!user) {
    return (
      <div className="min-h-screen text-zinc-900 bg-zinc-950 flex flex-col justify-center items-center p-4 font-sans text-left relative overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-igreen/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800/80 p-8 rounded-3xl space-y-6 shadow-2xl relative z-10">
          
          <div className="text-center space-y-4">
            <img 
              src="https://i.postimg.cc/QCqkVd5g/Design-sem-nome-(15).png" 
              alt="IGREEN ITARARÉ/ITAPEVA"
              className="h-16 w-auto object-contain mx-auto"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Painel Administrativo IGREEN</h2>
              <span className="text-[10px] text-[#00DB4A] font-extrabold tracking-widest block uppercase">Acesso seguro integrador</span>
            </div>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-950/40 border border-red-900/30 text-red-000 text-zinc-200 rounded-xl text-xs flex gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="text-red-400 font-medium">{loginError}</span>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loggingIn}
              className="w-full py-3.5 bg-[#00DB4A] hover:bg-[#00A638] disabled:bg-zinc-800 disabled:text-zinc-550 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#00DB4A]/10 hover:shadow-[#00DB4A]/15 cursor-pointer flex items-center justify-center gap-2.5 transition active:scale-[0.98]"
            >
              {loggingIn ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Entrar com Google</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={onBackToMain}
            className="w-full text-center text-[10px] uppercase font-bold text-zinc-500 hover:text-white transition duration-150 block mt-4 bg-transparent border-none cursor-pointer"
          >
            &larr; Voltar para o Site Público
          </button>

        </div>

        <div className="text-[10px] text-zinc-600 font-mono mt-8">
          IGREEN Itararé / Itapeva &bull; SP &bull; Solar Cloud
        </div>
      </div>
    );
  }

  // LOGGED IN -> Main Administrative panel layout
  return (
    <div className="min-h-screen text-zinc-800 bg-zinc-50 flex font-sans w-full">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => onNavigate(`/admin/${tab}`)}
        adminProfile={user}
        onLogout={handleLogout}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Container Wrapper */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          adminProfile={user}
          activeTab={activeTab}
          onNavigateHome={onBackToMain}
        />

        {/* Inner Content Area */}
        <main className="flex-1 p-4 md:p-6 mb-12">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>

      </div>

    </div>
  );
}
