import { useState, useEffect } from "react";

export function useFetchData() {
  const [entradas, setEntradas] = useState<number>(0);
  const [saidas, setSaidas] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      // Exemplo: Pegando o ID do usuário logado (ajuste conforme necessário)
      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("User ID is not available in localStorage");
      }

      const [transacoesResponse, contasResponse] = await Promise.all([
        fetch("http://localhost:3000/api/transacoes"),
        fetch("http://localhost:3000/api/contas"),
      ]);

      const transacoesData = await transacoesResponse.json();
      const contasData = await contasResponse.json();

      // Filtrar contas pelo usuário logado
      const userAccounts = contasData.filter(
        (conta: any) => conta.usuarioId === parseInt(userId)
      );

      // Extrair IDs das contas do usuário logado
      const userAccountIds = userAccounts.map((conta: any) => conta.id);

      // Filtrar transações apenas das contas do usuário logado
      const userTransactions = transacoesData.filter((transacao: any) =>
        userAccountIds.includes(transacao.contaId)
      );

      // Calcular entradas e saídas apenas para o usuário logado
      const entradas = userTransactions
        .filter((t: any) => t.tipoDeTransacao === "ENTRADA")
        .reduce((acc: number, t: any) => acc + parseFloat(t.valor), 0);

      const saidas = userTransactions
        .filter((t: any) => t.tipoDeTransacao === "SAIDA")
        .reduce((acc: number, t: any) => acc + parseFloat(t.valor), 0);

      // Calcular saldo das contas do usuário logado
      const saldo = userAccounts.reduce(
        (acc: number, conta: any) => acc + parseFloat(conta.saldo),
        0
      );

      setEntradas(entradas);
      setSaidas(saidas);
      setSaldo(saldo);
      setTransactions(userTransactions); // Apenas transações do usuário logado
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { entradas, saidas, saldo, transactions, fetchData, loading };
}
