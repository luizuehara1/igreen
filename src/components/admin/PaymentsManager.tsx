import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  CheckCircle, 
  X, 
  Loader, 
  Calendar,
  CreditCard,
  Building
} from 'lucide-react';
import { 
  getAllPayments, 
  createPayment, 
  updatePayment, 
  removePayment, 
  Payment,
  PaymentInput
} from '../../services/payments';

export default function PaymentsManager() {

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals controllers
  const [newPayOpen, setNewPayOpen] = useState(false);
  const [editPay, setEditPay] = useState<Payment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState<PaymentInput>({
    contractId: '',
    proposalId: '',
    clientName: '',
    amount: 0,
    paymentMethod: 'PIX',
    status: 'Pendente',
    dueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split('T')[0] // 10 days in future
  });

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await getAllPayments();
      setPayments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.amount || !formData.dueDate) {
      alert('Favor preencher Nome do Cliente, Valor Coletores e Vencimento da fatura.');
      return;
    }

    try {
      setActionLoading(true);
      await createPayment(formData);
      alert('Ordem de pagamento registrada com sucesso!');
      setNewPayOpen(false);
      loadPayments();
    } catch (err) {
      console.error(err);
      alert('Erro ao guardar recebível.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPay || !editPay.id) return;

    try {
      setActionLoading(true);
      await updatePayment(editPay.id, editPay);
      alert('Sincronização financeira efetuada com sucesso!');
      setEditPay(null);
      loadPayments();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir esta cobrança definitivamente do fluxo?')) {
      try {
        await removePayment(id);
        alert('Cobrança excluída.');
        loadPayments();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMarkAsPaid = async (p: Payment) => {
    try {
      setActionLoading(true);
      await updatePayment(p.id, {
        status: 'Pago',
        paidAt: new Date().toISOString()
      });
      alert('Baixa efetuada! Recebível compensado no fluxo de caixa.');
      loadPayments();
    } catch (err) {
      console.error(err);
      alert('Erro ao dar baixa na cobrança.');
    } finally {
      setActionLoading(false);
    }
  };

  // Cashflow aggregates
  const totalReceived = payments
    .filter(p => p.status === 'Pago')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOutstanding = payments
    .filter(p => p.status === 'Pendente' || p.status === 'Atrasado')
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter(p => {
    const term = search.toLowerCase();
    const matchSearch = p.clientName.toLowerCase().includes(term);
    const matchStatus = statusFilter === '' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pago': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Pendente': return 'bg-yellow-50 text-yellow-800 border-yellow-150';
      case 'Atrasado': return 'bg-red-50 text-red-800 border-red-200';
      case 'Cancelado': return 'bg-zinc-50 text-zinc-550 border-zinc-200';
      default: return 'bg-zinc-100 text-zinc-700';
    }
  };

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* CORNER HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight font-display uppercase">Fluxo de Caixa e Recebíveis</h2>
          <p className="text-xs text-zinc-500 font-light mt-0.5">Faturamento de integrador, comissões de parceiros comerciais e recebimento de parcelados fotovoltaicos.</p>
        </div>

        <button
          onClick={() => {
            setFormData({
              contractId: '',
              proposalId: '',
              clientName: '',
              amount: 0,
              paymentMethod: 'PIX',
              status: 'Pendente',
              dueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split('T')[0]
            });
            setNewPayOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-igreen hover:bg-[#00A638] text-black font-extrabold text-xs shadow transition cursor-pointer uppercase self-start"
        >
          <Plus className="w-4 h-4 text-black text-xs font-bold" />
          <span>Lançar Cobrança</span>
        </button>
      </div>

      {/* FINANCE TOTALIZERS */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50/50 p-4 border border-emerald-150 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-emerald-500 text-white rounded-xl shadow shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-800 uppercase font-bold block">Total Compensado / Recebido</span>
            <span className="text-xl font-black text-emerald-950 font-display">R$ {totalReceived.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        <div className="bg-amber-50/40 p-4 border border-amber-100 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-amber-500 text-white rounded-xl shadow shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-amber-800 uppercase font-semibold block">Previsão em Aberto / Pendente</span>
            <span className="text-xl font-black text-zinc-900 font-display">R$ {totalOutstanding.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER SELECT */}
      <div className="bg-white border border-zinc-150 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full text-xs">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por cliente no fluxo de caixa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-zinc-200 rounded-xl focus:ring-1 focus:ring-igreen outline-none font-semibold text-zinc-700"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto shrink-0 font-sans">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 text-xs border border-[#E4E4E7] rounded-xl focus:outline-none font-semibold text-zinc-650"
          >
            <option value="">Todos os Estados Financeiros</option>
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
            <option value="Atrasado">Atrasado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* FINANCIAL DATA TABLE */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="w-10 h-10 border-4 border-zinc-200 border-t-igreen rounded-full animate-spin" />
          <p className="text-xs text-zinc-500 font-bold">Consolidando fechamento financeiro...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-white border border-zinc-150 p-12 rounded-2xl text-center space-y-3">
          <DollarSign className="w-12 h-12 text-zinc-300 mx-auto" />
          <h4 className="text-sm font-bold text-zinc-800 uppercase tracking-tight">Nenhuma Fatura Cadastrada</h4>
          <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">Lance uma cobrança fotovoltaica nova ou vincule faturamentos aos contratos integradores.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-150 text-zinc-505 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Favorecido / Titular Ordem</th>
                  <th className="p-4">Método de Liquidação</th>
                  <th className="p-4">Vencimento</th>
                  <th className="p-4 text-left">Valor da Ordem</th>
                  <th className="p-4">Status de Caixa</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 text-zinc-702">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/30 transition">
                    <td className="p-4">
                      <span className="font-bold text-zinc-900 block text-sm">{p.clientName}</span>
                      <span className="text-[10px] text-zinc-400 font-light block">Contrato Ref: {p.contractId || 'Lançamento Isolado'}</span>
                    </td>
                    <td className="p-4 uppercase text-[10px] font-bold">
                      <span className="bg-zinc-100 text-zinc-600 px-2.5 py-0.5 rounded-full">{p.paymentMethod}</span>
                    </td>
                    <td className="p-4 font-semibold font-mono text-zinc-550">
                      {new Date(p.dueDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 font-black font-mono text-zinc-800 text-left">
                      R$ {p.amount.toLocaleString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {p.status !== 'Pago' && (
                          <button
                            onClick={() => handleMarkAsPaid(p)}
                            className="p-1 px-2.5 border border-[#00DB4A] rounded-lg text-emerald-800 font-bold bg-[#00DB4A]/10 hover:bg-[#00DB4A] hover:text-black transition text-[10px] uppercase cursor-pointer block"
                            title="Dar Baixa Financeira"
                          >
                            Dar Baixa
                          </button>
                        )}
                        <button
                          onClick={() => setEditPay(p)}
                          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-50 transition"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg border border-zinc-200 text-red-500 hover:bg-red-50 transition"
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

      {/* CREATE DUES ORDER MODAL */}
      {newPayOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl border border-zinc-150 overflow-hidden shadow-2xl animate-scale-up text-left">
            <div className="p-6 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-igreen" />
                <h3 className="font-display font-black text-base uppercase">Lançar Novo Recebível</h3>
              </div>
              <button 
                onClick={() => setNewPayOpen(false)}
                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Nome do Cliente / Favorecido *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome do cliente"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Valor da Cobrança (R$) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    className="w-full text-xs font-bold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 text-emerald-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Data de Vencimento *</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Método de Liquidação</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl outline-none"
                  >
                    <option value="PIX">PIX</option>
                    <option value="Boleto">Boleto CPFL / Elektro</option>
                    <option value="Cartão">Cartão de Crédito</option>
                    <option value="Transferência">TED / DOC</option>
                    <option value="Financiamento">Financiamento Solar BV, Santander</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Esquema Financeiro</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Compensado / Recebido</option>
                    <option value="Atrasado">Inadimplente / Atrasado</option>
                  </select>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">ID do Contrato Relacionado (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Contrato jurídico de origem ou emita avulso"
                    value={formData.contractId || ''}
                    onChange={(e) => setFormData({...formData, contractId: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3 font-sans">
                <button
                  type="button"
                  onClick={() => setNewPayOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-igreen hover:bg-[#00A638] text-black font-extrabold text-xs shadow hover:scale-[1.01] transition flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <span>Lançar Dues</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editPay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl border border-zinc-150 overflow-hidden shadow-2xl animate-scale-up text-left">
            <div className="p-6 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-igreen" />
                <h3 className="font-display font-black text-base uppercase">Alterar Atributos Cobrança</h3>
              </div>
              <button 
                onClick={() => setEditPay(null)}
                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Nome do Cliente / Favorecido</label>
                  <input
                    type="text"
                    required
                    value={editPay.clientName}
                    onChange={(e) => setEditPay({...editPay, clientName: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Valor Investimento</label>
                  <input
                    type="number"
                    value={editPay.amount}
                    onChange={(e) => setEditPay({...editPay, amount: Number(e.target.value)})}
                    className="w-full text-xs font-bold border border-zinc-200 px-3 py-2 rounded-xl text-emerald-805"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Data de Vencimento</label>
                  <input
                    type="date"
                    value={editPay.dueDate}
                    onChange={(e) => setEditPay({...editPay, dueDate: e.target.value})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Estado de Caixa</label>
                  <select
                    value={editPay.status}
                    onChange={(e) => setEditPay({...editPay, status: e.target.value as any})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                    <option value="Atrasado">Atrasado</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Liquidação</label>
                  <select
                    value={editPay.paymentMethod}
                    onChange={(e) => setEditPay({...editPay, paymentMethod: e.target.value as any})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl outline-none"
                  >
                    <option value="PIX">PIX</option>
                    <option value="Boleto">Boleto CPFL / Elektro</option>
                    <option value="Cartão">Cartão de Crédito</option>
                    <option value="Transferência">TED / DOC</option>
                    <option value="Financiamento">Financiamento Solar BV</option>
                  </select>
                </div>

              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3 text-sans">
                <button
                  type="button"
                  onClick={() => setEditPay(null)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-igreen hover:bg-[#00A638] text-black font-extrabold text-xs shadow transition-all flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <span>Sincronizar Lançamento</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
