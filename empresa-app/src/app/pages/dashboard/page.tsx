"use client";

import SummaryCard from "../../components/SummaryCard";
import TransactionTable from "../../components/TransactionTable";
import { useFetchData } from "../../hooks/useFetchData";

export default function DashboardPage() {
  const { contas, transactions, loading } = useFetchData();

  if (loading) {
    return <p style={{ textAlign: "center" }}>Carregando...</p>;
  }

  // Cálculo de entradas, saídas e saldo
  const entradas = transactions
    .filter((t) => t.tipoDeTransacao === "ENTRADA")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const saidas = transactions
    .filter((t) => t.tipoDeTransacao === "SAIDA")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const saldo = contas.reduce((acc, conta) => acc + parseFloat(conta.saldo.toString()), 0);

  return (
    <div>
      <h1 style={styles.title}>Controle Financeiro</h1>
      <div style={styles.summary}>
        <SummaryCard
          title="Entradas"
          value={entradas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        />
        <SummaryCard
          title="Saídas"
          value={saidas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        />
        <SummaryCard
          title="Saldo"
          value={saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        />
      </div>
      <TransactionTable
        transactions={transactions.map((t) => ({
          id: t.id,
          descricao: t.descricao || "Sem descrição",
          valor: parseFloat(t.valor), // Converte 'valor' para number
          tipoDeTransacao: t.tipoDeTransacao,
        }))}
      />
    </div>
  );
}

const styles = {
  title: {
    textAlign: "center" as const,
    marginBottom: "20px",
  },
  summary: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "20px",
  },
};
