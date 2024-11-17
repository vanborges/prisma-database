import { useState } from "react";

export interface Conta {
  id: number;
  nomeInstituicao: string;
  tipoDeConta: string;
  saldo: number;
}

export default function useContas() {
  const [contas, setContas] = useState<Conta[]>([]);

  const fetchContas = async () => {
    const res = await fetch("/api/contas");
    const data = await res.json();
    setContas(data);
  };

  const addConta = async (novaConta: Omit<Conta, "id">) => {
    try {
      const res = await fetch("/api/contas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaConta),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erro ao adicionar conta:", errorData);
        alert(`Erro: ${errorData.error}`);
        return;
      }

      fetchContas();
    } catch (error) {
      console.error("Erro no POST:", error);
      alert("Erro ao adicionar conta. Tente novamente.");
    }
  };

  const updateConta = async (
    id: number,
    contaAtualizada: Omit<Conta, "id">
  ) => {
    const res = await fetch(`/api/contas?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contaAtualizada),
    });
    if (res.ok) {
      fetchContas();
    }
  };

  const deleteConta = async (id: number) => {
    const res = await fetch(`/api/contas?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchContas();
    }
  };

  return { contas, fetchContas, addConta, updateConta, deleteConta };
}
