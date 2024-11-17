import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

interface Conta {
  id?: number;
  nomeInstituicao: string;
  tipoDeConta: string;
  saldo: number;
}

interface ModalProps {
  conta?: Conta;
  onClose: () => void;
  onSave: () => void;
}

export default function Modal({ conta, onClose, onSave }: ModalProps) {
  const [formData, setFormData] = useState({
    nomeInstituicao: conta?.nomeInstituicao || "",
    tipoDeConta: conta?.tipoDeConta || "",
    saldo: conta?.saldo || 0,
  });

  const handleSubmit = async () => {
    const method = conta ? "PUT" : "POST";
    const url = conta ? `/api/contas?id=${conta.id}` : "/api/contas";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onSave(); // Atualiza a lista de contas
      onClose(); // Fecha o modal
    }
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: "white", borderRadius: "8px" }}>
      <h2>{conta ? "Editar Conta" : "Nova Conta"}</h2>
      <TextField
        label="Nome da Instituição"
        fullWidth
        margin="normal"
        value={formData.nomeInstituicao}
        onChange={(e) => setFormData({ ...formData, nomeInstituicao: e.target.value })}
      />
      <TextField
        label="Tipo de Conta"
        fullWidth
        margin="normal"
        value={formData.tipoDeConta}
        onChange={(e) => setFormData({ ...formData, tipoDeConta: e.target.value })}
      />
      <TextField
        label="Saldo"
        type="number"
        fullWidth
        margin="normal"
        value={formData.saldo}
        onChange={(e) => setFormData({ ...formData, saldo: parseFloat(e.target.value) })}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Salvar
      </Button>
      <Button variant="outlined" color="secondary" onClick={onClose}>
        Cancelar
      </Button>
    </Box>
  );
}
