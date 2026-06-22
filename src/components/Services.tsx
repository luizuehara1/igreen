import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { SERVICES } from '../data';
import { ServiceDetail } from '../types';

interface ServicesProps {
  onSimulateClick: () => void;
}

export default function Services({ onSimulateClick }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  const getIcon = (name: string) => {
    return (Icons as any)[name] || Icons.Zap;
  };

  return (
    <section id="services-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-igreen-dark uppercase px-3 py-1 bg-igreen/20 rounded-full">
            Nossos Serviços Elites
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-900 tracking-tight mt-3">
            Soluções completas de ponta a ponta
          </h2>
          <p className="text-sm text-zinc-500 mt-2 max-w-xl mx-auto">
            Oferecemos toda a cadeia de engenharia solar e inteligência energética. Escolha a solução ideal sob medida para seu consumo atual.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => {
            const Icon = getIcon(service.iconName);

            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between bg-zinc-50 hover:bg-white rounded-3xl overflow-hidden border border-zinc-150 hover:shadow-2xl transition-all duration-300"
              >
                {/* Image Aspect ratio 4:3 */}
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-zinc-100">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-950/40 to-transparent" />
                  
                  {/* Floating Icon Badges */}
                  <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white text-zinc-900 shadow shadow-zinc-900/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-zinc-800" />
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-display font-bold text-zinc-900 group-hover:text-igreen-dark transition">
                      {service.title}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-2.5 leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="mt-8 pt-4 border-t border-zinc-200/50 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedService(service)}
                      className="text-xs font-bold text-zinc-900 hover:text-igreen-dark uppercase tracking-wide transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver Benefícios completos</span>
                      <span>&rarr;</span>
                    </button>
                    <span className="text-[10px] uppercase font-bold text-zinc-400">IGREEN Solar</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Service Expansion */}
        {selectedService && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-up border border-zinc-100">
              
              {/* Photo Banner */}
              <div className="relative h-48 bg-zinc-800">
                <img
                  src={selectedService.imageUrl}
                  alt={selectedService.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 to-transparent" />
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-zinc-900 transition flex items-center justify-center"
                >
                  <Icons.X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6">
                  <span className="flex items-center gap-1.5 p-1 px-2.5 rounded-md bg-igreen text-black font-extrabold text-[10px] uppercase tracking-wider">
                    {selectedService.id}
                  </span>
                  <h3 className="text-2xl font-display font-black text-white mt-1">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  {selectedService.fullDescription}
                </p>

                <h4 className="text-sm font-bold uppercase text-zinc-900 mt-6 tracking-wide flex items-center gap-1.5">
                  <Icons.CheckCircle className="w-4 h-4 text-igreen-dark" />
                  <span>Vantagens Principais</span>
                </h4>

                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedService.benefits.map((benefit, bIdx) => (
                    <li
                      key={bIdx}
                      className="p-3 rounded-xl bg-zinc-50 border border-zinc-150 text-xs font-semibold text-zinc-700 flex items-start gap-2"
                    >
                      <Icons.Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal Footer actions */}
              <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-5 py-2 rounded-xl text-zinc-500 hover:text-zinc-800 text-xs font-bold transition cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  onClick={() => {
                    setSelectedService(null);
                    onSimulateClick();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-igreen hover:bg-igreen-dark text-black font-bold text-xs shadow-md shadow-igreen/20 transition cursor-pointer"
                >
                  Simular este Projeto
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
