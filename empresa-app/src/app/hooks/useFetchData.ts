import { useState, useEffect } from 'react';

export function useFetchData() {
  const [entradas, setEntradas] = useState<number>(0);
  const [saidas, setSaidas] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [transactions, setTransactions] = useState([]); // Transações do usuário logado
  const [loading, setLoading] = useState<boolean>(true);
  const [userAccounts, setUserAccounts] = useState([]); // Contas do usuário logado

  const fetchData = async () => {
    try {
      // Verifique se está no ambiente do navegador
      if (typeof window === 'undefined') return;

      const userId = localStorage.getItem('userId');

      if (!userId) {
        throw new Error('User ID is not available in localStorage');
      }

      const [transacoesResponse, contasResponse] = await Promise.all([
        fetch('/api/transacoes'),
        fetch('/api/contas'),
      ]);

      const transacoesData = await transacoesResponse.json();
      const contasData = await contasResponse.json();

      // Filtrar contas do usuário logado
      const userAccounts = contasData.filter(
        (conta: any) => conta.usuarioId === parseInt(userId)
      );

      // Extrair IDs das contas do usuário logado
      const userAccountIds = userAccounts.map((conta: any) => conta.id);

      // Filtrar transações apenas das contas do usuário logado
      const userTransactions = transacoesData.filter((transacao: any) =>
        userAccountIds.includes(transacao.contaId)
      );

      // Calcular entradas e saídas com base nas transações do usuário logado
      const entradas = userTransactions
        .filter((t: any) => t.tipoDeTransacao === 'ENTRADA')
        .reduce((acc: number, t: any) => acc + parseFloat(t.valor), 0);

      const saidas = userTransactions
        .filter((t: any) => t.tipoDeTransacao === 'SAIDA')
        .reduce((acc: number, t: any) => acc + parseFloat(t.valor), 0);

      // Calcular saldo total do usuário logado
      const saldo = userAccounts.reduce(
        (acc: number, conta: any) => acc + parseFloat(conta.saldo),
        0
      );

      // Atualizar os estados
      setEntradas(entradas);
      setSaidas(saidas);
      setSaldo(saldo);
      setTransactions(userTransactions);
      setUserAccounts(userAccounts);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados ao montar o componente
  useEffect(() => {
    fetchData();
  }, []);

  // Retornar os valores calculados
  return { entradas, saidas, saldo, transactions, fetchData, loading, contas: userAccounts };
}
