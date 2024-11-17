"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Modal,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  tipoTransacao: "pagar" | "receber";
  onTransactionSuccess: () => void;
}

export default function TransacoesModal({
  title,
  isOpen,
  onClose,
  tipoTransacao,
  onTransactionSuccess,
}: ModalProps) {
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    data: "",
    contaId: "",
  });
  const [contas, setContas] = useState<{ id: number; tipoDeConta: string }[]>(
    []
  );
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Carrega contas ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      fetchContas();
    }
  }, [isOpen]);

  // Função para buscar contas
  const fetchContas = async () => {
    try {
      const response = await fetch("/api/contas");
      if (!response.ok) throw new Error("Erro ao carregar contas");

      const data = await response.json();
      setContas(data);
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
      setNotification({ message: "Erro ao carregar contas", type: "error" });
    }
  };

  // Atualiza valores do formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name!]: value as string }));
  };

  // Submete a transação
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.contaId ||
      !formData.descricao ||
      !formData.valor ||
      !formData.data
    ) {
      setNotification({
        message: "Por favor, preencha todos os campos.",
        type: "error",
      });
      return;
    }

    const payload = {
      contaId: parseInt(formData.contaId),
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      dataTransacao: formData.data,
      tipoDeTransacao: tipoTransacao === "pagar" ? "SAIDA" : "ENTRADA",
    };

    try {
      const response = await fetch("/api/transacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao salvar transação");

      setNotification({
        message: "Transação adicionada com sucesso!",
        type: "success",
      });
      setFormData({ descricao: "", valor: "", data: "", contaId: "" });
      setTimeout(() => {
        onTransactionSuccess();
        setNotification(null);
        onClose();
      }, 1500);
    } catch (error) {
      console.error(error);
      setNotification({
        message: "Erro ao adicionar a transação.",
        type: "error",
      });
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <h2>{title}</h2>
        {notification && (
          <Alert
            severity={notification.type}
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="contaId-label">Conta</InputLabel>
            <Select
              labelId="contaId-label"
              id="contaId"
              name="contaId"
              value={formData.contaId}
              onChange={handleChange}
              required
            >
              <MenuItem value="">
                <em>Selecione uma conta</em>
              </MenuItem>
              {contas.map((conta) => (
                <MenuItem key={conta.id} value={conta.id}>
                  {conta.nomeInstituicao} - {conta.tipoDeConta} {" "}
                  {/* Exibe o nome e tipo */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Valor"
            name="valor"
            type="number"
            value={formData.valor}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Data"
            name="data"
            type="date"
            value={formData.data}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Salvar
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
