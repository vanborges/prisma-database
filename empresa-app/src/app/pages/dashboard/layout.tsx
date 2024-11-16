"use client";

import { ReactNode, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import TransacoesModal from "../transacoes/TransactionsModal";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"pagar" | "receber" | null>(null);

  const openModal = (type: "pagar" | "receber") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalType(null);
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar fixa */}
      <Sidebar openModal={openModal} />

      {/* Conteúdo dinâmico */}
      <div style={{ flexGrow: 1, marginLeft: "0px", padding: "20px" }}>
        {children}
      </div>

      {/* Modal de transações */}
      <TransacoesModal
        title={
          modalType === "pagar" ? "Nova Conta a Pagar" : "Nova Conta a Receber"
        }
        isOpen={isModalOpen}
        onClose={closeModal}
        tipoTransacao={modalType || "pagar"}
        onTransactionSuccess={() => {
          console.log("Transação salva com sucesso!");
        }}
      />
    </div>
  );
}
