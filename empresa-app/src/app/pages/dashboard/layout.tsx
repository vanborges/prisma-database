"use client";

import Sidebar from "../../components/sidebar/Sidebar";
import TransacoesModal from "../../components/modal/transacao/ModalTransacao"; // Import do Modal
import { useState } from "react";
import styles from "./Dashboard.module.css";

export default function Layout({
  children,
  openModal,
  onSelectConta,
  contas,
}: {
  children: React.ReactNode;
  openModal: (type: "pagar" | "receber") => void;
  onSelectConta: (id: number) => void;
  contas: { id: number; nomeInstituicao: string; tipoDeConta: string }[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado do modal
  const [tipoTransacao, setTipoTransacao] = useState<"pagar" | "receber">("pagar"); // Tipo da transação

  const handleOpenModal = (type: "pagar" | "receber") => {
    setTipoTransacao(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTransactionSuccess = () => {
    console.log("Transação registrada com sucesso!");
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <Sidebar openModal={handleOpenModal} />
      <div className={styles.mainContent}>
        <div className={styles.main}>{children}</div>
      </div>
      {/* Modal de Transações */}
      <TransacoesModal
        title={tipoTransacao === "pagar" ? "Adicionar Pagamento" : "Adicionar Recebimento"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tipoTransacao={tipoTransacao}
        onTransactionSuccess={handleTransactionSuccess}
      />
    </div>
  );
}
