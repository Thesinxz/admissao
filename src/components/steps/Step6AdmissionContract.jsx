import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, Calendar, Clock, DollarSign, Bus, FileCheck, Award, ShieldAlert, MapPin, Navigation, RefreshCw } from 'lucide-react';
import { maskDate, maskCurrency, capitalizeWords } from '../../utils/masks';
import SignaturePad from '../signature/SignaturePad';

const BRAZIL_STATE_MAP = {
  'Acre': 'AC', 'Alagoas': 'AL', 'Amapá': 'AP', 'Amazonas': 'AM',
  'Bahia': 'BA', 'Ceará': 'CE', 'Distrito Federal': 'DF', 'Espírito Santo': 'ES',
  'Goiás': 'GO', 'Maranhão': 'MA', 'Mato Grosso': 'MT', 'Mato Grosso do Sul': 'MS',
  'Minas Gerais': 'MG', 'Pará': 'PA', 'Paraíba': 'PB', 'Paraná': 'PR',
  'Pernambuco': 'PE', 'Piauí': 'PI', 'Rio de Janeiro': 'RJ', 'Rio Grande do Norte': 'RN',
  'Rio Grande do Sul': 'RS', 'Rondônia': 'RO', 'Roraima': 'RR', 'Santa Catarina': 'SC',
  'São Paulo': 'SP', 'Sergipe': 'SE', 'Tocantins': 'TO'
};

const TRIAL_OPTIONS = [
  "30 dias + 60 dias",
  "45 dias + 45 dias",
  "30 dias + 30 dias",
  "90 dias",
  "Não vai fazer contrato de experiência"
];

const DAYS_OF_WEEK = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Escala 12x36",
  "Escala 6x1"
];

const COMMON_ROLES = [
  "Auxiliar Administrativo",
  "Vendedor(a)",
  "Operador(a) de Caixa",
  "Atendente / Balconista",
  "Auxiliar de Serviços Gerais",
  "Estoquista / Repositor",
  "Motorista / Entregador",
  "Assistente Financeiro",
  "Gerente"
];

const COMMON_SCHEDULES = [
  "08:00 às 18:00 (Segunda a Sexta) e Sábado das 08:00 às 12:00",
  "08:00 às 18:00 (Segunda a Sexta)",
  "08:00 às 17:00 (Seg a Sex) e 08:00 às 12:00 (Sáb)",
  "12x36 (07:00 às 19:00)",
  "13:40 às 22:00 (Escala 6x1)"
];

const COMMON_INTERVALS = [
  "das 11:00 às 13:00",
  "11:00 às 13:00",
  "das 12:00 às 13:12",
  "das 12:00 às 13:00",
  "1 hora de intervalo"
];

