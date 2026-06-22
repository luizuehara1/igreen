import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Trash2, 
  Edit, 
  Eye, 
  RefreshCw,
  Loader,
  X,
  FileSpreadsheet,
  Download,
  DollarSign,
  Briefcase,
  Zap
} from 'lucide-react';
import { 
  getLeadsFromFirestore, 
  createLeadInFirestore, 
  updateLeadDetailed, 
  deleteLeadFromFirestore,
  LeadDetailed
} from '../../services/leads';
import { getAddressByCep } from '../../services/cep';

interface LeadsManagerProps {
  onConvertToProposal: (lead: LeadDetailed) => void;
}

export default function LeadsManager({ onConvertToProposal }: LeadsManagerProps) {
  const [leads, setLeads] = useState<LeadDetailed[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Advanced filters
  const [statusFilter, setStatusFilter] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // Modal controllers
  const [viewLead, setViewLead] = useState<LeadDetailed | null>(null);
  const [editLead, setEditLead] = useState<LeadDetailed | null>(null);
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [cepSearchLoading, setCepSearchLoading] = useState(false);

  // Form states for creating a new lead
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cpfCnpj: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: 'SP',
    propertyType: 'Residencial',
    monthlyBill: 0,
    message: '',
    source: 'Cadastro Manual',
    status: 'Novo Lead',
    assignedTo: ''
  });

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeadsFromFirestore();
      setLeads(data);
    } catch (e) {
      console.error('Falha ao carregar leads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleCepLookup = async (cepVal: string, isEdit: boolean = false) => {
    const cleaned = cepVal.replace(/\D/g, '');
    if (cleaned.length === 8) {
      try {
        setCepSearchLoading(true);
        const res = await getAddressByCep(cleaned);
        if (res) {
          const updates = {
            address: res.logradouro || '',
            neighborhood: res.bairro || '',
            city: res.localidade || '',
            state: res.uf || 'SP',
          };
          if (isEdit) {
            setEditLead(prev => prev ? { ...prev, ...updates } : null);
          } else {
            setFormData(prev => ({ ...prev, ...updates }));
          }
        }
      } catch (err: any) {
        console.error('Erro de CEP:', err);
      } finally {
        setCepSearchLoading(false);
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city) {
      alert('Por favor, preencha os campos obrigatórios (Nome, WhatsApp, Cidade).');
      return;
    }

    try {
      setActionLoading(true);
      const billValue = Number(formData.monthlyBill) || 0;
      const calculatedSavingsMonthly = Math.round(billValue * 0.9);
      const calculatedSavingsAnnual = Math.round(calculatedSavingsMonthly * 12);

      await createLeadInFirestore({
        ...formData,
        monthlyBill: billValue,
        estimatedMonthlySavings: calculatedSavingsMonthly,
        estimatedAnnualSavings: calculatedSavingsAnnual,
        averageConsumption: Math.round(billValue * 1.1)
      });
      alert('Lead inserido com sucesso!');
      setNewLeadOpen(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        cpfCnpj: '',
        cep: '',
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: 'SP',
        propertyType: 'Residencial',
        monthlyBill: 0,
        message: '',
        source: 'Cadastro Manual',
        status: 'Novo Lead',
        assignedTo: ''
      });
      loadLeads();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar lead.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLead || !editLead.id) return;

    try {
      setActionLoading(true);
      const billVal = Number(editLead.monthlyBill) || 0;
      const savMonthly = Math.round(billVal * 0.9);
      const savAnnual = Math.round(savMonthly * 12);
      const averageCons = editLead.averageConsumption || Math.round(billVal * 1.1);

      await updateLeadDetailed(editLead.id, {
        ...editLead,
        monthlyBill: billVal,
        estimatedMonthlySavings: savMonthly,
        estimatedAnnualSavings: savAnnual,
        averageConsumption: averageCons
      });
      alert('Lead atualizado com sucesso!');
      setEditLead(null);
      loadLeads();
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar lead.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza de que deseja excluir este lead?')) {
      try {
        await deleteLeadFromFirestore(id);
        alert('Lead removido com sucesso.');
        setViewLead(null);
        loadLeads();
      } catch (err) {
        console.error(err);
        alert('Falha ao remover lead.');
      }
    }
  };

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      alert('Nenhum lead encontrado com os filtros atuais para exportação.');
      return;
    }
    
    // Headings
    const headings = [
      'ID', 'Nome', 'WhatsApp/Telefone', 'Email', 'CPF/CNPJ', 'CEP', 'Endereço', 
      'Número', 'Bairro', 'Cidade', 'Estado', 'Tipo de Imóvel', 
      'Conta Mensal (R$)', 'Economia Mensal Est. (R$)', 'Economia Anual Est. (R$)', 
      'Status', 'Consultor', 'Origem', 'Cadastrado em'
    ];
    
    const rows = filteredLeads.map(l => [
      l.id || '',
      l.name,
      l.phone,
      l.email || '',
      l.cpfCnpj || '',
      l.cep || '',
      l.address || '',
      l.number || '',
      l.neighborhood || '',
      l.city,
      l.state || 'SP',
      l.propertyType,
      l.monthlyBill,
      l.estimatedMonthlySavings !== undefined ? l.estimatedMonthlySavings : Math.round(l.monthlyBill * 0.9),
      l.estimatedAnnualSavings !== undefined ? l.estimatedAnnualSavings : Math.round(l.monthlyBill * 0.9) * 12,
      l.status,
      l.assignedTo || '',
      l.source,
      l.createdAt ? new Date(l.createdAt).toLocaleString('pt-BR') : ''
    ]);
    
    const csvContent = [
      headings.join(';'),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(';'))
    ].join('\n');
    
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_igreen_itarare_itapeva_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search computings
  const filteredLeads = leads.filter(l => {
    const term = search.toLowerCase();
    const nameMatch = l.name.toLowerCase().includes(term);
    const phoneMatch = l.phone.includes(term);
    const cityMatch = l.city.toLowerCase().includes(term);
    const emailMatch = l.email ? l.email.toLowerCase().includes(term) : false;
    const matchesSearch = nameMatch || phoneMatch || cityMatch || emailMatch;
    
    const matchesStatus = statusFilter === '' || l.status === statusFilter;
    const matchesProperty = propertyFilter === '' || l.propertyType === propertyFilter;
    const matchesCity = cityFilter === '' || l.city.toLowerCase() === cityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesProperty && matchesCity;
  });

  // Extract unique cities from all loaded leads for easy filtering
  const uniqueCities = Array.from(new Set(leads.map(l => l.city.trim()))).filter(Boolean);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Novo Lead': 
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Contactado': 
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Em Negociação': 
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Simulação Aprovada': 
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Proposta Enviada': 
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Fechado': 
        return 'bg-green-50 text-green-700 border-green-250';
      case 'Perdido': 
        return 'bg-red-50 text-red-700 border-red-200';
      default: 
        return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Top Banner Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-zinc-950 tracking-tight font-display uppercase flex items-center gap-2">
            <Users className="w-5 h-5 text-igreen" />
            <span>Painel Administrativo de Leads</span>
          </h2>
          <p className="text-xs text-zinc-500 font-light mt-0.5">
            Gerencie e processe as simulações e cadastros efetuados de forma 100% segura com persistência no Firestore.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* CSV Download Trigger */}
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-750 font-bold text-xs shadow-sm transition cursor-pointer"
            title="Exportar dados para Excel/CSV"
          >
            <Download className="w-4 h-4 text-zinc-500" />
            <span>Exportar CSV</span>
          </button>

          {/* Create manually button */}
          <button
            onClick={() => setNewLeadOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-igreen hover:bg-igreen-dark text-black font-extrabold text-xs shadow transition cursor-pointer uppercase"
          >
            <Plus className="w-4 h-4 text-black font-bold" />
            <span>Cadastrar Lead</span>
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-zinc-150 p-5 rounded-2xl shadow-sm space-y-4">
        
        {/* Search Input bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Pesquise por nome, telefone, estado, cidade ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-zinc-200 rounded-xl focus:ring-1 focus:ring-igreen focus:border-igreen outline-none text-zinc-800"
          />
        </div>

        {/* Action Select filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Filtrar por Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl outline-none bg-white text-zinc-700 font-medium"
            >
              <option value="">Todos os Status</option>
              <option value="Novo Lead">Novo Lead</option>
              <option value="Contactado">Contactado</option>
              <option value="Em Negociação">Em Negociação</option>
              <option value="Simulação Aprovada">Simulação Aprovada</option>
              <option value="Proposta Enviada">Proposta Enviada</option>
              <option value="Fechado">Fechado</option>
              <option value="Perdido">Perdido</option>
            </select>
          </div>

          {/* Property Type Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Tipo do Imóvel</label>
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl outline-none bg-white text-zinc-700 font-medium"
            >
              <option value="">Qualquer Tipo</option>
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
              <option value="Rural">Rural</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>

          {/* City Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Filtrar por Cidade</label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl outline-none bg-white text-zinc-700 font-medium"
            >
              <option value="">Todas as Cidades</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Main Grid statistics summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-4 bg-white border border-zinc-150 rounded-2xl shadow-sm text-left">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Total Filtrado</span>
          <span className="block text-2xl font-black text-zinc-950 mt-1">{filteredLeads.length}</span>
        </div>

        <div className="p-4 bg-white border border-zinc-150 rounded-2xl shadow-sm text-left">
          <span className="text-[10px] text-emerald-500 font-bold uppercase">Fechado / Ativos</span>
          <span className="block text-2xl font-black text-emerald-600 mt-1">
            {filteredLeads.filter(l => l.status === 'Fechado').length}
          </span>
        </div>

        <div className="p-4 bg-white border border-zinc-150 rounded-2xl shadow-sm text-left">
          <span className="text-[10px] text-igreen font-bold uppercase">Meta de Economia Est.</span>
          <span className="block text-lg font-black text-zinc-900 mt-1 truncate">
            R$ {filteredLeads.reduce((acc, current) => acc + (current.estimatedMonthlySavings || Math.round(current.monthlyBill * 0.9)), 0).toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="p-4 bg-white border border-zinc-150 rounded-2xl shadow-sm text-left">
          <span className="text-[10px] text-purple-500 font-bold uppercase">Propostas Enviadas</span>
          <span className="block text-2xl font-black text-purple-600 mt-1">
            {filteredLeads.filter(l => l.status === 'Proposta Enviada').length}
          </span>
        </div>

      </div>

      {/* Table Data list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-zinc-200 border-t-igreen rounded-full animate-spin" />
          <p className="text-xs text-zinc-500 font-semibold">Carregando dados estruturados do Firestore...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white border border-zinc-150 p-16 rounded-2xl text-center space-y-3">
          <Users className="w-12 h-12 text-zinc-300 mx-auto" />
          <h4 className="text-sm font-bold text-zinc-800 uppercase tracking-tight">Nenhum Lead Encontrado</h4>
          <p className="text-xs text-zinc-400 font-light max-w-xs mx-auto">
            Não há nenhum registro gravado no Firestore que corresponda à busca configurada.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-150 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4 font-display">Nome do Lead / Cidade</th>
                  <th className="p-4 font-display">Contato WhatsApp</th>
                  <th className="p-4 font-display">Imóvel</th>
                  <th className="p-4 font-display">Valor da Conta</th>
                  <th className="p-4 font-display">Economia Estimada</th>
                  <th className="p-4 font-display">Status / Funil</th>
                  <th className="p-4 font-display text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {filteredLeads.map((lead) => {
                  const calculatedMonthlySavings = lead.estimatedMonthlySavings !== undefined ? lead.estimatedMonthlySavings : Math.round(lead.monthlyBill * 0.9);
                  const calculatedAnnualSavings = lead.estimatedAnnualSavings !== undefined ? lead.estimatedAnnualSavings : Math.round(calculatedMonthlySavings * 12);
                  return (
                    <tr key={lead.id} className="hover:bg-zinc-50/50 transition">
                      <td className="p-4">
                        <div>
                          <span className="font-bold text-zinc-950 block text-sm">{lead.name}</span>
                          <span className="text-[10px] text-zinc-400 font-medium block">{lead.city} • {lead.state || 'SP'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="font-semibold text-zinc-850 block">{lead.phone}</span>
                          {lead.email && <span className="text-[10px] text-zinc-400 block max-w-[150px] truncate">{lead.email}</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-zinc-100 text-zinc-750 px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px]">
                          {lead.propertyType}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-zinc-900">
                        R$ {lead.monthlyBill.toLocaleString('pt-BR')}
                      </td>
                      <td className="p-4">
                        <div className="text-left font-mono">
                          <span className="text-[11px] font-bold text-emerald-600 block">R$ {calculatedMonthlySavings.toLocaleString('pt-BR')}/mês</span>
                          <span className="text-[9px] text-zinc-400 block">Anual: R$ {calculatedAnnualSavings.toLocaleString('pt-BR')}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-extrabold block text-center whitespace-nowrap ${getStatusBadge(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Quick details button */}
                          <button
                            onClick={() => setViewLead(lead)}
                            className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition cursor-pointer"
                            title="Ver Ficha Completa"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => setEditLead(lead)}
                            className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition cursor-pointer"
                            title="Editar Dados"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete action */}
                          <button
                            onClick={() => handleDelete(lead.id || '')}
                            className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition cursor-pointer"
                            title="Excluir Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CADASTRO MANUAL DE LEAD */}
      {newLeadOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-zinc-150 overflow-hidden shadow-2xl animate-scale-up text-left">
            <div className="p-5 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-igreen" />
                <h3 className="font-display font-black text-sm uppercase">Cadastrar Novo Lead</h3>
              </div>
              <button 
                onClick={() => setNewLeadOpen(false)}
                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Nome */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Nome do lead *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome completo ou empresa"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800 bg-white"
                  />
                </div>

                {/* Telefone/WhatsApp */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="(15) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800 bg-white"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Endereço de E-mail</label>
                  <input
                    type="email"
                    placeholder="exemplo@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800 bg-white"
                  />
                </div>

                {/* CPF/CNPJ */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Documento (CPF / CNPJ)</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpfCnpj}
                    onChange={(e) => setFormData({...formData, cpfCnpj: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800 bg-white"
                  />
                </div>

                {/* CEP */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">CEP (Preenchimento automático)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="18460-000"
                      maxLength={9}
                      value={formData.cep}
                      onChange={(e) => {
                        setFormData({...formData, cep: e.target.value});
                        handleCepLookup(e.target.value, false);
                      }}
                      className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800 bg-white"
                    />
                    {cepSearchLoading && (
                      <Loader className="absolute right-3 top-2 w-4 h-4 text-zinc-400 animate-spin" />
                    )}
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Endereço / Logradouro</label>
                  <input
                    type="text"
                    placeholder="Rua ou avenida"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

                {/* Bairro */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Bairro</label>
                  <input
                    type="text"
                    placeholder="Nome do bairro"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

                {/* Número do imóvel */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Número</label>
                    <input
                      type="text"
                      placeholder="Nº"
                      value={formData.number}
                      onChange={(e) => setFormData({...formData, number: e.target.value})}
                      className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Complemento</label>
                    <input
                      type="text"
                      placeholder="Bloco / Apto"
                      value={formData.complement}
                      onChange={(e) => setFormData({...formData, complement: e.target.value})}
                      className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                    />
                  </div>
                </div>

                {/* Cidade */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Cidade de residência *</label>
                  <input
                    type="text"
                    required
                    placeholder="Itararé, Itapeva..."
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

                {/* Status Inicial */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Status do Lead</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none bg-white text-zinc-700"
                  >
                    <option value="Novo Lead">Novo Lead</option>
                    <option value="Contactado">Contactado</option>
                    <option value="Em Negociação">Em Negociação</option>
                    <option value="Simulação Aprovada">Simulação Aprovada</option>
                    <option value="Proposta Enviada">Proposta Enviada</option>
                    <option value="Fechado">Fechado</option>
                    <option value="Perdido">Perdido</option>
                  </select>
                </div>

                {/* Tipo de Imóvel */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Tipo de Imóvel</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none bg-white text-zinc-700"
                  >
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Rural">Rural</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>

                {/* Conta Média */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Média de Conta Mensal (R$)</label>
                  <input
                    type="number"
                    placeholder="Ex: 500"
                    value={formData.monthlyBill || ''}
                    onChange={(e) => setFormData({...formData, monthlyBill: Number(e.target.value)})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

                {/* Consultor */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Consultor Responsável</label>
                  <input
                    type="text"
                    placeholder="Nome do consultor"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

                {/* Mensagens / Observações */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Observações / Mensagens</label>
                  <textarea
                    rows={2}
                    placeholder="Anotações sobre a conta ou telhado..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] p-3 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNewLeadOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-igreen hover:bg-igreen-dark text-black font-extrabold text-xs shadow hover:scale-[1.01] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin animate-spin-slow" /> : <span>Inserir Lead</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETALHES COMPLETOS DO LEAD */}
      {viewLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl border border-zinc-150 overflow-hidden shadow-2xl animate-scale-up text-left">
            <div className="p-5 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-900">
              <div>
                <span className="text-[9px] font-extrabold tracking-widest text-[#00DB4A] uppercase block">Dossiê Completo</span>
                <h3 className="font-display font-black text-sm uppercase truncate max-w-sm">{viewLead.name}</h3>
              </div>
              <button 
                onClick={() => setViewLead(null)}
                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Contatos Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold">Contato principal</span>
                  <span className="font-bold text-zinc-900 block mt-0.5">{viewLead.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold">E-mail</span>
                  <span className="font-bold text-zinc-900 block mt-0.5 select-all">{viewLead.email || 'Não informado'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold">Cidade</span>
                  <span className="font-bold text-zinc-900 block mt-0.5">{viewLead.city} • {viewLead.state || 'SP'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold">CPF/CNPJ</span>
                  <span className="font-bold text-zinc-900 block mt-0.5 truncate">{viewLead.cpfCnpj || 'Não informado'}</span>
                </div>
              </div>

              {/* Endereço */}
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-xs text-zinc-700">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-455" />
                  <span>Endereço de Carga</span>
                </span>
                <div>
                  <span>{viewLead.address || 'Sem logradouro'} {viewLead.number && `, Nº ${viewLead.number}`}</span>
                  <span className="block text-[11px] text-zinc-400 mt-1">
                    {viewLead.neighborhood && `${viewLead.neighborhood} • `} CEP: {viewLead.cep || 'Sem CEP'}
                    {viewLead.complement && ` (${viewLead.complement})`}
                  </span>
                </div>
              </div>

              {/* Parâmetros e cálculos financeiros */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-center">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-bold">Valor da Conta</span>
                  <span className="text-sm font-black text-zinc-900 block mt-1">R$ {viewLead.monthlyBill}</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                  <span className="text-[9px] text-emerald-600 uppercase tracking-wider block font-bold">Economia /mês</span>
                  <span className="text-sm font-black text-emerald-700 block mt-1">
                    R$ {(viewLead.estimatedMonthlySavings !== undefined ? viewLead.estimatedMonthlySavings : Math.round(viewLead.monthlyBill * 0.9)).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="p-3 bg-cyan-50 border border-cyan-150 rounded-2xl text-center">
                  <span className="text-[9px] text-cyan-600 uppercase tracking-wider block font-bold">Economia Anual</span>
                  <span className="text-sm font-black text-cyan-700 block mt-1">
                    R$ {(viewLead.estimatedAnnualSavings !== undefined ? viewLead.estimatedAnnualSavings : Math.round(viewLead.monthlyBill * 0.9) * 12).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Tipo de imóvel e consumo */}
              <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl text-xs border border-zinc-100">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500/10" />
                  <span className="font-semibold text-zinc-650">Consumo Projetado:</span>
                </div>
                <span className="font-mono font-bold text-zinc-800">{viewLead.averageConsumption || Math.round(viewLead.monthlyBill * 1.1)} kWh/mês</span>
              </div>

              {/* Observação */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Observações / Histórico</span>
                <p className="bg-zinc-50 p-4 rounded-xl text-zinc-600 border border-zinc-100 font-light leading-relaxed whitespace-pre-line">
                  {viewLead.message || 'Sem anotações complementares registradas.'}
                </p>
              </div>

              {/* Metadados */}
              <div className="flex justify-between items-center text-[10px] text-zinc-400 border-t border-zinc-100 pt-4 font-mono">
                <span>Data Cadastro: {new Date(viewLead.createdAt || '').toLocaleString('pt-BR')}</span>
                <span>Origem: {viewLead.source || 'Site'}</span>
              </div>

              {/* Ações */}
              <div className="pt-4 border-t border-zinc-100 flex flex-wrap gap-2 justify-end">
                {/* Whatsapp Link CTA */}
                <a
                  href={`https://wa.me/55${viewLead.phone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(viewLead.name)},%20sou%20integrador%20da%20IGREEN%20Itararé/Itapeva.%20Seja%20muito%20bem-vindo(a)!%20Recebi%2520sua%252520simula%252525C3%252525A3o%25252520solar.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow transition duration-150 cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  <span>Chamar no WhatsApp</span>
                </a>

                {/* Converter pra Proposta */}
                <button
                  onClick={() => {
                    onConvertToProposal(viewLead);
                    setViewLead(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-igreen hover:bg-[#00A638] text-black font-extrabold text-xs shadow transition cursor-pointer"
                >
                  <span>Gerar Proposta Comercial</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR REGISTRO DO LEAD */}
      {editLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-zinc-150 overflow-hidden shadow-2xl animate-scale-up text-left">
            <div className="p-5 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-igreen" />
                <h3 className="font-display font-black text-sm uppercase">Editar Cadastro do Lead</h3>
              </div>
              <button 
                onClick={() => setEditLead(null)}
                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Nome */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Nome do lead *</label>
                  <input
                    type="text"
                    required
                    value={editLead.name}
                    onChange={(e) => setEditLead({...editLead, name: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={editLead.phone}
                    onChange={(e) => setEditLead({...editLead, phone: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">E-mail</label>
                  <input
                    type="email"
                    value={editLead.email || ''}
                    onChange={(e) => setEditLead({...editLead, email: e.target.value})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

                {/* DOCUMENT */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">CPF / CNPJ</label>
                  <input
                     type="text"
                     value={editLead.cpfCnpj || ''}
                     onChange={(e) => setEditLead({...editLead, cpfCnpj: e.target.value})}
                     className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

                {/* CEP Auto lookup */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">CEP Postal</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={9}
                      value={editLead.cep || ''}
                      onChange={(e) => {
                        setEditLead({...editLead, cep: e.target.value});
                        handleCepLookup(e.target.value, true);
                      }}
                      className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                    />
                    {cepSearchLoading && (
                      <Loader className="absolute right-3 top-2 w-4 h-4 text-zinc-400 animate-spin" />
                    )}
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Endereço</label>
                  <input
                    type="text"
                    value={editLead.address || ''}
                    onChange={(e) => setEditLead({...editLead, address: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

                {/* Bairro */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Bairro</label>
                  <input
                    type="text"
                    value={editLead.neighborhood || ''}
                    onChange={(e) => setEditLead({...editLead, neighborhood: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

                {/* Numero / Complemento */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Número</label>
                    <input
                      type="text"
                      value={editLead.number || ''}
                      onChange={(e) => setEditLead({...editLead, number: e.target.value})}
                      className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800 animate-fade-in"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Complemento</label>
                    <input
                      type="text"
                      value={editLead.complement || ''}
                      onChange={(e) => setEditLead({...editLead, complement: e.target.value})}
                      className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800 animate-fade-in"
                    />
                  </div>
                </div>

                {/* Cidade */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Cidade *</label>
                  <input
                    type="text"
                    required
                    value={editLead.city}
                    onChange={(e) => setEditLead({...editLead, city: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Status do lead</label>
                  <select
                    value={editLead.status}
                    onChange={(e) => setEditLead({...editLead, status: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl bg-white text-zinc-700 font-bold"
                  >
                    <option value="Novo Lead">Novo Lead</option>
                    <option value="Contactado">Contactado</option>
                    <option value="Em Negociação">Em Negociação</option>
                    <option value="Simulação Aprovada">Simulação Aprovada</option>
                    <option value="Proposta Enviada">Proposta Enviada</option>
                    <option value="Fechado">Fechado</option>
                    <option value="Perdido">Perdido</option>
                  </select>
                </div>

                {/* Tipo Imóvel */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Tipo de Imóvel</label>
                  <select
                    value={editLead.propertyType}
                    onChange={(e) => setEditLead({...editLead, propertyType: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl bg-white text-zinc-700 font-bold"
                  >
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Rural">Rural</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>

                {/* Conta Média */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Conta Mensal (R$)</label>
                  <input
                    type="number"
                    value={editLead.monthlyBill}
                    onChange={(e) => setEditLead({...editLead, monthlyBill: Number(e.target.value)})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

                {/* Consultor */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Consultor Responsível</label>
                  <input
                    type="text"
                    value={editLead.assignedTo || ''}
                    onChange={(e) => setEditLead({...editLead, assignedTo: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

                {/* Mensagens */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Observações do Lead</label>
                  <textarea
                    rows={2}
                    value={editLead.message || ''}
                    onChange={(e) => setEditLead({...editLead, message: e.target.value})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] p-3 rounded-xl focus:ring-1 focus:ring-igreen outline-none text-zinc-800"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditLead(null)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-igreen hover:bg-[#00A638] text-black font-extrabold text-xs shadow hover:scale-[1.01] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <span>Atualizar Lead</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
