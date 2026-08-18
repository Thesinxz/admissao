import React from 'react';
import { CreditCard, Landmark, AlertCircle, CheckCircle } from 'lucide-react';
import { capitalizeWords } from '../../utils/masks';

const COMMON_BANKS = [
  "001 - Banco do Brasil S.A.",
  "237 - Banco Bradesco S.A.",
  "341 - Itaú Unibanco S.A.",
  "104 - Caixa Econômica Federal",
  "033 - Banco Santander (Brasil) S.A.",
  "260 - Nu Pagamentos S.A. (Nubank)",
  "077 - Banco Inter S.A.",
  "336 - Banco C6 S.A.",
  "748 - Banco Cooperativo Sicredi S.A.",
  "756 - Banco Cooperativo do Brasil S.A. (Sicoob)",
  "212 - Banco Original S.A.",
  "655 - Banco Votorantim S.A. (Neon)",
  "Outro Banco"
];

export default function Step4Banking({ formData, updateFormData }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-violet-950 flex items-center">
            <Landmark className="w-5 h-5 mr-2 text-violet-600" />
            Dados Bancários para Pagamento de Salário
          </h3>
          <span className="text-[10px] uppercase font-bold text-violet-700 bg-white px-2.5 py-0.5 rounded-full border border-violet-200">
            Opcional
          </span>
        </div>
        <p className="text-xs sm:text-sm text-violet-800/80 mt-1">
          Informe sua conta caso já possua. Se for abrir conta salário ou informar depois, você pode avançar normalmente.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Banco */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Instituição Bancária (opcional)
          </label>
          <select
            value={formData.banco || ''}
            onChange={(e) => updateFormData({ banco: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none text-slate-800 text-sm transition-all bg-white font-medium"
          >
            <option value="">Selecione seu banco (ou deixe em branco se não possuir)...</option>
            {COMMON_BANKS.map((banco) => (
              <option key={banco} value={banco}>{banco}</option>
            ))}
          </select>
        </div>

        {/* Se selecionou outro banco, campo de texto livre */}
        {formData.banco === 'Outro Banco' && (
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nome do Banco / Código
            </label>
            <input
              type="text"
              placeholder="Digite o nome do seu banco"
              autoCapitalize="words"
              value={formData.bancoOutro || ''}
              onChange={(e) => updateFormData({ bancoOutro: capitalizeWords(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none text-slate-800 text-sm transition-all bg-white"
            />
          </div>
        )}

        {/* Código da Agência */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Código da Agência (sem dígito)
          </label>
          <input
            type="text"
            placeholder="Ex: 1234"
            value={formData.agencia || ''}
            onChange={(e) => updateFormData({ agencia: e.target.value })}
            maxLength={8}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none text-slate-800 text-sm font-mono transition-all bg-white"
          />
        </div>

        {/* Tipo de Conta */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Tipo de Conta
          </label>
          <select
            value={formData.tipoConta || 'Conta Corrente'}
            onChange={(e) => updateFormData({ tipoConta: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none text-slate-800 text-sm transition-all bg-white"
          >
            <option value="Conta Corrente">Conta Corrente</option>
            <option value="Conta Salário">Conta Salário</option>
            <option value="Conta Poupança">Conta Poupança</option>
          </select>
        </div>

        {/* Nº da Conta com Dígito */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Número da Conta (com dígito verificador)
          </label>
          <input
            type="text"
            placeholder="Ex: 123456-7"
            value={formData.contaNumero || ''}
            onChange={(e) => updateFormData({ contaNumero: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none text-slate-800 text-sm font-mono transition-all bg-white font-medium"
          />
        </div>

        {/* Chave PIX opcional */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Chave PIX Vinculada a esta Conta (opcional)
          </label>
          <input
            type="text"
            placeholder="CPF, E-mail, Celular ou Chave Aleatória"
            value={formData.chavePix || ''}
            onChange={(e) => updateFormData({ chavePix: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none text-slate-800 text-sm transition-all bg-white"
          />
        </div>
      </div>

      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-2.5 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Aviso:</strong> Se informada, a conta bancária deve ser de <strong>titularidade do próprio funcionário</strong> (mesmo CPF).
        </div>
      </div>
    </div>
  );
}
