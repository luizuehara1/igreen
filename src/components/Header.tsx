import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Phone, FileSpreadsheet, Sparkles } from 'lucide-react';
import { BRAND } from '../data';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  settings?: any;
  whatsappLink?: string;
}

export default function Header({ currentPath, onNavigate, settings, whatsappLink }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Início', path: '/' },
    { label: 'Sobre Nós', path: '/sobre' },
    { label: 'Serviços', path: '/servicos' },
    { label: 'Projetos', path: '/projetos' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contato', path: '/contato' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-zinc-100'
          : 'bg-white/80 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo iGreen */}
          <div 
            onClick={() => handleNavClick('/')} 
            className="flex items-center cursor-pointer"
          >
            <img 
              src={settings?.logoUrl || "https://i.postimg.cc/QCqkVd5g/Design-sem-nome-(15).png"} 
              alt="IGREEN ITARARÉ/ITAPEVA" 
              className="h-10 md:h-12 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-600 hover:text-igreen hover:bg-zinc-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Real Corporate Admin Panel Button */}
            <button
              onClick={() => onNavigate('/admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 text-white hover:bg-zinc-850 hover:text-igreen transition"
              title="Acesso Corporativo Integrador"
            >
              <Sun className="w-3.5 h-3.5 text-igreen fill-igreen/20" />
              <span>Painel Admin</span>
            </button>

            {/* CTA WhatsApp */}
            <a
              href={whatsappLink || BRAND.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-igreen hover:bg-igreen-dark text-black font-semibold text-sm shadow-md shadow-igreen/20 hover:scale-[1.02] transition"
            >
              <Phone className="w-4 h-4" />
              <span>Orçamento Grátis</span>
            </a>
          </div>

          {/* Mobile elements (Menu) */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-zinc-100 py-4 px-6 animate-fade-in">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-igreen text-black font-bold'
                      : 'text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="border-t border-zinc-100 my-2 pt-3 flex flex-col gap-3">
              {/* Mobile Admin panel button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('/admin');
                }}
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-zinc-950 text-white text-sm font-semibold transition"
              >
                <Sun className="w-5 h-5 text-igreen fill-igreen/20" />
                <span>Painel Corporativo Admin</span>
              </button>

              {/* Mobile Whatsapp CTA */}
              <a
                href={whatsappLink || BRAND.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-igreen text-black font-bold shadow-md text-sm cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Solicitar Orçamento Grátis</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
