import React, { useState, useEffect } from 'react';
import { 
  getAllSocialProofs, 
  createSocialProof, 
  updateSocialProof, 
  deleteSocialProof, 
  SocialProof 
} from '../../services/socialProofs';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Edit3, 
  Trash2, 
  Star, 
  TrendingUp, 
  FileText, 
  X,
  Sparkles,
  DollarSign
} from 'lucide-react';

export default function SocialProofsManager() {
  const [proofs, setProofs] = useState<SocialProof[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search / Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Residencial' | 'Comercial' | 'Rural' | 'Industrial'>('all');
  
  // Status feedback / alerts
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form parameters
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [clientName, setClientName] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState<'Residencial' | 'Comercial' | 'Rural' | 'Industrial'>('Residencial');
  const [imageUrl, setImageUrl] = useState('');
  const [monthlyBillBefore, setMonthlyBillBefore] = useState<number | ''>('');
  const [monthlyBillAfter, setMonthlyBillAfter] = useState<number | ''>('');
  const [systemPowerKwp, setSystemPowerKwp] = useState<number | ''>('');
  const [testimonial, setTestimonial] = useState('');
  const [status, setStatus] = useState<'Ativo' | 'Inativo'>('Ativo');
  const [featured, setFeatured] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  // Auto computations
  const calculatedSavings = (Number(monthlyBillBefore || 0) - Number(monthlyBillAfter || 0));
  const calculatedAnnual = calculatedSavings * 12;

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllSocialProofs();
      setProofs(data);
    } catch (err: any) {
      console.error(err);
      setAlert({ type: 'error', text: 'Não foi possível carregar as provas sociais do Firestore.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewForm = () => {
    setEditingId(null);
    setClientName('');
    setCity('');
    setPropertyType('Residencial');
    setImageUrl('');
    setMonthlyBillBefore('');
    setMonthlyBillAfter('');
    setSystemPowerKwp('');
    setTestimonial('');
    setStatus('Ativo');
    setFeatured(false);
    
    setIsFormOpen(true);
    setAlert(null);
  };

  const openEditForm = (item: SocialProof) => {
    setEditingId(item.id || null);
    setClientName(item.clientName);
    setCity(item.city);
    setPropertyType(item.propertyType);
    setImageUrl(item.imageUrl || '');
    setMonthlyBillBefore(item.monthlyBillBefore || '');
    setMonthlyBillAfter(item.monthlyBillAfter || '');
    setSystemPowerKwp(item.systemPowerKwp || '');
    setTestimonial(item.testimonial || '');
    setStatus(item.status);
    setFeatured(item.featured);
    
    setIsFormOpen(true);
    setAlert(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza de que deseja excluir a prova social do cliente "${name}"?`)) {
      return;
    }
    try {
      await deleteSocialProof(id);
      setAlert({ type: 'success', text: `Prova social de ${name} excluída com sucesso!` });
      loadData();
    } catch (err: any) {
      console.error(err);
      setAlert({ type: 'error', text: `Erro ao deletar: ${err.message}` });
    }
  };

  const handleStatusToggle = async (item: SocialProof) => {
    if (!item.id) return;
    const newStatus = item.status === 'Ativo' ? 'Inativo' : 'Ativo';
    try {
      await updateSocialProof(item.id, { status: newStatus });
      setAlert({ type: 'success', text: `Status do cliente ${item.clientName} fixado em ${newStatus}!` });
      loadData();
    } catch (err: any) {
      console.error(err);
      setAlert({ type: 'error', text: 'Falha ao atualizar o status.' });
    }
  };

  const handleFeaturedToggle = async (item: SocialProof) => {
    if (!item.id) return;
    const newFeatured = !item.featured;
    try {
      await updateSocialProof(item.id, { featured: newFeatured });
      setAlert({ type: 'success', text: `Destaque do cliente ${item.clientName} ${newFeatured ? 'ativado!' : 'desativado!'}` });
      loadData();
    } catch (err: any) {
      console.error(err);
      setAlert({ type: 'error', text: 'Falha ao atualizar destaque.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !city || !testimonial) {
      setAlert({ type: 'error', text: 'Por favor, preencha os campos obrigatórios (Nome, Cidade e Depoimento).' });
      return;
    }
    setSubmitting(true);
    setAlert(null);
    
    const payload = {
      clientName,
      city,
      propertyType,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1548613053-220bfb801048?auto=format&fit=crop&w=400&q=80', // Fallback elegat
      monthlyBillBefore: Number(monthlyBillBefore) || 0,
      monthlyBillAfter: Number(monthlyBillAfter) || 0,
      testimonial,
      systemPowerKwp: Number(systemPowerKwp) || 0,
      status,
      featured,
      monthlySavings: calculatedSavings,
      annualSavings: calculatedAnnual
    };

    try {
      if (editingId) {
        await updateSocialProof(editingId, payload);
        setAlert({ type: 'success', text: `Prova social de ${clientName} atualizada com sucesso!` });
      } else {
        await createSocialProof(payload);
        setAlert({ type: 'success', text: `Prova social de ${clientName} cadastrada perfeitamente!` });
      }
      setIsFormOpen(false);
      loadData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setAlert({ type: 'error', text: `Ocorreu um erro ao salvar os dados: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  // Local filter checks
  const filteredProofs = proofs.filter(p => {
    const term = search.toLowerCase();
    const matchesSearch = p.clientName.toLowerCase().includes(term) || p.city.toLowerCase().includes(term);
    const matchesType = typeFilter === 'all' || p.propertyType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 font-sans text-left animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight font-display uppercase">Gestão de Provas Sociais</h2>
          <p className="text-xs text-zinc-500 font-light mt-0.5">Cadastre depoimentos, faturas reais e economias integradoras de clientes para exibir no site.</p>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            onClick={openNewForm}
            className="flex items-center gap-2 p-3 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow border-none active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-igreen shrink-0" />
            <span>Cadastrar Caso Real</span>
          </button>
        )}
      </div>

      {alert && (
        <div className={`p-4 rounded-2xl flex items-start gap-3 border text-xs leading-relaxed font-medium ${
          alert.type === 'success' 
            ? 'bg-emerald-50 border-emerald-150 text-emerald-800' 
            : 'bg-red-50 border-red-100 text-red-800'
        }`}>
          {alert.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <div>
            <p className="font-bold">{alert.type === 'success' ? 'Sucesso!' : 'Atenção'}</p>
            <p className="font-light mt-0.5">{alert.text}</p>
          </div>
        </div>
      )}

      {isFormOpen ? (
        /* Form View */
        <form onSubmit={handleSubmit} className="bg-white border border-zinc-150 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">
                {editingId ? 'Editar Caso de Sucesso' : 'Cadastrar Novo Caso de Sucesso'}
              </h3>
              <p className="text-xs text-zinc-400 font-light">Adicione fotos, métricas reais de faturas e o relato do cliente.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-1 px-2 text-zinc-650 hover:text-zinc-950 font-medium text-xs bg-zinc-100 hover:bg-zinc-200 rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Nome do Cliente *</label>
              <input
                required
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Exemplo: José Carlos de Souza"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Cidade do Cliente *</label>
              <input
                required
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Exemplo: Itararé"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Tipo de Propriedade *</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800 font-semibold"
              >
                <option value="Residencial">Residencial</option>
                <option value="Comercial">Comercial</option>
                <option value="Rural">Rural</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Caminho da Foto do Cliente / Campo (URL)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/foto.jpg"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800 placeholder-zinc-400"
              />
              <p className="text-[10px] text-zinc-400 mt-1 font-light">Fazer o upload de imagem via URL pública (Ex: Postimg, Unsplash, Imgur).</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Potência Nominal do Sistema (kWp)</label>
              <input
                type="number"
                step="0.01"
                value={systemPowerKwp}
                onChange={(e) => setSystemPowerKwp(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 6.6"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
              />
            </div>
          </div>

          {/* Money & Savings values box */}
          <div className="p-6 bg-zinc-950 text-white rounded-3xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-44 h-44 rounded-full bg-igreen/5 filter blur-[50px] pointer-events-none" />
            <h4 className="text-xs font-extrabold text-[#00DB4A] uppercase tracking-wide mb-4">Parâmetros de Fatura e Economia</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Conta Antes da IGREEN (R$)</label>
                <input
                  required
                  type="number"
                  value={monthlyBillBefore}
                  onChange={(e) => setMonthlyBillBefore(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Exemplo: 850"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-800 text-xs bg-zinc-900/80 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-100 font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Conta Atual com a IGREEN (R$)</label>
                <input
                  required
                  type="number"
                  value={monthlyBillAfter}
                  onChange={(e) => setMonthlyBillAfter(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Exemplo: 75"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-800 text-xs bg-zinc-900/80 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-100 font-bold font-mono"
                />
              </div>
            </div>

            {/* Calculations metrics auto-visual */}
            <div className="grid grid-cols-2 gap-4 border-t border-zinc-800/80 mt-6 pt-4 text-left">
              <div>
                <span className="text-[10px] text-zinc-400 font-semibold block uppercase">Economia Mensal Gerada</span>
                <strong className="text-lg sm:text-xl font-display font-black text-rose-000 text-[#00DB4A] font-mono leading-none">
                  R$ {calculatedSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </strong>
                <span className="text-[9px] text-zinc-500 block leading-tight mt-0.5">Valor salvo na conta d'água/fatura.</span>
              </div>

              <div>
                <span className="text-[10px] text-zinc-400 font-semibold block uppercase">Economia Anual Estimada</span>
                <strong className="text-lg sm:text-xl font-display font-black text-zinc-100 font-mono leading-none">
                  R$ {calculatedAnnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </strong>
                <span className="text-[9px] text-zinc-500 block leading-tight mt-0.5">Projeção acumulada de pura rentabilidade.</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Depoimento Escrito Pelo Cliente *</label>
            <textarea
              required
              rows={4}
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              placeholder="Digite verbatim as palavras reais do cliente demonstrando satisfação"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800 placeholder-zinc-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between border-t border-zinc-100 pt-6 gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-zinc-300 text-igreen focus:ring-igreen w-4 h-4 cursor-pointer"
                />
                <span>Exibir em Destaque (Home Page)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="px-3 py-1 bg-zinc-100 border border-zinc-200 rounded-lg text-xs cursor-pointer focus:outline-none"
                >
                  <option value="Ativo">Ativo (Publicado)</option>
                  <option value="Inativo">Inativo (Rascunho)</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-igreen" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Salvar Prova Social</span>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* List & Filter View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white border border-zinc-150 p-4 rounded-3xl shadow-sm text-xs">
            <div className="sm:col-span-6 relative flex items-center">
              <Search className="w-4 h-4 text-zinc-400 absolute left-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar por nome do cliente ou cidade..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800 font-medium"
              />
            </div>

            <div className="sm:col-span-4 relative flex items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full py-2.5 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs focus:outline-none text-zinc-800 font-bold"
              >
                <option value="all">Ver Todas Categorias</option>
                <option value="Residencial">Residencial</option>
                <option value="Comercial">Comercial</option>
                <option value="Rural">Rural</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>

            <button
              onClick={() => { setSearch(''); setTypeFilter('all'); }}
              className="sm:col-span-2 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold rounded-xl transition cursor-pointer text-center"
            >
              Resetar
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-igreen" />
              <span className="text-zinc-500 text-xs font-semibold">Buscando testemunhos no Firestore...</span>
            </div>
          ) : filteredProofs.length === 0 ? (
            <div className="p-16 border-2 border-dashed border-zinc-200 rounded-3xl text-center space-y-3">
              <FileText className="w-10 h-10 text-zinc-300 mx-auto" />
              <h4 className="text-sm font-bold text-zinc-650">Nenhuma Prova Social Cadastrada</h4>
              <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">Insira novos relatos e faturas de economia para popular o site de forma moderna e autêntica.</p>
              <button
                onClick={openNewForm}
                className="px-5 py-2.5 bg-zinc-900 text-white hover:bg-zinc-850 rounded-xl text-xs font-extrabold uppercase mt-2 shadow cursor-pointer border-none"
              >
                Cadastrar Primeiro Caso
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProofs.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white border border-zinc-150 p-5 rounded-3xl flex flex-col justify-between shadow-sm relative group"
                >
                  <div className="space-y-4 text-left">
                    {/* Header line */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <strong className="text-sm font-black text-zinc-900 block font-display leading-tight">{item.clientName}</strong>
                          {item.featured && (
                            <span className="p-1 px-1.5 bg-yellow-400 text-black text-[9px] font-black rounded uppercase flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-black" />
                              <span>Home</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-semibold block leading-tight mt-1 uppercase">📍 {item.city} &bull; {item.propertyType}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditForm(item)}
                          className="p-1.5 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 rounded-lg transition"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4 border-none" />
                        </button>
                        <button
                          onClick={() => item.id && handleDelete(item.id, item.clientName)}
                          className="p-1.5 hover:bg-red-50 text-zinc-500 hover:text-red-600 rounded-lg transition"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4 border-none" />
                        </button>
                      </div>
                    </div>

                    {/* Testimonial Quote excerpt */}
                    <p className="text-[11px] text-zinc-650 font-light italic leading-relaxed line-clamp-3">
                      "{item.testimonial}"
                    </p>

                    {/* Economic highlights */}
                    <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px]">
                      <div>
                        <span className="text-[8px] text-zinc-400 font-semibold block uppercase">Antes</span>
                        <span className="font-mono font-bold text-zinc-600">R$ {item.monthlyBillBefore}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-zinc-400 font-semibold block uppercase">Com IGREEN</span>
                        <span className="font-mono font-bold text-zinc-600 font-semibold">R$ {item.monthlyBillAfter}</span>
                      </div>
                      <div className="border-l border-zinc-200 pl-2">
                        <span className="text-[8px] text-emerald-600 font-bold block uppercase">Economia</span>
                        <strong className="font-mono text-emerald-800 font-black">R$ {item.monthlySavings}/mês</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions status panel footer */}
                  <div className="mt-4 pt-3 border-t border-zinc-105 flex items-center justify-between text-[10px]">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusToggle(item)}
                        className={`p-1 px-2.5 rounded-lg font-bold border transition ${
                          item.status === 'Ativo'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-150'
                            : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                        }`}
                      >
                        {item.status}
                      </button>

                      <button
                        onClick={() => handleFeaturedToggle(item)}
                        className={`p-1 px-2.5 rounded-lg font-bold border transition ${
                          item.featured
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-zinc-50 text-zinc-400 border-zinc-150'
                        }`}
                      >
                        {item.featured ? '★ Destaque Home' : '☆ Definir Destaque'}
                      </button>
                    </div>

                    <span className="text-[9px] text-zinc-400">{item.systemPowerKwp ? `${item.systemPowerKwp} kWp instalado` : 'Sem potência especificada'}</span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
