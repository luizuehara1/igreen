import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { BLOG_POSTS, SERVICES, PROJECTS, BRAND } from '../data';
import { BlogPost, Lead, PropertyType } from '../types';
import ResultsPage from './ResultsPage';

interface RoutePagesProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  onSimulateClick: () => void;
  settings?: any;
  whatsappLink?: string;
}

export default function RoutePages({ currentPath, onNavigate, onAddLead, onSimulateClick, settings, whatsappLink }: RoutePagesProps) {
  // Contact Form parameters
  const [contName, setContName] = useState('');
  const [contPhone, setContPhone] = useState('');
  const [contEmail, setContEmail] = useState('');
  const [contCity, setContCity] = useState('Itapeva');
  const [contProp, setContProp] = useState<PropertyType>('residencial');
  const [contMsg, setContMsg] = useState('');
  const [contSubmitted, setContSubmitted] = useState(false);

  // Filter criteria for dedicated projects page
  const [projFilter, setProjFilter] = useState<'all' | 'residencial' | 'comercial' | 'rural'>('all');

  // Selected article overlay reader
  const [readingArticle, setReadingArticle] = useState<BlogPost | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contName || !contPhone) {
      alert('Por favor, indique seu Nome e WhatsApp para entrarmos em contato.');
      return;
    }

    // Save lead in local integration
    onAddLead({
      name: contName,
      whatsapp: contPhone,
      phone: contPhone,
      email: contEmail || '',
      city: contCity,
      propertyType: contProp,
      monthlyBill: 500, // standard estimator value
      estimatedEconomy: 450,
      estimatedAnnualEconomy: 5400,
      averageConsumption: Math.round(500 * 1.1),
      message: contMsg || 'Mensagem enviada pelo formulário de contato.',
      source: 'Site IGREEN',
      status: 'Novo'
    });

    setContSubmitted(true);

    // Dynamic WhatsApp trigger
    const encText = `Olá IGREEN! Gostaria de falar com o comercial.\n\n*Nome:* ${contName}\n*Cidade:* ${contCity}\n*Assunto:* ${contMsg}`;
    setTimeout(() => {
      window.open(`https://wa.me/5515998765432?text=${encodeURIComponent(encText)}`, '_blank');
    }, 1000);
  };

  const resetContactForm = () => {
    setContName('');
    setContPhone('');
    setContEmail('');
    setContMsg('');
    setContSubmitted(false);
  };

  // Switch views based on active paths
  if (currentPath === '/resultados') {
    return (
      <ResultsPage 
        settings={settings} 
        whatsappLink={whatsappLink} 
        onNavigate={onNavigate} 
        onSimulateClick={onSimulateClick} 
      />
    );
  }

  if (currentPath === '/sobre') {
    return (
      <div className="pt-24 pb-16 bg-white animate-fade-in">
        {/* Hero Section */}
        <div className="bg-zinc-50 py-16 border-b border-zinc-100 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-widest text-igreen-dark">Nossa História</span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-zinc-900 mt-2 flex flex-wrap items-center gap-2">
              <span>Sobre a</span>
              <img 
                src="https://i.postimg.cc/QCqkVd5g/Design-sem-nome-(15).png" 
                alt="IGREEN ITARARÉ/ITAPEVA" 
                className="h-10 md:h-12 w-auto object-contain inline-block align-middle"
                referrerPolicy="no-referrer"
              />
            </h1>
            <p className="text-sm text-zinc-500 mt-3 max-w-xl leading-relaxed">
              Liderando a revolução energética fotovoltaica no Sudoeste Paulista, gerando sustentabilidade corporativa, agrícola e urbana de ponta.
            </p>
          </div>
        </div>

        {/* Content detail grids */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl font-display font-extrabold text-zinc-900">
                Engenharia de alta performance e compromisso ambiental real
              </h2>
              <p className="text-sm text-zinc-650 leading-relaxed font-light">
                A IGREEN ITARARÉ / ITAPEVA nasceu da união entre engenheiros e consultores financeiros focados na descentralização da matriz elétrica. Entendemos que pagar contas de energia caras e imprevisíveis é uma das maiores barreiras de liquidez de famílias, comércios e cooperativas agrárias.
              </p>
              <p className="text-sm text-zinc-650 leading-relaxed font-light">
                Com escritórios estratégicos estruturados nas cidades de Itararé e Itapeva, cobrimos integralmente mais de 15 municípios da região sul de São Paulo. Adotamos padrões de rigor técnico incontestáveis: utilizamos exclusivamente inversores de primeira linha com eficiência superior e módulos de silício monocristalino de altíssima conversão homologados pelo Inmetro.
              </p>

              {/* Indicators checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {['Equipe de Engenharia Própria', 'Projetos 100% Homologados', 'Ativação Rápida Elektro', 'Atendimento de Pós-Venda'].map((check) => (
                  <div key={check} className="flex items-center gap-2">
                    <Icons.CheckCircle2 className="w-5 h-5 text-igreen-dark shrink-0" />
                    <span className="text-xs font-bold text-zinc-800">{check}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Column */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-video border-4 border-white bg-zinc-100">
                <img
                  src="https://images.unsplash.com/photo-1548613053-220bfb801048?auto=format&fit=crop&w=800&q=80"
                  alt="Instalação de campo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* values block */}
              <div className="grid grid-cols-3 gap-4 mt-8 text-center">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-150">
                  <span className="text-xl">🌟</span>
                  <h4 className="text-xs font-bold text-zinc-900 mt-2">Missão</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">Tornar a energia solar acessível a qualquer classe consumidora.</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-150">
                  <span className="text-xl">🎯</span>
                  <h4 className="text-xs font-bold text-zinc-900 mt-2">Visão</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">Ser a maior distribuidora e integradora de energia do Sudoeste Paulista.</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-150">
                  <span className="text-xl">💚</span>
                  <h4 className="text-xs font-bold text-zinc-900 mt-2">Valores</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">Zelo técnico, sustentabilidade ativa e economia contínua.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPath === '/servicos' || currentPath === '/energia-solar-residencial' || currentPath === '/energia-solar-comercial' || currentPath === '/energia-solar-rural') {
    return (
      <div className="pt-24 pb-16 bg-white animate-fade-in">
        {/* Hero Section */}
        <div className="bg-zinc-50 py-16 border-b border-zinc-100 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00DB4A]">Nosso Portfólio Operacional</span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-zinc-900 mt-2">Serviços e Soluções Customizadas</h1>
            <p className="text-sm text-zinc-500 mt-3 max-w-xl leading-relaxed">
              Do dimensionamento do telhado à troca do relógio medidor da Elektro. Veja qual serviço casa perfeitamente com sua pretensão de redução.
            </p>
          </div>
        </div>

        {/* Detailed services lists */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          {SERVICES.map((s, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={s.id}
                id={`service-${s.id}`}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Visual Column */}
                <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="rounded-3xl overflow-hidden aspect-video sm:aspect-square relative shadow-lg border-2 border-white bg-zinc-100">
                    <img
                      src={s.imageUrl}
                      alt={s.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Info Text Column */}
                <div className={`lg:col-span-7 ${isEven ? 'lg:order-2' : 'lg:order-1'} space-y-5 text-left`}>
                  <div className="inline-flex items-center gap-1.5 p-1 px-3 bg-igreen/20 text-zinc-900 text-xs font-black uppercase rounded-full">
                    <span>IGREEN Elite</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900">{s.title}</h2>
                  <p className="text-sm text-zinc-650 leading-relaxed font-light">{s.fullDescription}</p>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Benefícios Inclusos</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {s.benefits.map((ben, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-1.5 p-2 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-700">
                          <Icons.Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-medium text-[11px]">{ben}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <button
                      onClick={onSimulateClick}
                      className="px-6 py-3 rounded-full bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 transition cursor-pointer"
                    >
                      Simular Economia Residencial / Comercial
                    </button>
                    <a
                      href={BRAND.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 rounded-full border border-zinc-200 text-zinc-750 font-bold text-xs hover:border-zinc-800 transition cursor-pointer"
                    >
                      Falar com Especialista
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (currentPath === '/projetos') {
    return (
      <div className="pt-24 pb-16 bg-white animate-fade-in">
        {/* Hero Banner Grid layout */}
        <div className="bg-zinc-50 py-16 border-b border-zinc-100 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00DB4A]">Nossa Engenharia na Prática</span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-zinc-900 mt-2">Nossa Galeria de Projetos</h1>
            <p className="text-sm text-zinc-500 mt-3 max-w-xl leading-relaxed">
              Confira fotos, potências ativas (kWp) e indicadores apurados das nossas centenas de homologações bem-sucedidas em Itararé, Itapeva, Apiaí, Buri e região.
            </p>
          </div>
        </div>

        {/* Categories filters for all */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
          <div className="flex bg-zinc-100 p-1 rounded-2xl max-w-sm mb-12">
            {(['all', 'residencial', 'comercial', 'rural'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setProjFilter(type)}
                className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition text-center cursor-pointer ${
                  projFilter === type
                    ? 'bg-zinc-900 text-white shadow'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {type === 'all' ? 'Ver Todos' : type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.filter(p => projFilter === 'all' || p.propertyType === projFilter).map((project) => (
              <div
                key={project.id}
                className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-zinc-200">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 p-1 px-2 rounded-md bg-white text-zinc-800 shadow font-bold text-xs">
                    📍 {project.city} - SP
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-igreen-dark tracking-wide">{project.systemType}</span>
                    <h3 className="text-lg font-display font-bold text-zinc-900 mt-1 leading-normal">{project.title}</h3>
                    <p className="text-xs text-zinc-500 mt-2.5 leading-relaxed font-light">{project.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-zinc-100 text-xs">
                    <div className="p-2 rounded bg-zinc-50 text-center">
                      <span className="text-[9px] text-zinc-400 font-medium block">POTÊNCIA</span>
                      <strong className="text-zinc-800 text-[11px]">{project.powerkWp}</strong>
                    </div>

                    <div className="p-2 rounded bg-emerald-50 text-center text-emerald-800 font-bold">
                      <span className="text-[9px] text-emerald-600 font-medium block">ECONOMIA</span>
                      <span className="text-[11px]">R$ {project.monthlyEconomy}/mês</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentPath === '/blog') {
    return (
      <div className="pt-24 pb-16 bg-white animate-fade-in text-left">
        {/* Banner */}
        <div className="bg-zinc-50 py-16 border-b border-zinc-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-widest text-igreen-dark">Educação e Notícias</span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-zinc-900 mt-2 flex flex-wrap items-center gap-2">
              <span>Canal</span>
              <img 
                src="https://i.postimg.cc/QCqkVd5g/Design-sem-nome-(15).png" 
                alt="IGREEN ITARARÉ/ITAPEVA" 
                className="h-10 md:h-12 w-auto object-contain inline-block align-middle"
                referrerPolicy="no-referrer"
              />
              <span>Solar</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-3 max-w-xl leading-relaxed">
              Mantenha-se informado sobre as tendências do mercado elétrico, novas regras da Aneel para 2026, avanços de células fotovoltaicas e dicas práticas para manutenção ideal.
            </p>
          </div>
        </div>

        {/* Blog Post List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between cursor-pointer"
                onClick={() => setReadingArticle(post)}
              >
                <div className="aspect-[16/10] w-full overflow-hidden relative bg-zinc-150">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 p-1 px-3 bg-igreen text-black font-extrabold text-[10px] rounded uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-medium pb-2">
                      <span>{post.date}</span>
                      <span>&bull;</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-base font-display font-bold text-zinc-900 mt-1 hover:text-igreen-dark leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-zinc-500 mt-2.5 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-zinc-900 hover:text-igreen-dark uppercase tracking-wide mt-6 block cursor-pointer">
                    Ler artigo completo &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Reading Article Dialog Overlays */}
        {readingArticle && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up border border-zinc-100">
              
              {/* Image Banner */}
              <div className="relative h-64 bg-zinc-800">
                <img
                  src={readingArticle.imageUrl}
                  alt={readingArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                <button
                  onClick={() => setReadingArticle(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-zinc-900 transition flex items-center justify-center cursor-pointer"
                >
                  <Icons.X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-6 left-6 pr-12">
                  <span className="p-1 px-2 bg-igreen text-black font-black text-[10px] uppercase rounded">
                    {readingArticle.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-black text-white mt-2 leading-tight">
                    {readingArticle.title}
                  </h3>
                </div>
              </div>

              {/* Body article parameters */}
              <div className="p-6 sm:p-8 overflow-y-auto max-h-[50vh] text-left">
                <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium pb-6 border-b border-zinc-100">
                  <span>Autor: <strong>{readingArticle.author}</strong></span>
                  <span>&bull;</span>
                  <span>Publicado em: <strong>{readingArticle.date}</strong></span>
                  <span>&bull;</span>
                  <span>Leitura: <strong>{readingArticle.readTime}</strong></span>
                </div>

                <div className="mt-6 text-sm text-zinc-600 leading-relaxed font-light space-y-4 whitespace-pre-line">
                  {readingArticle.content}
                </div>
              </div>

              {/* Sticky actions block */}
              <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 font-semibold uppercase">IGREEN Canal de Conhecimento</span>
                <button
                  onClick={() => setReadingArticle(null)}
                  className="px-6 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs"
                >
                  Fechar Artigo
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentPath === '/contato') {
    return (
      <div className="pt-24 pb-16 bg-white animate-fade-in text-left">
        {/* Banner */}
        <div className="bg-zinc-50 py-16 border-b border-zinc-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00DB4A]">Atendimento Local de Proximidade</span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-zinc-900 mt-2">Fale Conosco</h1>
            <p className="text-sm text-zinc-500 mt-3 max-w-xl leading-relaxed">
              Pronto para economizar? Solicite suporte imediato nas cidades sede de Itapeva, Itararé ou mande uma mensagem comercial direta.
            </p>
          </div>
        </div>

        {/* Content detail grid with form */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Columns physical locations contacts */}
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-2xl font-display font-extrabold text-zinc-900">Estação de atendimento local</h2>
              <p className="text-sm text-zinc-500 leading-relaxed font-light">
                Damos total preferência ao contato de proximidade humana. Visite uma de nossas agências comerciais físicas ou solicite uma visita na sua propriedade.
              </p>

              {/* Physical items list */}
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="p-3 bg-white text-zinc-900 rounded-xl shadow-sm">
                    <Icons.Navigation className="w-5 h-5 text-zinc-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">Nossos Endereços</h4>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
                      {BRAND.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="p-3 bg-white text-zinc-900 rounded-xl shadow-sm">
                    <Icons.PhoneCall className="w-5 h-5 text-zinc-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">Canais de Voz e WhatsApp</h4>
                    <p className="text-xs text-zinc-500 mt-1">
                      Comercial: <a href="tel:5515998765432" className="font-semibold text-zinc-800 hover:underline">{BRAND.phone}</a>
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Instagram: <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="text-igreen-dark hover:underline">@igreen_itarare_itapeva</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="p-3 bg-white text-zinc-900 rounded-xl shadow-sm">
                    <Icons.Mail className="w-5 h-5 text-zinc-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">Emails de Engenharia</h4>
                    <p className="text-xs text-zinc-500 mt-1 font-mono">
                      {BRAND.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="p-3 bg-white text-zinc-900 rounded-xl shadow-sm">
                    <Icons.Clock className="w-5 h-5 text-zinc-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">Working Hours</h4>
                    <p className="text-xs text-zinc-500 mt-1 font-medium leading-relaxed">
                      {BRAND.workingHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Columns Forms */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-150 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-zinc-950 mb-1">Mande sua mensagem de Orçamento</h3>
                <p className="text-xs text-zinc-500 mb-6">Preencha o formulário e nossa equipe responderá em menos de 1 hora.</p>
              </div>

              {!contSubmitted ? (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Seu Nome Completo</label>
                      <input
                        required
                        type="text"
                        value={contName}
                        onChange={(e) => setContName(e.target.value)}
                        placeholder="Nome Sobrenome"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Deixe seu WhatsApp</label>
                      <input
                        required
                        type="tel"
                        value={contPhone}
                        onChange={(e) => setContPhone(e.target.value)}
                        placeholder="(15) 99999-9999"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Sua Localidade</label>
                      <select
                        value={contCity}
                        onChange={(e) => setContCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
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
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Tipo da Propriedade</label>
                      <select
                        value={contProp}
                        onChange={(e) => setContProp(e.target.value as PropertyType)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                      >
                        <option value="residencial">Residencial</option>
                        <option value="comercial">Comercial</option>
                        <option value="rural">Rural</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Sua Mensagem ou Carga de consumo</label>
                    <textarea
                      rows={4}
                      value={contMsg}
                      onChange={(e) => setContMsg(e.target.value)}
                      placeholder="Exemplo: Gostaria de analisar economia de condomínio. Conta média R$ 1.200."
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800 placeholder-zinc-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Mandar solicitação de orçamento &rarr;
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <Icons.CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900">Mensagem Enviada com Sucesso!</h4>
                  <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto">
                    Seus dados foram salvos no nosso banco de dados. Você será contactado imediatamente pela nossa mesa de engenharia e estamos te linkando ao WhatsApp comercial.
                  </p>
                  <button
                    onClick={resetContactForm}
                    className="mt-6 px-6 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-lg transition"
                  >
                    Escrever Nova Mensagem
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    );
  }

  // fallback empty state
  return null;
}
