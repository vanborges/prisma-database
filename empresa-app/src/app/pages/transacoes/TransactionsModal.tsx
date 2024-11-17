"use client";

import { useState, useEffect } from "react";
import Modal from "../../components/modal/Modal";
import Notification from "../../components/notifications/Notification";

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
  const [contas, setContas] = useState<{ id: number; tipoDeConta: string }[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return; // Carrega contas apenas quando o modal estiver aberto
    fetchContas();
  }, [isOpen]);

  const fetchContas = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Obtém o ID do usuário logado
      if (!userId) {
        setNotification({
          message: "Erro: Usuário não autenticado.",
          type: "error",
        });
        return;
      }
  
      const response = await fetch("/api/contas");
      if (!response.ok) throw new Error("Erro ao carregar contas");
  
      const data = await response.json();
  
      // Filtrar contas apenas do usuário logado
      const userContas = data.filter((conta: { usuarioId: number }) => conta.usuarioId === parseInt(userId));
  
      setContas(userContas);
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
      setNotification({ message: "Erro ao carregar contas", type: "error" });
    }
  };
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contaId) {
      setNotification({ message: "Por favor, selecione uma conta válida.", type: "error" });
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

      setNotification({ message: "Transação adicionada com sucesso!", type: "success" });
      setFormData({ descricao: "", valor: "", data: "", contaId: "" });
      setTimeout(() => {
        onTransactionSuccess();
        setNotification(null);
        onClose();
      }, 1500);
    } catch (error) {
      console.error(error);
      setNotification({ message: "Erro ao adicionar a transação.", type: "error" });
    }
  };

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
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

        <div style={styles.field}>
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

        <div style={styles.field}>
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

        <div style={styles.field}>
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

        <button type="submit" style={styles.button}>
          Salvar
        </button>
      </form>
    </Modal>
  );
}

const styles = {
  field: {
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "5px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#2c6e49",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold" as const,
  },
};
