"use client";

import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import styles from "./Contas.module.css"; // Estilo específico para a página de Contas

import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

export default function ContasPage() {
  interface Conta {
    id: number;
    nomeInstituicao: string;
    tipoDeConta: string;
    saldo: number;
  }

  const [contas, setContas] = useState<Conta[]>([]);
  const [selectedConta, setSelectedConta] = useState<number | null>(null);

  // Fetch das contas
  const fetchContas = async () => {
    const res = await fetch("/api/contas");
    const data = await res.json();
    setContas(data);
  };

  useEffect(() => {
    fetchContas();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar openModal={() => {}} />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <Header
            contas={contas}
            onSelectConta={(id) => setSelectedConta(id)}
          />
        </div>
        <div className={styles.main}>
          <h1 className={styles.titulo}>Gerenciamento de Contas</h1>
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: "20px" }}
          >
            Nova Conta
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome da Instituição</TableCell>
                  <TableCell>Tipo de Conta</TableCell>
                  <TableCell>Saldo</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contas.map((conta) => (
                  <TableRow key={conta.id}>
                    <TableCell>{conta.nomeInstituicao}</TableCell>
                    <TableCell>{conta.tipoDeConta}</TableCell>
                    <TableCell>{conta.saldo}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary">
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        style={{ marginLeft: "10px" }}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
