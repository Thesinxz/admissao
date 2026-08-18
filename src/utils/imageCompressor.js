/**
 * Utilitário de compressão de imagens no navegador
 * Reduz fotos pesadas de celulares (4-10MB) para 200-400KB com alta nitidez para documentos
 */
export async function compressImage(dataUrlOrFile, maxWidth = 1600, quality = 0.82) {
  return new Promise((resolve) => {
    let src = '';
    if (typeof dataUrlOrFile === 'string') {
      src = dataUrlOrFile;
    } else if (dataUrlOrFile instanceof File || dataUrlOrFile instanceof Blob) {
      src = URL.createObjectURL(dataUrlOrFile);
    } else {
      resolve(dataUrlOrFile);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Se for File blob, revoga a URL temporária
      if (typeof dataUrlOrFile !== 'string') {
        URL.revokeObjectURL(src);
      }

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      // Se falhar ao carregar no canvas, retorna original
      resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : src);
    };

    img.src = src;
  });
}

/**
 * Converte dataURL para Blob binário para upload ultrarrápido
 */
export function dataURLtoBlob(dataurl) {
  try {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.warn('Erro ao converter dataURL para Blob:', e);
    return null;
  }
}
