"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [entradas, setEntradas] = useState(0);
  const [saidas, setSaidas] = useState(0);
  const [total, setTotal] = useState(0);
  const [transacoes, setTransacoes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/transacoes");
        const data = await response.json();

        setEntradas(data.entradas || 0);
        setSaidas(data.saidas || 0);
        setTotal(data.total || 0);
        setTransacoes(data.transacoes || []);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Controle Financeiro</h1>
      <div style={styles.summary}>
        <div style={styles.card}>
          <h3>Entradas</h3>
          <p style={styles.value}>R$ {Number(entradas).toFixed(2)}</p>
        </div>
        <div style={styles.card}>
          <h3>Saídas</h3>
          <p style={styles.value}>R$ {Number(saidas).toFixed(2)}</p>
        </div>
        <div style={styles.card}>
          <h3>Total</h3>
          <p style={styles.value}>R$ {Number(total).toFixed(2)}</p>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((t) => (
            <tr key={t.id}>
              <td>{t.descricao}</td>
              <td>R$ {Number(t.valor).toFixed(2)}</td>
              <td>{t.valor > 0 ? "✅ Entrada" : "❌ Saída"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f4f6f8",
  },
  title: {
    textAlign: "center",
    color: "#2c6e49",
    marginBottom: "20px",
  },
  summary: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#2c6e49",
    color: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center" as const,
  },
  value: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#2c6e49",
    color: "#ffffff",
    padding: "10px",
  },
  td: {
    padding: "10px",
    textAlign: "center",
  },
};
