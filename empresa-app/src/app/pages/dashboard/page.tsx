"use client";

import SummaryCard from "../../components/SummaryCard";
import TransactionTable from "../../components/TransactionTable";
import { useFetchData } from "../../hooks/useFetchData";

export default function DashboardPage() {
  const { entradas, saidas, saldo, transactions, loading } = useFetchData();

  if (loading) {
    return <p style={{ textAlign: "center" }}>Carregando...</p>;
  }

  return (
    <div>
      <h1 style={styles.title}>Controle Financeiro</h1>
      <div style={styles.summary}>
        <SummaryCard title="Entradas" value={entradas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
        <SummaryCard title="Saídas" value={saidas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
        <SummaryCard title="Saldo" value={saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
      </div>
      <TransactionTable transactions={transactions} />
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
