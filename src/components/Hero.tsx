import React from 'react';
import { ArrowRight, Phone, Shield, Zap, Award, Sparkles } from 'lucide-react';
import { BRAND } from '../data';

interface HeroProps {
  onSimulateClick: () => void;
  onNavigate: (path: string) => void;
  settings?: any;
  whatsappLink?: string;
}

export default function Hero({ onSimulateClick, onNavigate, settings, whatsappLink }: HeroProps) {
  return (
    <section id="hero-section" className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-white overflow-hidden">
      {/* Background soft ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-igreen/5 filter blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[300px] h-[300px] rounded-full bg-yellow-400/5 filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Left Column (5 columns width on large size) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Tag Line removed */}

            {/* Display Header */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-zinc-900 leading-[1.05] mb-6">
              {settings?.heroTitle ? (
                <span>{settings.heroTitle}</span>
              ) : (
                <>Transforme sua conta de energia em <span className="text-transparent bg-clip-text bg-gradient-to-r from-igreen-dark to-igreen leading-normal">economia</span> todos os meses.</>
              )}
            </h1>

            {/* Subheading */}
            <p className="text-lg text-zinc-600 max-w-2xl font-light mb-8 leading-relaxed">
              {settings?.heroSubtitle || "Soluções completas e homologadas em energia solar para residências, empresas e propriedades rurais em Itararé, Itapeva e região. Até 95% de desconto de forma segura, garantida e sem investimento inicial pesado."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <button
                onClick={onSimulateClick}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-base shadow-lg shadow-zinc-900/10 hover:scale-[1.02] transition cursor-pointer"
              >
                <span>{settings?.primaryCtaText || "Simular Economia Já"}</span>
                <ArrowRight className="w-5 h-5 text-igreen" />
              </button>

              <a
                href={whatsappLink || BRAND.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-zinc-200 hover:border-zinc-900 bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-base hover:scale-[1.02] transition cursor-pointer"
              >
                <Phone className="w-5 h-5 text-emerald-600" />
                <span>{settings?.secondaryCtaText || "Conversar no WhatsApp"}</span>
              </a>
            </div>

            {/* trust vectors */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-100 max-w-lg">
              <div className="flex items-center gap-2">
                <div className="p-1 px-1.5 rounded-md bg-zinc-100">
                  <Shield className="w-4 h-4 text-zinc-600" />
                </div>
                <span className="text-xs font-semibold text-zinc-700 leading-tight">Garantia de 25 anos</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1 px-1.5 rounded-md bg-zinc-100">
                  <Zap className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-xs font-semibold text-zinc-700 leading-tight">Instalação Express</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1 px-1.5 rounded-md bg-zinc-100">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-xs font-semibold text-zinc-700 leading-tight">Análise Gratuita</span>
              </div>
            </div>

          </div>

          {/* Right Column (Image + Card over layer - 5 columns wide) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Back ambient frame */}
              <div className="absolute inset-4 rounded-3xl bg-zinc-900/5 rotate-2 scale-95 pointer-events-none" />
              <div className="absolute inset-4 rounded-3xl bg-igreen/10 -rotate-3 scale-98 pointer-events-none" />

              {/* Main Image Frame with CSS shadow */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-zinc-100 aspect-square sm:aspect-[4/3] lg:aspect-square">
                <img
                  src={settings?.heroImageUrl || "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80"}
                  alt="Instalação Fotovoltaica IGREEN ITARARÉ / ITAPEVA"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/45 via-transparent to-transparent" />
              </div>

              {/* Rich Glassmorphic floating card */}
              <div className="absolute -bottom-6 -left-6 sm:bottom-4 sm:left-4 max-w-[280px] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 animate-bounce-slow">
                <div className="flex items-start gap-3">
                  <div className="p-2 h-10 w-10 rounded-xl bg-igreen text-black flex items-center justify-center font-extrabold text-lg shadow-sm">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Economia Comprovada</h4>
                    <p className="text-xs text-zinc-600 mt-1">Sistemas instalados que reduzem a fatura da Elektro para o valor mínimo legal em até 30 dias.</p>
                  </div>
                </div>
              </div>

              {/* Floating circular sticker */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 p-3.5 rounded-full shadow-lg shadow-yellow-500/20 flex flex-col items-center justify-center font-display font-extrabold text-black text-xs leading-none rotate-12">
                <span>ATÉ</span>
                <span className="text-xl font-black mt-0.5">95%</span>
                <span>DESCONTO</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
