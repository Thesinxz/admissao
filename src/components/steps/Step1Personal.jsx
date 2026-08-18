import React, { useState } from 'react';
import { User, MapPin, Building, Phone, Mail, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { maskCPF, maskCEP, maskPhone, maskDate, capitalizeWords } from '../../utils/masks';
import { fetchAddressByCep } from '../../services/viaCep';

export default function Step1Personal({ formData, updateFormData }) {
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [cepMessage, setCepMessage] = useState(null);

  const handleCepChange = async (e) => {
    const rawValue = e.target.value;
    const masked = maskCEP(rawValue);
    updateFormData({ cep: masked });

    const cleanCep = rawValue.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsSearchingCep(true);
      setCepMessage(null);
      const res = await fetchAddressByCep(cleanCep);
      setIsSearchingCep(false);

      if (res && !res.error) {
        updateFormData({
          endereco: capitalizeWords(res.logradouro) || formData.endereco || '',
          bairro: capitalizeWords(res.bairro) || formData.bairro || '',
          cidade: capitalizeWords(res.cidade) || formData.cidade || '',
          estado: res.estado || formData.estado || '',
          complemento: res.complemento || formData.complemento || ''
        });
        setCepMessage({ type: 'success', text: 'Endereço localizado com sucesso!' });
      } else {
        setCepMessage({ type: 'error', text: res?.error || 'CEP não encontrado' });
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold text-indigo-950 flex items-center">
          <Building className="w-5 h-5 mr-2 text-indigo-600" />
          Empresa e Identificação Básica
        </h3>
        <p className="text-xs sm:text-sm text-indigo-800/80 mt-1">
          Informe o nome da empresa contratante e os dados pessoais do funcionário para abertura do cadastro.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Empresa */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Empresa Contratante <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nome ou Razão Social da Empresa"
            autoCapitalize="words"
            value={formData.empresa || ''}
            onChange={(e) => updateFormData({ empresa: capitalizeWords(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
          />
        </div>

        {/* Nome do Funcionário */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Nome Completo do Funcionário <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nome sem abreviações"
            autoCapitalize="words"
            value={formData.nomeFuncionario || ''}
            onChange={(e) => updateFormData({ nomeFuncionario: capitalizeWords(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white font-medium"
          />
        </div>

        {/* Nome da Mãe */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Nome da Mãe <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nome completo da mãe"
            autoCapitalize="words"
            value={formData.nomeMae || ''}
            onChange={(e) => updateFormData({ nomeMae: capitalizeWords(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
          />
        </div>

        {/* Nome do Pai */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Nome do Pai (opcional)
          </label>
          <input
            type="text"
            placeholder="Nome completo do pai"
            autoCapitalize="words"
            value={formData.nomePai || ''}
            onChange={(e) => updateFormData({ nomePai: capitalizeWords(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
          />
        </div>

        {/* Data Nasc */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Data de Nascimento <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="DD/MM/AAAA"
            value={formData.dataNascimento || ''}
            onChange={(e) => updateFormData({ dataNascimento: maskDate(e.target.value) })}
            maxLength={10}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
          />
        </div>

        {/* Estado Civil */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Estado Civil <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.estadoCivil || ''}
            onChange={(e) => updateFormData({ estadoCivil: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
          >
            <option value="">Selecione...</option>
            <option value="Solteiro(a)">Solteiro(a)</option>
            <option value="Casado(a)">Casado(a)</option>
            <option value="União Estável">União Estável</option>
            <option value="Divorciado(a)">Divorciado(a)</option>
            <option value="Viúvo(a)">Viúvo(a)</option>
          </select>
        </div>

        {/* Nome Cônjuge (se casado ou união estável) */}
        {(formData.estadoCivil === 'Casado(a)' || formData.estadoCivil === 'União Estável') && (
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nome do Cônjuge
            </label>
            <input
              type="text"
              placeholder="Nome completo do(a) esposo(a) / companheiro(a)"
              autoCapitalize="words"
              value={formData.nomeConjuge || ''}
              onChange={(e) => updateFormData({ nomeConjuge: capitalizeWords(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>
        )}

        {/* Naturalidade e UF */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Naturalidade (Cidade onde nasceu) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Campo Grande"
            autoCapitalize="words"
            value={formData.naturalidade || ''}
            onChange={(e) => updateFormData({ naturalidade: capitalizeWords(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Estado de Nascimento (UF) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: MS"
            maxLength={2}
            value={formData.naturalidadeEstado || ''}
            onChange={(e) => updateFormData({ naturalidadeEstado: e.target.value.toUpperCase() })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white uppercase"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Nacionalidade <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Brasileira"
            autoCapitalize="words"
            value={formData.nacionalidade || 'Brasileira'}
            onChange={(e) => updateFormData({ nacionalidade: capitalizeWords(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
          />
        </div>

        {/* Contato Telefone/WhatsApp */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Telefone / WhatsApp <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="(00) 00000-0000"
            value={formData.telefone || ''}
            onChange={(e) => updateFormData({ telefone: maskPhone(e.target.value) })}
            maxLength={15}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
          />
        </div>
      </div>

      {/* Seção Endereço Residencial com Auto-preenchimento CEP */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
          <MapPin className="w-4 h-4 mr-1.5 text-indigo-600" />
          Endereço Residencial
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* CEP */}
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              CEP <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="00000-000"
                value={formData.cep || ''}
                onChange={handleCepChange}
                maxLength={9}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white font-mono"
              />
              <div className="absolute right-3 top-3.5 text-slate-400">
                {isSearchingCep ? (
                  <Search className="w-4 h-4 animate-spin text-indigo-600" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </div>
            </div>
            {cepMessage && (
              <p className={`text-[11px] mt-1 flex items-center ${cepMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>
                {cepMessage.type === 'success' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                {cepMessage.text}
              </p>
            )}
          </div>

          {/* Endereço / Logradouro */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Endereço (Rua, Av, Travessa) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Rua das Palmeiras"
              autoCapitalize="words"
              value={formData.endereco || ''}
              onChange={(e) => updateFormData({ endereco: capitalizeWords(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* Número */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Número <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: 123 ou S/N"
              value={formData.numero || ''}
              onChange={(e) => updateFormData({ numero: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* Complemento */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Complemento (Apto, Bloco, Casa)
            </label>
            <input
              type="text"
              placeholder="Ex: Apto 102"
              autoCapitalize="words"
              value={formData.complemento || ''}
              onChange={(e) => updateFormData({ complemento: capitalizeWords(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* Bairro */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Bairro <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Centro"
              autoCapitalize="words"
              value={formData.bairro || ''}
              onChange={(e) => updateFormData({ bairro: capitalizeWords(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* Cidade */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Cidade <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Campo Grande"
              autoCapitalize="words"
              value={formData.cidade || ''}
              onChange={(e) => updateFormData({ cidade: capitalizeWords(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* Estado UF */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Estado (UF) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: MS"
              maxLength={2}
              value={formData.estado || ''}
              onChange={(e) => updateFormData({ estado: e.target.value.toUpperCase() })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white uppercase"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
