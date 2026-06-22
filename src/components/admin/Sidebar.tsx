import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FileCheck, 
  Wrench, 
  DollarSign, 
  Settings, 
  LogOut, 
  Sun,
  X,
  Star
} from 'lucide-react';
import { AdminUser } from '../../services/auth';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  adminProfile: AdminUser | null;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ 
  activeTab, 
  onSelectTab, 
  adminProfile, 
  onLogout, 
  isOpen, 
  onClose 
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'propostas', label: 'Propostas', icon: FileText },
    { id: 'contratos', label: 'Contratos', icon: FileCheck },
    { id: 'projetos', label: 'Projetos', icon: Wrench },
    { id: 'pagamentos', label: 'Pagamentos', icon: DollarSign },
    { id: 'prova-social', label: 'Prova Social', icon: Star },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-900 text-zinc-400 font-sans text-left">
      {/* Brand area */}
      <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="https://i.postimg.cc/QCqkVd5g/Design-sem-nome-(15).png" 
            alt="IGREEN ITARARÉ/ITAPEVA"
            className="h-9 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Mobile close button */}
        <button 
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Admin User Small Badge */}
      {adminProfile && (
        <div className="p-4 mx-4 mt-4 bg-zinc-900/60 rounded-xl border border-zinc-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-igreen/10 text-[#00DB4A] border border-[#00DB4A]/20 flex items-center justify-center font-bold font-display text-base uppercase">
            {adminProfile.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold text-white truncate leading-tight">
              {adminProfile.name}
            </h4>
            <p className="text-[10px] text-zinc-500 truncate mt-0.5 uppercase tracking-wider">
              {adminProfile.role === 'super_admin' ? 'Super Admin' : adminProfile.role === 'admin' ? 'Administrador' : 'Integrador'}
            </p>
          </div>
        </div>
      )}

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold font-display tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-igreen text-black shadow-lg shadow-igreen/20 font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
              }`}
            >
              <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-black font-bold' : 'text-zinc-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-zinc-900">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-950/40 border border-red-950/20 transition-colors uppercase cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0 text-red-500" />
          <span>Sair do Painel</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside className="hidden md:block w-64 h-screen fixed top-0 left-0 z-20 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile background backdrop overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Mobile drawer sidebar */}
      <div 
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        {sidebarContent}
      </div>
    </>
  );
}
