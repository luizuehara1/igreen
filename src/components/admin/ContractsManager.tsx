import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Phone, 
  MapPin, 
  CheckCircle, 
  X, 
  Loader, 
  Wrench,
  DollarSign
} from 'lucide-react';
import { 
  getAllContracts, 
  createContract, 
  updateContract, 
  removeContract, 
  Contract,
  ContractInput
} from '../../services/contracts';
import { createProject } from '../../services/projects';
import { getAddressByCep } from '../../services/cep';

interface ContractsManagerProps {
  onConvertToProject: (contract: Contract) => void;
  conversionQueueContract: any | null;
  onClearConversionQueue: () => void;
}

export default function ContractsManager({ 
  onConvertToProject, 
  conversionQueueContract,
  onClearConversionQueue 
}: ContractsManagerProps) {

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals controllers
  const [newContractOpen, setNewContractOpen] = useState(false);
  const [viewContract, setViewContract] = useState<Contract | null>(null);
  const [editContract, setEditContract] = useState<Contract | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState<ContractInput>({
    proposalId: '',
    clientName: '',
    clientDocument: '',
    clientPhone: '',
    clientEmail: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: 'SP',
    contractValue: 0,
    paymentTerms: 'Financiamento Bancário',
    status: 'Aguardando assinatura'
  });

  const loadContracts = async () => {
    try {
      setLoading(true);
      const data = await getAllContracts();
      setContracts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  // Check incoming conversion queue from approved proposals
  useEffect(() => {
    if (conversionQueueContract) {
      setFormData({
        proposalId: conversionQueueContract.id || '',
        clientName: conversionQueueContract.clientName,
        clientDocument: '',
        clientPhone: conversionQueueContract.clientPhone,
        clientEmail: conversionQueueContract.clientEmail || '',
        cep: conversionQueueContract.cep || '',
        address: conversionQueueContract.address || '',
        number: conversionQueueContract.number || '',
        complement: conversionQueueContract.complement || '',
        neighborhood: conversionQueueContract.neighborhood || '',
        city: conversionQueueContract.city,
        state: conversionQueueContract.state || 'SP',
        contractValue: conversionQueueContract.totalValue,
        paymentTerms: conversionQueueContract.installments > 1 ? `Parcelado em ${conversionQueueContract.installments}x` : 'À Vista',
        status: 'Aguardando assinatura'
      });
      setNewContractOpen(true);
      onClearConversionQueue(); // Consume trigger
    }
  }, [conversionQueueContract]);

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
            setEditContract(prev => prev ? { ...prev, ...updates } : null);
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
    if (!formData.clientName || !formData.clientPhone || !formData.contractValue) {
      alert('Favor inserir os campos obrigatórios (Cliente, Celular, Valor).');
      return;
    }

    try {
      setActionLoading(true);
      await createContract(formData);
      alert('Ato contratual registrado com sucesso!');
      setNewContractOpen(false);
      loadContracts();
    } catch (err) {
      console.error(err);
      alert('Falha ao instanciar contrato.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContract || !editContract.id) return;

    try {
      setActionLoading(true);
      await updateContract(editContract.id, editContract);
      alert('Contrato atualizado com sucesso!');
      setEditContract(null);
      loadContracts();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deletar esse contrato?')) {
      try {
        await removeContract(id);
        alert('Contrato removido.');
        setViewContract(null);
        loadContracts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSignContract = async (contract: Contract) => {
    try {
      setActionLoading(true);
      await updateContract(contract.id, {
        status: 'Assinado',
        signedAt: new Date().toISOString()
      });
      
      // Auto initiate engineering Project!
      await createProject({
        contractId: contract.id,
        clientName: contract.clientName,
        clientPhone: contract.clientPhone,
        cep: contract.cep || '',
        address: contract.address || '',
        number: contract.number || '',
        complement: contract.complement || '',
        neighborhood: contract.neighborhood || '',
        city: contract.city,
        state: contract.state || 'SP',
        systemPowerKwp: 4.8, // defaults
        panelsQuantity: 10,
        technicianName: 'Engenharia Interna iGreen',
        scheduledDate: '',
        status: 'Contrato assinado'
      });

      alert('Contrato assinado! Um projeto de homologação de engenharia solar foi inicializado automaticamente na aba Projetos.');
      setViewContract(null);
      loadContracts();
    } catch (err) {
      console.error(err);
      alert('Erro ao homologar assinatura.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredContracts = contracts.filter(c => {
    const term = search.toLowerCase();
    const matchSearch = 
      c.clientName.toLowerCase().includes(term) ||
      c.clientPhone.includes(term) ||
      (c.clientDocument && c.clientDocument.includes(term)) ||
      c.city.toLowerCase().includes(term);
    const matchStatus = statusFilter === '' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* ACTION CORNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight font-display uppercase">Contratos Jurídicos</h2>
          <p className="text-xs text-zinc-500 font-light mt-0.5">Gestão de assinaturas, fechamento de caixa de projetos fotovoltaicos e integradores.</p>
        </div>

        <button
          onClick={() => {
            setFormData({
              proposalId: '',
              clientName: '',
              clientDocument: '',
              clientPhone: '',
              clientEmail: '',
              cep: '',
              address: '',
              number: '',
              complement: '',
              neighborhood: '',
              city: '',
              state: 'SP',
              contractValue: 0,
              paymentTerms: 'Financiamento Bancário',
              status: 'Aguardando assinatura'
            });
            setNewContractOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-igreen hover:bg-[#00A638] text-black font-extrabold text-xs shadow transition cursor-pointer uppercase self-start"
        >
          <Plus className="w-4 h-4 text-black text-xs font-bold" />
          <span>Registrar Contrato</span>
        </button>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white border border-zinc-150 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, CPF/CNPJ, cidade..."
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
            <option value="">Filtro de Assinatura</option>
            <option value="Aguardando assinatura">Aguardando Assinatura</option>
            <option value="Assinado">Assinado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* DATA GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="w-10 h-10 border-4 border-zinc-200 border-t-igreen rounded-full animate-spin" />
          <p className="text-xs text-zinc-500 font-bold">Consolidando termos de contratos...</p>
        </div>
      ) : filteredContracts.length === 0 ? (
        <div className="bg-white border border-zinc-150 p-12 rounded-2xl text-center space-y-3">
          <FileCheck className="w-12 h-12 text-zinc-300 mx-auto" />
          <h4 className="text-sm font-bold text-zinc-800 uppercase tracking-tight">Nenhum Contrato em Andamento</h4>
          <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">Emita uma proposta comercial e ative a conversão da mesma em contrato assinado.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-150 text-zinc-505 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Cliente / Unidade Consumidora</th>
                  <th className="p-4">CPF / CNPJ</th>
                  <th className="p-2">Condições de Pagamento</th>
                  <th className="p-4 text-left">Valor do Fechamento</th>
                  <th className="p-4">Assinatura</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 text-zinc-702">
                {filteredContracts.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-55/30 transition">
                    <td className="p-4">
                      <div>
                        <span className="font-bold text-zinc-900 block text-sm">{c.clientName}</span>
                        <span className="text-[10px] text-zinc-400 block">{c.city} - CEP {c.cep}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono">{c.clientDocument || 'Não informado'}</td>
                    <td className="p-2 font-semibold text-zinc-600">{c.paymentTerms}</td>
                    <td className="p-4 font-mono font-black text-emerald-800 text-left">
                      R$ {Number(c.contractValue).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${
                        c.status === 'Assinado' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewContract(c)}
                          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-50 transition"
                          title="Ficha do Contrato"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditContract(c)}
                          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-50 transition"
                          title="Editar Contrato"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 rounded-lg border border-[#E4E4E7] text-red-500 hover:bg-red-50 transition"
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

      {/* CREATE CONTRACT MODAL */}
      {newContractOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-zinc-150 overflow-hidden shadow-2xl animate-scale-up text-left">
            <div className="p-6 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-igreen" />
                <h3 className="font-display font-black text-base uppercase">Gerar Formulário Contratual</h3>
              </div>
              <button 
                onClick={() => setNewContractOpen(false)}
                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
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
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">WhatsApp *</label>
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
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">CPF / CNPJ *</label>
                  <input
                    type="text"
                    required
                    placeholder="Documento legal do cliente"
                    value={formData.clientDocument}
                    onChange={(e) => setFormData({...formData, clientDocument: e.target.value})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Email de Notificação</label>
                  <input
                    type="email"
                    placeholder="remetente@email.com"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">CEP postal</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={9}
                      value={formData.cep}
                      onChange={(e) => {
                        setFormData({...formData, cep: e.target.value});
                        handleCepLookup(e.target.value, false);
                      }}
                      className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                    />
                    {cepLoading && (
                      <Loader className="absolute right-3.5 top-2.5 w-4 h-4 text-zinc-400 animate-spin" />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Cidade de Instalação</label>
                  <input
                    type="text"
                    required
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Valor Total do Contrato (R$) *</label>
                  <input
                    type="number"
                    required
                    value={formData.contractValue}
                    onChange={(e) => setFormData({...formData, contractValue: Number(e.target.value)})}
                    className="w-full text-xs font-bold border border-zinc-200 px-3 py-2 rounded-xl text-emerald-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Termos e Condições de Pagamento</label>
                  <input
                    type="text"
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNewContractOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-igreen hover:bg-[#00A638] text-black font-extrabold text-xs shadow transition-all flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <span>Inserir Contrato</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DETAILED VIEW MODAL */}
      {viewContract && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl border border-zinc-150 overflow-hidden shadow-2xl animate-scale-up text-left">
            <div className="p-6 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-900">
              <div>
                <span className="text-[9px] font-extrabold tracking-widest text-[#00DB4A] uppercase block">Dossiê de Fechamento Jurídico</span>
                <h3 className="font-display font-black text-base uppercase truncate max-w-sm">{viewContract.clientName}</h3>
              </div>
              <button 
                onClick={() => setViewContract(null)}
                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-400 block uppercase font-bold text-[10px]">CPF / CNPJ do Titular</span>
                  <span className="font-bold text-zinc-909 block mt-0.5">{viewContract.clientDocument || 'Não preenchido'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block uppercase font-bold text-[10px]">Contato principal</span>
                  <span className="font-bold text-zinc-909 block mt-0.5">{viewContract.clientPhone}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block uppercase font-bold text-[10px]">Endereço Eletrônico</span>
                  <span className="font-semibold text-zinc-909 block mt-0.5 truncate">{viewContract.clientEmail || 'Sem email'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block uppercase font-bold text-[10px]">Localidade Sede</span>
                  <span className="font-bold text-zinc-909 block mt-0.5">{viewContract.city}, {viewContract.state || 'SP'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-display">
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <span className="text-[10px] text-emerald-800 uppercase block font-bold">Investimento Final</span>
                  <span className="text-base font-black text-emerald-950 block mt-1">R$ {viewContract.contractValue.toLocaleString('pt-BR')}</span>
                </div>
                <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-2xl">
                  <span className="text-[10px] text-zinc-500 uppercase block font-bold font-display">Opção Parcelas</span>
                  <span className="text-xs font-bold text-zinc-800 block mt-1 truncate">{viewContract.paymentTerms}</span>
                </div>
              </div>

              {viewContract.status !== 'Assinado' ? (
                <div className="bg-yellow-50 text-yellow-850 p-4 border border-yellow-200 rounded-2xl text-xs space-y-3">
                  <div className="flex gap-2 items-center">
                    <Loader className="w-4 h-4 text-yellow-600 animate-spin" />
                    <strong>Aguardando Assinatura do Cliente</strong>
                  </div>
                  <p className="font-light leading-relaxed text-[11px] text-yellow-750">
                    O documento legal está sob análise ou pendente sobre o telhado. Marcar como assinado abaixo inicializará instantaneamente a fila técnica de engenharia!
                  </p>
                  
                  <button
                    onClick={() => handleSignContract(viewContract)}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 font-extrabold text-[#ffffff] rounded-xl shadow cursor-pointer text-center text-xs block"
                  >
                    Marcar Como Assinado / Validado
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 text-emerald-850 p-4 border border-emerald-250 rounded-2xl text-xs space-y-2">
                  <div className="flex gap-2 items-center text-emerald-800 font-bold">
                    <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    <span>Contrato Assinado Digitalmente / Validado</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Assinatura homologada e confirmada em: {viewContract.signedAt ? new Date(viewContract.signedAt).toLocaleString('pt-BR') : 'Sem data'}.
                  </p>
                </div>
              )}

              <div className="text-[10px] text-zinc-400 border-t border-zinc-100 pt-4 font-mono">
                ID da Proposta Referenciada: {viewContract.proposalId || 'Documento Manual'}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editContract && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-zinc-150 overflow-hidden shadow-2xl animate-scale-up text-left">
            <div className="p-6 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-igreen" />
                <h3 className="font-display font-black text-base uppercase">Editar Termos Contrato</h3>
              </div>
              <button 
                onClick={() => setEditContract(null)}
                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Nome do Cliente</label>
                  <input
                    type="text"
                    required
                    value={editContract.clientName}
                    onChange={(e) => setEditContract({...editContract, clientName: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={editContract.clientPhone}
                    onChange={(e) => setEditContract({...editContract, clientPhone: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Valor Investimento</label>
                  <input
                    type="number"
                    value={editContract.contractValue}
                    onChange={(e) => setEditContract({...editContract, contractValue: Number(e.target.value)})}
                    className="w-full text-xs font-bold border border-zinc-200 px-3 py-2 rounded-xl text-emerald-805"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Condições de Pagamento</label>
                  <input
                    type="text"
                    value={editContract.paymentTerms}
                    onChange={(e) => setEditContract({...editContract, paymentTerms: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditContract(null)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-igreen hover:bg-[#00A638] text-black font-extrabold text-xs shadow transition-all flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <span>Sincronizar Contrato</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
