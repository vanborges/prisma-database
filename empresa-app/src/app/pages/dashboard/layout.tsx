"use client";

import SummaryCard from "../../components/SummaryCard";
import TransactionTable from "../../components/TransactionTable";
import { useFetchData } from "../../hooks/useFetchData";
import { useState } from "react";
import TransacoesModal from "../transacoes/TransactionsModal";
import Sidebar from "../../components/sidebar/Sidebar";

export default function DashboardPage() {
  const { entradas, saidas, saldo, transactions, fetchData, loading } = useFetchData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState<"pagar" | "receber">("pagar");

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
          <SummaryCard title="Entradas" value={entradas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
          <SummaryCard title="Saídas" value={saidas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
          <SummaryCard title="Saldo" value={saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
        </div>
        <TransactionTable transactions={transactions} />
       

        {/* Modal de Transações */}
        <TransacoesModal
          title={`Nova Transação - ${tipoTransacao === "pagar" ? "Pagar" : "Receber"}`}
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
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#2c6e49",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
};
