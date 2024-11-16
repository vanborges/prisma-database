import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Criar uma nova transação
export const criarTransacao = async (dados: {
  descricao: string;
  valor: number;
  tipoDeTransacao: "ENTRADA" | "SAIDA";
  dataTransacao: string;
}) => {
  return axios.post(`${API_URL}/transacoes`, dados);
};

// Obter todas as transações
export const obterTransacoes = async () => {
  const response = await axios.get(`${API_URL}/transacoes`);
  return response.data;
};
