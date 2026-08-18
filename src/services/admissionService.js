import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import { dataURLtoBlob, compressImage } from "../utils/imageCompressor";

const isPdfOrImageExt = (filename) => {
  if (!filename) return null;
  const match = filename.match(/\.(jpg|jpeg|png|webp|pdf)$/i);
  return match ? match[1].toLowerCase() : null;
};

/**
 * Função utilitária para executar upload com timeout de segurança
 */
const withTimeout = (promise, ms = 6000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout no upload')), ms))
  ]);
};

/**
 * Upload seguro de um arquivo individual para o Firebase Storage
 */
async function uploadToFirebaseStorage(protocol, key, item, mimeType) {
  try {
    const fileExt = isPdfOrImageExt(item.name) || (mimeType === 'application/pdf' ? 'pdf' : 'jpg');
    const storagePath = `admissoes/${protocol}/${key}_${Date.now()}.${fileExt}`;
    const storageRef = ref(storage, storagePath);
    const metadata = { contentType: mimeType };

    // 1. Se for DataURL, usa uploadString oficial do Firebase
    if (typeof item.url === 'string' && item.url.startsWith('data:')) {
      const snapshot = await withTimeout(uploadString(storageRef, item.url, 'data_url', metadata), 6000);
      return await withTimeout(getDownloadURL(snapshot.ref), 4000);
    }

    // 2. Se tiver Blob/File
    const blobToUpload = item.fileRef || (item.url ? dataURLtoBlob(item.url) : null);
    if (blobToUpload) {
      const snapshot = await withTimeout(uploadBytes(storageRef, blobToUpload, metadata), 6000);
      return await withTimeout(getDownloadURL(snapshot.ref), 4000);
    }
  } catch (err) {
    console.warn(`Storage indisponível para ${key} (${err.code || err.message})`);
  }

  return null;
}

/**
 * Salva a ficha completa de admissão no banco de dados e repositório de arquivos
 * @param {object} formData 
 * @param {function} onProgressCallback (uploadedCount, totalCount, statusText)
 * @returns {Promise<{id: string, protocol: string}>}
 */
