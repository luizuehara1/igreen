import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import Numbers from './components/Numbers';
import Services from './components/Services';
import SolarSimulator from './components/SolarSimulator';
import HowItWorks from './components/HowItWorks';
import ProjectsGallery from './components/ProjectsGallery';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import RoutePages from './components/RoutePages';
import Footer from './components/Footer';
import { Lead } from './types';
import { BRAND } from './data';
import { getSiteSettings, SiteSettings, DEFAULT_SETTINGS } from './services/siteSettings';
import { Phone, ArrowRight, Zap, Star, ShieldAlert } from 'lucide-react';
import { 
  createLeadInFirestore
} from './services/leads';
import AdminPortal from './components/admin/AdminPortal';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const cleanPhoneNum = (settings.whatsapp || '').replace(/\D/g, '');
  const computedWhatsAppLink = cleanPhoneNum 
    ? (cleanPhoneNum.startsWith('55') ? `https://wa.me/${cleanPhoneNum}` : `https://wa.me/55${cleanPhoneNum}`) + `?text=Ol%C3%A1%21+Gostaria+de+solicitar+um+or%C3%A7amento+para+energia+solar.`
    : BRAND.whatsappLink;

  // Load Firestore Site Settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const loaded = await getSiteSettings();
        setSettings(loaded);
      } catch (e) {
        console.error('Falha ao carregar configurações do site:', e);
      }
    }
    fetchSettings();
  }, [currentPath]); // Reload on path changes so it stays highly reactive

  // Sync client router natively with HTML5 Browser History
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);

    // Initial Path Sync
    const initialPath = window.location.pathname || '/';
    setCurrentPath(initialPath);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddLead = async (leadInput: Omit<Lead, 'id' | 'createdAt'>) => {
    try {
      const sourceVal = leadInput.source || 'Site IGREEN';
      const bill = Number(leadInput.monthlyBill) || 0;
      const estSavMonthly = bill * 0.9;
      const estSavAnnual = estSavMonthly * 12;

      await createLeadInFirestore({
        name: leadInput.name,
        phone: leadInput.phone || leadInput.whatsapp || '',
        email: leadInput.email || '',
        city: leadInput.city,
        state: leadInput.state || 'SP',
        propertyType: leadInput.propertyType || 'Residencial',
        monthlyBill: bill,
        averageConsumption: leadInput.averageConsumption || Math.round(bill * 1.1),
        estimatedMonthlySavings: estSavMonthly,
        estimatedAnnualSavings: estSavAnnual,
        message: leadInput.message || '',
        source: sourceVal,
        status: 'Novo Lead'
      });
    } catch (e) {
      console.error('Erro ao adicionar lead:', e);
    }
  };

  const handleAnchorToSimulator = () => {
    // If not on home path, navigate home first then anchor
    if (currentPath !== '/') {
      navigateTo('/');
      // short timeout to support navigation render before anchor
      setTimeout(() => {
        const simEl = document.getElementById('simulator-section');
        if (simEl) simEl.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const simEl = document.getElementById('simulator-section');
      if (simEl) simEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (currentPath.startsWith('/admin')) {
    return (
      <AdminPortal 
        currentPath={currentPath}
        onNavigate={navigateTo}
        onBackToMain={() => navigateTo('/')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-800 font-sans flex flex-col justify-between selection:bg-igreen selection:text-black">
      
      {/* Premium Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigateTo}
        settings={settings}
        whatsappLink={computedWhatsAppLink}
      />

      {/* Main Container Content */}
      <main className="flex-grow">
        {currentPath === '/' ? (
          <div className="animate-fade-in">
            {/* Hero module */}
            <Hero
              onSimulateClick={handleAnchorToSimulator}
              onNavigate={navigateTo}
              settings={settings}
              whatsappLink={computedWhatsAppLink}
            />

            {/* Benefits module */}
            <Benefits />

            {/* Stats Numbers module */}
            <Numbers settings={settings} />

            {/* Services module */}
            <Services onSimulateClick={handleAnchorToSimulator} />

            {/* Interactive Simulator and Lead Capture */}
            <SolarSimulator onAddLead={handleAddLead} />

            {/* How It Works timelines */}
            <HowItWorks />

            {/* Success Cases projects */}
            <ProjectsGallery />

            {/* Satisfied Clients feedback */}
            <Testimonials />

            {/* FAQs Accordions */}
            <FAQ />

            {/* Large bottom Final Call-to-Action panel */}
            <section id="cta-bottom" className="py-20 bg-zinc-950 text-white relative overflow-hidden text-center">
              {/* Green ambient accent light */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-igreen/10 filter blur-[120px] pointer-events-none" />

              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
                <span className="text-xs font-bold text-igreen uppercase tracking-widest bg-igreen/10 px-3 py-1 rounded-full border border-igreen/20">
                  Economia Definitiva Garantida
                </span>
                
                <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-tight max-w-2xl mx-auto">
                  Comece a economizar até <span className="text-[#00DB4A]">95% na conta de luz</span> já no próximo mês.
                </h2>

                <p className="text-sm text-zinc-400 max-w-lg mx-auto font-light leading-relaxed">
                  Não enterre seu lucro pagando taxas absurdas de inflação energética. Solicite agora mesmo um dimensionamento fotovoltaico completo sem custos.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleAnchorToSimulator}
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-igreen text-black font-extrabold text-sm shadow hover:bg-igreen-dark transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Fazer Simulação Online</span>
                    <Zap className="w-4 h-4 fill-black" />
                  </button>

                  <a
                    href={computedWhatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-4 h-4 text-[#00DB4A]" />
                    <span>Orçamento via WhatsApp</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* Multi-route pages context switcher */
          <RoutePages
            currentPath={currentPath}
            onNavigate={navigateTo}
            onAddLead={handleAddLead}
            onSimulateClick={handleAnchorToSimulator}
            settings={settings}
            whatsappLink={computedWhatsAppLink}
          />
        )}
      </main>

      {/* Floating pulsing WhatsApp green button at bottom right */}
      <a
        href={computedWhatsAppLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#00DB4A] hover:bg-emerald-500 text-black p-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center justify-center border border-emerald-400 group cursor-pointer animate-float"
        title="Falar no WhatsApp"
      >
        <span className="absolute left-[-150px] bg-zinc-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none shadow border border-zinc-800">
          Chamar no WhatsApp 📲
        </span>
        <Phone className="w-6 h-6 shrink-0 fill-black text-black" />
        <div className="absolute inset-0 rounded-full bg-igreen/20 animate-ping -z-10" />
      </a>

      {/* Corporate footer */}
      <Footer
        onNavigate={navigateTo}
        settings={settings}
        whatsappLink={computedWhatsAppLink}
      />

    </div>
  );
}
