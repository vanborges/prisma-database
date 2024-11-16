import { useState, useEffect } from "react";

export function useFetchData() {
  const [entradas, setEntradas] = useState<number>(0);
  const [saidas, setSaidas] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const [transacoesResponse, contasResponse] = await Promise.all([
        fetch("http://localhost:3000/api/transacoes"),
        fetch("http://localhost:3000/api/contas"),
      ]);

      const transacoesData = await transacoesResponse.json();
      const contasData = await contasResponse.json();

      const entradas = transacoesData
        .filter((t: any) => t.tipoDeTransacao === "ENTRADA")
        .reduce((acc: number, t: any) => acc + parseFloat(t.valor), 0);

      const saidas = transacoesData
        .filter((t: any) => t.tipoDeTransacao === "SAIDA")
        .reduce((acc: number, t: any) => acc + parseFloat(t.valor), 0);

      const saldo = contasData.reduce(
        (acc: number, conta: any) => acc + parseFloat(conta.saldo),
        0
      );

      setEntradas(entradas);
      setSaidas(saidas);
      setSaldo(saldo);
      setTransactions(transacoesData);
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