export async function submitAdmission(formData, onProgressCallback = () => {}) {
  const protocol = `ADM-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const anexos = formData.anexos || {};
  const anexoKeys = Object.keys(anexos);
  const totalFiles = anexoKeys.length + (formData.assinaturaFuncionario ? 1 : 0);

  onProgressCallback(0, totalFiles, 'Processando documentos...');

  // 1. Upload concorrente em PARALELO para velocidade máxima (< 2 segundos)
  const uploadPromises = anexoKeys.map(async (key) => {
    const item = anexos[key];
    if (!item?.url) return [key, null];

    const mimeType = item.type || (item.name?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
    const downloadUrl = await uploadToFirebaseStorage(protocol, key, item, mimeType);

    return [key, {
      title: item.title || key,
      name: item.name || `${key}.jpg`,
      type: mimeType,
      url: downloadUrl || item.url,
      storageUrl: downloadUrl || null,
      uploadedAt: new Date().toISOString()
    }];
  });

  const uploadResults = await Promise.all(uploadPromises);
  const uploadedAnexos = {};
  const firestoreAnexos = {};

  for (const [key, anexoData] of uploadResults) {
    if (anexoData) {
      uploadedAnexos[key] = anexoData;
      // Para o Firestore, salvamos metadados e storageUrl (ou url apenas se for leve) para nunca estourar o limite de 1MB do Firestore
      firestoreAnexos[key] = {
        title: anexoData.title,
        name: anexoData.name,
        type: anexoData.type,
        storageUrl: anexoData.storageUrl,
        uploadedAt: anexoData.uploadedAt
      };
    }
  }

  // 2. Upload da Assinatura Digital
  let assinaturaUrl = null;
  if (formData.assinaturaFuncionario && formData.assinaturaFuncionario.startsWith('data:')) {
    onProgressCallback(anexoKeys.length, totalFiles, 'Registrando assinatura digital...');
    try {
      const sigRef = ref(storage, `admissoes/${protocol}/assinatura_${Date.now()}.png`);
      const sigSnap = await withTimeout(uploadString(sigRef, formData.assinaturaFuncionario, 'data_url', { contentType: 'image/png' }), 5000);
      assinaturaUrl = await withTimeout(getDownloadURL(sigSnap.ref), 4000);
    } catch (sigErr) {
      console.warn('Aviso no upload da assinatura para o Storage:', sigErr.message);
      // Se storage falhar, mantém a assinatura em base64 (assinaturas são pequenas, ~10KB)
      assinaturaUrl = formData.assinaturaFuncionario;
    }
  }

  onProgressCallback(totalFiles, totalFiles, 'Gravando ficha de admissão...');

  // 3. Monta o objeto final para gravação no banco de dados Firestore
  const admissionRecord = {
    protocolo: protocol,
    empresa: formData.empresa || '',
    nomeFuncionario: formData.nomeFuncionario || '',
    nomeMae: formData.nomeMae || '',
    nomePai: formData.nomePai || '',
    dataNascimento: formData.dataNascimento || '',
    estadoCivil: formData.estadoCivil || '',
    nomeConjuge: formData.nomeConjuge || '',
    naturalidade: formData.naturalidade || '',
    naturalidadeEstado: formData.naturalidadeEstado || '',
    nacionalidade: formData.nacionalidade || 'Brasileira',
    telefone: formData.telefone || '',
    
    // Endereço
    cep: formData.cep || '',
    endereco: formData.endereco || '',
    numero: formData.numero || '',
    complemento: formData.complemento || '',
    bairro: formData.bairro || '',
    cidade: formData.cidade || '',
    estado: formData.estado || '',

    // Documentos
    cpf: formData.cpf || '',
    rg: formData.rg || '',
    rgEmissor: formData.rgEmissor || '',
    rgDataEmissao: formData.rgDataEmissao || '',
    pis: formData.pis || '',
    ctpsNumero: formData.ctpsNumero || '',
    ctpsSerie: formData.ctpsSerie || '',
    ctpsDataEmissao: formData.ctpsDataEmissao || '',
    tituloEleitor: formData.tituloEleitor || '',
    tituloZona: formData.tituloZona || '',
    tituloSecao: formData.tituloSecao || '',
    reservistaNumero: formData.reservistaNumero || '',
    reservistaCategoria: formData.reservistaCategoria || '',
    cnhNumero: formData.cnhNumero || '',
    cnhCategoria: formData.cnhCategoria || '',
    cnhValidade: formData.cnhValidade || '',
    conselhoNome: formData.conselhoNome || '',
    conselhoNumero: formData.conselhoNumero || '',
    conselhoValidade: formData.conselhoValidade || '',

    // Características
    corPele: formData.corPele || '',
    corOlhos: formData.corOlhos || '',
    altura: formData.altura || '',
    peso: formData.peso || '',
    escolaridade: formData.escolaridade || '',
    estudante: formData.estudante || 'Não',
    deficiente: formData.deficiente || 'Não',
    tipoDeficiencia: formData.tipoDeficiencia || '',

    // Dependentes
    dependentes: formData.dependentes || [],

    // Dados Bancários
    banco: formData.banco === 'Outro Banco' ? (formData.bancoOutro || 'Outro') : (formData.banco || ''),
    agencia: formData.agencia || '',
    tipoConta: formData.tipoConta || 'Conta Corrente',
    contaNumero: formData.contaNumero || '',
    chavePix: formData.chavePix || '',

    // Dados Admissionais (Página 2)
    dataAdmissao: formData.dataAdmissao || '',
    funcao: formData.funcao || '',
    salario: formData.salario || '',
    tipoSalario: formData.tipoSalario || 'Mensal',
    horarioTrabalho: formData.horarioTrabalho || '',
    intervalo: formData.intervalo || '',
    folga: formData.folga || 'Domingo',
    contratoExperiencia: formData.contratoExperiencia || '',
    valeTransporte: formData.valeTransporte || 'NÃO',
    valeDia20: formData.valeDia20 || 'SIM',
    valeDia20Percentual: formData.valeDia20Percentual || '40%',
    dataExameAdmissional: formData.dataExameAdmissional || '',
    outrasObservacoes: formData.outrasObservacoes || '',
    localidadeAssinatura: formData.localidadeAssinatura || `${formData.cidade || 'Campo Grande'}-${formData.estado || 'MS'}`,

    // Assinatura e Anexos
    assinaturaUrl: assinaturaUrl || formData.assinaturaFuncionario || null,
    anexos: firestoreAnexos,
    criadoEm: serverTimestamp(),
    status: 'RECEBIDO'
  };

  // 4. Grava no banco de dados Firestore
  const docRef = await withTimeout(addDoc(collection(db, "admissoes"), admissionRecord), 15000);

  // 5. Salva no histórico local de segurança
  try {
    const localHistory = JSON.parse(localStorage.getItem('admissoes_locais') || '[]');
    localHistory.unshift({
      id: docRef.id,
      protocolo: protocol,
      nomeFuncionario: formData.nomeFuncionario,
      empresa: formData.empresa,
      dataEnvio: new Date().toISOString()
    });
    localStorage.setItem('admissoes_locais', JSON.stringify(localHistory.slice(0, 50)));
  } catch (localErr) {
    console.warn('Erro ao salvar histórico local:', localErr);
  }

  return {
    id: docRef.id,
    protocolo: protocol
  };
}

/**
 * Busca a lista de admissões cadastradas para o RH
 */
export async function getAdmissionsList() {
  try {
    const q = query(collection(db, "admissoes"), orderBy("criadoEm", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error("Erro ao buscar admissões:", err);
    return [];
  }
}
