import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Shield, Users, Landmark, Paperclip, Briefcase, 
  CheckCircle2, ArrowRight, ArrowLeft, Save, Building2,
  FileCheck, ShieldCheck, Sparkles, LayoutDashboard
} from 'lucide-react';

import Step1Personal from './components/steps/Step1Personal';
import Step2Documents from './components/steps/Step2Documents';
import Step3Dependents from './components/steps/Step3Dependents';
import Step4Banking from './components/steps/Step4Banking';
import Step5Attachments from './components/steps/Step5Attachments';
import Step6AdmissionContract from './components/steps/Step6AdmissionContract';
import Step7ReviewSubmit from './components/steps/Step7ReviewSubmit';
import HRDashboard from './components/admin/HRDashboard';
import AdmissionPrintTemplate from './components/admin/AdmissionPrintTemplate';

const STEPS = [
  { id: 'pessoal', title: 'Pessoal & Endereço', icon: User, short: 'Pessoal' },
  { id: 'documentos', title: 'Documentos & Perfil', icon: Shield, short: 'Documentos' },
  { id: 'dependentes', title: 'Dependentes', icon: Users, short: 'Dependentes' },
  { id: 'banco', title: 'Dados Bancários', icon: Landmark, short: 'Banco' },
  { id: 'anexos', title: 'Anexos & Câmera', icon: Paperclip, short: 'Anexos' },
  { id: 'contrato', title: 'Contrato & Assinatura', icon: Briefcase, short: 'Contrato' },
  { id: 'revisao', title: 'Revisão & Envio', icon: CheckCircle2, short: 'Envio' },
];

// Obter data atual no formato DD/MM/AAAA para data de admissão e emissão padrão
const getTodayFormatted = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const INITIAL_FORM_DATA = {
  empresa: '',
  nomeFuncionario: '',
  nomeMae: '',
  nomePai: '',
  dataNascimento: '',
  estadoCivil: 'Solteiro(a)',
  nomeConjuge: '',
  naturalidade: 'Campo Grande',
  naturalidadeEstado: 'MS',
  nacionalidade: 'Brasileira',
  telefone: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: 'Campo Grande',
  estado: 'MS',
  
  cpf: '',
  rg: '',
  rgEmissor: 'SSP/MS',
  rgDataEmissao: '',
  pis: '',
  ctpsNumero: '',
  ctpsSerie: '0001/MS',
  ctpsDataEmissao: '',
  tituloEleitor: '',
  tituloZona: '',
  tituloSecao: '',
  reservistaNumero: '',
  reservistaCategoria: '1ª Cat',
  cnhNumero: '',
  cnhCategoria: 'B',
  cnhValidade: '',
  conselhoNome: '',
  conselhoNumero: '',
  conselhoValidade: '',

  corPele: 'Parda',
  corOlhos: 'Castanhos',
  altura: '1.70',
  peso: '70',
  escolaridade: 'Ensino Médio Completo',
  estudante: 'Não',
  deficiente: 'Não',
  tipoDeficiencia: '',

  dependentes: [],

  banco: '001 - Banco do Brasil S.A.',
  bancoOutro: '',
  agencia: '',
  tipoConta: 'Conta Corrente',
  contaNumero: '',
  chavePix: '',

  anexos: {},

  dataAdmissao: getTodayFormatted(),
  funcao: 'Auxiliar Administrativo',
  salario: 'R$ 1.950,00',
  tipoSalario: 'Mensal',
  horarioTrabalho: '08:00 às 18:00 (Segunda a Sexta) e Sábado das 08:00 às 12:00',
  intervalo: 'das 11:00 às 13:00',
  folga: 'Domingo',
  contratoExperiencia: '30 dias + 60 dias',
  valeTransporte: 'NÃO',
  valeDia20: 'SIM', // Adiantamento salarial / Vale até o dia 20
  valeDia20Percentual: '40%',
  dataExameAdmissional: getTodayFormatted(),
  outrasObservacoes: 'Admissão conforme convenção coletiva de trabalho.',
  assinaturaFuncionario: ''
};

