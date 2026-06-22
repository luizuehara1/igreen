import React from 'react';
import * as Icons from 'lucide-react';
import { BENEFITS } from '../data';

export default function Benefits() {
  return (
    <section id="benefits-section" className="py-20 bg-zinc-50 border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-igreen-dark uppercase px-3 py-1 bg-igreen/20 rounded-full">
            Por que IGREEN?
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-900 tracking-tight mt-3">
            A escolha inteligente para sua energia
          </h2>
          <p className="text-sm text-zinc-500 mt-3 max-w-xl mx-auto">
            Garantimos excelência em cada detalhe do seu projeto para que você faça a transição para a energia solar com total tranquilidade e máxima rentabilidade técnica.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((benefit, idx) => {
            // Dynamically select the correct lucide vector icon
            const IconComponent = (Icons as any)[benefit.icon] || Icons.HelpCircle;

            return (
              <div
                key={idx}
                className="group relative p-8 bg-white border border-zinc-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Green accent shadow focus bar */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-igreen-dark to-igreen rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Icon Circle Container */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-900 group-hover:bg-igreen group-hover:text-black transition-colors duration-300">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-display font-bold text-zinc-800 mt-6 group-hover:text-igreen-dark transition-colors">
                    {benefit.title}
                  </h3>

                  <p className="text-sm text-zinc-500 mt-3 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Saiba mais</span>
                  <span>&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* trust badge row */}
        <div className="mt-16 text-center border-t border-zinc-200/60 pt-10">
          <p className="text-xs text-zinc-400 font-medium tracking-wide">
            NOSSO SISTEMA ESTÁ QUALIFICADO E REGULAMENTADO PELOS ÓRGÃOS COMPETENTES:
          </p>
          <div className="flex justify-center items-center flex-wrap gap-8 mt-6 grayscale opacity-60">
            <span className="font-display font-extrabold text-sm tracking-widest">ANEEL</span>
            <span className="font-sans font-bold text-sm tracking-wide">ELEKTRO</span>
            <span className="font-mono font-medium text-xs">INMETRO</span>
            <span className="font-display font-black text-sm text-emerald-800">ABGD</span>
          </div>
        </div>

      </div>
    </section>
  );
}
