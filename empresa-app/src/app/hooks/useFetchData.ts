// hooks/useFetchData.ts
"use client";

import { useState, useEffect } from "react";

export function useFetchData() {
  const [entradas, setEntradas] = useState<number>(0);
  const [saidas, setSaidas] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true); // Para indicar carregamento
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
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
          (acc: number, c: any) => acc + parseFloat(c.saldo),
          0
        );

        setEntradas(entradas);
        setSaidas(saidas);
        setSaldo(saldo);
        setTransactions(transacoesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { entradas, saidas, saldo, transactions, loading };
}
