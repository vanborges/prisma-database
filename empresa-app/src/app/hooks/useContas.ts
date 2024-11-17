import { useState } from "react";

export interface Conta {
  id: number;
  nomeInstituicao: string;
  tipoDeConta: string;
  saldo: number;
}

export default function useContas() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento
  const [error, setError] = useState<string | null>(null); // Estado para capturar erros

  // Fetch para buscar todas as contas
  const fetchContas = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/contas");

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao buscar contas");
      }

      const data = await res.json();
      setContas(data);
    } catch (error: any) {
      setError(error.message || "Erro desconhecido ao buscar contas");
      console.error("Erro no fetch das contas:", error);
    } finally {
      setLoading(false);
    }
  };

  const addConta = async (novaConta: Omit<Conta, "id">) => {
    try {
      const usuarioId = parseInt(localStorage.getItem("userId") || "0", 10);
      console.log("Enviando usuárioId:", usuarioId);
  
      const res = await fetch("/api/contas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...novaConta, usuarioId }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erro ao adicionar conta:", errorData);
        throw new Error(errorData.error || "Erro ao adicionar conta");
      }
  
      fetchContas();
    } catch (error) {
      console.error("Erro no POST:", error);
    }
  };
  

  // Atualizar uma conta existente
  const updateConta = async (id: number, contaAtualizada: Omit<Conta, "id">) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/contas?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contaAtualizada),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao atualizar conta");
      }

      fetchContas(); // Atualizar as contas após a atualização
    } catch (error: any) {
      setError(error.message || "Erro desconhecido ao atualizar conta");
      console.error("Erro no PUT:", error);
    } finally {
      setLoading(false);
    }
  };

  // Excluir uma conta
  const deleteConta = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/contas?id=${id}`, { method: "DELETE" });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao excluir conta");
      }

      fetchContas(); // Atualizar as contas após a exclusão
    } catch (error: any) {
      setError(error.message || "Erro desconhecido ao excluir conta");
      console.error("Erro no DELETE:", error);
    } finally {
      setLoading(false);
    }
  };

  return { contas, fetchContas, addConta, updateConta, deleteConta, loading, error };
}
