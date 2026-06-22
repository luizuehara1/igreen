import React, { useState } from 'react';
import { Leaf, Info, Percent, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { PropertyType, SimulationResult, Lead } from '../types';

interface SolarSimulatorProps {
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
}

export default function SolarSimulator({ onAddLead }: SolarSimulatorProps) {
  // Form parameters
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('Itapeva');
  const [propertyType, setPropertyType] = useState<PropertyType>('residencial');
  const [monthlyBill, setMonthlyBill] = useState<number>(350);

  // Simulation indicators
  const [simulated, setSimulated] = useState<SimulationResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Live calculation function
  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp) {
      alert('Por favor, digite seu Nome e WhatsApp para realizar a simulação.');
      return;
    }

    // Mathematical parameters customized for Elektro distribution (Itararé / Itapeva) area
    // R$ 1.00 is approximately 1 kWh
    const estimatedEconomy = Math.round(monthlyBill * 0.92);
    const estimatedAnnualEconomy = estimatedEconomy * 12;
    // Payback period
    const paybackYears = propertyType === 'comercial' ? 3.2 : propertyType === 'rural' ? 3.8 : 4.2;
    // Each panel provides approx R$ 45 in elektro savings
    const panelsCount = Math.max(2, Math.ceil(monthlyBill / 45));
    // Environmental conversions
    const co2SavedKg = Math.round(panelsCount * 14.5 * 12);
    const treesPlantedVal = Math.ceil(co2SavedKg / 7.3);

    setSimulated({
      monthlyBill,
      estimatedEconomy,
      estimatedAnnualEconomy,
      paybackYears,
      panelsCount,
      co2SavedKg,
      treesPlantedVal
    });
  };

  const handleApplyOfficialOffer = () => {
    if (!simulated) return;

    onAddLead({
      name,
      whatsapp,
      phone: whatsapp,
      city,
      propertyType,
      monthlyBill: simulated.monthlyBill,
      estimatedEconomy: simulated.estimatedEconomy,
      estimatedAnnualEconomy: simulated.estimatedAnnualEconomy,
      averageConsumption: Math.round(simulated.monthlyBill * 1.1),
      message: `Simulação realizada para cerca de ~${simulated.panelsCount} placas fotovoltaicas.`,
      source: 'Simulador IGREEN',
      status: 'Novo'
    });

    setSubmitted(true);

    // Format WhatsApp message
    const cleanPhone = whatsapp.replace(/\D/g, '');
    const textMsg = `Olá IGREEN! Acabei de realizar a simulação solar de economia:\n\n*Nome:* ${name}\n*Cidade:* ${city}\n*Tipo:* ${propertyType.toUpperCase()}\n*Conta atual:* R$ ${monthlyBill}\n*Economia Estimada:* R$ ${simulated.estimatedEconomy}/mês (Anual: R$ ${simulated.estimatedAnnualEconomy})\n*Painéis Requeridos:* ~${simulated.panelsCount} placas\n\nGostaria de solicitar meu estudo técnico oficial gratuito!`;
    const waLink = `https://wa.me/5515998765432?text=${encodeURIComponent(textMsg)}`;
    
    // Smooth delay before opening to let the customer absorb the congratulations screen
    setTimeout(() => {
      window.open(waLink, '_blank');
    }, 1200);
  };

  const handleReset = () => {
    setName('');
    setWhatsapp('');
    setMonthlyBill(350);
    setSimulated(null);
    setSubmitted(false);
  };

  return (
    <section id="simulator-section" className="py-20 bg-zinc-50 border-t border-zinc-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-[#00DB4A] uppercase px-3 py-1 bg-[#00DB4A]/10 rounded-full">
            Calculadora Fotovoltaica
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-900 tracking-tight mt-3">
            Simulador de Economia IGREEN
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            Descubra em segundos o quanto de dinheiro você está deixando na mesa. Preencha os campos abaixo e veja os resultados estimados reais.
          </p>
        </div>

        {/* Layout responsive cards wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Input details card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-150 shadow-sm flex flex-col justify-between h-full">
            <h3 className="text-lg font-display font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <span className="p-1 px-2.5 rounded-lg bg-zinc-100 text-sm">💡</span>
              <span>Dados da propriedade</span>
            </h3>

            {!submitted ? (
              <form onSubmit={handleSimulate} className="space-y-5">
                {/* Nome */}
                <div>
                  <label htmlFor="sim-name" className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Seu Nome Completo
                  </label>
                  <input
                    id="sim-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-igreen focus:border-igreen bg-zinc-50"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label htmlFor="sim-whatsapp" className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Seu WhatsApp / Telefone
                  </label>
                  <input
                    id="sim-whatsapp"
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(15) 99999-9999"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-igreen focus:border-igreen bg-zinc-50"
                  />
                </div>

                {/* City select row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sim-city" className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                      Sua Cidade
                    </label>
                    <select
                      id="sim-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen"
                    >
                      <option value="Itapeva">Itapeva - SP</option>
                      <option value="Itararé">Itararé - SP</option>
                      <option value="Taquarivaí">Taquarivaí - SP</option>
                      <option value="Itaberá">Itaberá - SP</option>
                      <option value="Buri">Buri - SP</option>
                      <option value="Capão Bonito">Capão Bonito - SP</option>
                      <option value="Nova Campina">Nova Campina - SP</option>
                      <option value="Riversul">Riversul - SP</option>
                      <option value="Bom Sucesso de Itararé">Bom Sucesso de Itararé - SP</option>
                      <option value="Região Sudoeste Paulista">Região Sudoeste Paulista</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sim-type" className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                      Tipo Imóvel
                    </label>
                    <select
                      id="sim-type"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen"
                    >
                      <option value="residencial">Residencial</option>
                      <option value="comercial">Comercial</option>
                      <option value="rural">Rural</option>
                    </select>
                  </div>
                </div>

                {/* Account Cost slider input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="sim-bill" className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                      Valor Médio da Conta
                    </label>
                    <span className="text-lg font-black text-zinc-900">
                      R$ {monthlyBill}
                    </span>
                  </div>
                  <input
                    id="sim-bill"
                    type="range"
                    min="150"
                    max="10000"
                    step="50"
                    value={monthlyBill}
                    onChange={(e) => setMonthlyBill(Number(e.target.value))}
                    className="w-full accent-igreen cursor-pointer h-2 bg-zinc-100 rounded-lg"
                  />
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                    <span>R$ 150</span>
                    <span>R$ 5.000</span>
                    <span>R$ 10.000+</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-center rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-sm transition tracking-wide cursor-pointer"
                >
                  Calcular Economia Estimada &rarr;
                </button>
              </form>
            ) : (
              <div className="text-center py-6 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-display font-extrabold text-zinc-900">Simulação Registrada!</h4>
                <p className="text-sm text-zinc-500 mt-2 max-w-sm">
                  Seus dados foram salvos no nosso banco de dados local. Você será redirecionado para falar com o nosso consultor especializado para receber um projeto 3D oficial.
                </p>
                <div className="mt-8 space-y-3 w-full">
                  <button
                    onClick={() => window.open(`https://wa.me/5515998765432`)}
                    className="w-full py-3 rounded-xl bg-igreen hover:bg-igreen-dark text-black font-extrabold text-xs tracking-wide shadow"
                  >
                    Falar com Consultor no WhatsApp
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold"
                  >
                    Fazer Nova Simulação
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column Results display card */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-150 shadow-sm min-h-[400px] flex flex-col justify-between">
            {!simulated ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
                <Percent className="w-12 h-12 text-zinc-300 animate-bounce" />
                <h4 className="text-base font-bold text-zinc-800 mt-4">Esperando Dados...</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  Preencha os campos de Nome, WhatsApp e a média do seu gasto mensal à esquerda para calcular seus benefícios ecológicos e financeiros.
                </p>
              </div>
            ) : (
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                    <div>
                      <h4 className="text-xs uppercase font-extrabold text-zinc-400 tracking-wider">Estudo Preliminar</h4>
                      <h3 className="text-xl font-display font-black text-zinc-900 mt-0.5">Economia Garantida IGREEN</h3>
                    </div>
                    <span className="p-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold">
                    92% Redução teórica
                    </span>
                  </div>

                  {/* Pricing grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-150">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block">Investimento mensal atual</span>
                      <span className="text-lg font-black text-zinc-800 block mt-1 text-slate-700 line-through">
                        R$ {simulated.monthlyBill}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#00DB4A]/10 border border-[#00DB4A]/20">
                      <span className="text-[10px] uppercase font-extrabold text-[#00A638] block">Sua economia mensal estimada</span>
                      <span className="text-xl font-black text-[#00A638] block mt-1">
                        R$ {simulated.estimatedEconomy}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-900 text-white">
                      <span className="text-[10px] uppercase font-bold text-[#00DB4A] block">Economia Anual Líquida</span>
                      <span className="text-xl font-black text-white block mt-1">
                        R$ {simulated.estimatedAnnualEconomy.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Ecological indices */}
                  <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-150 space-y-3.5 mb-6">
                    <h5 className="text-xs font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Dimensionamento e impacto ambiental</span>
                    </h5>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
                      <div>
                        <span className="text-[11px] font-medium text-zinc-500 block">Placas necessárias</span>
                        <span className="text-lg font-bold text-zinc-800 block mt-0.5 font-display">
                          ~ {simulated.panelsCount} unidades
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] font-medium text-zinc-500 block">Carbono evitado/ano</span>
                        <span className="text-lg font-bold text-zinc-800 block mt-0.5 font-display flex items-center gap-1">
                          <Leaf className="w-4 h-4 text-[#00A638]" />
                          {simulated.co2SavedKg} Kg
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] font-medium text-zinc-500 block">Árvores plantadas eq.</span>
                        <span className="text-lg font-bold text-zinc-800 block mt-0.5 font-display">
                          {simulated.treesPlantedVal} mudas
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-200/50 flex items-center gap-2">
                      <Info className="w-3.5 h-3.5 text-zinc-400 cursor-pointer" />
                      <p className="text-[10px] text-zinc-500">
                        Cálculo baseado no índice solarimétrico de Itararé/Itapeva de 4.8 kWh/m²/dia e tarifação das bandeiras vigentes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submission call to action */}
                {!submitted && (
                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-150 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                    <div>
                      <p className="text-xs font-bold text-zinc-800">
                        Gostou dos números? Garanta seu Orçamento Premium!
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        O projeto oficial final inclui visitas técnicas gratuitas e representações 3D.
                      </p>
                    </div>

                    <button
                      onClick={handleApplyOfficialOffer}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-igreen hover:bg-igreen-dark text-black font-extrabold text-xs tracking-wide shadow flex items-center justify-center gap-1.5 transition-all hover:scale-102 cursor-pointer"
                    >
                      <span>Solicitar Estudo no WhatsApp</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
