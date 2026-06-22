import React, { useState, useEffect } from 'react';
import { Star, Quote, Zap, ArrowRight, TrendingDown } from 'lucide-react';
import { getFeaturedSocialProofs, SocialProof } from '../services/socialProofs';

export default function Testimonials() {
  const [proofs, setProofs] = useState<SocialProof[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await getFeaturedSocialProofs();
        setProofs(data);
      } catch (e) {
        console.error('Falha ao carregar depoimentos na Home:', e);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleRouteToResults = () => {
    window.history.pushState({}, '', '/resultados');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="testimonials-section" className="py-20 bg-zinc-50 border-t border-b border-zinc-200/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-[#00DB4A] uppercase px-3 py-1 bg-[#00DB4A]/10 rounded-full">
            Casos de Sucesso
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-900 tracking-tight mt-3 uppercase">
            Resultados Reais de Clientes IGREEN
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            Veja a economia de verdade na fatura de nossos parceiros residenciais, rurais e comerciais.
          </p>
        </div>

        {/* Testimonials dynamic loading state helper */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-6 h-6 border-2 border-zinc-900 border-t-igreen rounded-full animate-spin" />
          </div>
        ) : proofs.length === 0 ? (
          /* Elegant fallback cards if database contains no records yet */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 bg-white border border-zinc-200 rounded-3xl space-y-4 text-left shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="p-1 px-2.5 bg-emerald-50 text-emerald-800 text-[10px] uppercase font-bold rounded-lg border border-emerald-100">Residencial</span>
                  <h4 className="text-base font-bold text-zinc-900 mt-2">Eduardo Fernandes</h4>
                  <p className="text-[10px] text-zinc-500 font-medium">📍 Itararé / SP</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-igreen/10 border border-igreen/20 flex items-center justify-center font-bold text-lg text-emerald-800">EF</div>
              </div>
              <p className="text-xs text-zinc-650 italic font-light">"Minha fatura de energia caiu de R$ 740,00 para a taxa mínima de R$ 85,00 logo no primeiro mês. Instalação super limpa e engenharia da iGreen está de parabéns!"</p>
              <div className="p-4 bg-zinc-50 rounded-2xl grid grid-cols-2 gap-4 text-xs font-mono font-bold">
                <div>Antes: <span className="text-rose-600">R$ 740,00</span></div>
                <div>Depois: <span className="text-emerald-600">R$ 85,00</span></div>
              </div>
            </div>

            <div className="p-8 bg-white border border-zinc-200 rounded-3xl space-y-4 text-left shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="p-1 px-2.5 bg-emerald-50 text-emerald-800 text-[10px] uppercase font-bold rounded-lg border border-emerald-100">Comercial</span>
                  <h4 className="text-base font-bold text-zinc-900 mt-2">Frigorífico Sabor Sudoeste</h4>
                  <p className="text-[10px] text-zinc-500 font-medium">📍 Itapeva / SP</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-igreen/10 border border-igreen/20 flex items-center justify-center font-bold text-lg text-emerald-800">FS</div>
              </div>
              <p className="text-xs text-zinc-650 italic font-light">"Mudamos nossa matriz energética para solar com a iGreen e agora economizamos quase R$ 4.000,00 por mês. Altamente recomendado!"</p>
              <div className="p-4 bg-zinc-50 rounded-2xl grid grid-cols-2 gap-4 text-xs font-mono font-bold">
                <div>Antes: <span className="text-rose-600">R$ 4.200,00</span></div>
                <div>Depois: <span className="text-emerald-600">R$ 290,00</span></div>
              </div>
            </div>
          </div>
        ) : (
          /* Render real dynamic testimonials from Firestore */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {proofs.map((t) => (
              <div
                key={t.id}
                className="relative p-6 bg-white border border-zinc-200/80 rounded-3xl flex flex-col justify-between hover:shadow-xl transition-all duration-300 group text-left"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="p-1 px-2.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-[9px] uppercase font-black tracking-wide rounded-lg inline-block">
                        {t.propertyType}
                      </span>
                      <h4 className="text-base font-black text-zinc-950 font-display tracking-tight mt-2 leading-none">{t.clientName}</h4>
                      <span className="text-[10px] font-semibold text-zinc-400 block mt-1 uppercase">📍 {t.city} &bull; SP</span>
                    </div>

                    {/* Image rendering with fallback check */}
                    {t.imageUrl && t.imageUrl !== '' ? (
                      <img 
                        src={t.imageUrl} 
                        alt={t.clientName}
                        className="w-12 h-12 rounded-full object-cover border border-zinc-150 shadow-sm shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 font-extrabold font-display uppercase tracking-widest shrink-0">
                        {t.clientName.substring(0, 2)}
                      </div>
                    )}
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-xs text-zinc-600 leading-relaxed font-light italic pl-3 border-l-2 border-[#00DB4A]">
                    "{t.testimonial}"
                  </p>

                  {/* Compare faturas box */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
                    <span className="text-[9px] uppercase font-extrabold text-zinc-400 block tracking-widest leading-none mb-1">Conta de Luz Mensal</span>
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono font-semibold">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-rose-500 uppercase">Antes da solar</span>
                        <strong className="text-zinc-700">R$ {t.monthlyBillBefore.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </div>
                      <div className="flex flex-col border-l border-zinc-200 pl-3">
                        <span className="text-[9px] text-[#00DB4A] uppercase">Fatura Atual</span>
                        <strong className="text-zinc-800 font-bold">R$ {t.monthlyBillAfter.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Nominal installed Capacity */}
                  {t.systemPowerKwp && t.systemPowerKwp > 0 ? (
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono font-medium">
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                      <span>{t.systemPowerKwp} kWp de potência instalada</span>
                    </div>
                  ) : null}
                </div>

                {/* Savings bottom footer */}
                <div className="pt-4 mt-6 border-t border-zinc-100 flex items-center justify-between text-xs font-mono font-bold">
                  <div>
                    <span className="text-[9px] text-zinc-400 block uppercase">Economia Mensal</span>
                    <strong className="text-emerald-800 text-sm font-black font-display font-mono">R$ {t.monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-zinc-400 block uppercase">Economia Anual</span>
                    <strong className="text-zinc-900 font-black font-mono">R$ {t.annualSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* View all button to navigate to /resultados */}
        <div className="mt-12 text-center">
          <button
            onClick={handleRouteToResults}
            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 border-none hover:bg-zinc-850 active:scale-[0.98] text-white rounded-full font-bold text-xs uppercase tracking-widest shadow transition cursor-pointer"
          >
            <span>Ver Todos Resultados de Clientes</span>
            <ArrowRight className="w-4 h-4 text-igreen shrink-0" />
          </button>
        </div>

        {/* Google review micro banner */}
        <div className="mt-16 bg-zinc-50 border border-zinc-150 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-display font-black text-blue-600 text-lg shadow-sm">
              G
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-950">Excelente classificação no Google Reviews</p>
              <p className="text-xs text-zinc-500">Média de 5.0 estrelas baseada em avaliações de moradores e empresas locais.</p>
            </div>
          </div>
          <div className="flex gap-1 text-amber-400 shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs font-bold text-zinc-800 ml-1">5.0 / 5</span>
          </div>
        </div>

      </div>
    </section>
  );
}
