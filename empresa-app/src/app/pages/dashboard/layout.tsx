"use client";

import Sidebar from "../../components/sidebar/Sidebar";
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
  return (
    <div className={styles.container}>
      <Sidebar openModal={openModal} />
      <div className={styles.mainContent}>
        <div className={styles.main}>{children}</div>
      </div>
    </div>
  );
}
