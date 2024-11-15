"use client";

import { useState, useEffect } from "react";

export default function ContasPage() {
  interface Conta {
    id: number;
    tipoDeConta: string;
    saldo: number;
  }

  const [contas, setContas] = useState<Conta[]>([]);
  const [tipoDeConta, setTipoDeConta] = useState("");
  const [saldo, setSaldo] = useState("");

  useEffect(() => {
    fetch("/api/contas")
      .then((res) => res.json())
      .then((data) => setContas(data));
  }, []);

  const handleAddConta = async () => {
    const response = await fetch("/api/contas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tipoDeConta, saldo }),
    });

    if (response.ok) {
      const newConta = await response.json();
      setContas([...contas, newConta]);
      setTipoDeConta("");
      setSaldo("");
    }
  };

  const handleDeleteConta = async (id: number) => {
    const response = await fetch(`/api/contas?id=${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setContas(contas.filter((conta) => conta.id !== id));
    }
  };

  return (
    <div>
      <h1>Gestão de Contas</h1>

      <h2>Adicionar Conta</h2>
      <input
        type="text"
        placeholder="Tipo de Conta"
        value={tipoDeConta}
        onChange={(e) => setTipoDeConta(e.target.value)}
      />
      <input
        type="number"
        placeholder="Saldo"
        value={saldo}
        onChange={(e) => setSaldo(e.target.value)}
      />
      <button onClick={handleAddConta}>Adicionar</button>

      <h2>Lista de Contas</h2>
      <ul>
        {contas.map((conta) => (
          <li key={conta.id}>
            {conta.tipoDeConta} - Saldo: {conta.saldo}
            <button onClick={() => handleDeleteConta(conta.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
