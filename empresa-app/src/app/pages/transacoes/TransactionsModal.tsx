"use client";

import { useState, useEffect } from "react";
import Modal from "../../components/modal/Modal";
import Notification from "../../components/notifications/Notification"; // Importe o componente de notificação

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  tipoTransacao: "pagar" | "receber";
  onTransactionSuccess: () => void; // Callback para atualizar os dados no dashboard
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
  const [contas, setContas] = useState<{ id: number; tipoDeConta: string }[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null); // Estado para gerenciar notificações

  // Busca as contas ao abrir o modal
  useEffect(() => {
    const fetchContas = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/contas");
        if (response.ok) {
          const data = await response.json();
          setContas(data);
        } else {
          console.error("Erro ao carregar contas");
        }
      } catch (error) {
        console.error("Erro ao carregar contas:", error);
      }
    };

    if (isOpen) {
      fetchContas();
    }
  }, [isOpen]);

  // Atualiza os campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Envia os dados da transação para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contaId) {
      setNotification({
        message: "Por favor, selecione uma conta válida.",
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
      const response = await fetch("http://localhost:3000/api/transacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setNotification({
          message: "Transação adicionada com sucesso!",
          type: "success",
        });

        // Limpa os campos do formulário
        setFormData({ descricao: "", valor: "", data: "", contaId: "" });

        // Aguarda 1500ms antes de fechar o modal e atualizar os dados
        setTimeout(() => {
          onTransactionSuccess(); // Atualiza os dados no dashboard
          setNotification(null); // Remove a notificação
          onClose(); // Fecha o modal
        }, 1500);
      } else {
        throw new Error("Erro ao salvar transação.");
      }
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      setNotification({
        message: "Erro ao adicionar a transação. Tente novamente.",
        type: "error",
      });
    }
  };

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      {/* Notificação */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="contaId">Conta:</label>
          <select
            id="contaId"
            name="contaId"
            value={formData.contaId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma conta</option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.tipoDeConta} (ID: {conta.id})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="descricao">Descrição:</label>
          <input
            id="descricao"
            name="descricao"
            type="text"
            value={formData.descricao}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="valor">Valor:</label>
          <input
            id="valor"
            name="valor"
            type="number"
            value={formData.valor}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="data">Data:</label>
          <input
            id="data"
            name="data"
            type="date"
            value={formData.data}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#2c6e49",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Salvar
        </button>
      </form>
    </Modal>
  );
}
