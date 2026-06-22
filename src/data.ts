import { ServiceDetail, SolarProject, BlogPost, Testimonial, FAQItem } from './types';

export const BRAND = {
  name: 'IGREEN ITARARÉ / ITAPEVA',
  whatsappNumber: '5515999999999', // Placeholder default that can be adjusted
  whatsappLink: 'https://wa.me/5515999999999?text=Ol%C3%A1%21+Gostaria+de+solicitar+um+or%C3%A7amento+para+energia+solar.',
  phone: '(15) 99876-5432',
  email: 'contato@igreenitarareitapeva.com.br',
  instagram: 'https://instagram.com/igreen_itarare_itapeva',
  address: 'Av. Paulina de Morais, 450 - Centro, Itapeva - SP | Rua XV de Novembro, 1200 - Centro, Itararé - SP',
  workingHours: 'Segunda a Sexta, das 8h às 18h | Sábado, das 8h às 12h'
};

export const BENEFITS = [
  {
    title: 'Economia de até 95%',
    description: 'Reduza drasticamente seu custo fixo mensal com eletricidade e proteja seu bolso contra os constantes aumentos de tarifas das distribuidoras.',
    icon: 'Percent'
  },
  {
    title: 'Energia limpa e sustentável',
    description: 'Gere sua própria eletricidade a partir de uma fonte 100% inesgotável e sem qualquer emissão de CO2 ou impactos ao meio ambiente.',
    icon: 'Leaf'
  },
  {
    title: 'Valorização do imóvel',
    description: 'Imóveis com sistemas fotovoltaicos integrados são altamente valorizados, com valorização estimada entre 4% a 8% no mercado imobiliário.',
    icon: 'TrendingUp'
  },
  {
    title: 'Retorno garantido (Payback)',
    description: 'O investimento médio em energia solar se paga em um período curto de 3 a 5 anos, entregando mais de 20 anos de pura economia líquida.',
    icon: 'Coins'
  },
  {
    title: 'Monitoramento inteligente',
    description: 'Acompanhe no detalhe em tempo real a produção de energia, consumo e economia gerada diretamente pelo seu celular através do nosso app.',
    icon: 'Smartphone'
  },
  {
    title: 'Instalação profissional',
    description: 'Equipe de engenharia credenciada que cuida de cada detalhe, desde o dimensionamento inicial, homologação até a ativação definitiva.',
    icon: 'ShieldCheck'
  }
];

