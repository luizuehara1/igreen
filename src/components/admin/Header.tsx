import React from 'react';
import { Menu, Sun, Search, Bell, ExternalLink, ShieldCheck } from 'lucide-react';
import { AdminUser } from '../../services/auth';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  adminProfile: AdminUser | null;
  activeTab: string;
  onNavigateHome: () => void;
}

export default function Header({
  onOpenMobileSidebar,
  adminProfile,
  activeTab,
  onNavigateHome
}: HeaderProps) {
  
  // Format tab title to human readable
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Visão Geral do Negócio';
      case 'leads': return 'Gestão de Leads';
      case 'propostas': return 'Propostas Comerciais';
      case 'contratos': return 'Gestão de Contratos';
      case 'projetos': return 'Monitoramento de Redes e Projetos';
      case 'pagamentos': return 'Fluxo de Caixa e Cobranças';
      case 'configuracoes': return 'Ajustes do Painel Integrador';
      default: return 'Painel IGREEN';
    }
  };

  return (
    <header className="bg-white border-b border-zinc-150 sticky top-0 z-30 h-16 px-4 md:px-6 flex items-center justify-between font-sans text-left">
      
      {/* Drawer selector + Page breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-lg text-zinc-600 hover:text-black hover:bg-zinc-100 transition"
          title="Ver Menu"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 capitalize tracking-wider font-display">
            <span>IGREEN Itararé &bull; Itapeva</span>
            <span>/</span>
            <span className="text-[#00DB4A] font-semibold">{activeTab}</span>
          </div>
          <h1 className="text-sm font-black text-zinc-900 tracking-tight font-display -mt-0.5 uppercase">
            {getTabTitle(activeTab)}
          </h1>
        </div>
      </div>

      {/* Profile quick links and settings */}
      <div className="flex items-center gap-4">
        
        {/* Ir para o site público */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition"
          title="Ir para o Site IGREEN"
        >
          <span>Ver Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Notificações do integrador */}
        <div className="relative cursor-pointer hover:bg-zinc-50 p-2 rounded-lg text-zinc-500 hover:text-zinc-900 transition">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-[#00DB4A]" />
        </div>

        {/* User identification badge */}
        {adminProfile && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-200">
            <div className="text-right hidden md:block">
              <span className="text-xs font-bold text-zinc-900 block leading-tight">{adminProfile.name}</span>
              <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-0.5 justify-end uppercase tracking-tighter">
                <ShieldCheck className="w-3 h-3 text-[#00DB4A] fill-[#00DB4A]/10 shrink-0" />
                {adminProfile.role}
              </span>
            </div>
            
            {/* Quick mini-avatar circle */}
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-extrabold flex items-center justify-center text-xs tracking-tighter font-display uppercase border border-zinc-800">
              {adminProfile.name.charAt(0)}
            </div>
          </div>
        )}
      </div>

    </header>
  );
}
