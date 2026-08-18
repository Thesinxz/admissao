/**
 * Utilitários de Máscaras e Formatação para Documentos e Campos Brasileiros
 */

export function maskCPF(value) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskRG(value) {
  if (!value) return '';
  const cleanDigits = value.replace(/\D/g, '');
  
  // Se tiver 11 dígitos ou estiver digitando CPF/CIN (Nova Carteira de Identidade Nacional)
  if (cleanDigits.length === 11 && !/[a-zA-Z]/.test(value)) {
    return maskCPF(value);
  }
  
  // Se for RG tradicional com até 9 dígitos
  if (cleanDigits.length >= 8 && cleanDigits.length <= 9 && !/[a-zA-Z]/.test(value)) {
    return cleanDigits
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  // Converte para maiúsculo preservando caracteres de outros estados
  return value.toUpperCase();
}

export function maskCEP(value) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}

export function maskPhone(value) {
  if (!value) return '';
  const clean = value.replace(/\D/g, '').slice(0, 11);
  if (clean.length <= 10) {
    return clean
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }
  return clean
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

export function maskDate(value) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d{1,4})$/, '$1/$2');
}

export function maskPIS(value) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{5})(\d)/, '$1.$2')
    .replace(/(\d{2})(\d{1})$/, '$1-$2');
}

export function maskCurrency(value) {
  if (!value && value !== 0) return '';
  const clean = String(value).replace(/\D/g, '');
  if (!clean) return '';
  const num = (parseInt(clean, 10) / 100).toFixed(2);
  return 'R$ ' + num.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function maskDecimal(value, suffix = '') {
  if (!value) return '';
  const clean = value.replace(/[^\d.,]/g, '');
  return clean + (suffix ? ` ${suffix}` : '');
}

export function maskVoterTitle(value) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .slice(0, 12)
    .replace(/(\d{4})(\d)/, '$1 $2')
    .replace(/(\d{4})(\d)/, '$1 $2');
}

export function unmask(value) {
  if (!value) return '';
  return String(value).replace(/\D/g, '');
}

export function capitalizeWords(value) {
  if (!value) return '';
  const prepositions = ['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'com', 'para', 'por', 'a', 'o', 'as', 'os'];
  
  // Divide preservando múltiplos espaços
  return value
    .split(/(\s+)/)
    .map((part) => {
      const trimmed = part.trim().toLowerCase();
      if (!trimmed) return part; // Mantém espaços
      if (prepositions.includes(trimmed)) {
        return trimmed;
      }
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    })
    .join('');
}

export function isValidCPF(cpf) {
  const clean = unmask(cpf);
  if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean.charAt(i), 10) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9), 10)) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean.charAt(i), 10) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(clean.charAt(10), 10);
}
