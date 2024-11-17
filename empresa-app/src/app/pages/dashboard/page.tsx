"use client";

import SummaryCard from "../../components/summaryCard/SummaryCard";
import TransactionTable from "../../components/TransactionTable";
import ChartComponent from "../../components/ChartComponent";
import { useFetchData } from "../../hooks/useFetchData";
import { useState } from "react";
import Layout from "./layout";
import Header from "../../components/header/Header";

export default function Dashboard() {
  const { contas: rawContas, transactions, loading } = useFetchData();
  const contas = rawContas.map((conta) => ({
    id: conta.id,
    nomeInstituicao: conta.nomeInstituicao || "Instituição não disponível",
    tipoDeConta: conta.tipoDeConta || "Tipo não disponível",
    saldo: conta.saldo || 0,
  }));
  const [selectedContaId, setSelectedContaId] = useState<number | null>(null);

  const openModal = (type: "pagar" | "receber") => {
    console.log(`Abrir modal de ${type}`);
  };

  const handleSelectConta = (id: number) => {
    setSelectedContaId(id);
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Carregando...</p>;
  }

  const filteredTransactions = selectedContaId
    ? transactions.filter((t) => t.contaId === selectedContaId)
    : transactions;

  const formattedTransactions = filteredTransactions.map((t) => ({
    id: t.id,
    descricao: t.descricao || "Sem descrição",
    valor: parseFloat(t.valor),
    tipoDeTransacao: t.tipoDeTransacao,
  }));

  const contaData = contas.find((c) => c.id === selectedContaId);
  const saldoConta = contaData ? Number(contaData.saldo) : 0;
  const entradasConta = filteredTransactions
    .filter((t) => t.tipoDeTransacao === "ENTRADA")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);
  const saidasConta = filteredTransactions
    .filter((t) => t.tipoDeTransacao === "SAIDA")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const onSelectConta = (id: number) => {
    handleSelectConta(id);
  };

  return (
    <Layout
      openModal={openModal}
      onSelectConta={handleSelectConta}
      contas={contas}
    >
      <Header contas={contas} onSelectConta={onSelectConta} />
      <div className="main">
        <h1 className="titulo">Dashboard</h1>
        <div className="summary">
          <SummaryCard
            title="Entradas"
            value={`R$ ${entradasConta.toFixed(2)}`}
          />
          <SummaryCard title="Saídas" value={`R$ ${saidasConta.toFixed(2)}`} />
          <SummaryCard title="Saldo" value={`R$ ${saldoConta.toFixed(2)}`} />
          
        </div>
        
        <div className="chartAndTable">
          <TransactionTable transactions={formattedTransactions} />
          <ChartComponent entradas={entradasConta} saidas={saidasConta} />

        </div>
      </div>
    </Layout>
  );
}
