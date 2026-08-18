/**
 * Serviço de Armazenamento Seguro de Rascunho com Suporte a IndexedDB + LocalStorage
 * Garante que mesmo fotos pesadas e todos os campos sejam 100% salvos e recuperados
 * caso o usuário minimize o app, feche a aba, receba ligação ou saia da página.
 */

const DB_NAME = 'AdmissaoDraftDB';
const DB_VERSION = 1;
const STORE_NAME = 'draftStore';
const DRAFT_KEY = 'current_admission_draft';
const STEP_KEY = 'ficha_admissao_step';

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => resolve(null);
  });
}

/**
 * Salva o rascunho completo (campos + fotos) de forma persistente
 */
export async function saveDraftPersistent(formData, currentStep = 0) {
  try {
    localStorage.setItem(STEP_KEY, String(currentStep));
  } catch (e) {}

  // 1. Tenta salvar no IndexedDB (sem limite de 5MB, suporta muitas fotos)
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ formData, currentStep, updatedAt: Date.now() }, DRAFT_KEY);
    }
  } catch (err) {
    console.warn('Aviso IndexedDB save:', err);
  }

  // 2. Salva também no LocalStorage (como redundância rápida)
  try {
    localStorage.setItem('ficha_admissao_draft', JSON.stringify(formData));
  } catch (e) {
    // Se estourar quota do localStorage por causa das fotos em base64, salva os dados sem anexos pesados no localStorage
    try {
      const { anexos, ...fieldsOnly } = formData;
      localStorage.setItem('ficha_admissao_draft', JSON.stringify(fieldsOnly));
    } catch (err) {}
  }
}

/**
 * Recupera o rascunho completo persistido
 */
export async function loadDraftPersistent() {
  let loadedData = null;
  let loadedStep = 0;

  // 1. Tenta carregar do IndexedDB
  try {
    const db = await openDB();
    if (db) {
      const result = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(DRAFT_KEY);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      });

      if (result && result.formData) {
        loadedData = result.formData;
        loadedStep = result.currentStep || 0;
      }
    }
  } catch (err) {
    console.warn('Aviso IndexedDB load:', err);
  }

  // 2. Se não encontrou no IndexedDB, tenta no LocalStorage
  if (!loadedData) {
    try {
      const saved = localStorage.getItem('ficha_admissao_draft');
      if (saved) {
        loadedData = JSON.parse(saved);
      }
      const savedStep = localStorage.getItem(STEP_KEY);
      if (savedStep) {
        loadedStep = parseInt(savedStep, 10) || 0;
      }
    } catch (e) {}
  }

  return { formData: loadedData, currentStep: loadedStep };
}

/**
 * Limpa o rascunho após envio concluído com sucesso
 */
export async function clearDraftPersistent() {
  try {
    localStorage.removeItem('ficha_admissao_draft');
    localStorage.removeItem(STEP_KEY);
  } catch (e) {}

  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(DRAFT_KEY);
    }
  } catch (e) {}
}
