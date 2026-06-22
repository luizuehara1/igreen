import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  Image as ImageIcon, 
  Phone, 
  ListTodo, 
  BarChart3, 
  Save, 
  CheckCircle, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getSiteSettings, updateSiteSettings, SiteSettings, DEFAULT_SETTINGS } from '../../services/siteSettings';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'br-cont' | 'ct-home' | 'est-num'>('br-cont');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (err) {
        console.error('Erro ao buscar configurações:', err);
        setStatusMsg({ type: 'error', text: 'Erro ao conectar ou buscar dados no Firestore. Usando padrões locais.' });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      await updateSiteSettings(settings);
      setStatusMsg({ type: 'success', text: 'Configurações do site salvas com sucesso no Firestore!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ 
        type: 'error', 
        text: `Falha ao salvar configurações: ${err.message || 'Verifique suas permissões do Firestore.'}` 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#00DB4A]" />
        <span className="text-zinc-500 text-xs font-semibold">Carregando dados das configurações...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-left animate-fade-in pb-12">
      <div>
        <h2 className="text-xl font-black text-zinc-900 tracking-tight font-display uppercase">Configurações Globais do Site</h2>
        <p className="text-xs text-zinc-500 font-light mt-0.5">Gerencie os conteúdos, dados de contato e estatísticas principais do site público iGreen.</p>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-2xl flex items-start gap-3 border text-xs leading-relaxed font-medium ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-50 border-emerald-150 text-emerald-800' 
            : 'bg-red-50 border-red-100 text-red-800'
        }`}>
          {statusMsg.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <div>
            <p className="font-bold">{statusMsg.type === 'success' ? 'Sucesso!' : 'Atenção'}</p>
            <p className="mt-0.5 font-light">{statusMsg.text}</p>
          </div>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-zinc-200 gap-1 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('br-cont')}
          className={`flex items-center gap-2 px-4 py-3.5 border-b-2 text-xs font-bold uppercase transition ${
            activeTab === 'br-cont'
              ? 'border-zinc-900 text-zinc-950 bg-zinc-100/50 rounded-t-xl'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Branding & Contatos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ct-home')}
          className={`flex items-center gap-2 px-4 py-3.5 border-b-2 text-xs font-bold uppercase transition ${
            activeTab === 'ct-home'
              ? 'border-zinc-900 text-zinc-950 bg-zinc-100/50 rounded-t-xl'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Textos & Conteúdos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('est-num')}
          className={`flex items-center gap-2 px-4 py-3.5 border-b-2 text-xs font-bold uppercase transition ${
            activeTab === 'est-num'
              ? 'border-zinc-900 text-zinc-950 bg-zinc-100/50 rounded-t-xl'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Estatísticas & Números</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Branding & Contatos */}
        {activeTab === 'br-cont' && (
          <div className="bg-white border border-zinc-150 p-6 rounded-3xl space-y-6 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Identidade Visual & Links de Contato</h3>
              <p className="text-zinc-400 text-xs mt-0.5">Assegure que os canais de atendimento e imagens institucionais estejam corretos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Logo Oficial da IGREEN (URL)</label>
                <input
                  required
                  type="url"
                  value={settings.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  placeholder="https://sua-logo.png"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                />
                <p className="text-[10px] text-zinc-400 mt-1 font-light">URL de imagem da logo oficial do cabeçalho em alta resolução.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Favicon (URL)</label>
                <input
                  required
                  type="url"
                  value={settings.faviconUrl}
                  onChange={(e) => handleChange('faviconUrl', e.target.value)}
                  placeholder="https://seu-favicon.ico"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-100 pt-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">WhatsApp Comercial</label>
                <input
                  required
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="(15) 99876-5432"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Instagram Link</label>
                <input
                  required
                  type="url"
                  value={settings.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/perfil"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Email Geral</label>
                <input
                  required
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="contato@empresa.com"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-100 pt-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Regiões Atendidas (Cidade / Filtros)</label>
                <input
                  required
                  type="text"
                  value={settings.cityRegion}
                  onChange={(e) => handleChange('cityRegion', e.target.value)}
                  placeholder="Itapeva, Itararé..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Endereços Físicos Completos</label>
                <textarea
                  required
                  rows={2}
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Endereço filial 1 | Endereço filial 2"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800 placeholder-zinc-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Textos & Conteúdos */}
        {activeTab === 'ct-home' && (
          <div className="bg-white border border-zinc-150 p-6 rounded-3xl space-y-6 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Conteúdos Textuais Principais</h3>
              <p className="text-zinc-400 text-xs mt-0.5">Customize os títulos e as descrições em destaque nas telas.</p>
            </div>

            {/* Hero parameters */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-[#00DB4A] uppercase tracking-wide border-l-2 border-[#00DB4A] pl-2">Seção de Apresentação (Hero Banner)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Título do Hero (Destaque Principal)</label>
                  <input
                    required
                    type="text"
                    value={settings.heroTitle}
                    onChange={(e) => handleChange('heroTitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Caminho de Imagem Hero (URL)</label>
                  <input
                    required
                    type="url"
                    value={settings.heroImageUrl}
                    onChange={(e) => handleChange('heroImageUrl', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Subtítulo Explicativo do Hero</label>
                <textarea
                  required
                  rows={3}
                  value={settings.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800 placeholder-zinc-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Texto do Botão Primário (CTA)</label>
                  <input
                    required
                    type="text"
                    value={settings.primaryCtaText}
                    onChange={(e) => handleChange('primaryCtaText', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Texto do Botão Secundário (WhatsApp)</label>
                  <input
                    required
                    type="text"
                    value={settings.secondaryCtaText}
                    onChange={(e) => handleChange('secondaryCtaText', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                  />
                </div>
              </div>
            </div>

            {/* About parameters */}
            <div className="space-y-4 border-t border-zinc-100 pt-6">
              <h4 className="text-xs font-extrabold text-[#00DB4A] uppercase tracking-wide border-l-2 border-[#00DB4A] pl-2">Quem Somos (História & Sobre Nós)</h4>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Título da Seção Sobre</label>
                <input
                  required
                  type="text"
                  value={settings.aboutTitle}
                  onChange={(e) => handleChange('aboutTitle', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Texto Explicativo Sobre Nosotros</label>
                <textarea
                  required
                  rows={5}
                  value={settings.aboutText}
                  onChange={(e) => handleChange('aboutText', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800 placeholder-zinc-400"
                />
              </div>
            </div>

            {/* Footer parameters */}
            <div className="space-y-4 border-t border-zinc-100 pt-6">
              <h4 className="text-xs font-extrabold text-[#00DB4A] uppercase tracking-wide border-l-2 border-[#00DB4A] pl-2">Rodapé Global</h4>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Texto ou Direitos Autorais do Rodapé</label>
                <input
                  required
                  type="text"
                  value={settings.footerText}
                  onChange={(e) => handleChange('footerText', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-igreen text-zinc-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Estatísticas & Números */}
        {activeTab === 'est-num' && (
          <div className="bg-white border border-zinc-150 p-6 rounded-3xl space-y-6 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Estatísticas & Números de Desempenho</h3>
              <p className="text-zinc-400 text-xs mt-0.5">Esses números alimentam de modo automatizado os contadores de conquistas da home.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col justify-between">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Projetos Executados</label>
                  <p className="text-[9px] text-zinc-400 font-light max-w-[120px] mb-3 leading-normal">Total de casas, comércios e fazendas ligadas.</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    required
                    type="number"
                    value={settings.projectsCompleted}
                    onChange={(e) => handleChange('projectsCompleted', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-bold font-mono text-zinc-800 text-sm focus:ring-1 focus:ring-igreen focus:outline-none bg-white"
                  />
                  <span className="text-xs text-zinc-500 font-bold shrink-0">+</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col justify-between">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Potência (MWp)</label>
                  <p className="text-[9px] text-zinc-400 font-light max-w-[120px] mb-3 leading-normal">Potência ativada somada total instalada.</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={settings.totalPowerInstalled}
                    onChange={(e) => handleChange('totalPowerInstalled', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-bold font-mono text-zinc-800 text-sm focus:ring-1 focus:ring-igreen focus:outline-none bg-white"
                  />
                  <span className="text-xs text-zinc-550 shrink-0 font-medium font-mono">MW</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-105 flex flex-col justify-between">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Média Redução (%)</label>
                  <p className="text-[9px] text-zinc-400 font-light max-w-[120px] mb-3 leading-normal">Percentual de economia gerada média.</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    required
                    type="number"
                    value={settings.averageSavingsPercent}
                    onChange={(e) => handleChange('averageSavingsPercent', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-bold font-mono text-zinc-800 text-sm focus:ring-1 focus:ring-igreen focus:outline-none bg-white"
                  />
                  <span className="text-xs text-zinc-500 font-bold shrink-0">%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col justify-between">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Matriz Limpa (%)</label>
                  <p className="text-[9px] text-zinc-400 font-light max-w-[120px] mb-3 leading-normal">Sustentabilidade ecológica de carbono.</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    required
                    type="number"
                    value={settings.cleanEnergyPercent}
                    onChange={(e) => handleChange('cleanEnergyPercent', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-bold font-mono text-zinc-800 text-sm focus:ring-1 focus:ring-igreen focus:outline-none bg-white"
                  />
                  <span className="text-xs text-zinc-500 font-bold shrink-0">%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col justify-between">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Economia Gerada (R$/mês)</label>
                  <p className="text-[9px] text-zinc-400 font-light max-w-[120px] mb-3 leading-normal">Média de economia financeira estimada mensal.</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-500 font-bold font-mono shrink-0">R$</span>
                  <input
                    required
                    type="number"
                    value={settings.monthlySavingsGenerated}
                    onChange={(e) => handleChange('monthlySavingsGenerated', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-bold font-mono text-zinc-800 text-sm focus:ring-1 focus:ring-igreen focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button Sticky Panel wrapper */}
        <div className="flex items-center justify-end gap-3 bg-zinc-900 text-white p-4 rounded-2xl border border-zinc-800 shadow-lg">
          <span className="text-[10px] text-zinc-400 font-bold uppercase mr-auto hidden sm:inline-block">iGreen Solar Content Management</span>
          
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#00DB4A] hover:bg-[#00B438] active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-black shrink-0" />
                <span>Salvar Tudo</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
