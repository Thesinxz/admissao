import React, { useState } from 'react';
import { Paperclip, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import AttachmentItem from '../attachments/AttachmentItem';
import DocumentCameraModal from '../camera/DocumentCameraModal';
import AttachmentPreviewModal from '../attachments/AttachmentPreviewModal';

const ATTACHMENT_DOCS = [
  {
    id: "foto_3x4",
    title: "Foto 3x4 (Retrato / Selfie)",
    description: "Foto nítida do rosto com fundo claro e sem óculos escuros",
    required: true,
    isPortrait: true
  },
  {
    id: "doc_rg",
    title: "Cópia do RG (Frente e Verso)",
    description: "Documento de Identidade com foto recente",
    required: true
  },
  {
    id: "doc_cpf",
    title: "Cópia do CPF",
    description: "Comprovante de Inscrição no CPF ou CNH",
    required: true
  },
  {
    id: "doc_residencia",
    title: "Comprovante de Residência",
    description: "Conta de água, luz, internet ou declaração recente (máx. 90 dias)",
    required: true
  },
  {
    id: "doc_titulo",
    title: "Cópia do Título de Eleitor",
    description: "Título de eleitor ou certidão de quitação eleitoral",
    required: false
  },
  {
    id: "doc_reservista",
    title: "Cópia do Certificado de Reservista",
    description: "Obrigatório para homens entre 18 e 45 anos",
    required: false
  },
  {
    id: "doc_registro_profissional",
    title: "Cópia do Registro Profissional",
    description: "Carteira de Conselho Regional (CRM, CREA, CRC, OAB, COREN, etc.) se aplicável",
    required: false
  },
  {
    id: "doc_casamento",
    title: "Cópia da Certidão de Casamento",
    description: "Se for casado(a) ou possuir união estável registrada em cartório",
    required: false
  },
  {
    id: "doc_filhos_nascimento",
    title: "Cópia da Certidão de Nascimento dos Filhos",
    description: "Certidões de nascimento dos filhos / dependentes legais",
    required: false
  },
  {
    id: "doc_vacinacao",
    title: "Cópia da Carteira de Vacinação (Filhos de 0 a 07 anos)",
    description: "Páginas de identificação e vacinas em dia dos dependentes",
    required: false
  },
  {
    id: "doc_frequencia_escolar",
    title: "Cópia do Comprovante de Frequência Escolar (Filhos de 07 a 14 anos)",
    description: "Declaração de matrícula/frequência emitida pela escola",
    required: false
  },
  {
    id: "doc_ctps",
    title: "Cópia da CTPS (Foto e Verso / Qualificação Civil)",
    description: "Página da foto e verso da carteira física ou espelho da Carteira de Trabalho Digital em PDF",
    required: false
  },
  {
    id: "doc_pis_fgts",
    title: "Cópia do Cartão PIS/Pasep, Extrato FGTS ou Cartão Cidadão",
    description: "Comprovante do número de inscrição PIS/PASEP",
    required: false
  },
  {
    id: "doc_aso",
    title: "Exame Médico Admissional (ASO)",
    description: "Atestado de Saúde Ocupacional emitido pela clínica credenciada",
    required: false
  }
];

export default function Step5Attachments({ formData, updateFormData }) {
  const anexos = formData.anexos || {};
  const [activeCameraDoc, setActiveCameraDoc] = useState(null);
  const [activePreviewDoc, setActivePreviewDoc] = useState(null);

  const handleAttachmentChange = (attachmentData) => {
    updateFormData({
      anexos: {
        ...anexos,
        [attachmentData.id]: attachmentData
      }
    });
  };

  const handleAttachmentDelete = (id) => {
    const updated = { ...anexos };
    delete updated[id];
    updateFormData({ anexos: updated });
    if (activePreviewDoc?.id === id) {
      setActivePreviewDoc(null);
    }
  };

  const handleCameraCapture = (dataUrl) => {
    if (!activeCameraDoc) return;
    handleAttachmentChange({
      id: activeCameraDoc.id,
      title: activeCameraDoc.title,
      url: dataUrl,
      name: `${activeCameraDoc.id}_captura.jpg`,
      type: 'image/jpeg',
      size: Math.round(dataUrl.length * 0.75)
    });
    setActiveCameraDoc(null);
  };

  // Contagem de anexos anexados
  const totalAnexados = Object.keys(anexos).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-blue-950 flex items-center">
              <Paperclip className="w-5 h-5 mr-2 text-blue-600" />
              Anexo de Documentos & Fotos
            </h3>
            <p className="text-xs sm:text-sm text-blue-800/80 mt-1">
              Envie fotos tiradas pela câmera ou arquivos em PDF dos documentos solicitados. Nem todos são obrigatórios.
            </p>
          </div>
          <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-white px-3 py-1.5 rounded-full border border-blue-200 text-xs font-semibold text-blue-900 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{totalAnexados} documento(s) anexado(s)</span>
          </div>
        </div>
      </div>

      {/* Cards de Orientação para Fotos e Documentos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
            👤
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-950">Foto 3x4 (Selfie / Retrato)</h4>
            <p className="text-[11px] text-indigo-900/80 mt-0.5 leading-relaxed">
              Tire de frente com fundo claro e sem óculos de sol. O enquadramento centraliza o rosto perfeitamente.
            </p>
          </div>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
            📄
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">Documentos (RG, CPF, etc.)</h4>
            <p className="text-[11px] text-emerald-900/80 mt-0.5 leading-relaxed">
              Apoie o documento em uma mesa plana e bem iluminada para que os 4 cantos e textos fiquem nítidos.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Documentos Solicitados */}
      <div className="space-y-3">
        {ATTACHMENT_DOCS.map((doc) => {
          const isMarriageRequired = doc.id === 'doc_casamento' && 
            (formData.estadoCivil === 'Casado(a)' || formData.estadoCivil === 'União Estável');
          const isRequired = doc.required || isMarriageRequired;

          return (
            <AttachmentItem
              key={doc.id}
              id={doc.id}
              title={doc.title}
              description={doc.description}
              required={isRequired}
              isPortrait={doc.isPortrait}
              value={anexos[doc.id]}
              onChange={handleAttachmentChange}
              onDelete={handleAttachmentDelete}
              onOpenLiveCamera={() => setActiveCameraDoc(doc)}
              onOpenPreview={(val) => setActivePreviewDoc({ ...val, id: doc.id })}
            />
          );
        })}
      </div>

      {/* Modal Único de Câmera com Scanner Guiado */}
      {activeCameraDoc && (
        <DocumentCameraModal
          isOpen={!!activeCameraDoc}
          onClose={() => setActiveCameraDoc(null)}
          onCapture={handleCameraCapture}
          documentTitle={activeCameraDoc.title}
          isPortrait={activeCameraDoc.isPortrait}
        />
      )}

      {/* Modal Único de Pré-visualização com Escolha de Download em PNG ou PDF */}
      {activePreviewDoc && (
        <AttachmentPreviewModal
          isOpen={!!activePreviewDoc}
          onClose={() => setActivePreviewDoc(null)}
          fileData={activePreviewDoc}
          onDelete={() => handleAttachmentDelete(activePreviewDoc.id)}
        />
      )}
    </div>
  );
}
