import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  Edit, 
  Eye, 
  Phone, 
  MapPin, 
  Calculator, 
  X, 
  Loader, 
  FileCheck,
  Send
} from 'lucide-react';
import { 
  getAllProposals, 
  createProposal, 
  updateProposal, 
  removeProposal,
  Proposal,
  ProposalInput
} from '../../services/proposals';
import { getAddressByCep } from '../../services/cep';

interface ProposalsManagerProps {
  onConvertToContract: (proposal: Proposal) => void;
  conversionQueueProposal: any | null;
  onClearConversionQueue: () => void;
}

export default function ProposalsManager({ 
  onConvertToContract, 
  conversionQueueProposal,
  onClearConversionQueue
}: ProposalsManagerProps) {
  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modais controllers
  const [newPropOpen, setNewPropOpen] = useState(false);
  const [viewProp, setViewProp] = useState<Proposal | null>(null);
  const [editProp, setEditProp] = useState<Proposal | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState<ProposalInput>({
    leadId: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: 'SP',
    propertyType: 'Residencial',
    monthlyBill: 0,
    averageConsumption: 0,
    systemPowerKwp: 4.5,
    panelsQuantity: 8,
    panelModel: 'Dah Solar 550W',
    inverterModel: 'Deye 5kW Monofásico',
    totalValue: 12500,
    entryValue: 0,
    installments: 1,
    status: 'Rascunho'
  });

  const loadProposals = async () => {
    try {
      setLoading(true);
      const data = await getAllProposals();
      setProposals(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  // Check if there is an incoming lead conversion queue triggered from LeadsManager
  useEffect(() => {
    if (conversionQueueProposal) {
      setFormData({
        leadId: conversionQueueProposal.id || '',
        clientName: conversionQueueProposal.name,
        clientPhone: conversionQueueProposal.phone,
        clientEmail: conversionQueueProposal.email || '',
        cep: conversionQueueProposal.cep || '',
        address: conversionQueueProposal.address || '',
        number: conversionQueueProposal.number || '',
        complement: conversionQueueProposal.complement || '',
        neighborhood: conversionQueueProposal.neighborhood || '',
        city: conversionQueueProposal.city,
        state: conversionQueueProposal.state || 'SP',
        propertyType: conversionQueueProposal.propertyType || 'Residencial',
        monthlyBill: conversionQueueProposal.monthlyBill,
        averageConsumption: conversionQueueProposal.averageConsumption || Math.round(conversionQueueProposal.monthlyBill * 1.1),
        systemPowerKwp: Number((conversionQueueProposal.monthlyBill * 0.0075).toFixed(2)) || 4.2,
        panelsQuantity: Math.round(conversionQueueProposal.monthlyBill * 0.012) || 8,
        panelModel: 'Astronergy 575W N-Type',
        inverterModel: 'Growatt 5000TL-X',
        totalValue: Math.round(conversionQueueProposal.monthlyBill * 18) || 12800,
        entryValue: 0,
        installments: 12,
        status: 'Rascunho'
      });
      setNewPropOpen(true);
      onClearConversionQueue(); // Consume
    }
  }, [conversionQueueProposal]);

  const handleCepLookup = async (cepVal: string, isEdit: boolean = false) => {
    const cleaned = cepVal.replace(/\D/g, '');
    if (cleaned.length === 8) {
      try {
        setCepLoading(true);
        const res = await getAddressByCep(cleaned);
        if (res) {
          const updates = {
            address: res.logradouro,
            neighborhood: res.bairro,
            city: res.localidade,
            state: res.uf
          };
          if (isEdit) {
            setEditProp(prev => prev ? { ...prev, ...updates } : null);
          } else {
            setFormData(prev => ({ ...prev, ...updates }));
          }
        }
      } catch (err: any) {
        alert(err.message || 'Falha ao recuperar endereço.');
      } finally {
        setCepLoading(false);
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.clientPhone || !formData.totalValue) {
      alert('Preencha os dados básicos obrigatórios.');
      return;
    }

    try {
      setActionLoading(true);
      await createProposal(formData);
      alert('Proposta comercial criada com sucesso!');
      setNewPropOpen(false);
      loadProposals();
    } catch (err) {
      console.error(err);
      alert('Erro ao registrar proposta.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProp || !editProp.id) return;

    try {
      setActionLoading(true);
      await updateProposal(editProp.id, editProp);
      alert('Proposta sincronizada!');
      setEditProp(null);
      loadProposals();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja apagar essa proposta definitivamente?')) {
      try {
        await removeProposal(id);
        alert('Proposta removida com sucesso.');
        setViewProp(null);
        loadProposals();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredProposals = proposals.filter(p => {
    const term = search.toLowerCase();
    const matchSearch = 
      p.clientName.toLowerCase().includes(term) ||
      p.clientPhone.includes(term) ||
      p.city.toLowerCase().includes(term);
    const matchStatus = statusFilter === '' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Rascunho': return 'bg-zinc-100 text-zinc-650 border-zinc-200';
      case 'Enviada': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Visualizada': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Aprovada': return 'bg-emerald-50 text-emerald-800 border-emerald-250';
      case 'Rejeitada': return 'bg-red-50 text-red-700 border-red-200';
      case 'Expirada': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-zinc-100 text-zinc-800';
    }
  };

  return (
    <div className="space-y-6 font-sans text-left">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight font-display uppercase">Propostas Comerciais</h2>
          <p className="text-xs text-zinc-500 font-light mt-0.5">Simulador avançado de dimensionamento, payback e prospecção técnico-financeira.</p>
        </div>

        <button
          onClick={() => {
            setFormData({
              leadId: '',
              clientName: '',
              clientPhone: '',
              clientEmail: '',
              cep: '',
              address: '',
              number: '',
              complement: '',
              neighborhood: '',
              city: '',
              state: 'SP',
              propertyType: 'Residencial',
              monthlyBill: 0,
              averageConsumption: 0,
              systemPowerKwp: 4.5,
              panelsQuantity: 8,
              panelModel: 'Dah Solar 550W',
              inverterModel: 'Deye 5kW Monofásico',
              totalValue: 12500,
              entryValue: 0,
              installments: 1,
              status: 'Rascunho'
            });
            setNewPropOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-igreen hover:bg-[#00A638] text-black font-extrabold text-xs shadow transition-all duration-155 cursor-pointer uppercase self-start"
        >
          <Plus className="w-4 h-4 text-black text-xs font-bold" />
          <span>Dimensionar Proposta</span>
        </button>
      </div>

      {/* FILTER SEARCHBAR */}
      <div className="bg-white border border-zinc-150 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nome do cliente ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-zinc-200 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 text-xs border border-zinc-200 rounded-xl focus:ring-1 focus:ring-igreen focus:outline-none font-semibold text-zinc-650"
          >
            <option value="">Status da Proposta</option>
            <option value="Rascunho">Rascunho</option>
            <option value="Enviada">Enviada</option>
            <option value="Visualizada">Visualizada</option>
            <option value="Aprovada">Aprovada</option>
            <option value="Rejeitada">Rejeitada</option>
            <option value="Expirada">Expirada</option>
          </select>

          <button 
            onClick={loadProposals} 
            className="p-2.5 border border-[#E4E4E7] rounded-xl hover:bg-zinc-50 transition"
          >
            <Loader className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* TABLE DATA GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="w-10 h-10 border-4 border-zinc-200 border-t-igreen rounded-full animate-spin" />
          <p className="text-xs text-zinc-500 font-bold">Consolidando dados das propostas...</p>
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="bg-white border border-zinc-150 p-12 rounded-2xl text-center space-y-3">
          <FileText className="w-12 h-12 text-zinc-300 mx-auto" />
          <h4 className="text-sm font-bold text-zinc-800 uppercase tracking-tight">Nenhuma Proposta Registrada</h4>
          <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">Insira novos dados de prospecção técnico comercial ou inicie a partir do funil de leads.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-150 text-zinc-502 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Cliente / Local</th>
                  <th className="p-4">Potência do Sistema</th>
                  <th className="p-4">Estrutura (Módulos)</th>
                  <th className="p-4 text-left">Valor Integrado</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 text-zinc-705">
                {filteredProposals.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/40 transition">
                    <td className="p-4">
                      <div>
                        <span className="font-bold text-zinc-900 text-sm block">{p.clientName}</span>
                        <span className="text-[10px] text-zinc-400 font-light block">{p.city} • {p.propertyType}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-zinc-800">
                      {p.systemPowerKwp} kWp
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-black">{p.panelsQuantity} placas</span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">{p.panelModel}</span>
                    </td>
                    <td className="p-4 font-mono font-black text-emerald-800 text-left">
                      R$ {Number(p.totalValue).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewProp(p)}
                          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-50 transition"
                          title="Visualizar Proposta"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditProp(p)}
                          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-50 transition"
                          title="Editar Proposta"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg border border-zinc-200 text-red-500 hover:bg-red-50 transition"
                          title="Remover Proposta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE PROPOSAL MODAL */}
      {newPropOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl border border-zinc-150 overflow-hidden shadow-2xl animate-scale-up text-left">
            <div className="p-6 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-igreen" />
                <h3 className="font-display font-black text-base uppercase">Gerar Proposta Técnico Comercial</h3>
              </div>
              <button 
                onClick={() => setNewPropOpen(false)}
                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
              
              <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 pb-1.5 step-heading">1. Identificação do Cliente</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Nome do Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome completo"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">WhatsApp de Contato *</label>
                  <input
                    type="text"
                    required
                    placeholder="(15) 99999-9999"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Endereço de E-mail</label>
                  <input
                    type="email"
                    placeholder="cliente@email.com"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

              </div>

              <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 pb-1.5 step-heading">2. Localização</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">CEP postal</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={9}
                      placeholder="18400-000"
                      value={formData.cep}
                      onChange={(e) => {
                        setFormData({...formData, cep: e.target.value});
                        handleCepLookup(e.target.value, false);
                      }}
                      className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                    />
                    {cepLoading && (
                      <Loader className="absolute right-3 top-2.5 w-4 h-4 text-zinc-400 animate-spin" />
                    )}
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Endereço de Instalação</label>
                  <input
                    type="text"
                    placeholder="Av. ou Rua de instalação"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Número</label>
                  <input
                    type="text"
                    placeholder="100"
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Complemento</label>
                  <input
                    type="text"
                    placeholder="Casa, Sala..."
                    value={formData.complement}
                    onChange={(e) => setFormData({...formData, complement: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Bairro</label>
                  <input
                    type="text"
                    placeholder="Bairro"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Cidade de Instalação</label>
                  <input
                    type="text"
                    required
                    placeholder="Itararé/Itapeva..."
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Estado</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

              </div>

              <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 pb-1.5 step-heading">3. Dimensionamento Técnico</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Tipo de Imóvel</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none"
                  >
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Rural">Rural</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Parâmetro de Conta (R$)</label>
                  <input
                    type="number"
                    value={formData.monthlyBill}
                    onChange={(e) => setFormData({...formData, monthlyBill: Number(e.target.value)})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Consumo Médio (kWh)</label>
                  <input
                    type="number"
                    value={formData.averageConsumption}
                    onChange={(e) => setFormData({...formData, averageConsumption: Number(e.target.value)})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Potência kWp do Gerador</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.systemPowerKwp}
                    onChange={(e) => setFormData({...formData, systemPowerKwp: Number(e.target.value)})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Num. Placas Solares</label>
                  <input
                    type="number"
                    value={formData.panelsQuantity}
                    onChange={(e) => setFormData({...formData, panelsQuantity: Number(e.target.value)})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Marca/Modelo Painéis</label>
                  <input
                    type="text"
                    value={formData.panelModel}
                    onChange={(e) => setFormData({...formData, panelModel: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Modelo Inversor Coletor</label>
                  <input
                    type="text"
                    value={formData.inverterModel}
                    onChange={(e) => setFormData({...formData, inverterModel: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

              </div>

              <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 pb-1.5 step-heading">4. Plano Financeiro de Aquisição</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Valor Investimento Total *</label>
                  <input
                    type="number"
                    value={formData.totalValue}
                    onChange={(e) => setFormData({...formData, totalValue: Number(e.target.value)})}
                    className="w-full text-xs font-bold border border-zinc-200 px-3 py-2 rounded-xl outline-none text-emerald-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Valor de Entrada</label>
                  <input
                    type="number"
                    value={formData.entryValue}
                    onChange={(e) => setFormData({...formData, entryValue: Number(e.target.value)})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Parcelas Restantes</label>
                  <input
                    type="number"
                    value={formData.installments}
                    onChange={(e) => setFormData({...formData, installments: Number(e.target.value)})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Estado Geral Proposta</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none"
                  >
                    <option value="Rascunho">Rascunho</option>
                    <option value="Enviada">Enviada</option>
                    <option value="Visualizada">Visualizada</option>
                    <option value="Aprovada">Aprovada</option>
                    <option value="Rejeitada">Rejeitada</option>
                    <option value="Expirada">Expirada</option>
                  </select>
                </div>

              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNewPropOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-igreen hover:bg-[#00A638] text-black font-extrabold text-xs shadow hover:scale-[1.01] transition flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <span>Calcular & Dimensionar</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* VIEW PROPOSAL SPECIFICS */}
      {viewProp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-zinc-150 overflow-hidden shadow-2xl animate-scale-up text-left">
            <div className="p-6 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-900">
              <div>
                <span className="text-[9px] font-extrabold tracking-widest text-[#00DB4A] uppercase block">Dossiê Técnico Comercial</span>
                <h3 className="font-display font-black text-base uppercase truncate max-w-sm">Proposta: {viewProp.clientName}</h3>
              </div>
              <button 
                onClick={() => setViewProp(null)}
                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-display">
                <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl">
                  <span className="text-[9px] text-zinc-450 uppercase block font-bold">Investimento</span>
                  <span className="text-sm font-black text-emerald-800 block mt-1">R$ {viewProp.totalValue.toLocaleString('pt-BR')}</span>
                </div>
                <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl">
                  <span className="text-[9px] text-zinc-450 uppercase block font-bold">Economia Mensal</span>
                  <span className="text-sm font-black text-zinc-800 block mt-1">R$ {viewProp.monthlySavings.toLocaleString('pt-BR')}</span>
                </div>
                <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl">
                  <span className="text-[9px] text-zinc-450 uppercase block font-bold">Economia Anual</span>
                  <span className="text-sm font-black text-zinc-800 block mt-1">R$ {viewProp.annualSavings.toLocaleString('pt-BR')}</span>
                </div>
                <div className="p-3 bg-[#00DB4A]/5 border border-[#00DB4A]/10 rounded-2xl">
                  <span className="text-[9px] text-zinc-500 uppercase block font-bold">Payback Estimado</span>
                  <span className="text-sm font-black text-[#00A638] block mt-1">{viewProp.paybackMonths} meses</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Dimensionamento do Gerador</h4>
                <div className="border border-zinc-150 rounded-2xl overflow-hidden p-4 space-y-3 background-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-zinc-400 block font-bold text-[10px] uppercase">Potência Instalada (kWp)</span>
                      <span className="font-bold text-zinc-800 font-mono text-sm block mt-0.5">{viewProp.systemPowerKwp} kWp</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block font-bold text-[10px] uppercase">Arranjo de Módulos (Quantidade)</span>
                      <span className="font-bold text-zinc-800 font-mono text-sm block mt-0.5">{viewProp.panelsQuantity} placas</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100">
                    <div>
                      <span className="text-zinc-400 block font-bold text-[10px] uppercase">Modelo dos Módulos</span>
                      <span className="font-semibold text-zinc-750 block mt-0.5">{viewProp.panelModel}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block font-bold text-[10px] uppercase">Modelo Inversor Principal</span>
                      <span className="font-semibold text-zinc-750 block mt-0.5">{viewProp.inverterModel}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Dados Locais de Remessa</h4>
                <div className="bg-zinc-50 p-4 border border-zinc-100 rounded-2xl text-zinc-650 flex flex-col gap-2">
                  <div><strong>Destinatário:</strong> {viewProp.clientName} ({viewProp.clientPhone})</div>
                  <div><strong>Unidade consumidora:</strong> {viewProp.address}, {viewProp.number} - {viewProp.neighborhood}, {viewProp.city}/{viewProp.state} - CEP: {viewProp.cep}</div>
                  <div><strong>Média de conta anterior:</strong> R$ {viewProp.monthlyBill} - Consumo: {viewProp.averageConsumption} kWh</div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="pt-4 border-t border-zinc-100 flex flex-wrap gap-2 justify-end">
                <a
                  href={`https://wa.me/55${viewProp.clientPhone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(viewProp.clientName)},%20aqui%20está%2520sua%20Proposta%20Solar%20da%20iGreen.%20Potência%20de%20${viewProp.systemPowerKwp}kWp,%20investimento%20total%20de%20R$%20${viewProp.totalValue.toLocaleString('pt-BR')}.%20Payback%20estimado%20em%20${viewProp.paybackMonths}%20meses.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition"
                >
                  <Send className="w-4 h-4 fill-white" />
                  <span>Enviar pelo WhatsApp</span>
                </a>

                {viewProp.status === 'Aprovada' && (
                  <button
                    onClick={() => {
                      onConvertToContract(viewProp);
                      setViewProp(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-igreen hover:bg-[#00A638] text-black font-extrabold text-xs shadow transition-all cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4 text-black" />
                    <span>Iniciar Contrato</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* EDIT PROPOSAL FORM */}
      {editProp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl border border-zinc-150 overflow-hidden shadow-2xl animate-scale-up text-left">
            <div className="p-6 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-igreen" />
                <h3 className="font-display font-black text-base uppercase">Alterar Dados Dimensionamento</h3>
              </div>
              <button 
                onClick={() => setEditProp(null)}
                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Nome do Cliente</label>
                  <input
                    type="text"
                    required
                    value={editProp.clientName}
                    onChange={(e) => setEditProp({...editProp, clientName: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={editProp.clientPhone}
                    onChange={(e) => setEditProp({...editProp, clientPhone: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Estado proposta</label>
                  <select
                    value={editProp.status}
                    onChange={(e) => setEditProp({...editProp, status: e.target.value as any})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none"
                  >
                    <option value="Rascunho">Rascunho</option>
                    <option value="Enviada">Enviada</option>
                    <option value="Visualizada">Visualizada</option>
                    <option value="Aprovada">Aprovada</option>
                    <option value="Rejeitada">Rejeitada</option>
                    <option value="Expirada">Expirada</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">CEP postal</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={9}
                      value={editProp.cep || ''}
                      onChange={(e) => {
                        setEditProp({...editProp, cep: e.target.value});
                        handleCepLookup(e.target.value, true);
                      }}
                      className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                    />
                    {cepLoading && (
                      <Loader className="absolute right-3.5 top-2.5 w-4 h-4 text-zinc-400 animate-spin" />
                    )}
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Logradouro / Endereço</label>
                  <input
                    type="text"
                    value={editProp.address || ''}
                    onChange={(e) => setEditProp({...editProp, address: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Valor Investimento (R$)</label>
                  <input
                    type="number"
                    value={editProp.totalValue}
                    onChange={(e) => setEditProp({...editProp, totalValue: Number(e.target.value)})}
                    className="w-full text-xs font-bold text-emerald-800 border border-zinc-200 px-3 py-2 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Potência mL (kWp)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editProp.systemPowerKwp}
                    onChange={(e) => setEditProp({...editProp, systemPowerKwp: Number(e.target.value)})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Conta Parâmetro (R$)</label>
                  <input
                    type="number"
                    value={editProp.monthlyBill}
                    onChange={(e) => setEditProp({...editProp, monthlyBill: Number(e.target.value)})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditProp(null)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-igreen hover:bg-[#00A638] text-black font-extrabold text-xs shadow transition-all flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <span>Sincronizar Proposta</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
