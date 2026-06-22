import React, { useState, useEffect } from 'react';
import { getActiveSocialProofs, SocialProof } from '../services/socialProofs';
import { 
  Star, 
  Quote, 
  Zap, 
  MapPin, 
  ChevronLeft, 
  ArrowRight, 
  Filter, 
  HeartHandshake, 
  Award,
  Loader2,
  Phone
} from 'lucide-react';
import { BRAND } from '../data';

interface ResultsPageProps {
  settings?: any;
  whatsappLink?: string;
  onNavigate: (path: string) => void;
  onSimulateClick: () => void;
}

export default function ResultsPage({ settings, whatsappLink, onNavigate, onSimulateClick }: ResultsPageProps) {
  const [proofs, setProofs] = useState<SocialProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'Residencial' | 'Comercial' | 'Rural' | 'Industrial'>('all');

  useEffect(() => {
    async function loadProofs() {
      try {
        const data = await getActiveSocialProofs();
        setProofs(data);
      } catch (e) {
        console.error('Erro ao buscar casos ativos:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProofs();
  }, []);

  const handleBackToMain = () => {
    onNavigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = proofs.filter(p => activeFilter === 'all' || p.propertyType === activeFilter);

  return (
    <div className="pt-24 pb-20 bg-zinc-50 font-sans text-left animate-fade-in relative">
      {/* Upper soft decoration */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-igreen/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Section */}
      <div className="bg-white border-b border-zinc-200/60 py-16 text-left relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <button
            onClick={handleBackToMain}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-950 transition uppercase tracking-wider mb-6 bg-transparent border-none cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 shrink-0 text-zinc-400" />
            <span>Voltar para o Início</span>
          </button>

          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-igreen-dark bg-[#00DB4A]/10 px-3.5 py-1.5 rounded-full">
            Performance Comprovada &bull; Sudoeste Paulista
          </span>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-zinc-900 mt-4 leading-tight uppercase tracking-tight max-w-4xl">
            Resultados Reais de Clientes IGREEN
          </h1>
          
          <p className="text-sm sm:text-base text-zinc-500 mt-3 max-w-3xl leading-relaxed font-light">
            Nossos clientes geram sua própria energia sustentável e limpa com reduções de até 95% na fatura. Do residencial urbano ao grande agronegócio de Itapeva e Itararé, veja as histórias reais de quem escolheu a iGreen.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <Filter className="w-4 h-4 shrink-0 text-zinc-400" />
            <span>Filtrar Projetos por Matriz:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Todos Casos' },
              { id: 'Residencial', label: 'Residenciais' },
              { id: 'Comercial', label: 'Comerciais' },
              { id: 'Rural', label: 'Rurais / Agro' },
              { id: 'Industrial', label: 'Industriais' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-none ${
                  activeFilter === tab.id
                    ? 'bg-zinc-900 text-white font-black'
                    : 'bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Showcase loader */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-igreen-dark" />
            <span className="text-zinc-500 text-xs font-semibold">Buscando testemunhos reais no Firestore...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-zinc-200 rounded-3xl space-y-4 max-w-2xl mx-auto mt-8">
            <HeartHandshake className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-base font-bold text-zinc-800">Sem casos cadastrados nesta categoria ainda</h3>
            <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">Nossos engenheiros estão ativando cooperativas no momento. Navegue pelas outras abas para conferir as faturas homologadas!</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-extrabold uppercase rounded-xl tracking-wider cursor-pointer border-none"
            >
              Ver Todos Projetos
            </button>
          </div>
        ) : (
          /* Card grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {filtered.map(t => (
              <div
                key={t.id}
                className="bg-white border border-zinc-200/80 rounded-3xl p-6 hover:shadow-2xl transition duration-300 flex flex-col justify-between text-left"
              >
                <div className="space-y-4">
                  {/* Badge & profile photo */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="p-1 px-2.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] uppercase font-bold rounded-lg inline-block">
                        {t.propertyType}
                      </span>
                      <h3 className="text-base font-black text-zinc-900 tracking-tight mt-2">{t.clientName}</h3>
                      <span className="text-[10px] text-zinc-400 font-bold block mt-0.5 uppercase flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-400 inline" />
                        <span>{t.city} &bull; Sudoeste Paulista</span>
                      </span>
                    </div>

                    {t.imageUrl && t.imageUrl !== '' ? (
                      <img
                        src={t.imageUrl}
                        alt={t.clientName}
                        className="w-14 h-14 rounded-full object-cover shadow-sm shrink-0 border border-zinc-150"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-150 text-emerald-800 font-black text-lg flex items-center justify-center uppercase shrink-0">
                        {t.clientName.substring(0, 2)}
                      </div>
                    )}
                  </div>

                  {/* Relato */}
                  <div className="relative">
                    <Quote className="w-5 h-5 text-igreen/20 absolute -left-1 -top-2" />
                    <p className="text-xs text-zinc-600 italic font-light leading-relaxed pl-6">
                      "{t.testimonial}"
                    </p>
                  </div>

                  {/* Faturas boxes */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
                    <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-widest block leading-none">Comparativo de Faturas Elétricas</span>
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono font-bold pt-1">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-rose-500 uppercase font-bold">Antes da Solar</span>
                        <strong className="text-zinc-600 line-through">R$ {t.monthlyBillBefore.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </div>
                      <div className="flex flex-col border-l border-zinc-150 pl-3">
                        <span className="text-[9px] text-[#00DB4A] uppercase font-bold">Atualmente</span>
                        <strong className="text-zinc-950">R$ {t.monthlyBillAfter.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Potência nominal */}
                  {t.systemPowerKwp && t.systemPowerKwp > 0 ? (
                    <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-semibold font-mono">
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{t.systemPowerKwp} kWp de potência instalada ativa</span>
                    </div>
                  ) : null}
                </div>

                {/* Savings values bottom summary */}
                <div className="pt-4 mt-6 border-t border-zinc-100 flex items-center justify-between text-xs font-mono font-bold">
                  <div>
                    <span className="text-[9px] text-zinc-400 block uppercase font-bold">Economia Mensal</span>
                    <strong className="text-emerald-800 text-sm font-black font-display font-mono">R$ {t.monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-zinc-400 block uppercase font-bold">Economia Anual</span>
                    <strong className="text-zinc-900 font-bold font-mono">R$ {t.annualSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Page bottom action strip */}
        <div className="mt-16 bg-zinc-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-20 -translate-y-20 w-80 h-80 rounded-full bg-igreen/5 filter blur-[90px] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] text-[#00DB4A] font-extrabold uppercase tracking-widest block">Simulação técnica gratuita e sem compromisso</span>
            <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-white leading-tight">Quer ter essa economia na sua fatura também?</h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">Nossos especialistas analisam seu consumo de energia atual e preparam um plano sob medida de eficiência solar fotovoltaica para você.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onSimulateClick}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#00DB4A] hover:bg-[#00B438] active:scale-[0.98] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer border-none"
            >
              Simular Economia Agora
            </button>

            <a
              href={whatsappLink || BRAND.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Phone className="w-4 h-4 text-[#00DB4A]" />
              <span>Chamar Consultor Técnico</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
