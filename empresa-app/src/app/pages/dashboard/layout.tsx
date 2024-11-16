"use client";

import SummaryCard from "../../components/SummaryCard";
import TransactionTable from "../../components/TransactionTable";
import { useFetchData } from "../../hooks/useFetchData";
import { useState } from "react";
import TransacoesModal from "../transacoes/TransactionsModal";
import Sidebar from "../../components/sidebar/Sidebar";
import ChartComponent from "../../components/ChartComponent";

export default function DashboardPage() {
  const { entradas, saidas, saldo, transactions, fetchData, loading } =
    useFetchData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState<"pagar" | "receber">(
    "pagar"
  );

  const openModal = (tipo: "pagar" | "receber") => {
    setTipoTransacao(tipo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Carregando...</p>;
  }

  return (
    <div style={styles.layout}>
      {/* Menu Lateral */}
      <Sidebar openModal={openModal} />

      {/* Conteúdo Principal */}
      <div style={styles.content}>
        <h1 style={styles.title}>Controle Financeiro</h1>
        <div style={styles.summary}>
          <SummaryCard
            title="Entradas"
            value={entradas.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          />
          <SummaryCard
            title="Saídas"
            value={saidas.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          />
          <SummaryCard
            title="Saldo"
            value={saldo.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          />
        </div>

        {/* Gráfico e Tabela */}
        <div style={styles.chartAndTable}>
          <div style={styles.tableContainer}>
            <TransactionTable transactions={transactions} />
          </div>
          <div style={styles.chartContainer}>
            <ChartComponent />
          </div>
        </div>

        {/* Modal de Transações */}
        <TransacoesModal
          title={`Nova Transação - ${
            tipoTransacao === "pagar" ? "Pagar" : "Receber"
          }`}
          isOpen={isModalOpen}
          onClose={closeModal}
          tipoTransacao={tipoTransacao}
          onTransactionSuccess={fetchData} // Atualiza o dashboard ao salvar a transação
        />
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
  },
  content: {
    marginLeft: "250px", // Espaço para o menu lateral
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
    justifyContent: "space-between",
    gap: "20px",
  },
  chartContainer: {
    flex: 1,
    padding: "10px",
  },
  tableContainer: {
    flex: 1,
    padding: "10px",
  },
};
