import React, { useRef, useState } from 'react';
import { Camera, Upload, Eye, CheckCircle2, FileText, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

export default function AttachmentItem({
  id,
  title,
  description,
  required = false,
  isPortrait = false,
  value, // { url, name, type, size }
  onChange,
  onDelete,
  onOpenLiveCamera,
  onOpenPreview
}) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      
      if (isPdf) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onChange({
            id,
            title,
            url: event.target.result,
            name: file.name,
            type: 'application/pdf',
            size: file.size
          });
          setIsProcessing(false);
        };
        reader.readAsDataURL(file);
      } else {
        // Imagem: comprime e otimiza para evitar estouro de memória e tela preta/ícone quebrado
        const compressedDataUrl = await compressImage(file, 1600, 0.82);
        onChange({
          id,
          title,
          url: compressedDataUrl,
          name: file.name || `${id}_foto.jpg`,
          type: 'image/jpeg',
          size: Math.round(compressedDataUrl.length * 0.75)
        });
        setIsProcessing(false);
      }
    } catch (err) {
      console.warn('Erro ao processar imagem:', err);
      // Fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({
          id,
          title,
          url: event.target.result,
          name: file.name || `${id}_foto.jpg`,
          type: file.type || 'image/jpeg',
          size: file.size
        });
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }

    // Limpa valor do input para permitir selecionar o mesmo arquivo novamente se desejar
    e.target.value = '';
  };

  const handleCameraClick = () => {
    // Se for dispositivo móvel ou se preferir, dispara a câmera nativa do celular imediatamente
    // Também permite abrir o scanner guiado
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    } else if (onOpenLiveCamera) {
      onOpenLiveCamera();
    }
  };

  const isAttached = !!value?.url;
  const isPdf = value?.type === 'application/pdf' || (value?.name && value.name.toLowerCase().endsWith('.pdf'));

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-200 ${
      isAttached 
        ? 'bg-emerald-50/40 border-emerald-300 shadow-sm' 
        : 'bg-white border-slate-200 hover:border-indigo-200 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Informações do Documento */}
        <div className="flex items-start space-x-3">
          {/* Ícone de status / miniatura clicável */}
          {isAttached ? (
            <button
              type="button"
              onClick={() => onOpenPreview(value)}
              className="relative group w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-500 flex-shrink-0 bg-slate-100 flex items-center justify-center shadow"
              title="Clique para visualizar ou baixar em PDF/PNG"
            >
              {isPdf ? (
                <FileText className="w-6 h-6 text-rose-500" />
              ) : (
                <img
                  src={value.url}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              )}
              {/* Overlay hover para incentivar clique */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                <Eye className="w-4 h-4" />
              </div>
            </button>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center text-slate-400">
              <ImageIcon className="w-5 h-5" />
            </div>
          )}

          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="font-semibold text-slate-800 text-sm">{title}</h4>
              {required ? (
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-medium px-1.5 py-0.5 rounded">Obrigatório</span>
              ) : (
                <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-1.5 py-0.5 rounded">Opcional</span>
              )}
            </div>
            {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
            
            {isAttached && (
              <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 inline" />
                Anexado ({value.name || 'Arquivo'})
              </p>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center space-x-2 self-end sm:self-center">
          {isAttached ? (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onOpenPreview(value)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver / Baixar</span>
              </button>

              <button
                type="button"
                onClick={() => onDelete(id)}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium py-1.5 px-2.5 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Trocar
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {/* Botão Câmera do Celular / Scanner Nativo */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
                title="Abrir a câmera do aparelho para fotografar"
              >
                <Camera className="w-4 h-4" />
                <span>Tirar Foto</span>
              </button>

              {/* Botão Enviar Arquivo / PDF */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
                title="Enviar imagem da galeria ou arquivo em PDF"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Arquivo/PDF</span>
              </button>

              {/* Input Nativo de Câmera (Abre câmera do smartphone diretamente sem erro de permissão) */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture={isPortrait ? "user" : "environment"}
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Input de Arquivos / PDF / Galeria */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
