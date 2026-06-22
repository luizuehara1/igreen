import React from 'react';
import { Sun, Mail, Phone, MapPin, Instagram, Shield, ArrowUp } from 'lucide-react';
import { BRAND } from '../data';

interface FooterProps {
  onNavigate: (path: string) => void;
  settings?: any;
  whatsappLink?: string;
}

export default function Footer({ onNavigate, settings, whatsappLink }: FooterProps) {
  const handleNav = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-zinc-950 text-zinc-400 pt-16 pb-8 border-t border-zinc-900 text-left relative overflow-hidden">
      
      {/* Glow highlight background */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-igreen/5 filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top details block */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-900">
          
          {/* Column 1 Logo and Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div 
              onClick={() => handleNav('/')}
              className="flex items-center cursor-pointer"
            >
              <img 
                src={settings?.logoUrl || "https://i.postimg.cc/QCqkVd5g/Design-sem-nome-(15).png"} 
                alt="IGREEN ITARARÉ/ITAPEVA" 
                className="h-14 md:h-16 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              Somos o braço oficial IGREEN integrador líder de soluções e faturas fotovoltaicas nas cidades de Itararé, Itapeva e todo o Sudoeste Paulista, entregando economia de até 95% sem complicações.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href={settings?.instagram || BRAND.instagram} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-350 hover:bg-[#00DB4A] hover:text-black hover:border-[#00DB4A] transition"
                title="Siga no Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={`mailto:${settings?.email || BRAND.email}`}
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-350 hover:bg-[#00DB4A] hover:text-black hover:border-[#00DB4A] transition"
                title="Mande um Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2 Quick links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest font-display">Navegação</h4>
            <ul className="space-y-2 text-xs">
              {[
                { l: 'Início', p: '/' },
                { l: 'Sobre Nós', p: '/sobre' },
                { l: 'Nossos Serviços', p: '/servicos' },
                { l: 'Portfólio Projetos', p: '/projetos' },
                { l: 'Nosso Blog', p: '/blog' },
                { l: 'Contato Rápido', p: '/contato' }
              ].map((link) => (
                <li key={link.p}>
                  <button
                    onClick={() => handleNav(link.p)}
                    className="hover:text-white hover:underline transition text-left cursor-pointer"
                  >
                    {link.l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 Quick Service links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest font-display">Serviços Completos</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('/energia-solar-residencial')} className="hover:text-white hover:underline transition text-left cursor-pointer">
                  Energia Solar Residencial
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/energia-solar-comercial')} className="hover:text-white hover:underline transition text-left cursor-pointer">
                  Energia Solar Comercial
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/energia-solar-rural')} className="hover:text-white hover:underline transition text-left cursor-pointer">
                  Energia Solar Rural
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/servicos')} className="hover:text-white hover:underline transition text-left cursor-pointer">
                  Instalação & homologação
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/servicos')} className="hover:text-white hover:underline transition text-left cursor-pointer">
                  Manutenção de placas solares
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4 Direct support touchpoints */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest font-display">Sede & Atendimento</h4>
            
            <div className="flex gap-2 text-xs leading-normal">
              <MapPin className="w-4 h-4 shrink-0 text-igreen mt-0.5" />
              <span>{settings?.address || BRAND.address}</span>
            </div>

            <div className="flex gap-2 text-xs items-center pt-2">
              <Phone className="w-4 h-4 text-igreen" />
              <a href={whatsappLink || BRAND.whatsappLink} className="hover:text-white font-medium">
                {settings?.whatsapp || BRAND.phone}
              </a>
            </div>


          </div>

        </div>

        {/* Bottom credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-600 gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00DB4A]" />
            <span>&copy; {new Date().getFullYear()} {settings?.footerText || "IGREEN Itararé / Itapeva. Todos os direitos reservados."}</span>
          </div>

          <p className="text-center sm:text-right">
            Projetos integrados com tecnologia, engenharia sustentável e máxima redução de tarifas.
          </p>

          <button
            onClick={handleScrollTop}
            className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
            title="Voltar ao topo"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
