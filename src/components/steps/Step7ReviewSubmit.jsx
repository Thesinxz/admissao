import React, { useState } from 'react';
import { CheckCircle2, FileText, Send, AlertTriangle, ShieldCheck, Printer, RefreshCw, Sparkles, Download, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitAdmission } from '../../services/admissionService';
import { clearDraftPersistent } from '../../services/draftStorage';
import { downloadAsPDF } from '../../utils/downloadHelper';
import AttachmentPreviewModal from '../attachments/AttachmentPreviewModal';

export default function Step7ReviewSubmit({ formData, onEditStep, onViewPrintTemplate, onResetForm }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [previewAttachment, setPreviewAttachment] = useState(null);

  const anexos = formData.anexos || {};
  const anexoKeys = Object.keys(anexos);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitAdmission(formData, (current, total, statusText) => {
        setUploadProgress({ current, total, statusText });
      });

      setSubmissionResult(result);
      setIsSubmitting(false);

      // Limpar rascunho após envio confirmado
      await clearDraftPersistent();

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (cErr) {
        console.log('Confetti not available:', cErr);
      }
    } catch (err) {
      console.error('Erro detalhado no envio da admissão:', err.code, err.message, err);
      let errorMsg = 'Houve um problema ao concluir o envio. Verifique a sua conexão com a internet e tente novamente.';
      if (err.code === 'permission-denied') {
        errorMsg = 'Permissão negada no Firestore (permission-denied). Acesse o Firebase Console > Firestore Database > Regras e defina allow read, write: if true;';
      } else if (err.code === 'unavailable') {
        errorMsg = 'Serviço temporariamente indisponível. Verifique sua conexão com a internet.';
      }
      setSubmitError(errorMsg);
      setIsSubmitting(false);
    }
  };

  // Se já foi enviado com sucesso, mostra tela de conclusão
  if (submissionResult) {
    return (
      <div className="space-y-6 text-center py-6 animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Admissão Enviada com Sucesso!
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-3">
            Ficha de Admissão Protocolada
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
            Os dados e documentos do funcionário <strong>{formData.nomeFuncionario}</strong> foram salvos e transmitidos com segurança para o RH da empresa.
          </p>
        </div>

        {/* Card do Protocolo */}
        <div className="max-w-md mx-auto p-5 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl shadow-xl">
          <span className="text-xs text-indigo-300 font-medium uppercase tracking-wider">Número de Protocolo</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 mt-1 tracking-wider">
            {submissionResult.protocolo}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Empresa: {formData.empresa}</span>
            <span>{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-md mx-auto">
          <button
            onClick={() => onViewPrintTemplate(formData)}
            className="w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Visualizar Ficha Oficial (2 Págs)</span>
          </button>

          <button
            onClick={onResetForm}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-semibold text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Novo Preenchimento</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold flex items-center text-blue-950">
          <ShieldCheck className="w-5 h-5 mr-2 text-indigo-600" />
          Revisão Final e Envio Seguro
        </h3>
        <p className="text-xs sm:text-sm text-blue-800/80 mt-1">
          Revise atentamente os dados cadastrais antes do envio para o banco de dados da empresa.
        </p>
      </div>

      {/* Resumo dos Blocos */}
      <div className="space-y-4">
        {/* Bloco 1: Pessoal */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">1. Dados Pessoais & Residenciais</h4>
            <button
              onClick={() => onEditStep(0)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Editar
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <div><strong className="text-slate-500">Empresa:</strong> {formData.empresa || '-'}</div>
            <div><strong className="text-slate-500">Funcionário:</strong> <span className="font-bold text-slate-900">{formData.nomeFuncionario || '-'}</span></div>
            <div><strong className="text-slate-500">Nascimento:</strong> {formData.dataNascimento || '-'}</div>
            <div><strong className="text-slate-500">Telefone:</strong> {formData.telefone || '-'}</div>
            <div className="sm:col-span-2">
              <strong className="text-slate-500">Endereço:</strong> {formData.endereco ? `${formData.endereco}, Nº ${formData.numero || 'S/N'}, ${formData.bairro} - ${formData.cidade}/${formData.estado}` : '-'}
            </div>
          </div>
        </div>

        {/* Bloco 2: Documentos */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">2. Documentação & Perfil</h4>
            <button
              onClick={() => onEditStep(1)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Editar
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700">
            <div><strong className="text-slate-500">CPF:</strong> {formData.cpf || '-'}</div>
            <div><strong className="text-slate-500">RG:</strong> {formData.rg || '-'} ({formData.rgEmissor || '-'})</div>
            <div><strong className="text-slate-500">PIS:</strong> {formData.pis || '-'}</div>
            <div><strong className="text-slate-500">CTPS:</strong> {formData.ctpsNumero ? `${formData.ctpsNumero} / ${formData.ctpsSerie}` : '-'}</div>
            <div><strong className="text-slate-500">Título:</strong> {formData.tituloEleitor || '-'}</div>
            <div><strong className="text-slate-500">Escolaridade:</strong> {formData.escolaridade || '-'}</div>
          </div>
        </div>

        {/* Bloco 3: Dependentes */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              3. Dependentes ({formData.dependentes?.length || 0})
            </h4>
            <button
              onClick={() => onEditStep(2)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Editar
            </button>
          </div>
          {formData.dependentes && formData.dependentes.length > 0 ? (
            <div className="space-y-1.5 text-xs text-slate-700">
              {formData.dependentes.map((dep, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-900">{dep.nome || `Dependente ${idx + 1}`}</span>
                  <span className="text-slate-500">{dep.grauParentesco} • CPF: {dep.cpf || 'Não inf.'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">Nenhum dependente cadastrado.</p>
          )}
        </div>

        {/* Bloco 4: Dados Bancários */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">4. Dados Bancários</h4>
            <button
              onClick={() => onEditStep(3)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Editar
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700">
            <div><strong className="text-slate-500">Banco:</strong> {formData.banco || '-'}</div>
            <div><strong className="text-slate-500">Agência:</strong> {formData.agencia || '-'}</div>
            <div><strong className="text-slate-500">Conta:</strong> <span className="font-bold text-slate-900">{formData.contaNumero || '-'}</span></div>
            <div><strong className="text-slate-500">Tipo:</strong> {formData.tipoConta || '-'}</div>
            <div><strong className="text-slate-500">PIX:</strong> {formData.chavePix || '-'}</div>
          </div>
        </div>

        {/* Bloco 5: Anexos */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              5. Documentos Anexados ({anexoKeys.length})
            </h4>
            <button
              onClick={() => onEditStep(4)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Editar
            </button>
          </div>
          {anexoKeys.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {anexoKeys.map((key) => {
                const anexo = anexos[key];
                const isPdf = anexo.type === 'application/pdf' || (anexo.name && anexo.name.toLowerCase().endsWith('.pdf'));

                return (
                  <div key={key} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all">
                    {/* Thumbnail clicável para baixar em PDF */}
                    <button
                      type="button"
                      onClick={() => downloadAsPDF(anexo.url, anexo.name || anexo.title, anexo.title)}
                      className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity mr-2.5 shadow-xs"
                      title="Clique para baixar como PDF"
                    >
                      {isPdf ? (
                        <FileText className="w-5 h-5 text-rose-500" />
                      ) : (
                        <img src={anexo.url} alt={anexo.title} className="w-full h-full object-cover" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 pr-2">
                      <span className="font-bold text-slate-900 block truncate text-xs">{anexo.title || key}</span>
                      <span className="text-[10px] text-emerald-700 font-medium flex items-center mt-0.5">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 inline" /> Anexado
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => downloadAsPDF(anexo.url, anexo.name || anexo.title, anexo.title)}
                        className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-[11px] flex items-center space-x-1 transition-colors"
                        title="Baixar este documento como PDF"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPreviewAttachment(anexo)}
                        className="px-2 py-1 bg-slate-200/70 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-[11px] flex items-center space-x-1 transition-colors"
                        title="Visualizar documento"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-amber-600 italic">Nenhum documento anexado até o momento.</p>
          )}
        </div>

        {/* Bloco 6: Contrato & Assinatura */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">6. Contrato & Assinatura</h4>
            <button
              onClick={() => onEditStep(5)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Editar
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <div><strong className="text-slate-500">Função:</strong> <span className="font-bold text-slate-900">{formData.funcao || '-'}</span></div>
            <div><strong className="text-slate-500">Salário:</strong> {formData.salario || '-'} ({formData.tipoSalario || 'Mensal'})</div>
            <div><strong className="text-slate-500">Data de Admissão:</strong> {formData.dataAdmissao || '-'}</div>
            <div><strong className="text-slate-500">Contrato de Exp.:</strong> {formData.contratoExperiencia || '-'}</div>
            <div><strong className="text-slate-500">Vale Transporte:</strong> {formData.valeTransporte || 'NÃO'}</div>
            <div><strong className="text-slate-500">Vale Dia 20 (Adiantamento):</strong> {formData.valeDia20 === 'SIM' ? `SIM (${formData.valeDia20Percentual || '40%'})` : 'NÃO'}</div>
            <div className="sm:col-span-2"><strong className="text-slate-500">Horário:</strong> {formData.horarioTrabalho || '-'}</div>
            <div className="sm:col-span-2 flex items-center space-x-2 pt-2">
              <strong className="text-slate-500">Assinatura Digital:</strong>
              {formData.assinaturaFuncionario ? (
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Assinada Eletronicamente
                </span>
              ) : (
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  Não Assinada
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem de Erro no Envio */}
      {submitError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start space-x-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Não foi possível enviar</p>
            <p className="mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {/* Barra de Progresso de Upload */}
      {isSubmitting && (
        <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-indigo-900 font-bold text-sm">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Salvando e processando documentos anexados...</span>
          </div>
          <div className="w-full bg-indigo-200/60 rounded-full h-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{
                width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 35}%`
              }}
            />
          </div>
          <p className="text-xs text-indigo-700 font-medium">
            {uploadProgress.statusText || `Processando arquivo ${uploadProgress.current} de ${uploadProgress.total || 1}...`}
          </p>
        </div>
      )}

      {/* Botão Principal de Envio */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Gravando e gerando protocolo de admissão...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Confirmar e Enviar Ficha de Admissão</span>
            </>
          )}
        </button>
      </div>

      {/* Modal de Pré-visualização do Anexo Selecionado */}
      <AttachmentPreviewModal
        isOpen={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        fileData={previewAttachment}
      />
    </div>
  );
}
