import React from 'react';
import { FileText, Shield, UserCheck, Eye, Sparkles } from 'lucide-react';
import { maskCPF, maskRG, maskDate, maskPIS, maskVoterTitle, isValidCPF, capitalizeWords } from '../../utils/masks';

export default function Step2Documents({ formData, updateFormData }) {
  const isCpfValid = formData.cpf ? isValidCPF(formData.cpf) : true;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold text-emerald-950 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-emerald-600" />
          Documentos Pessoais & Perfil
        </h3>
        <p className="text-xs sm:text-sm text-emerald-800/80 mt-1">
          Preencha os números e dados de registro para formalização dos livros de admissão e eSocial.
        </p>
      </div>

      {/* Seção 1: Documentos Principais */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
          <FileText className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
          Documentação Civil Obrigatória
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* CPF */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              CPF <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={formData.cpf || ''}
              onChange={(e) => updateFormData({ cpf: maskCPF(e.target.value) })}
              maxLength={14}
              className={`w-full px-4 py-3 rounded-xl border ${
                formData.cpf && !isCpfValid ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              } focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm font-mono transition-all bg-white`}
            />
            {formData.cpf && !isCpfValid && (
              <p className="text-[11px] text-rose-500 mt-1">CPF com dígitos verificadores inválidos</p>
            )}
          </div>

          {/* RG / CIN */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              RG / Nova CIN (CPF) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00 ou RG Estadual"
              value={formData.rg || ''}
              onChange={(e) => updateFormData({ rg: maskRG(e.target.value) })}
              maxLength={18}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm font-mono transition-all bg-white"
            />
            <p className="text-[10px] text-slate-400 mt-1">Aceita a nova CIN (número do CPF) ou RG tradicional</p>
          </div>

          {/* Estado Emissor RG */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Órgão / UF Emissor <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: SSP/MS"
              value={formData.rgEmissor || ''}
              onChange={(e) => updateFormData({ rgEmissor: e.target.value.toUpperCase() })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white uppercase"
            />
          </div>

          {/* Data Emissão RG */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Data Emissão RG <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              value={formData.rgDataEmissao || ''}
              onChange={(e) => updateFormData({ rgDataEmissao: maskDate(e.target.value) })}
              maxLength={10}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm font-mono transition-all bg-white"
            />
          </div>

          {/* PIS / PASEP */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              PIS / PASEP / NIT
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="000.00000.00-0"
              value={formData.pis || ''}
              onChange={(e) => updateFormData({ pis: maskPIS(e.target.value) })}
              maxLength={14}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm font-mono transition-all bg-white"
            />
          </div>

          {/* CTPS Nº */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              CTPS Nº (ou Digital)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Nº Carteira de Trabalho"
              value={formData.ctpsNumero || ''}
              onChange={(e) => updateFormData({ ctpsNumero: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* CTPS Série */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Série / UF
            </label>
            <input
              type="text"
              placeholder="Ex: 0001 / MS"
              value={formData.ctpsSerie || ''}
              onChange={(e) => updateFormData({ ctpsSerie: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* CTPS Data Emissão */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Data Emissão CTPS
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              value={formData.ctpsDataEmissao || ''}
              onChange={(e) => updateFormData({ ctpsDataEmissao: maskDate(e.target.value) })}
              maxLength={10}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm font-mono transition-all bg-white"
            />
          </div>

          {/* Título de Eleitor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Título de Eleitor
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000"
              value={formData.tituloEleitor || ''}
              onChange={(e) => updateFormData({ tituloEleitor: maskVoterTitle(e.target.value) })}
              maxLength={14}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm font-mono transition-all bg-white"
            />
          </div>

          {/* Zona */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Zona Eleitoral
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Zona (ex: 036)"
              value={formData.tituloZona || ''}
              onChange={(e) => updateFormData({ tituloZona: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* Seção */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Seção Eleitoral
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Seção (ex: 0142)"
              value={formData.tituloSecao || ''}
              onChange={(e) => updateFormData({ tituloSecao: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* Reservista */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Certificado Reservista
            </label>
            <input
              type="text"
              placeholder="Nº Reservista"
              value={formData.reservistaNumero || ''}
              onChange={(e) => updateFormData({ reservistaNumero: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* Reservista Categoria */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Categoria Reservista
            </label>
            <input
              type="text"
              placeholder="Ex: 1ª ou 2ª Cat"
              value={formData.reservistaCategoria || ''}
              onChange={(e) => updateFormData({ reservistaCategoria: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* CNH */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              CNH Nº
            </label>
            <input
              type="text"
              placeholder="Nº de registro da CNH"
              value={formData.cnhNumero || ''}
              onChange={(e) => updateFormData({ cnhNumero: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* CNH Categoria */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Categoria CNH
            </label>
            <input
              type="text"
              placeholder="Ex: A, B, AB, D"
              value={formData.cnhCategoria || ''}
              onChange={(e) => updateFormData({ cnhCategoria: e.target.value.toUpperCase() })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white uppercase"
            />
          </div>

          {/* CNH Validade */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Validade CNH
            </label>
            <input
              type="text"
              placeholder="DD/MM/AAAA"
              value={formData.cnhValidade || ''}
              onChange={(e) => updateFormData({ cnhValidade: maskDate(e.target.value) })}
              maxLength={10}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* Conselho Regional */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Conselho Regional (Ex: CRM, CREA, CRC, OAB)
            </label>
            <input
              type="text"
              placeholder="Sigla do Conselho"
              value={formData.conselhoNome || ''}
              onChange={(e) => updateFormData({ conselhoNome: e.target.value.toUpperCase() })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nº Registro Conselho
            </label>
            <input
              type="text"
              placeholder="Nº de inscrição"
              value={formData.conselhoNumero || ''}
              onChange={(e) => updateFormData({ conselhoNumero: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Data Validade Conselho
            </label>
            <input
              type="text"
              placeholder="DD/MM/AAAA"
              value={formData.conselhoValidade || ''}
              onChange={(e) => updateFormData({ conselhoValidade: maskDate(e.target.value) })}
              maxLength={10}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>
        </div>
      </div>

      {/* Seção 2: Características Físicas e Sociais */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
          <Eye className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
          Características Físicas, Grau de Instrução e Acessibilidade
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Cor da Pele / Raça */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Cor da Pele / Raça
            </label>
            <select
              value={formData.corPele || ''}
              onChange={(e) => updateFormData({ corPele: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            >
              <option value="">Selecione...</option>
              <option value="Branca">Branca</option>
              <option value="Parda">Parda</option>
              <option value="Preta">Preta</option>
              <option value="Amarela">Amarela</option>
              <option value="Indígena">Indígena</option>
            </select>
          </div>

          {/* Cor Olhos */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Cor dos Olhos
            </label>
            <input
              type="text"
              placeholder="Ex: Castanhos, Verdes, Azuis"
              autoCapitalize="words"
              value={formData.corOlhos || ''}
              onChange={(e) => updateFormData({ corOlhos: capitalizeWords(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* Altura */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Altura (m)
            </label>
            <input
              type="text"
              placeholder="Ex: 1.75"
              value={formData.altura || ''}
              onChange={(e) => updateFormData({ altura: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* Peso */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Peso (kg)
            </label>
            <input
              type="text"
              placeholder="Ex: 75"
              value={formData.peso || ''}
              onChange={(e) => updateFormData({ peso: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>

          {/* Escolaridade */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Escolaridade
            </label>
            <select
              value={formData.escolaridade || ''}
              onChange={(e) => updateFormData({ escolaridade: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
            >
              <option value="">Selecione o nível de escolaridade...</option>
              <option value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</option>
              <option value="Ensino Fundamental Completo">Ensino Fundamental Completo</option>
              <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
              <option value="Ensino Médio Completo">Ensino Médio Completo</option>
              <option value="Ensino Superior Incompleto">Ensino Superior Incompleto</option>
              <option value="Ensino Superior Completo">Ensino Superior Completo</option>
              <option value="Pós-Graduação / Especialização">Pós-Graduação / Especialização</option>
              <option value="Mestrado / Doutorado">Mestrado / Doutorado</option>
            </select>
          </div>

          {/* Estudante Sim/Não */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Atualmente é Estudante?
            </label>
            <div className="flex items-center space-x-4 pt-2">
              <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="estudante"
                  value="Sim"
                  checked={formData.estudante === 'Sim'}
                  onChange={(e) => updateFormData({ estudante: e.target.value })}
                  className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Sim</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="estudante"
                  value="Não"
                  checked={formData.estudante === 'Não' || !formData.estudante}
                  onChange={(e) => updateFormData({ estudante: e.target.value })}
                  className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Não</span>
              </label>
            </div>
          </div>

          {/* PCD / Deficiência */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Pessoa com Deficiência (PCD)?
            </label>
            <div className="flex items-center space-x-4 pt-2">
              <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="deficiente"
                  value="Sim"
                  checked={formData.deficiente === 'Sim'}
                  onChange={(e) => updateFormData({ deficiente: e.target.value })}
                  className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Sim</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="deficiente"
                  value="Não"
                  checked={formData.deficiente === 'Não' || !formData.deficiente}
                  onChange={(e) => updateFormData({ deficiente: e.target.value })}
                  className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Não</span>
              </label>
            </div>
          </div>

          {/* Tipo de Deficiência (se sim) */}
          {formData.deficiente === 'Sim' && (
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tipo de Deficiência / Laudo
              </label>
              <input
                type="text"
                placeholder="Ex: Física, Auditiva, Visual, Intelectual, etc."
                autoCapitalize="words"
                value={formData.tipoDeficiencia || ''}
                onChange={(e) => updateFormData({ tipoDeficiencia: capitalizeWords(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm transition-all bg-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
