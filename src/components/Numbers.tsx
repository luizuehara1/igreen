import React from 'react';
import { Award, Zap, Percent, ShieldCheck } from 'lucide-react';

interface NumbersProps {
  settings?: any;
}

export default function Numbers({ settings }: NumbersProps) {
  const stats = [
    {
      value: settings?.projectsCompleted ? `+${settings.projectsCompleted}` : '+500',
      label: 'Projetos Entregues',
      description: 'Casas, indústrias, comércios e fazendas homologadas com sucesso.',
      icon: Award,
      color: 'text-amber-500'
    },
    {
      value: settings?.totalPowerInstalled ? `+${settings.totalPowerInstalled} MWp` : '+2 MWp',
      label: 'Instalados com Sucesso',
      description: 'De potência nominal ativa instalada gerando energia renovável limpa.',
      icon: Zap,
      color: 'text-emerald-500'
    },
    {
      value: settings?.averageSavingsPercent ? `+${settings.averageSavingsPercent}%` : '+95%',
      label: 'Economia Hidroelétrica',
      description: 'Média de redução final obtida pelos clientes em Itararé e Itapeva.',
      icon: Percent,
      color: 'text-igreen-dark'
    },
    {
      value: settings?.cleanEnergyPercent ? `${settings.cleanEnergyPercent}%` : '100%',
      label: 'Energia Renovável',
      description: 'Contribuição definitiva ecológica para um futuro limpo de carbono.',
      icon: ShieldCheck,
      color: 'text-blue-500'
    }
  ];

  return (
    <section id="numbers-section" className="relative py-16 bg-zinc-900 overflow-hidden">
      {/* Decorative dark vector shapes */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-igreen/5 filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-800/60 backdrop-blur text-left flex flex-col justify-between hover:border-zinc-700 hover:scale-[1.01] transition duration-200"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-[10px] uppercase font-bold text-zinc-500">IGREEN Status</span>
                  </div>
                  
                  {/* Number Stat */}
                  <div className="text-4xl lg:text-5xl font-display font-black text-white mt-4 tracking-tight">
                    {stat.value}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-bold text-zinc-100">
                    {stat.label}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
