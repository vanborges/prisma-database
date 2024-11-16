// components/Sidebar.jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const router = useRouter();

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
          <Link href="/dashboard/contas">Contas</Link>
        </li>
        <li>
          <Link href="/dashboard/contas-a-receber">Contas a Receber</Link>
        </li>
        <li>
          <Link href="/dashboard/contas-a-pagar">Contas a Pagar</Link>
        </li>
        <li>
          <Link href="/dashboard/categorias">Categorias</Link>
        </li>
        <li>
          <Link href="/dashboard/configuracoes">Configurações</Link>
        </li>
        <li>
          <button className={styles.logoutButton} onClick={() => router.push("/logout")}>
            Sair
          </button>
        </li>
      </ul>
    </div>
  );
}
