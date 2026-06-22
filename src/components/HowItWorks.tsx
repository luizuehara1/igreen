import React from 'react';
import { ClipboardList, ClipboardCheck, LayoutGrid, Hammer, Coins } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Solicite Orçamento',
      description: 'Informe seus gastos atuais através da nossa calculadora ou envie uma foto da sua conta de luz pelo WhatsApp.',
      icon: ClipboardList
    },
    {
      num: '02',
      title: 'Análise Técnica',
      description: 'Nossos engenheiros inspecionam a inclinação espacial do seu telhado, ensolação, posicionamento e tipo de disjuntores.',
      icon: ClipboardCheck
    },
    {
      num: '03',
      title: 'Projeto sob Medida',
      description: 'Elaboramos um rendering 3D do seu projeto fotovoltaico simulando a posição ideal das placas para potência limite.',
      icon: LayoutGrid
    },
    {
      num: '04',
      title: 'Instalação Ágil',
      description: 'Nossa equipe técnica realiza a fixação física do suporte, passagem de cabos e conexão do inversor homologada.',
      icon: Hammer
    },
    {
      num: '05',
      title: 'Comece a Economizar',
      description: 'Ativamos o sistema com medidor bidirecional e você começa a economizar imediatamente em até 95%.',
      icon: Coins
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-igreen-dark uppercase px-3 py-1 bg-igreen/20 rounded-full">
            Fluxo IGREEN Simplificado
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-900 tracking-tight mt-3">
            Como funciona a contratação?
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            Cuidamos de 100% do processo técnico e burocrático de forma ágil e segura, sem que você se preocupe com nada.
          </p>
        </div>

        {/* Timeline Stepper Grid */}
        <div className="relative mt-8">
          {/* Background horizontal timeline connect bar (hidden on mobile) */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-0.5 bg-zinc-100 -translate-y-12 pointer-events-none z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;

              return (
                <div key={idx} className="flex flex-col items-center text-center group">
                  {/* Step bubble wrapper */}
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-zinc-50 group-hover:bg-igreen border-4 border-white shadow-md text-zinc-800 group-hover:text-black transition-all duration-300 transform group-hover:scale-105 z-10 mb-6">
                    <IconComponent className="w-8 h-8" />
                    
                    {/* Floating Step Badge count */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-zinc-900 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white shadow">
                      {step.num}
                    </div>
                  </div>

                  <h3 className="text-base font-display font-bold text-zinc-900 mt-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed max-w-[200px]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
