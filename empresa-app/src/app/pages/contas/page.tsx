"use client";

import { useState, useEffect } from "react";
import { Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import ModalConta from "../../components/modal/contas/ModalConta";
import useContas, { Conta } from "../../hooks/useContas";
import styles from "./Contas.module.css";

export default function ContasPage() {
  const { contas, fetchContas, addConta, updateConta, deleteConta } = useContas();
  const [openModal, setOpenModal] = useState(false);
  const [editingConta, setEditingConta] = useState<Conta | null>(null);

  useEffect(() => {
    fetchContas();
  }, []);

  const handleSave = (data: any) => {
    if (editingConta) {
      updateConta(editingConta.id, data);
    } else {
      addConta(data);
    }
    setEditingConta(null);
  };

  return (
    <div className={styles.container}>
      <Sidebar openModal={() => {}} />
      <div className={styles.mainContent}>
        <Header contas={contas} onSelectConta={() => {}} />
        <div className={styles.main}>
          <h1 className={styles.titulo}>Gerenciamento de Contas</h1>
          <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
            Nova Conta
          </Button>
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
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
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          setEditingConta(conta);
                          setOpenModal(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteConta(conta.id)}
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
      {openModal && (
        <ModalConta
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setEditingConta(null);
          }}
          onSave={handleSave}
          initialData={editingConta || undefined}
        />
      )}
    </div>
  );
}
