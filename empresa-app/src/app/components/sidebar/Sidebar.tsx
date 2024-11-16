"use client";

import Link from "next/link";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  openModal: (type: "pagar" | "receber") => void;
}

export default function Sidebar({ openModal }: SidebarProps) {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Controle Financeiro</h2>
      <ul className={styles.navList}>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/dashboard/transacoes">Transações</Link>
        </li>
        <li>
          <button
            className={styles.button}
            onClick={() => openModal("pagar")}
          >
            Contas a Pagar
          </button>
        </li>
        <li>
          <button
            className={styles.button}
            onClick={() => openModal("receber")}
          >
            Contas a Receber
          </button>
        </li>
        <li>
          <Link href="/dashboard/categorias">Categorias</Link>
        </li>
        <li>
          <Link href="/dashboard/configuracoes">Configurações</Link>
        </li>
      </ul>
    </div>
  );
}
