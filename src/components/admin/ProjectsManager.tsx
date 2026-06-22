import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Search, 
  Trash2, 
  Edit, 
  Eye, 
  MapPin, 
  Calendar, 
  X, 
  Loader, 
  Sun,
  Award,
  BookOpen
} from 'lucide-react';
import { 
  getAllProjects, 
  updateProject, 
  removeProject, 
  Project 
} from '../../services/projects';

export default function ProjectsManager() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals controllers
  const [viewProj, setViewProj] = useState<Project | null>(null);
  const [editProj, setEditProj] = useState<Project | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Timeline list for engineering
  const timelineMilestones = [
    'Contrato assinado',
    'Aguardando documentação',
    'Projeto em análise',
    'Aguardando concessionária',
    'Equipamentos comprados',
    'Instalação agendada',
    'Em instalação',
    'Vistoria',
    'Homologação',
    'Sistema ativado',
    'Concluído'
  ];

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProj || !editProj.id) return;

    try {
      setActionLoading(true);
      await updateProject(editProj.id, editProj);
      alert('Sincronização técnica efetuada!');
      setEditProj(null);
      loadProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deletar projeto técnico definitivamente?')) {
      try {
        await removeProject(id);
        alert('Projeto removido.');
        setViewProj(null);
        loadProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getMilestoneIndex = (currentStatus: string) => {
    return timelineMilestones.indexOf(currentStatus);
  };

  const filteredProjects = projects.filter(p => {
    const term = search.toLowerCase();
    const matchSearch = 
      p.clientName.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term) ||
      (p.technicianName && p.technicianName.toLowerCase().includes(term));
    const matchStatus = statusFilter === '' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* EXPLAIN CORNER */}
      <div>
        <h2 className="text-xl font-black text-zinc-900 tracking-tight font-display uppercase">Monitoramento Físico e Engenharia</h2>
        <p className="text-xs text-zinc-500 font-light mt-0.5">Fila de obras solares e homologação junto à concessionária (Elektro / CPFL).</p>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-zinc-150 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, engenheiro encarregado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-zinc-200 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto shrink-0 animate-fade-in">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 text-xs border border-[#E4E4E7] rounded-xl focus:outline-none focus:ring-1 focus:ring-igreen font-semibold text-zinc-650"
          >
            <option value="">Filtro de Fase da Obra</option>
            {timelineMilestones.map((ms) => (
              <option key={ms} value={ms}>{ms}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE DATA GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="w-10 h-10 border-4 border-zinc-200 border-t-igreen rounded-full animate-spin" />
          <p className="text-xs text-zinc-500 font-bold">Consolidando projetos com concessionárias...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white border border-zinc-150 p-12 rounded-2xl text-center space-y-3">
          <Wrench className="w-12 h-12 text-zinc-300 mx-auto" />
          <h4 className="text-sm font-bold text-zinc-800 uppercase tracking-tight">Fila Técnica Vazia</h4>
          <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">Para que um projeto apareça aqui, o contrato na aba anterior precisa estar marcado como "Assinado" pelo cliente.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-150 text-zinc-505 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Cliente / Cidade</th>
                  <th className="p-4">Módulos (KWp)</th>
                  <th className="p-4">Estágio Concessionária</th>
                  <th className="p-4">Responsável Técnico</th>
                  <th className="p-4">Previsão Ativação</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 text-zinc-702">
                {filteredProjects.map((p) => {
                  const msIndex = getMilestoneIndex(p.status);
                  const progressPct = Math.round(((msIndex + 1) / timelineMilestones.length) * 105);
                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/30 transition">
                      <td className="p-4">
                        <div>
                          <span className="font-bold text-zinc-900 block text-sm">{p.clientName}</span>
                          <span className="text-[10px] text-zinc-450 block">{p.city} • {p.address}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-black block">{p.panelsQuantity} Placas</span>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">{p.systemPowerKwp} kWp</span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1.5 max-w-[170px]">
                          <span className="font-bold text-[#00A638] block">{p.status}</span>
                          <div className="w-full bg-zinc-100 rounded-full h-1">
                            <div className="bg-igreen h-1 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-zinc-650">{p.technicianName || 'Sem eng. atribuído'}</td>
                      <td className="p-4 font-semibold font-mono text-zinc-600">
                        {p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString('pt-BR') : 'Sem data agendada'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewProj(p)}
                            className="p-1.5 rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-50 transition"
                            title="Cronograma"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditProj(p)}
                            className="p-1.5 rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-50 transition"
                            title="Alterar Estágio"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg border border-[#E4E4E7] text-red-500 hover:bg-red-55/10 transition"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* VIEW PROJECT DETAILED MODAL */}
      {viewProj && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-zinc-150 overflow-hidden shadow-2xl animate-scale-up text-left">
            <div className="p-6 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-900">
              <div>
                <span className="text-[9px] font-extrabold tracking-widest text-[#00DB4A] uppercase block">Dossiê de Obras</span>
                <h3 className="font-display font-black text-base uppercase truncate max-w-sm">Homologação Solar: {viewProj.clientName}</h3>
              </div>
              <button 
                onClick={() => setViewProj(null)}
                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Cronograma Timeline Milestones */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Cronograma de Obra / Andamento</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fila Lateral de Obras */}
                  <div className="border border-zinc-150 rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-zinc-50">
                    <div className="text-xs">
                      <span className="text-zinc-405 block uppercase font-bold text-[10px]">Técnico responsável</span>
                      <strong className="text-zinc-805 block text-sm mt-0.5">{viewProj.technicianName}</strong>
                    </div>
                    <div className="text-xs">
                      <span className="text-zinc-405 block uppercase font-bold text-[10px]">Data Estimada de Instalação</span>
                      <strong className="text-zinc-805 block text-sm mt-0.5">{viewProj.scheduledDate ? new Date(viewProj.scheduledDate).toLocaleDateString('pt-BR') : 'Não agendada'}</strong>
                    </div>
                    <div className="text-xs border-t border-zinc-200 pt-3">
                      <span className="text-zinc-405 block uppercase font-bold text-[10px]">Gerador Fotovoltaico</span>
                      <span className="block mt-0.5 font-semibold text-zinc-800">{viewProj.panelsQuantity} Módulos de {viewProj.systemPowerKwp} kWp acumulados</span>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
                    {timelineMilestones.map((ms, idx) => {
                      const activeIndex = getMilestoneIndex(viewProj.status);
                      const isCompleted = idx <= activeIndex;
                      const isCurrent = idx === activeIndex;
                      
                      return (
                        <div key={ms} className="flex gap-3 text-xs items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border font-mono text-[10px] font-bold ${
                            isCompleted ? 'bg-[#00DB4A] border-igreen text-black' : 'bg-transparent border-zinc-200 text-zinc-350'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className={`${isCurrent ? 'font-black text-black text-sm' : isCompleted ? 'font-semibold text-zinc-700' : 'text-zinc-400 font-light'}`}>
                            {ms}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-405">
                <span>Roteiro de Obras iGreen Itararé &bull; Itapeva</span>
                <span className="font-mono text-[10px]">Código do Contrato: {viewProj.contractId}</span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editProj && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-zinc-150 overflow-hidden shadow-2xl animate-scale-up text-left">
            <div className="p-6 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-igreen" />
                <h3 className="font-display font-black text-base uppercase">Alterar Estágio da Obra</h3>
              </div>
              <button 
                onClick={() => setEditProj(null)}
                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Fase Atual da Homologação Concessionária</label>
                  <select
                    value={editProj.status}
                    onChange={(e) => setEditProj({...editProj, status: e.target.value as any})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none"
                  >
                    {timelineMilestones.map((ms) => (
                      <option key={ms} value={ms}>{ms}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Engenheiro / Técnico Responsável</label>
                  <input
                    type="text"
                    required
                    value={editProj.technicianName || ''}
                    onChange={(e) => setEditProj({...editProj, technicianName: e.target.value})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Previsão Ativação / Conexão</label>
                  <input
                    type="date"
                    value={editProj.scheduledDate || ''}
                    onChange={(e) => setEditProj({...editProj, scheduledDate: e.target.value})}
                    className="w-full text-xs font-semibold border border-[#E4E4E7] px-3 py-2 rounded-xl focus:ring-1 focus:ring-igreen outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Quantidade de Placas</label>
                  <input
                    type="number"
                    value={editProj.panelsQuantity}
                    onChange={(e) => setEditProj({...editProj, panelsQuantity: Number(e.target.value)})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Potência mL do Gerador (kWp)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editProj.systemPowerKwp}
                    onChange={(e) => setEditProj({...editProj, systemPowerKwp: Number(e.target.value)})}
                    className="w-full text-xs font-semibold border border-zinc-200 px-3 py-2 rounded-xl outline-none"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditProj(null)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-igreen hover:bg-[#00A638] text-black font-extrabold text-xs shadow transition-all flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <span>Sincronizar Cronograma</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
