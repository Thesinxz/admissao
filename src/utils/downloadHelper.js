import { jsPDF } from "jspdf";
import { dataURLtoBlob } from "./imageCompressor";

/**
 * Função utilitária universal para disparar download ou abertura de arquivo em qualquer navegador
 */
function triggerDownload(blobOrUrl, filename) {
  let objectUrl = '';
  let isCreated = false;

  if (blobOrUrl instanceof Blob) {
    objectUrl = URL.createObjectURL(blobOrUrl);
    isCreated = true;
  } else if (typeof blobOrUrl === 'string' && blobOrUrl.startsWith('data:')) {
    const blob = dataURLtoBlob(blobOrUrl);
    if (blob) {
      objectUrl = URL.createObjectURL(blob);
      isCreated = true;
    } else {
      objectUrl = blobOrUrl;
    }
  } else {
    objectUrl = blobOrUrl;
  }

  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    if (isCreated) {
      URL.revokeObjectURL(objectUrl);
    }
  }, 300);
}

/**
 * Baixa uma imagem ou anexo no formato PNG
 * @param {string} source - DataURL ou URL da imagem
 * @param {string} filename - Nome do arquivo base
 */
export async function downloadAsPNG(source, filename = "documento") {
  if (!source) {
    console.warn("downloadAsPNG: source vazia");
    return;
  }

  const cleanName = (filename || "documento").toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

  // Se já for PDF, baixa direto
  if (source.startsWith('data:application/pdf') || source.endsWith('.pdf')) {
    triggerDownload(source, `${cleanName}.pdf`);
    return;
  }

  // Se for data:image, converte para PNG direto via Canvas ou download de blob
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 1200;
        canvas.height = img.naturalHeight || img.height || 800;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            triggerDownload(blob, `${cleanName}.png`);
          } else {
            triggerDownload(source, `${cleanName}.png`);
          }
          resolve();
        }, 'image/png');
      } catch (err) {
        console.warn('Fallback download direto:', err);
        triggerDownload(source, `${cleanName}.png`);
        resolve();
      }
    };

    img.onerror = () => {
      triggerDownload(source, `${cleanName}.png`);
      resolve();
    };

    img.src = source;
  });
}

/**
 * Converte uma imagem e baixa como documento PDF (A4 ajustado)
 * @param {string} source - DataURL ou URL da imagem
 * @param {string} filename - Nome do arquivo base
 * @param {string} title - Título do documento no cabeçalho do PDF
 */
export async function downloadAsPDF(source, filename = "documento", title = "Documento Admissional") {
  if (!source) {
    console.warn("downloadAsPDF: source vazia");
    return;
  }

  const cleanName = (filename || "documento").toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

  if (source.startsWith('data:application/pdf') || source.endsWith('.pdf')) {
    triggerDownload(source, `${cleanName}.pdf`);
    return;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const imgWidth = img.naturalWidth || img.width || 1200;
        const imgHeight = img.naturalHeight || img.height || 800;
        
        // Determina orientação A4
        const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
        const pdf = new jsPDF({
          orientation: orientation,
          unit: 'mm',
          format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        const margin = 10;
        const headerHeight = 15;
        
        // Cabeçalho institucional do documento
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(30, 41, 59);
        pdf.text(title || "Documento de Admissão", margin, 10);
        
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        const dateStr = new Date().toLocaleDateString('pt-BR');
        pdf.text(`Emissão: ${dateStr}`, pageWidth - margin - 35, 10);
        
        // Linha divisória
        pdf.setDrawColor(203, 213, 225);
        pdf.setLineWidth(0.3);
        pdf.line(margin, 12, pageWidth - margin, 12);

        // Calcular dimensões da imagem mantendo aspecto
        const maxContentWidth = pageWidth - (margin * 2);
        const maxContentHeight = pageHeight - (margin * 2) - headerHeight;
        
        const ratio = Math.min(maxContentWidth / imgWidth, maxContentHeight / imgHeight);
        const renderWidth = imgWidth * ratio;
        const renderHeight = imgHeight * ratio;
        
        const xPos = margin + (maxContentWidth - renderWidth) / 2;
        const yPos = margin + headerHeight + (maxContentHeight - renderHeight) / 2;

        pdf.addImage(img, 'JPEG', xPos, yPos, renderWidth, renderHeight, undefined, 'FAST');
        
        // Gera blob do PDF e dispara download
        const pdfBlob = pdf.output('blob');
        triggerDownload(pdfBlob, `${cleanName}.pdf`);
        resolve();
      } catch (err) {
        console.error('Erro ao gerar PDF da imagem:', err);
        resolve();
      }
    };

    img.onerror = () => {
      console.warn('Erro ao carregar imagem para PDF');
      resolve();
    };

    img.src = source;
  });
}
