/**
 * Busca endereço a partir do CEP usando a API gratuita ViaCEP
 * @param {string} cep 
 * @returns {Promise<object|null>}
 */
export async function fetchAddressByCep(cep) {
  const cleanCep = (cep || '').replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    return null;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!response.ok) {
      throw new Error('Erro ao consultar CEP');
    }
    const data = await response.json();
    if (data.erro) {
      return { error: 'CEP não encontrado' };
    }
    return {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
      complemento: data.complemento || ''
    };
  } catch (err) {
    console.error('Falha na busca de CEP:', err);
    return { error: 'Falha na conexão com o serviço de CEP' };
  }
}
