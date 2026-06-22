import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  FileCheck, 
  Wrench, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Sparkles,
  Percent,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { getLeadsFromFirestore } from '../../services/leads';
import { getAllProposals } from '../../services/proposals';
import { getAllContracts } from '../../services/contracts';
import { getAllProjects } from '../../services/projects';
import { getAllPayments } from '../../services/payments';

interface DashboardViewProps {
  onNavigateTab: (tab: string) => void;
}

export default function DashboardView({ onNavigateTab }: DashboardViewProps) {
  const [loading, setLoading] = useState(true);
  
  // Real datasets state lists
  const [leads, setLeads] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [lData, propData, contrData, projData, payData] = await Promise.all([
          getLeadsFromFirestore(),
          getAllProposals(),
          getAllContracts(),
          getAllProjects(),
          getAllPayments()
        ]);
        
        setLeads(lData);
        setProposals(propData);
        setContracts(contrData);
        setProjects(projData);
        setPayments(payData);
      } catch (err) {
        console.error('Erro ao recarregar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Metrics calculators
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter(l => l.status === 'Novo' || l.status === 'new').length;
  const inNegotiationLeadsCount = leads.filter(l => l.status === 'Negociação' || l.status === 'negotiation' || l.status === 'Em atendimento').length;
  
  const totalProposals = proposals.length;
  const approvedProposals = proposals.filter(p => p.status === 'Aprovada').length;
  
  const activeContractsCount = contracts.filter(c => c.status === 'Assinado').length;
  const totalContractsValue = contracts
    .filter(c => c.status === 'Assinado')
    .reduce((sum, c) => sum + (Number(c.contractValue) || 0), 0);

  const activeProjectsCount = projects.filter(p => p.status !== 'Concluído' && p.status !== 'Sistema ativado').length;
  
  const pendingPayments = payments.filter(p => p.status === 'Pendente' || p.status === 'Atrasado');
  const pendingPaymentsCount = pendingPayments.length;
  const pendingPaymentsValue = pendingPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  
  const approvedPaymentsTotalValue = payments
    .filter(p => p.status === 'Pago')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  // total proposals accumulative value
  const totalProposalsValue = proposals.reduce((sum, p) => sum + (Number(p.totalValue) || 0), 0);

  const stats = [
    {
      id: 'total-leads',
      label: 'Total de Leads',
      value: totalLeads,
      description: `${newLeadsCount} novos hoje`,
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      tab: 'leads'
    },
    {
      id: 'leads-negociacao',
      label: 'Em Negociação',
      value: inNegotiationLeadsCount,
      description: 'Atendimento consultivo ativo',
      icon: TrendingUp,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-150',
      tab: 'leads'
    },
    {
      id: 'total-propostas',
      label: 'Propostas Criadas',
      value: totalProposals,
      description: `${approvedProposals} propostas aprovadas`,
      icon: FileText,
      color: 'bg-amber-50 text-amber-600 border-amber-150',
      tab: 'propostas'
    },
    {
      id: 'valor-propostas',
      label: 'Valor Total Proposto',
      value: `R$ ${totalProposalsValue.toLocaleString('pt-BR')}`,
      description: 'Em fase consultiva/fechamento',
      icon: DollarSign,
      color: 'bg-lime-50 text-lime-600 border-lime-150',
      tab: 'propostas'
    },
    {
      id: 'contratos-ativos',
      label: 'Contratos Ativos',
      value: activeContractsCount,
      description: `R$ ${totalContractsValue.toLocaleString('pt-BR')} fechados`,
      icon: FileCheck,
      color: 'bg-[#00DB4A]/10 text-[#00A638] border-emerald-250',
      tab: 'contratos'
    },
    {
      id: 'projetos-andamento',
      label: 'Projetos em Execução',
      value: activeProjectsCount,
      description: 'Na engenharia/concessionária',
      icon: Wrench,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-150',
      tab: 'projetos'
    },
    {
      id: 'pagamentos-pendentes',
      label: 'Receitas Pendentes',
      value: `${pendingPaymentsCount} faturas`,
      description: `R$ ${pendingPaymentsValue.toLocaleString('pt-BR')} a receber`,
      icon: Clock,
      color: 'bg-red-50 text-red-600 border-red-150',
      tab: 'pagamentos'
    },
    {
      id: 'caixa-gerado',
      label: 'Caixa Total Recebido',
      value: `R$ ${approvedPaymentsTotalValue.toLocaleString('pt-BR')}`,
      description: 'Comprovado no financeiro',
      icon: DollarSign,
      color: 'bg-purple-50 text-purple-600 border-purple-150',
      tab: 'pagamentos'
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-[#00DB4A] rounded-full animate-spin" />
        <p className="text-sm font-semibold text-zinc-500">Sincronizando analytics com Firestore...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans text-left">
      
      {/* Banner Ambient Premium */}
      <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-[300px] h-full bg-gradient-to-l from-igreen/10 to-transparent pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-igreen/10 text-igreen text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider border border-igreen/20">
              CONEXÃO ESTÁVEL
            </span>
            <span className="text-zinc-500 text-xs font-semibold">• Itararé / Itapeva integradas</span>
          </div>
          <h2 className="text-2xl font-black text-white font-display tracking-tight leading-tight">
            Olá, Integrador Solar!
          </h2>
          <p className="text-xs text-zinc-400 font-light max-w-md mt-1">
            Aqui está a consolidação das simulações, propostas, comissionamentos e cronograma de homologação física das duas sedes paulistas.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 shrink-0">
          <div className="p-3 rounded-xl bg-[#00DB4A] text-black">
            <Sparkles className="w-5 h-5 fill-black" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 block uppercase">Faturamento de Conversão</span>
            <span className="text-lg font-black text-white block">
              95% de Economia
            </span>
            <span className="text-[9px] text-[#00DB4A] font-semibold flex items-center gap-1 mt-0.5">
              Máxima eficiência na redução
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.id}
              onClick={() => onNavigateTab(stat.tab)}
              className="bg-white border border-zinc-150 p-5 rounded-2xl hover:shadow-lg hover:border-zinc-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</span>
                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <IconComponent className="w-5 h-5 shrink-0" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-black text-zinc-900 tracking-tight block">
                  {stat.value}
                </span>
                <span className="text-[11px] text-zinc-500 font-medium block mt-1">
                  {stat.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lists of details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Últimos Leads */}
        <div className="bg-white border border-zinc-150 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-xs font-black uppercase text-zinc-900 font-display tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              Últimos Leads
            </h3>
            <button 
              onClick={() => onNavigateTab('leads')}
              className="text-[10px] font-extrabold uppercase text-[#00A638] hover:underline flex items-center gap-0.5"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div 
                key={lead.id} 
                className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-bold text-zinc-800 block truncate">{lead.name}</span>
                  <span className="text-[10px] text-zinc-500 block truncate">{lead.city} • {lead.phone}</span>
                </div>
                
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  lead.status === 'Novo' || lead.status === 'new' ? 'bg-emerald-50 text-emerald-800' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {lead.status || 'Novo'}
                </span>
              </div>
            ))}
            
            {leads.length === 0 && (
              <div className="text-center py-8 text-zinc-400 text-xs">Nenhum lead encontrado.</div>
            )}
          </div>
        </div>

        {/* Últimas Propostas */}
        <div className="bg-white border border-zinc-150 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-xs font-black uppercase text-zinc-900 font-display tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              Últimas Propostas
            </h3>
            <button 
              onClick={() => onNavigateTab('propostas')}
              className="text-[10px] font-extrabold uppercase text-[#00A638] hover:underline flex items-center gap-0.5"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {proposals.slice(0, 5).map((prop) => (
              <div 
                key={prop.id} 
                className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-bold text-zinc-800 block truncate">{prop.clientName}</span>
                  <span className="text-[10px] text-zinc-500 block truncate font-mono">R$ {Number(prop.totalValue).toLocaleString('pt-BR')}</span>
                </div>
                
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  prop.status === 'Aprovada' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                }`}>
                  {prop.status}
                </span>
              </div>
            ))}

            {proposals.length === 0 && (
              <div className="text-center py-8 text-zinc-400 text-xs">Nenhuma proposta cadastrada.</div>
            )}
          </div>
        </div>

        {/* Cronograma/Projetos Recentes */}
        <div className="bg-white border border-zinc-150 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-xs font-black uppercase text-zinc-900 font-display tracking-widest flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-500" />
              Projetos Recentes
            </h3>
            <button 
              onClick={() => onNavigateTab('projetos')}
              className="text-[10px] font-extrabold uppercase text-[#00A638] hover:underline flex items-center gap-0.5"
            >
              Fila Técnica <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 5).map((proj) => (
              <div 
                key={proj.id} 
                className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-bold text-zinc-800 block truncate">{proj.clientName}</span>
                  <span className="text-[10px] text-zinc-500 block truncate">{proj.technicianName} • {proj.panelsQuantity} placas</span>
                </div>
                
                <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 text-[9px] font-bold max-w-[100px] truncate">
                  {proj.status}
                </span>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="text-center py-8 text-zinc-400 text-xs">Nenhum projeto em andamento.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
