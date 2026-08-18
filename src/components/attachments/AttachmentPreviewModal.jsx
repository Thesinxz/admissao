import React, { useState } from 'react';
import { X, FileDown, Image, FileText, Trash2, CheckCircle2, Download } from 'lucide-react';
import { downloadAsPNG, downloadAsPDF } from '../../utils/downloadHelper';

export default function AttachmentPreviewModal({
  isOpen,
  onClose,
  fileData, // { title, url, type, name }
  onDelete
}) {
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !fileData) return null;

  const isPdf = fileData.type === 'application/pdf' || (fileData.name && fileData.name.toLowerCase().endsWith('.pdf')) || (typeof fileData.url === 'string' && fileData.url.startsWith('data:application/pdf'));

  const handleDownload = async (format) => {
    if (!fileData.url) return;
    setDownloadingFormat(format);
    try {
      if (format === 'png') {
        await downloadAsPNG(fileData.url, fileData.name || fileData.title || 'documento');
      } else if (format === 'pdf') {
        await downloadAsPDF(fileData.url, fileData.name || fileData.title || 'documento', fileData.title || 'Documento Admissional');
      }
    } catch (err) {
      console.error('Erro ao baixar arquivo:', err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              {isPdf ? <FileText className="w-5 h-5" /> : <Image className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm sm:text-base leading-snug">
                {fileData.title || "Visualizar Documento"}
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[220px] sm:max-w-xs">
                {fileData.name || "Arquivo anexado"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Preview */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-900/5 min-h-[260px]">
          {isPdf ? (
            <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-xs">
              <FileText className="w-16 h-16 text-rose-500 mb-3" />
              <p className="font-medium text-slate-800 text-sm mb-1">{fileData.name || "Documento em PDF"}</p>
              <span className="text-xs text-slate-500 mb-4">Formato Documento Portátil</span>
              <div className="flex items-center text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Anexado com Sucesso
              </div>
            </div>
          ) : imageError || !fileData.url ? (
            <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-xs">
              <Image className="w-12 h-12 text-slate-400 mb-2" />
              <p className="font-bold text-slate-800 text-sm">Arquivo Anexado</p>
              <p className="text-xs text-slate-500 mt-1 mb-3">{fileData.name || 'Documento pronto para envio'}</p>
              <div className="flex items-center text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Pronto no formulário
              </div>
            </div>
          ) : (
            <img
              src={fileData.url}
              alt={fileData.title || "Pré-visualização do documento"}
              onError={() => setImageError(true)}
              className="max-h-[50vh] w-auto max-w-full rounded-xl object-contain shadow-md border border-slate-200"
            />
          )}
        </div>

        {/* Action Bar / Download Choice in real-time */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Escolha como baixar:
            </span>
            {onDelete && (
              <button
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="inline-flex items-center text-xs text-rose-600 hover:text-rose-700 font-medium py-1 px-2 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Remover anexo
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Download PNG Button */}
            <button
              onClick={() => handleDownload('png')}
              disabled={downloadingFormat !== null}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border-2 border-indigo-100 hover:border-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-semibold text-xs sm:text-sm active:scale-98 transition-all disabled:opacity-50"
            >
              <Image className="w-4 h-4 text-indigo-600" />
              <span>{downloadingFormat === 'png' ? 'Gerando...' : 'Baixar como PNG'}</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloadingFormat !== null}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 active:scale-98 transition-all disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span>{downloadingFormat === 'pdf' ? 'Gerando...' : 'Baixar como PDF'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
