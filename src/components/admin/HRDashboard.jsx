import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, Search, RefreshCw, Printer, ArrowLeft, Calendar, 
  Building, CheckCircle, ExternalLink, Download, Lock, LogOut, Settings, 
  Save, Plus, Trash2, Sliders, Briefcase, Bus, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { getAdmissionsList, deleteAdmission } from '../../services/admissionService';
import { getRHConfig, saveRHConfig, DEFAULT_RH_CONFIG } from '../../services/configService';
import { downloadAsPDF } from '../../utils/downloadHelper';
import AdmissionPrintTemplate from './AdmissionPrintTemplate';
import AttachmentPreviewModal from '../attachments/AttachmentPreviewModal';
import HRAuthModal from './HRAuthModal';

export default function HRDashboard({ onBackToForm }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('rh_auth_session') === 'true';
  });
  const [activeTab, setActiveTab] = useState('admissoes'); // 'admissoes' | 'config'
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estado das configurações do RH
  const [rhConfig, setRhConfig] = useState(DEFAULT_RH_CONFIG);
  const [newCargoInput, setNewCargoInput] = useState('');
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSavedToast, setConfigSavedToast] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    const list = await getAdmissionsList();
    setAdmissions(list);
    setLoading(false);
  };

  const handleDeleteAdmission = async () => {
    if (!itemToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteAdmission(itemToDelete.id);
      setAdmissions(prev => prev.filter(a => a.id !== itemToDelete.id));
      setItemToDelete(null);
    } catch (err) {
      alert('Erro ao excluir: ' + (err.message || 'Tente novamente'));
    } finally {
      setIsDeleting(false);
    }
  };

  const loadConfig = async () => {
    const cfg = await getRHConfig();
    setRhConfig(cfg);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchList();
      loadConfig();
    }
  }, [isAuthenticated]);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('rh_auth_session', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('rh_auth_session');
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setIsSavingConfig(true);
    await saveRHConfig(rhConfig);
    setIsSavingConfig(false);
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 3000);
  };

  const addCargo = () => {
    if (!newCargoInput.trim()) return;
    if (!rhConfig.funcoesPadrao.includes(newCargoInput.trim())) {
      setRhConfig({
        ...rhConfig,
        funcoesPadrao: [...rhConfig.funcoesPadrao, newCargoInput.trim()]
      });
    }
    setNewCargoInput('');
  };

  const removeCargo = (cargoToRemove) => {
    setRhConfig({
      ...rhConfig,
      funcoesPadrao: rhConfig.funcoesPadrao.filter(c => c !== cargoToRemove)
    });
  };

  const toggleContratoOpcao = (opcao) => {
    let updated;
    if (rhConfig.contratoOpcoesPermitidas.includes(opcao)) {
      if (rhConfig.contratoOpcoesPermitidas.length <= 1) return; // Mínimo 1 opção
      updated = rhConfig.contratoOpcoesPermitidas.filter(o => o !== opcao);
    } else {
      updated = [...rhConfig.contratoOpcoesPermitidas, opcao];
    }
    setRhConfig({
      ...rhConfig,
      contratoOpcoesPermitidas: updated,
      contratoExperienciaPadrao: updated.includes(rhConfig.contratoExperienciaPadrao) 
        ? rhConfig.contratoExperienciaPadrao 
        : updated[0]
    });
  };

  if (!isAuthenticated) {
    return (
      <HRAuthModal
        onAuthenticated={handleAuthenticated}
        onCancel={onBackToForm}
      />
    );
  }

  const filtered = admissions.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      (item.nomeFuncionario || '').toLowerCase().includes(term) ||
      (item.cpf || '').includes(term) ||
      (item.empresa || '').toLowerCase().includes(term) ||
      (item.protocolo || '').toLowerCase().includes(term)
    );
  });

  if (selectedAdmission) {
    return (
      <AdmissionPrintTemplate
        data={selectedAdmission}
        onBack={() => setSelectedAdmission(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToForm}
              className="p-2.5 rounded-2xl hover:bg-slate-100 text-slate-600 transition-colors"
              title="Voltar ao formulário de admissão"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Painel do Recursos Humanos</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center">
                  <Lock className="w-2.5 h-2.5 mr-1" /> Protegido por Senha
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-0.5">
                Gestão de Admissões & Configurações
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === 'admissoes' && (
              <button
                onClick={fetchList}
                disabled={loading}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
              title="Bloquear painel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Bloquear</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 bg-slate-200/70 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('admissoes')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'admissoes'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Fichas Recebidas ({admissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'config'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Configurações Padrão (Fábrica)</span>
          </button>
        </div>

        {/* ===================== TAB 1: ADMISSÕES RECEBIDAS ===================== */}
        {activeTab === 'admissoes' && (
          <div className="space-y-4">
            {/* Barra de Busca */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por funcionário, CPF, empresa ou protocolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
            </div>

            {/* Tabela / Cards de Admissões */}
            {loading ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-600">Carregando admissões do Firebase...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">Nenhuma admissão encontrada</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  As fichas preenchidas e enviadas pelos candidatos aparecerão automaticamente aqui.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => {
                  const anexosList = item.anexos ? Object.values(item.anexos) : [];
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {item.protocolo || 'SEM PROTOCOLO'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {item.dataAdmissao ? `Adm: ${item.dataAdmissao}` : 'Recém-enviado'}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900 text-base leading-tight">
                            {item.nomeFuncionario || 'Nome não preenchido'}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center">
                            <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            {item.empresa || 'Empresa não informada'}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Cargo</span>
                            <span className="font-medium text-slate-800 truncate block">{item.funcao || '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">CPF</span>
                            <span className="font-mono text-slate-800">{item.cpf || '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Vale Transporte</span>
                            <span className={`font-semibold ${item.valeTransporte === 'SIM' ? 'text-indigo-600' : 'text-slate-600'}`}>
                              {item.valeTransporte || 'NÃO'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Vale Dia 20</span>
                            <span className={`font-semibold ${item.valeDia20 === 'SIM' ? 'text-emerald-600' : 'text-slate-600'}`}>
                              {item.valeDia20 === 'SIM' ? `SIM (${item.valeDia20Percentual || '40%'})` : 'NÃO'}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contrato Exp.</span>
                            <span className="font-medium text-slate-800 truncate block">{item.contratoExperiencia || '-'}</span>
                          </div>
                        </div>

                        {/* Mini lista de anexos */}
                        {anexosList.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1.5">
                              Documentos Anexados ({anexosList.length}):
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {anexosList.map((anexo, idx) => (
                                <div
                                  key={idx}
                                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 border border-slate-200/80 rounded-xl text-[11px]"
                                >
                                  <button
                                    type="button"
                                    onClick={() => setPreviewAttachment(anexo)}
                                    className="font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                                    title="Visualizar documento"
                                  >
                                    {anexo.title || anexo.name || 'Documento'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => downloadAsPDF(anexo.url, anexo.name || anexo.title, anexo.title)}
                                    className="p-1 hover:bg-indigo-100 rounded-md text-indigo-600 transition-colors"
                                    title="Baixar diretamente em PDF"
                                  >
                                    <Download className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedAdmission(item)}
                          className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs transition-all active:scale-98"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Ver Ficha Oficial (2 Págs)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemToDelete(item)}
                          className="p-2.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 transition-all active:scale-95 flex-shrink-0"
                          title="Excluir ficha de admissão"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: CONFIGURAÇÕES DO RH ===================== */}
        {activeTab === 'config' && (
          <form onSubmit={handleSaveConfig} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
            
            {configSavedToast && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm font-semibold flex items-center space-x-2 animate-fade-in">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Configurações salvas com sucesso! Os novos formulários carregarão esses padrões.</span>
              </div>
            )}

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
                <Sliders className="w-5 h-5 mr-2 text-indigo-600" />
                Regras e Padrões de Admissão
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure os valores que já virão pré-preenchidos ou disponíveis para escolha do colaborador no formulário.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
              {/* 1. Empresa Padrão */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nome da Empresa Padrão (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Minha Empresa Ltda"
                  value={rhConfig.empresaPadrao || ''}
                  onChange={(e) => setRhConfig({ ...rhConfig, empresaPadrao: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-slate-800 text-sm"
                />
              </div>

              {/* 2. Regra do Vale Transporte */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Bus className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-slate-800 text-sm">Vale Transporte</h4>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  O colaborador decide no formulário (SIM / NÃO).
                </p>
                
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-semibold text-slate-700">Pré-marcar:</span>
                  <label className="flex items-center space-x-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="vtPadrao"
                      value="NÃO"
                      checked={rhConfig.valeTransportePadrao === 'NÃO'}
                      onChange={(e) => setRhConfig({ ...rhConfig, valeTransportePadrao: e.target.value })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>NÃO</span>
                  </label>
                  <label className="flex items-center space-x-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="vtPadrao"
                      value="SIM"
                      checked={rhConfig.valeTransportePadrao === 'SIM'}
                      onChange={(e) => setRhConfig({ ...rhConfig, valeTransportePadrao: e.target.value })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>SIM</span>
                  </label>
                </div>
              </div>

              {/* 2.1 Adiantamento Salarial / Vale Dia 20 */}
              <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-bold text-slate-800 text-sm">Vale Quinzenal (Dia 20)</h4>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Adiantamento de até 40% no dia 20 do mês.
                </p>
                
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700">Pré-marcar:</span>
                  <label className="flex items-center space-x-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="valeDia20Padrao"
                      value="SIM"
                      checked={rhConfig.valeDia20Padrao === 'SIM'}
                      onChange={(e) => setRhConfig({ ...rhConfig, valeDia20Padrao: e.target.value })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>SIM</span>
                  </label>
                  <label className="flex items-center space-x-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="valeDia20Padrao"
                      value="NÃO"
                      checked={rhConfig.valeDia20Padrao === 'NÃO'}
                      onChange={(e) => setRhConfig({ ...rhConfig, valeDia20Padrao: e.target.value })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>NÃO</span>
                  </label>

                  <div className="flex items-center space-x-1 pl-2">
                    <span className="text-[11px] text-slate-500">Percentual:</span>
                    <input
                      type="text"
                      value={rhConfig.valeDia20Percentual || '40%'}
                      onChange={(e) => setRhConfig({ ...rhConfig, valeDia20Percentual: e.target.value })}
                      className="w-14 px-1 py-0.5 text-xs font-bold text-slate-800 border rounded bg-white text-center"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Contrato de Experiência (30+60, 45+45, etc.) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 sm:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">Opções de Contrato de Experiência Permitidas</h4>
                  <span className="text-[11px] text-slate-500">Selecione quais modelos aparecem no formulário</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    "45 dias + 45 dias",
                    "30 dias + 60 dias",
                    "30 dias + 30 dias",
                    "90 dias",
                    "Não vai fazer contrato de experiência"
                  ].map((opcao) => {
                    const isChecked = rhConfig.contratoOpcoesPermitidas?.includes(opcao);
                    const isDefault = rhConfig.contratoExperienciaPadrao === opcao;
                    return (
                      <div
                        key={opcao}
                        className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                          isChecked ? 'bg-white border-indigo-200 shadow-xs' : 'bg-slate-100/60 border-slate-200 opacity-60'
                        }`}
                      >
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleContratoOpcao(opcao)}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-xs font-semibold text-slate-800">{opcao}</span>
                        </label>

                        {isChecked && (
                          <button
                            type="button"
                            onClick={() => setRhConfig({ ...rhConfig, contratoExperienciaPadrao: opcao })}
                            className={`text-[10px] py-1 px-2 rounded-lg font-bold transition-all text-left ${
                              isDefault
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                            }`}
                          >
                            {isDefault ? '✓ Seleção Padrão' : 'Definir como Padrão'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Lista de Cargos / Funções de Fábrica da Empresa */}
              <div className="sm:col-span-2 space-y-3">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Cargos / Funções Disponíveis como Sugestão Rápida
                </label>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Adicionar novo cargo (Ex: Caixa, Operador...)"
                    value={newCargoInput}
                    onChange={(e) => setNewCargoInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCargo();
                      }
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:border-indigo-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCargo}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {rhConfig.funcoesPadrao?.map((cargo) => (
                    <span
                      key={cargo}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-100"
                    >
                      <span>{cargo}</span>
                      <button
                        type="button"
                        onClick={() => removeCargo(cargo)}
                        className="text-indigo-400 hover:text-rose-600 ml-1"
                        title="Remover cargo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 5. Horário, Intervalo e Folga Padrão */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Horário de Trabalho Padrão
                </label>
                <input
                  type="text"
                  value={rhConfig.horarioPadrao || ''}
                  onChange={(e) => setRhConfig({ ...rhConfig, horarioPadrao: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Intervalo Padrão
                </label>
                <input
                  type="text"
                  value={rhConfig.intervaloPadrao || ''}
                  onChange={(e) => setRhConfig({ ...rhConfig, intervaloPadrao: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:border-indigo-600 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSavingConfig}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingConfig ? 'Gravando Configurações...' : 'Salvar Padrões do RH'}</span>
              </button>
            </div>

          </form>
        )}

      </div>

      {/* Modal para Download PNG / PDF de Anexo */}
      <AttachmentPreviewModal
        isOpen={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        fileData={previewAttachment}
      />

      {/* Modal de Confirmação para Excluir Ficha */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                Excluir Ficha de Admissão?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Tem certeza que deseja apagar a ficha de <strong className="text-slate-800">{itemToDelete.nomeFuncionario || 'Funcionário'}</strong>?
              </p>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 inline-block">
                Protocolo: {itemToDelete.protocolo || 'N/A'}
              </div>
              <p className="text-[11px] text-rose-500 font-medium">
                Esta ação é irreversível e removerá os dados do banco de dados.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteAdmission}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-rose-600/25 transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sim, Excluir</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
