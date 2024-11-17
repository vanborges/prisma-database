import { useState, useEffect } from "react";

interface Conta {
  nome: string;
  nomeInstituicao: string;
  tipoDeConta: string;
  usuarioId: number;
  id: number;
  saldo: number;
}

interface Transacao {
  id: number;
  contaId: number;
  descricao: string;
  valor: string;
  tipoDeTransacao: "ENTRADA" | "SAIDA";
}

export function useFetchData() {
  const [transactions, setTransactions] = useState<Transacao[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("User ID não encontrado no localStorage");
      }

      const [transacoesResponse, contasResponse] = await Promise.all([
        fetch("/api/transacoes"),
        fetch("/api/contas"),
      ]);

      if (!transacoesResponse.ok || !contasResponse.ok) {
        throw new Error("Erro ao buscar dados do servidor");
      }

      const transacoesData = await transacoesResponse.json();
      const contasData = await contasResponse.json();
      // Filtrar contas e transações do usuário logado
      const userAccounts = contasData.filter(
        (conta: Conta) => conta.usuarioId === parseInt(userId)
      );

      const userAccountIds = userAccounts.map((conta: { id: any }) => conta.id);

      const userTransactions = transacoesData.filter((transacao: Transacao) =>
        userAccountIds.includes(transacao.contaId)
      );

      setContas(userAccounts);
      setTransactions(userTransactions);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { contas, transactions, fetchData, loading };
}
