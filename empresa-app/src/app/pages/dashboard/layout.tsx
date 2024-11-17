"use client";

import SummaryCard from "../../components/SummaryCard";
import TransactionTable from "../../components/TransactionTable";
import Header from "../../components/header/Header";
import { useFetchData } from "../../hooks/useFetchData";
import { useState } from "react";
import TransacoesModal from "../transacoes/TransactionsModal";
import Sidebar from "../../components/sidebar/Sidebar";
import ChartComponent from "../../components/ChartComponent";

export default function DashboardPage() {
  const { entradas, saidas, saldo, transactions, fetchData, loading, contas } =
    useFetchData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState<"pagar" | "receber">(
    "pagar"
  );
  const [selectedContaId, setSelectedContaId] = useState<number | null>(null);

  const openModal = (tipo: "pagar" | "receber") => {
    setTipoTransacao(tipo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectConta = (id: number) => {
    setSelectedContaId(id);
  };

  // Filtrar transações pela conta selecionada
  const filteredTransactions = selectedContaId
    ? transactions.filter((t: any) => t.contaId === selectedContaId)
    : transactions;

  // Obter saldo, entradas e saídas da conta selecionada
  const contaData = contas.find((c: any) => c.id === selectedContaId);
  const saldoConta = contaData ? contaData.saldo : 0;
  const entradasConta = filteredTransactions
    .filter((t: any) => t.tipoDeTransacao === "ENTRADA")
    .reduce((acc: number, t: any) => acc + parseFloat(t.valor), 0);
  const saidasConta = filteredTransactions
    .filter((t: any) => t.tipoDeTransacao === "SAIDA")
    .reduce((acc: number, t: any) => acc + parseFloat(t.valor), 0);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Carregando...</p>;
  }

  return (
    <div>
      {/* Header com seleção de conta */}
      <Header contas={contas} onSelectConta={handleSelectConta} />

      <div style={styles.layout}>
        <Sidebar openModal={openModal} />

        <div style={styles.content}>
          <h1 style={styles.title}>Controle Financeiro</h1>
          <div style={styles.summary}>
            <SummaryCard
              title="Entradas"
              value={`R$ ${entradasConta.toFixed(2)}`}
            />
            <SummaryCard
              title="Saídas"
              value={`R$ ${saidasConta.toFixed(2)}`}
            />
            <SummaryCard
              title="Saldo"
              value={`R$ ${Number(saldoConta).toFixed(2)}`}
            />
          </div>
          <div style={styles.chartAndTable}>
            <TransactionTable transactions={filteredTransactions} />
            <ChartComponent entradas={entradasConta} saidas={saidasConta} />
          </div>
          <TransacoesModal
            title={`Nova Transação - ${
              tipoTransacao === "pagar" ? "Pagar" : "Receber"
            }`}
            isOpen={isModalOpen}
            onClose={closeModal}
            tipoTransacao={tipoTransacao}
            onTransactionSuccess={fetchData}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
  },
  content: {
    marginLeft: "250px",
    padding: "20px",
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "20px",
  },
  summary: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "20px",
  },
  chartAndTable: {
    display: "flex",
    justifyContent: "space-around",
    gap: "20px",
  },
};
