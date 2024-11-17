"use client";

import SummaryCard from "../../components/SummaryCard";
import TransactionTable from "../../components/TransactionTable";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import ChartComponent from "../../components/ChartComponent";
import TransacoesModal from "../transacoes/TransactionsModal";
import { useFetchData } from "../../hooks/useFetchData";
import { useState } from "react";

export default function DashboardPage() {
  const { contas, transactions, fetchData, loading } = useFetchData();
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
    ? transactions.filter((t) => t.contaId === selectedContaId)
    : transactions;

  // Formatar transações para o formato esperado por TransactionTable
  const formattedTransactions = filteredTransactions.map((t) => ({
    id: t.id || 0,
    descricao: t.descricao || "Sem descrição",
    valor: parseFloat(t.valor),
    tipoDeTransacao: t.tipoDeTransacao,
  }));

  // Obter saldo, entradas e saídas da conta selecionada
  const contaData = contas.find((c) => c.id === selectedContaId);
  const saldoConta = contaData ? Number(contaData.saldo) : 0;

  const entradasConta = filteredTransactions
    .filter((t) => t.tipoDeTransacao === "ENTRADA")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const saidasConta = filteredTransactions
    .filter((t) => t.tipoDeTransacao === "SAIDA")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Carregando...</p>;
  }

  return (
    <div className="container">
      <div className="sidebar">
        <Sidebar openModal={openModal} />
      </div>
      <div className="mainContent">
        <div className="header">
          <Header
            contas={contas.map((conta) => ({
              id: conta.id,
              nomeInstituicao: conta.nomeInstituicao || "Não Informado",
              tipoDeConta: conta.tipoDeConta || "Tipo Desconhecido",
            }))}
            onSelectConta={handleSelectConta}
          />
        </div>
        <div className="main">
          <h1 className="titulo">Controle Financeiro</h1>
          <div className="summary">
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
              value={`R$ ${saldoConta.toFixed(2)}`}
            />
          </div>
          <div className="chartAndTable">
            <TransactionTable transactions={formattedTransactions} />
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
      <style jsx>{`
        /* CSS atualizado */
        .container {
  display: grid;
  grid-template-columns: 290px 1fr; /* Sidebar e conteúdo principal */
  grid-template-rows: auto 1fr; /* Header na primeira linha */
  height: 100vh; /* Altura total da tela */
}

.sidebar {
  grid-column: 1 / 2; /* Sidebar ocupa a primeira coluna */
  grid-row: 1 / 3; /* Sidebar ocupa ambas as linhas */
  background-color: #2c6e49;
  color: white;
  padding: 10px;
}

.mainContent {
  grid-column: 2 / 3; /* Conteúdo principal ocupa a segunda coluna */
  grid-row: 1 / 3;
  display: grid;
  grid-template-rows: auto 1fr; /* Header na primeira linha, Main na segunda */
}

.header {
  grid-row: 1; /* Header ocupa a linha superior */
  background-color: #2c6e49;
  color: white;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Espaçamento correto entre os elementos */
}

.main {
  grid-row: 2;
  padding: 20px;
  background-color: #f4f4f9;
}

.titulo {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

      `}</style>
    </div>
  );
}
