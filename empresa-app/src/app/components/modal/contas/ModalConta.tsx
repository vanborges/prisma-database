"use client";

import { useState, useEffect } from "react";
import { Box, TextField, Button, Modal, Alert } from "@mui/material";

interface ModalContaProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: { id?: number; nomeInstituicao: string; tipoDeConta: string; saldo: number };
}

export default function ModalConta({ open, onClose, onSave, initialData }: ModalContaProps) {
  const [formData, setFormData] = useState({
    nomeInstituicao: "",
    tipoDeConta: "",
    saldo: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        nomeInstituicao: initialData.nomeInstituicao || "",
        tipoDeConta: initialData.tipoDeConta || "",
        saldo: initialData.saldo.toString() || "",
      });
    } else {
      setFormData({ nomeInstituicao: "", tipoDeConta: "", saldo: "" });
    }
    setError(""); // Limpa erros ao abrir
  }, [initialData]);

  const handleSubmit = () => {
    if (!formData.nomeInstituicao || !formData.tipoDeConta || !formData.saldo) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    const saldoValue = parseFloat(formData.saldo);
    if (isNaN(saldoValue)) {
      setError("Saldo deve ser um número válido.");
      return;
    }

    onSave({ ...formData, saldo: saldoValue });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <h2>{initialData ? "Editar Conta" : "Nova Conta"}</h2>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          fullWidth
          margin="normal"
          label="Nome da Instituição"
          value={formData.nomeInstituicao}
          onChange={(e) => setFormData({ ...formData, nomeInstituicao: e.target.value })}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Tipo de Conta"
          value={formData.tipoDeConta}
          onChange={(e) => setFormData({ ...formData, tipoDeConta: e.target.value })}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Saldo"
          type="number"
          value={formData.saldo}
          onChange={(e) => setFormData({ ...formData, saldo: e.target.value })}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Salvar
        </Button>
      </Box>
    </Modal>
  );
}