export const SERVICES: ServiceDetail[] = [
  {
    id: 'residencial',
    title: 'Energia Solar Residencial',
    shortDescription: 'Economia máxima e sustentabilidade para você, sua família e seu lar.',
    fullDescription: 'Esqueça as surpresas nas contas de luz e as bandeiras tarifárias vermelhas. Nosso sistema residencial é sob medida para sua rotina, garantindo conforto completo para ligar ar-condicionado, chuveiros e carregar automóveis elétricos sem qualquer remorso financeiro. Valorize sua residência e traga segurança de longo prazo para quem você mais ama.',
    iconName: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1620022301489-f2ee55001757?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Economia imediata na primeira conta de energia',
      'Proteção por mais de 25 anos contra reajustes tarifários',
      'Atende casas urbanas, condomínios fechados ou chácaras',
      'Valorização imediata do valor patrimonial do seu imóvel'
    ]
  },
  {
    id: 'comercial',
    title: 'Energia Solar Comercial',
    shortDescription: 'Redução de custos operacionais fixos para aumentar a margem do seu negócio.',
    fullDescription: 'Seja você proprietário de um supermercado, loja, padaria, escola ou clínica em Itararé e Itapeva, a energia é um dos seus maiores custos operacionais. Ao investir em energia solar corporativa, você redireciona esse gasto fixo direto para a competitividade da sua empresa, expandindo margens de lucro e aliando sua marca ao selo internacional ESG de sustentabilidade.',
    iconName: 'Building2',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Redução imbatível de custos fixos, aumentando lucros líquidos',
      'Excelente ferramenta de marketing verde corporativo',
      'Crédito fiscal e benefícios fiscais estaduais/federais',
      'Linhas de financiamento solar facilitadas com juros baixos'
    ]
  },
  {
    id: 'rural',
    title: 'Energia Solar Rural',
    shortDescription: 'Autonomia energética e produtividade para o produtor agropecuário.',
    fullDescription: 'A força do agronegócio de Itapeva, Itararé e região Sul do estado precisa de soluções enérgicas confiáveis. Reduza de forma estrondosa os custos de bombeamento de água, irrigação, resfriamento de leite, silos, ordenhas automáticas e cercas elétricas. Garanta a segurança energética e estabilize sua produção independentemente das variações da concessionária regional.',
    iconName: 'Tractor',
    imageUrl: 'https://images.unsplash.com/photo-1548613053-220bfb801048?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Alimentação de alta eficiência para pivôs de irrigação',
      'Linhas especiais de crédito agrícola (BNDES, PRONAF, FCO)',
      'Imunidade contra tarifas elevadas de horário de ponta rural',
      'Sustentabilidade certificada para exportação e venda'
    ]
  },
  {
    id: 'manutencao',
    title: 'Manutenção de Sistemas Solares',
    shortDescription: 'Manutenção preventiva e corretiva para garantir o rendimento ideal.',
    fullDescription: 'Um sistema solar sujo ou com placas danificadas pode perder até 30% da sua eficiência de geração de energia sem você perceber. Oferecemos pacotes especializados de limpeza de placas, reaperto elétrico, calibração de inversores e testes de isolamento com câmeras termográficas de última geração. Mantenha seu investimento operando em escala de potência máxima.',
    iconName: 'Wrench',
    imageUrl: 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Limpeza técnica de módulos com equipamentos específicos',
      'Análise termográfica para identificação precoce de hot-spots',
      'Validação de cabos elétricos e eficiência de inversores',
      'Garantia de segurança ativa contra curtos-circuitos'
    ]
  },
  {
    id: 'projetos',
    title: 'Projetos Fotovoltaicos & Homologação',
    shortDescription: 'Sua engenharia solar de ponta a ponta sem dores de cabeça.',
    fullDescription: 'Nossos engenheiros cuidam de absolutamente toda a burocracia técnica. Elaboramos o projeto memorial descritivo, emitimos a ART (Anotação de Responsabilidade Técnica), submetemos a documentação de acesso junto à Elektro / concessionárias locais e agendamos a vistoria oficial de troca do relógio medidor bidirecional.',
    iconName: 'FileText',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Projetos elaborados estritamente sob as normas NBR e regulamentações Aneel',
      'Homologação rápida e sem exigências técnicas pendentes',
      'Gestão burocrática integral com a distribuidora regional',
      'Engenheiros altamente credenciados e com ampla experiência prática'
    ]
  },
  {
    id: 'consultoria',
    title: 'Consultoria Energética',
    shortDescription: 'Análise profunda e viabilidade tarifária para grandes consumidores.',
    fullDescription: 'Para indústrias, comércios de grande porte ou agroindústrias, a melhor tarifa nem sempre é a mais evidente. Analisamos seu histórico de consumo de energia, realizamos estudos detalhados de adequação para o Mercado Livre de Energia (ACL), migrações de grupo tarifário (Verde/Azul) e definimos o mix perfeito entre autoprodução solar e contratos.',
    iconName: 'TrendingUp',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Auditoria de faturas antigas para detectar cobranças incorretas',
      'Estudo detalhado de enquadramento de demanda contratada',
      'Viabilidade financeira apurada baseada no perfil de carga horária',
      'Suporte técnico estratégico para tomadas de decisão corporativas'
    ]
  }
];

