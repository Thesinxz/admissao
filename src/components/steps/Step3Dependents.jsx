import React from 'react';
import { Users, Plus, Trash2, Heart, UserPlus, Info } from 'lucide-react';
import { maskCPF, maskDate, capitalizeWords } from '../../utils/masks';

export default function Step3Dependents({ formData, updateFormData }) {
  const dependentes = formData.dependentes || [];

  const addDependente = () => {
    const newDependente = {
      id: Date.now().toString(),
      nome: '',
      cpf: '',
      parentesco: 'Filho(a)',
      dataNascimento: ''
    };
    updateFormData({ dependentes: [...dependentes, newDependente] });
  };

  const removeDependente = (indexToRemove) => {
    const updated = dependentes.filter((_, idx) => idx !== indexToRemove);
    updateFormData({ dependentes: updated });
  };

  const updateDependente = (index, field, value) => {
    const updated = [...dependentes];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData({ dependentes: updated });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold text-pink-950 flex items-center">
          <Users className="w-5 h-5 mr-2 text-pink-600" />
          Dependentes (Salário Família e Imposto de Renda)
        </h3>
        <p className="text-xs sm:text-sm text-pink-800/80 mt-1">
          Informe seus dependentes legais (filhos, cônjuge, enteados). Caso não possua dependentes, você pode avançar normalmente.
        </p>
      </div>

      {dependentes.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">Nenhum dependente adicionado</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Possui filhos ou outros dependentes legais? Adicione-os para inclusão em benefícios e dedução fiscal.
          </p>
          <button
            type="button"
            onClick={addDependente}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 active:scale-95 text-white text-xs font-semibold shadow-md shadow-pink-600/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Adicionar Dependente</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {dependentes.map((dep, index) => (
            <div
              key={dep.id || index}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg">
                  Dependente #{index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => removeDependente(index)}
                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center py-1 px-2 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Remover
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Nome */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Nome do dependente"
                    autoCapitalize="words"
                    value={dep.nome || ''}
                    onChange={(e) => updateDependente(index, 'nome', capitalizeWords(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-600 focus:ring-2 focus:ring-pink-100 outline-none text-slate-800 text-sm transition-all bg-white"
                  />
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    value={dep.cpf || ''}
                    onChange={(e) => updateDependente(index, 'cpf', maskCPF(e.target.value))}
                    maxLength={14}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-600 focus:ring-2 focus:ring-pink-100 outline-none text-slate-800 text-sm font-mono transition-all bg-white"
                  />
                </div>

                {/* Grau de Parentesco */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Grau de Parentesco
                  </label>
                  <select
                    value={dep.parentesco || 'Filho(a)'}
                    onChange={(e) => updateDependente(index, 'parentesco', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-600 focus:ring-2 focus:ring-pink-100 outline-none text-slate-800 text-sm transition-all bg-white"
                  >
                    <option value="Filho(a)">Filho(a)</option>
                    <option value="Cônjuge / Companheiro(a)">Cônjuge / Companheiro(a)</option>
                    <option value="Enteado(a)">Enteado(a)</option>
                    <option value="Pai / Mãe">Pai / Mãe</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                {/* Data Nascimento */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="DD/MM/AAAA"
                    value={dep.dataNascimento || ''}
                    onChange={(e) => updateDependente(index, 'dataNascimento', maskDate(e.target.value))}
                    maxLength={10}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-600 focus:ring-2 focus:ring-pink-100 outline-none text-slate-800 text-sm font-mono transition-all bg-white"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addDependente}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-pink-300 hover:border-pink-500 bg-pink-50/40 hover:bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Mais Um Dependente</span>
          </button>
        </div>
      )}

      {/* Lembrete de Documentação de Filhos */}
      {dependentes.length > 0 && (
        <div className="flex items-start space-x-2 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Lembrete importante:</strong> Na etapa de Anexos a seguir, lembre-se de anexar a Certidão de Nascimento, Carteira de Vacinação (para filhos de até 7 anos) e Comprovante de Frequência Escolar (filhos de 7 a 14 anos).
          </div>
        </div>
      )}
    </div>
  );
}
