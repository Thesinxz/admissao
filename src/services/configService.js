import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const DEFAULT_RH_CONFIG = {
  empresaPadrao: "",
  contratoExperienciaPadrao: "30 dias + 60 dias",
  contratoOpcoesPermitidas: [
    "30 dias + 60 dias",
    "45 dias + 45 dias",
    "30 dias + 30 dias",
    "90 dias",
    "Não vai fazer contrato de experiência"
  ],
  valeTransportePadrao: "NÃO", // Funcionário decide
  permitirFuncionarioDecidirVT: true,
  valeDia20Padrao: "SIM", // Adiantamento salarial até o dia 20 (opcional / decide)
  valeDia20Percentual: "40%",
  funcoesPadrao: [
    "Auxiliar Administrativo",
    "Vendedor(a)",
    "Operador(a) de Caixa",
    "Atendente / Balconista",
    "Auxiliar de Serviços Gerais",
    "Estoquista / Repositor",
    "Motorista / Entregador",
    "Assistente Financeiro",
    "Gerente"
  ],
  salarioPadrao: "R$ 1.950,00",
  horarioPadrao: "08:00 às 18:00 (Segunda a Sexta) e Sábado das 08:00 às 12:00",
  intervaloPadrao: "das 11:00 às 13:00",
  folgaPadrao: "Domingo"
};

const CONFIG_LOCAL_KEY = "rh_admission_config_v1";

/**
 * Obtém as configurações do RH (tenta Firestore, com fallback no localStorage)
 */
export async function getRHConfig() {
  try {
    const docRef = doc(db, "configuracoes", "admissao");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      localStorage.setItem(CONFIG_LOCAL_KEY, JSON.stringify(data));
      return { ...DEFAULT_RH_CONFIG, ...data };
    }
  } catch (err) {
    console.warn("Aviso ao buscar configurações do Firestore:", err);
  }

  // Fallback para localStorage
  try {
    const saved = localStorage.getItem(CONFIG_LOCAL_KEY);
    if (saved) {
      return { ...DEFAULT_RH_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {}

  return DEFAULT_RH_CONFIG;
}

/**
 * Salva as configurações do RH no Firestore e no localStorage
 */
export async function saveRHConfig(newConfig) {
  const merged = { ...DEFAULT_RH_CONFIG, ...newConfig };
  
  // Salva no localStorage imediatamente
  localStorage.setItem(CONFIG_LOCAL_KEY, JSON.stringify(merged));

  // Tenta sincronizar com o Firestore
  try {
    const docRef = doc(db, "configuracoes", "admissao");
    await setDoc(docRef, merged, { merge: true });
  } catch (err) {
    console.warn("Aviso ao salvar configurações no Firestore:", err);
  }

  return merged;
}