export const PROJECTS: SolarProject[] = [
  {
    id: 'proj1',
    title: 'Residência Sustentável Jardim Alvorada',
    city: 'Itapeva',
    propertyType: 'residencial',
    panelsCount: 12,
    powerkWp: '6.6 kWp',
    monthlyEconomy: 620,
    systemType: 'Sistema On-Grid Residencial',
    imageUrl: 'https://images.unsplash.com/photo-1620022301489-f2ee55001757?auto=format&fit=crop&w=800&q=80',
    description: 'Instalação em telhado cerâmico orientada ao norte. O sistema cobre 100% do consumo contínuo de aparelhos de ar-condicionado e da piscina aquecida do cliente.'
  },
  {
    id: 'proj2',
    title: 'Supermercado Central de Itararé',
    city: 'Itararé',
    propertyType: 'comercial',
    panelsCount: 160,
    powerkWp: '88 kWp',
    monthlyEconomy: 7100,
    systemType: 'Sistema On-Grid Comercial Industrial',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
    description: 'Projeto de alta potência instalado em estrutura metálica autoportante. Reduziu drasticamente o custo do sistema de refrigeração e congelados do estabelecimento comercial.'
  },
  {
    id: 'proj3',
    title: 'Fazenda Agro Sol e Vida',
    city: 'Itapeva',
    propertyType: 'rural',
    panelsCount: 84,
    powerkWp: '46.2 kWp',
    monthlyEconomy: 3800,
    systemType: 'Sistema On-Grid Agrícola Rural',
    imageUrl: 'https://images.unsplash.com/photo-1548613053-220bfb801048?auto=format&fit=crop&w=800&q=80',
    description: 'Estruturas de fixação instaladas diretamente no solo com ângulo ideal para suprir energia do sistema de irrigação automatizado e ordenha diária de gado de leite.'
  },
  {
    id: 'proj4',
    title: 'Clínica Médica e de Bem-Estar Itapeva',
    city: 'Itapeva',
    propertyType: 'comercial',
    panelsCount: 30,
    powerkWp: '16.5 kWp',
    monthlyEconomy: 1450,
    systemType: 'Sistema On-Grid Comercial Lajes',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    description: 'Instalação executada em laje impermeabilizada com defletores de vento e fixadores de alta estabilidade para manter aparelhos médicos e ar-condicionado.'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post1',
    title: 'Mudanças nas Regras de Geração Distribuída em 2026: O que muda?',
    excerpt: 'Entenda os novos critérios regulatórios da Aneel para energia solar e como garantir os melhores benefícios financeiros antes da transição da lei.',
    content: 'O setor elétrico brasileiro vive constantes atualizações, e em 2026 as regras para compensação de créditos de energia solar seguem firmes. O principal ponto de atenção para os consumidores de Itararé e Itapeva é garantir o protocolo de solicitação de acesso o quanto antes para usufruir da máxima rentabilidade e de regras tarifárias perfeitamente pré-estabelecidas.\n\nAtualmente, quem investe em sistema solar fotovoltaico possui excelente retorno sobre o capital investido devido à taxa de reajuste constante das tarifas de energia regulares. Explicamos detalhadamente todos os impactos das novas resoluções legislativas e por que adiar esse projeto significa perder milhares de reais em economia direta mensal na sua propriedade.',
    author: 'Eng. Roberto Silva - IGREEN Co.',
    date: '15 de Junho, 2026',
    readTime: '5 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    category: 'Regulação'
  },
  {
    id: 'post2',
    title: 'Como manter o rendimento de suas placas solares no Inverno',
    excerpt: 'Descubra como o clima frio da nossa região Sul do estado afeta a eficiência dos sistemas e saiba como a manutenção ideal evita quedas na produção.',
    content: 'Itararé e Itapeva são conhecidas por registrar temperaturas mais frias durante o inverno em comparação a outras regiões do estado de São Paulo. Mas afinal, o frio atrapalha a geração fotovoltaica?\n\nA verdade surpreende: os painéis fotovoltaicos funcionam à base de LUZ, e não de calor! De fato, a condução de silício das células solares opera de forma levemente mais eficiente em temperaturas amenas do que em dias de calor escaldante, desde que haja radiação luminosa limpa.\n\nNo entanto, o inverno regional costuma acumular mais folhas, orvalho denso e poeira. Por isso, a limpeza técnica periódica das placas solares é crucial para evitar o sombreamento parcial e maximizar a captação solar durante os dias mais curtos do ano.',
    author: 'Equipe Técnica IGREEN',
    date: '02 de Maio, 2026',
    readTime: '3 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=800&q=80',
    category: 'Manutenção'
  },
  {
    id: 'post3',
    title: 'Energia Solar Rural: Vale a pena o investimento no Agro?',
    excerpt: 'Análise detalhada de custos e linhas de financiamento rurais exclusivas com juros subsidiados para produtores agrícolas em Itapeva.',
    content: 'A região sudoeste de São Paulo abriga produtores de grãos, silvicultura e pecuária leiteira extremamente competitivos. Para fazer frente às despesas de energia crescentes devido ao maquinário pesado e à irrigação, a energia solar rural surge como a principal defensiva financeira.\n\nNeste artigo, avaliamos os custos práticos de instalação em solo e silos, abordamos as carências fiscais exclusivas das linhas de financiamento rural como o PRONAF Eco, Plano Safra e BNDES Agro, e mapeamos o payback acelerado em propriedades que realizam bombeamento de água de grande porte do manancial local.',
    author: 'Consultora Energética Carla Santos',
    date: '20 de Abril, 2026',
    readTime: '7 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1548613053-220bfb801048?auto=format&fit=crop&w=800&q=80',
    category: 'Agronegócio'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'José Carlos de Souza',
    role: 'Produtor Rural',
    location: 'Itapeva - SP',
    rating: 5,
    text: 'A instalação na minha propriedade rural foi um divisor de águas. Economizo mais de R$ 3.500 todos os meses e agora ligo a irrigação sem me preocupar com o horário de pico. Recomendo fortemente a IGREEN Itapeva!',
    savingPercent: 93
  },
  {
    id: 't2',
    name: 'Mariana Antunes Rocha',
    role: 'Proprietária de Residência',
    location: 'Itararé - SP',
    rating: 5,
    text: 'Minha conta de luz que antes beirava os R$ 800 hoje vem apenas a taxa mínima de R$ 75! O atendimento foi fantástico e a homologação com a Elektro ocorreu sem qualquer complicação. Nota dez!',
    savingPercent: 91
  },
  {
    id: 't3',
    name: 'Marcos Vasconcellos',
    role: 'Diretor Geral de Panificadora',
    location: 'Itapeva - SP',
    rating: 5,
    text: 'Temos fornos elétricos grandes e câmaras frias funcionando 24 horas por dia. O projeto comercial da IGREEN se pagou em menos de 3 anos! A nossa economia agora vai toda para expansão e estoque.',
    savingPercent: 94
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'Energia solar de fato vale a pena na região de Itararé / Itapeva?',
    answer: 'Sim, totalmente! Nossa região possui ótimos índices de radiação solar o ano inteiro, mesmo com frentes frias no inverno. A redução de até 95% na conta de eletricidade compensa em altíssima velocidade o capital investido inicial, blindando você contra os reajustes anuais constantes da distribuidora Elektro.'
  },
  {
    question: 'Quanto custa para instalar um sistema solar fotovoltaico?',
    answer: 'O preço depende do perfil de consumo individual (quantos kWh são consumidos por mês). Desenvolvemos soluções customizadas que vão de pequenas residências a grandes indústrias e plantações. O sistema se paga de 3 a 5 anos e as linhas de crédito solar financiam até 100% da compra com parcelas menores que sua economia real imediata.'
  },
  {
    question: 'O que acontece em dias nublados ou sob fortes chuvas?',
    answer: 'O sistema solar continua gerando energia em dias nublados, chuvosos ou com névoa, porém com uma menor intensidade física (visto que há menos incidência direta de radiação solar). À noite, a energia gerada excedente de dia (enviada à rede de distribuição) retorna em formato de créditos para sua fatura automaticamente.'
  },
  {
    question: 'Qual a durabilidade estimada das placas e inversores?',
    answer: 'Os módulos solares (placas) possuem garantia de desempenho de fábrica de 25 anos, com perda de eficiência menor que 0,5% ao ano. Já os inversores e microinversores de excelência duram de 10 a 15 anos com manutenção básica. É um investimento altíssimo em estabilidade de longo prazo.'
  },
  {
    question: 'A IGREEN resolve toda a papelada e homologação junto à Elektro?',
    answer: 'Sim! Entregamos a solução em modelo Turn-Key (chave na mão). Cuidamos do dimensionamento técnico, elaboração de projetos assinados por engenheiros credenciados, pedido de parecer técnico naElektro, montagem profissional, testes e ativação oficial. Você só acompanha o progresso e aproveita o desconto.'
  }
];
