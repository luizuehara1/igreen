import React, { useState } from 'react';
import { FAQS } from '../data';
import { Plus, Minus, MessageSquare } from 'lucide-react';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-20 bg-zinc-50 border-t border-zinc-150">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-[#00DB4A] uppercase px-3 py-1 bg-[#00DB4A]/10 rounded-full">
            Dúvidas Frequentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-900 tracking-tight mt-3">
            Tire suas dúvidas técnicas
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            Compilamos as principais perguntas de nossos clientes sobre a instalação, concessionárias, custos e retorno financeiro.
          </p>
        </div>

        {/* Accordions Stack */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = activeIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white border border-zinc-150 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
              >
                {/* Header Toggle Clicker */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <span className="text-base font-bold text-zinc-900 pr-4">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                    isOpen ? 'bg-igreen text-black' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {/* Collapsible Body with simple animation heights */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[300px] border-t border-zinc-100' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 text-sm text-zinc-500 leading-relaxed font-light bg-zinc-50">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA for direct contact doubt assistance */}
        <div className="mt-12 text-center p-6 bg-white border border-zinc-150 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-3 rounded-full bg-igreen/20 text-[#00DB4A]">
              <MessageSquare className="w-5 h-5 text-igreen-dark" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-950">Ficou com alguma outra dúvida específica?</p>
              <p className="text-xs text-zinc-500">Mande uma mensagem e converse com nossa engenharia sem qualquer compromisso.</p>
            </div>
          </div>
          <a
            href="https://wa.me/5515998765432?text=Ol%C3%A1%21+Tenho+d%C3%BAvidas+sobre+como+funciona+o+sistema+solar+fotovoltaico."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs tracking-wide transition cursor-pointer"
          >
            Falar pelo WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