import { getRHConfig, DEFAULT_RH_CONFIG } from './services/configService';
import { saveDraftPersistent, loadDraftPersistent, clearDraftPersistent } from './services/draftStorage';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [rhConfig, setRhConfig] = useState(DEFAULT_RH_CONFIG);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [lastSavedTime, setLastSavedTime] = useState('agora');
  const [validationError, setValidationError] = useState('');
  const [saveDraftMessage, setSaveDraftMessage] = useState(false);
  const [viewMode, setViewMode] = useState('form'); // 'form' | 'admin' | 'print'
  const [printData, setPrintData] = useState(null);

  // 1. Carregar rascunho persistido (IndexedDB + LocalStorage) e configurações do RH
  useEffect(() => {
    async function initApp() {
      const [cfg, draft] = await Promise.all([
        getRHConfig(),
        loadDraftPersistent()
      ]);

      setRhConfig(cfg);

      if (draft && draft.formData && Object.keys(draft.formData).length > 0) {
        setFormData(prev => ({
          ...INITIAL_FORM_DATA,
          ...draft.formData,
          empresa: draft.formData.empresa || cfg.empresaPadrao || '',
          contratoExperiencia: draft.formData.contratoExperiencia || cfg.contratoExperienciaPadrao,
          valeTransporte: draft.formData.valeTransporte || cfg.valeTransportePadrao,
          valeDia20: draft.formData.valeDia20 || cfg.valeDia20Padrao || 'SIM',
          valeDia20Percentual: draft.formData.valeDia20Percentual || cfg.valeDia20Percentual || '40%',
          intervalo: draft.formData.intervalo || cfg.intervaloPadrao || 'das 11:00 às 13:00',
          funcao: draft.formData.funcao || cfg.funcoesPadrao?.[0] || 'Auxiliar Administrativo'
        }));
        if (typeof draft.currentStep === 'number' && draft.currentStep >= 0 && draft.currentStep < STEPS.length) {
          setCurrentStep(draft.currentStep);
        }
      } else {
        setFormData(prev => ({
          ...prev,
          empresa: prev.empresa || cfg.empresaPadrao || prev.empresa,
          contratoExperiencia: prev.contratoExperiencia || cfg.contratoExperienciaPadrao,
          valeTransporte: prev.valeTransporte || cfg.valeTransportePadrao,
          valeDia20: prev.valeDia20 || cfg.valeDia20Padrao || 'SIM',
          valeDia20Percentual: prev.valeDia20Percentual || cfg.valeDia20Percentual || '40%',
          intervalo: prev.intervalo || cfg.intervaloPadrao || 'das 11:00 às 13:00',
          funcao: prev.funcao || cfg.funcoesPadrao?.[0] || prev.funcao
        }));
      }
    }
    initApp();
  }, []);

  // 2. Auto-salvar de forma contínua e persistente
  useEffect(() => {
    saveDraftPersistent(formData, currentStep);
    const now = new Date();
    const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(formatted);
  }, [formData, currentStep]);

  // 3. Sempre rolar para o topo da página ao mudar de etapa
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentStep]);

  const updateFormData = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
    setValidationError('');
  };

  const validateCurrentStep = () => {
    if (currentStep === 0) {
      if (!formData.empresa?.trim()) return 'Por favor, informe a Empresa Contratante.';
      if (!formData.nomeFuncionario?.trim()) return 'Por favor, informe o Nome Completo do Funcionário.';
      if (!formData.nomeMae?.trim()) return 'Por favor, informe o Nome da Mãe.';
      if (!formData.dataNascimento?.trim()) return 'Por favor, informe a Data de Nascimento.';
      if (!formData.estadoCivil) return 'Por favor, selecione o Estado Civil.';
      if (!formData.telefone?.trim()) return 'Por favor, informe o Telefone de Contato.';
      if (!formData.cep?.trim() || !formData.endereco?.trim() || !formData.cidade?.trim()) {
        return 'Por favor, preencha o endereço residencial completo (CEP, Endereço e Cidade).';
      }
    } else if (currentStep === 1) {
      if (!formData.cpf?.trim()) return 'Por favor, preencha o CPF do funcionário.';
      if (!formData.rg?.trim()) return 'Por favor, preencha o número do RG.';
      if (!formData.rgEmissor?.trim()) return 'Por favor, preencha o Órgão/UF Emissor do RG.';
    } else if (currentStep === 5) {
      if (!formData.dataAdmissao?.trim()) return 'Por favor, informe a data prevista de admissão.';
      if (!formData.funcao?.trim()) return 'Por favor, informe a função/cargo.';
      if (!formData.assinaturaFuncionario) return 'Por favor, assine digitalmente o termo no campo de assinatura.';
    }
    return null;
  };

  const handleNext = () => {
    const error = validateCurrentStep();
    if (error) {
      setValidationError(error);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setValidationError('');
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setValidationError('');
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveDraftManual = async () => {
    await saveDraftPersistent(formData, currentStep);
    setSaveDraftMessage(true);
    setTimeout(() => setSaveDraftMessage(false), 2500);
  };

  const handleResetForm = async () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados preenchidos e reiniciar o formulário?')) {
      await clearDraftPersistent();
      setFormData({
        ...INITIAL_FORM_DATA,
        empresa: rhConfig.empresaPadrao || '',
        contratoExperiencia: rhConfig.contratoExperienciaPadrao || '45 dias + 45 dias',
        valeTransporte: rhConfig.valeTransportePadrao || 'NÃO',
        valeDia20: rhConfig.valeDia20Padrao || 'SIM',
        valeDia20Percentual: rhConfig.valeDia20Percentual || '40%',
        funcao: rhConfig.funcoesPadrao?.[0] || 'Auxiliar Administrativo'
      });
      setCurrentStep(0);
    }
  };

  const stepContainerRef = useRef(null);

  const handleKeyDownEnter = (e) => {
    if (e.key === 'Enter') {
      const active = document.activeElement;
      if (!active) return;

      // Se estiver em textarea, botão ou radio/checkbox, mantém o comportamento padrão
      if (active.tagName === 'TEXTAREA' || active.tagName === 'BUTTON') return;
      if (active.type === 'radio' || active.type === 'checkbox') return;

      e.preventDefault();

      // Procura todos os campos focáveis dentro do container da etapa atual
      const formContainer = stepContainerRef.current;
      if (!formContainer) return;

      const focusable = Array.from(
        formContainer.querySelectorAll(
          'input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]):not([disabled]), select:not([disabled]), textarea:not([disabled])'
        )
      );

      const index = focusable.indexOf(active);
      if (index !== -1 && index < focusable.length - 1) {
        focusable[index + 1].focus();
      } else if (index === focusable.length - 1) {
        // Se for o último campo da etapa, aciona o próximo passo
        handleNext();
      }
    }
  };

  const handleViewPrint = (dataToPrint) => {
    setPrintData(dataToPrint || formData);
    setViewMode('print');
  };

  if (viewMode === 'admin') {
    return <HRDashboard onBackToForm={() => setViewMode('form')} />;
  }

  if (viewMode === 'print') {
    return <AdmissionPrintTemplate data={printData || formData} onBack={() => setViewMode('form')} />;
  }

  const CurrentStepComponent = [
    Step1Personal,
    Step2Documents,
    Step3Dependents,
    Step4Banking,
    Step5Attachments,
    Step6AdmissionContract,
    Step7ReviewSubmit,
  ][currentStep];

  const progressPercentage = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                Admissão Digital
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Ficha Cadastral Oficial de Funcionários
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200" title="Suas alterações são salvas automaticamente no aparelho">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Salvo automaticamente</span>
            </div>

            <button
              onClick={handleSaveDraftManual}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 active:scale-95 text-xs font-semibold text-slate-700 transition-all"
              title="Salvar rascunho manualmente"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Salvar</span>
            </button>

            <button
              onClick={() => setViewMode('admin')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 active:scale-95 text-xs font-semibold transition-all border border-indigo-100"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Painel RH</span>
            </button>
          </div>
        </div>

        {/* Barra de Progresso no Topo */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-gradient-to-r from-indigo-600 to-teal-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* Rascunho Salvo Toast */}
      {saveDraftMessage && (
        <div className="fixed top-16 right-4 z-40 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 animate-fade-in border border-slate-700">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Rascunho salvo localmente com sucesso!</span>
        </div>
      )}

      {/* Main Form Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
        
        {/* Step Indicator Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Etapa {currentStep + 1} de {STEPS.length}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {STEPS[currentStep].title}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              {progressPercentage}% concluído
            </span>
          </div>

          {/* Stepper Dots / Icons on larger screen */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    if (idx <= currentStep) {
                      setValidationError('');
                      setCurrentStep(idx);
                    }
                  }}
                  disabled={idx > currentStep}
                  className={`flex flex-col items-center p-2 rounded-xl text-center transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer font-medium'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  <span className="text-[9px] sm:text-[10px] truncate max-w-full leading-tight">
                    {step.short}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center space-x-2 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Step Component Content Card */}
        <div
          ref={stepContainerRef}
          onKeyDown={handleKeyDownEnter}
          className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-sm flex-1 mb-6"
        >
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            rhConfig={rhConfig}
            onEditStep={(stepIdx) => setCurrentStep(stepIdx)}
            onViewPrintTemplate={handleViewPrint}
            onResetForm={handleResetForm}
          />

          {/* Wizard Navigation Buttons ao final do formulário (Oculto no Step 7 final) */}
          {currentStep < STEPS.length - 1 && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center space-x-1.5 px-4 sm:px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 active:scale-95 text-xs sm:text-sm font-semibold text-slate-700 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <div className="text-[11px] text-slate-400 font-medium">
                Passo {currentStep + 1} de {STEPS.length}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-1.5 px-6 sm:px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/25 transition-all"
              >
                <span>{currentStep === STEPS.length - 2 ? 'Revisar Informações' : 'Continuar'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200">
        Ficha de Admissão de Funcionário • Armazenamento Seguro com Firebase
      </footer>
    </div>
  );
}