export default function Step6AdmissionContract({ formData, updateFormData, rhConfig }) {
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('');

  const detectCityGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsStatus('GPS não suportado');
      return;
    }

    setIsDetectingGps(true);
    setGpsStatus('Obtendo localização pelo GPS do celular...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            { headers: { 'Accept-Language': 'pt-BR' } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const rawCity = addr.city || addr.town || addr.municipality || addr.village || addr.suburb || addr.city_district || addr.county;
            const state = addr.state;
            const uf = state ? (BRAZIL_STATE_MAP[state] || state) : (formData.estado || 'MS');

            if (rawCity) {
              const formattedLoc = `${capitalizeWords(rawCity)}-${uf}`;
              updateFormData({ localidadeAssinatura: formattedLoc });
              setGpsStatus(`Localizado via GPS: ${formattedLoc}`);
            }
          }
        } catch (err) {
          console.warn('Erro ao obter cidade por GPS:', err);
        } finally {
          setIsDetectingGps(false);
        }
      },
      (err) => {
        console.warn('Permissão de GPS:', err);
        setIsDetectingGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, [formData.estado, updateFormData]);

  useEffect(() => {
    if (!formData.localidadeAssinatura) {
      const fallbackLoc = formData.cidade && formData.estado ? `${formData.cidade}-${formData.estado}` : 'Campo Grande-MS';
      updateFormData({ localidadeAssinatura: fallbackLoc });
      detectCityGps();
    }
  }, [detectCityGps, formData.localidadeAssinatura, formData.cidade, formData.estado, updateFormData]);

  // Obter data atual por extenso
  const currentDate = new Date();
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const formattedToday = `${currentDate.getDate()} de ${months[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;

  // Opções de contrato configuradas pelo RH (ou fallback para 45+45 e 30+60)
  const allowedTrialOptions = rhConfig?.contratoOpcoesPermitidas?.length > 0 
    ? rhConfig.contratoOpcoesPermitidas 
    : ["45 dias + 45 dias", "30 dias + 60 dias", "30 dias + 30 dias", "90 dias", "Não vai fazer contrato de experiência"];

  const rolesList = rhConfig?.funcoesPadrao?.length > 0 ? rhConfig.funcoesPadrao : COMMON_ROLES;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold text-amber-950 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-amber-600" />
          Dados da Admissão e Termo de Responsabilidade (Página 2)
        </h3>
        <p className="text-xs sm:text-sm text-amber-800/80 mt-1">
          Confira as condições contratuais acordadas e assine digitalmente o termo de veracidade das informações.
        </p>
      </div>

      {/* Dados Admissionais */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
          <Award className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
          Condições de Contratação
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Data de Admissão */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Data de Admissão <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              value={formData.dataAdmissao || ''}
              onChange={(e) => updateFormData({ dataAdmissao: maskDate(e.target.value) })}
              maxLength={10}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white font-medium"
            />
          </div>

          {/* Função / Cargo com Sugestões Rápidas de Fábrica */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Função / Cargo <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-indigo-600 font-medium hidden sm:inline">Sugestões de fábrica abaixo:</span>
            </div>
            <input
              type="text"
              placeholder="Ex: Assistente Administrativo, Vendedor, etc."
              autoCapitalize="words"
              value={formData.funcao || ''}
              onChange={(e) => updateFormData({ funcao: capitalizeWords(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white font-semibold"
            />
            {/* Chips de funções configuradas pelo RH */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {rolesList.map((cargo) => (
                <button
                  key={cargo}
                  type="button"
                  onClick={() => updateFormData({ funcao: cargo })}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    formData.funcao === cargo
                      ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {cargo}
                </button>
              ))}
            </div>
          </div>

          {/* Salário */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Salário (R$)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="R$ 0,00"
              value={formData.salario || ''}
              onChange={(e) => updateFormData({ salario: maskCurrency(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm font-bold text-slate-900 transition-all bg-white"
            />
          </div>

          {/* Tipo de Salário */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tipo de Salário
            </label>
            <select
              value={formData.tipoSalario || 'Mensal'}
              onChange={(e) => updateFormData({ tipoSalario: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white font-medium"
            >
              <option value="Mensal">Mensal</option>
              <option value="Semanal">Semanal</option>
              <option value="Quinzenal">Quinzenal</option>
              <option value="Horista">Horista</option>
            </select>
          </div>

          {/* Horário de Trabalho */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Horário de Trabalho
            </label>
            <input
              type="text"
              placeholder="Ex: 08:00 às 18:00 (Segunda a Sexta)"
              value={formData.horarioTrabalho || ''}
              onChange={(e) => updateFormData({ horarioTrabalho: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
            {/* Chips de horários pré-configurados */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_SCHEDULES.slice(0, 3).map((sched) => (
                <button
                  key={sched}
                  type="button"
                  onClick={() => updateFormData({ horarioTrabalho: sched })}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                    formData.horarioTrabalho === sched
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {sched}
                </button>
              ))}
            </div>
          </div>

          {/* Intervalo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Intervalo de Almoço/Refeição
            </label>
            <input
              type="text"
              placeholder="Ex: das 12:00 às 13:12"
              value={formData.intervalo || ''}
              onChange={(e) => updateFormData({ intervalo: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* Folga */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Folga (Dia da Semana)
            </label>
            <select
              value={formData.folga || 'Domingo'}
              onChange={(e) => updateFormData({ folga: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white font-medium"
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Data do Exame Admissional */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Data do Exame Admissional
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              value={formData.dataExameAdmissional || ''}
              onChange={(e) => updateFormData({ dataExameAdmissional: maskDate(e.target.value) })}
              maxLength={10}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm font-mono transition-all bg-white"
            />
          </div>

          {/* Contrato de Experiência (Configurado pelo RH: 45+45, 30+60, etc.) */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Contrato de Experiência (Modalidade acordada)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {allowedTrialOptions.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.contratoExperiencia === opt
                      ? 'bg-indigo-50/80 border-indigo-600 text-indigo-900 font-medium shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="contratoExperiencia"
                    value={opt}
                    checked={formData.contratoExperiencia === opt}
                    onChange={(e) => updateFormData({ contratoExperiencia: e.target.value })}
                    className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Vale Transporte: Opcional com Decisão do Funcionário */}
          <div className="sm:col-span-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                <Bus className="w-4 h-4 mr-1.5 text-indigo-600" />
                Opção de Vale Transporte (Opcional - Decisão do Funcionário)
              </label>
              <span className="text-[10px] text-indigo-700 font-semibold bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                Escolha do Colaborador
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Você deseja receber Vale Transporte para seu deslocamento diário residência-trabalho?
            </p>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <label className="flex items-center space-x-2 text-xs sm:text-sm text-slate-800 cursor-pointer bg-white px-3 sm:px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-400 transition-all">
                <input
                  type="radio"
                  name="valeTransporte"
                  value="SIM"
                  checked={formData.valeTransporte === 'SIM'}
                  onChange={(e) => updateFormData({ valeTransporte: e.target.value })}
                  className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="font-bold text-indigo-950">SIM, desejo receber VT</span>
              </label>
              <label className="flex items-center space-x-2 text-xs sm:text-sm text-slate-800 cursor-pointer bg-white px-3 sm:px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-400 transition-all">
                <input
                  type="radio"
                  name="valeTransporte"
                  value="NÃO"
                  checked={formData.valeTransporte === 'NÃO'}
                  onChange={(e) => updateFormData({ valeTransporte: e.target.value })}
                  className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="font-bold text-slate-700">NÃO preciso de VT</span>
              </label>
            </div>
          </div>

          {/* Vale / Adiantamento Salarial até o Dia 20 */}
          <div className="sm:col-span-3 p-4 sm:p-5 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                <DollarSign className="w-4 h-4 mr-1.5 text-emerald-600" />
                Adiantamento Salarial / Vale Quinzenal (Até o dia 20)
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                Opção do Colaborador
              </span>
            </div>
            
            <p className="text-xs text-slate-600">
              Deseja receber adiantamento de salário (vale quinzenal de até 40%) pago todo dia 20 de cada mês?
            </p>

            {/* Escolha Principal: SIM ou NÃO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                formData.valeDia20 === 'SIM'
                  ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="valeDia20"
                  value="SIM"
                  checked={formData.valeDia20 === 'SIM'}
                  onChange={(e) => updateFormData({ valeDia20: e.target.value })}
                  className="text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-emerald-950 block">SIM, desejo receber Vale (Dia 20)</span>
                  <span className="text-[11px] text-emerald-700 block">Adiantamento quinzenal no dia 20 do mês</span>
                </div>
              </label>

              <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                formData.valeDia20 === 'NÃO'
                  ? 'bg-slate-100 border-slate-400 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="valeDia20"
                  value="NÃO"
                  checked={formData.valeDia20 === 'NÃO'}
                  onChange={(e) => updateFormData({ valeDia20: e.target.value })}
                  className="text-slate-600 focus:ring-slate-500 w-4 h-4"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 block">NÃO desejo Vale Quinzenal</span>
                  <span className="text-[11px] text-slate-500 block">Receber salário integral 100% no 5º dia útil</span>
                </div>
              </label>
            </div>

            {/* Se optou por SIM, seleção do percentual de preferência */}
            {formData.valeDia20 === 'SIM' && (
              <div className="pt-3 border-t border-emerald-200/60 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">
                    Selecione qual percentual de adiantamento você prefere:
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200 font-mono">
                    Selecionado: {formData.valeDia20Percentual || '40%'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: '40% (Máximo Padrão)', value: '40%' },
                    { label: '30% do Salário', value: '30%' },
                    { label: '20% do Salário', value: '20%' },
                    { label: '10% do Salário', value: '10%' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateFormData({ valeDia20Percentual: opt.value })}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        formData.valeDia20Percentual === opt.value
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                          : 'bg-white hover:bg-emerald-50 text-slate-700 border-emerald-200 text-xs font-medium'
                      }`}
                    >
                      <span className="text-xs block">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Outros / Observações */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Outras Informações / Observações
            </label>
            <textarea
              rows={2}
              placeholder="Informações adicionais relevantes para admissão..."
              value={formData.outrasObservacoes || ''}
              onChange={(e) => updateFormData({ outrasObservacoes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>
        </div>
      </div>

      {/* Portaria MTE e Declaração Legal */}
      <div className="pt-4 border-t border-slate-200">
        <div className="bg-amber-50/70 text-slate-800 p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3">
          <div className="flex items-start space-x-2 text-amber-800">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Portaria 01 do MTE - Art. 15°
            </h5>
          </div>
          <p className="text-xs leading-relaxed text-slate-700 italic">
            "Será inválida a Carteira de Trabalho e Previdência Social – CTPS que apresentar emendas, rasuras, falta ou troca de fotografias e que não contiver a impressão digital do titular, sua assinatura e assinatura do emissor, salvo exceções previstas no art. 4° e seus § 1° desta Portaria."
          </p>
          <div className="pt-2 border-t border-amber-200/70 flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-900">
              Assumo inteira responsabilidade pelas informações aqui prestadas.
            </span>
          </div>
        </div>
      </div>

      {/* Localidade e Data (Detectada por GPS com opção de ajuste) */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-600">Local e Data:</span>
              <strong className="text-slate-900 font-bold">
                {formData.localidadeAssinatura || `${formData.cidade || 'Campo Grande'}-${formData.estado || 'MS'}`}, {formattedToday}
              </strong>
            </div>
            {gpsStatus ? (
              <p className="text-[11px] text-indigo-600 font-medium mt-0.5">
                {gpsStatus}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-0.5">
                Registro com carimbo de data/hora eletrônico
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={detectCityGps}
          disabled={isDetectingGps}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 active:scale-95 text-xs font-semibold text-slate-700 shadow-xs transition-all disabled:opacity-50 self-end sm:self-center"
          title="Detectar cidade atual usando GPS do aparelho"
        >
          {isDetectingGps ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-indigo-600" />
          )}
          <span>{isDetectingGps ? 'Localizando...' : 'Atualizar GPS'}</span>
        </button>
      </div>

      {/* Assinatura Digital do Funcionário */}
      <div className="pt-2">
        <SignaturePad
          title="Assinatura Digital do Funcionário *"
          value={formData.assinaturaFuncionario || ''}
          onChange={(sigData) => updateFormData({ assinaturaFuncionario: sigData })}
        />
      </div>
    </div>
  );
}
