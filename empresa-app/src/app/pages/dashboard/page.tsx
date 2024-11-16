"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [entradas, setEntradas] = useState<number>(0);
  const [saidas, setSaidas] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true); // Para indicar carregamento

  interface Transacao {
    tipoDeTransacao: string;
    id: number;
    descricao: string;
    valor: number;
  }

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Executar requisições em paralelo
        const [transacoesResponse, saldoResponse] = await Promise.all([
          fetch("http://localhost:3000/api/transacoes"),
          fetch("http://localhost:3000/api/contas"),
        ]);

        const transacoesData = await transacoesResponse.json();
        // Fetch do saldo da conta
        const contasResponse = await fetch("http://localhost:3000/api/contas");
        const contasData = await contasResponse.json();

        // Aqui pegamos o saldo da conta correspondente ao usuário
        const saldo = contasData[0]?.saldo || 0;

        // Calcular entradas e saídas
        const entradas = transacoesData
          .filter((t: any) => t.tipoDeTransacao === "ENTRADA")
          .reduce((acc: number, t: any) => acc + parseFloat(t.valor), 0);

        const saidas = transacoesData
          .filter((t: any) => t.tipoDeTransacao === "SAIDA")
          .reduce((acc: number, t: any) => acc + parseFloat(t.valor), 0);

        // Atualizar estados
        setEntradas(entradas);
        setSaidas(saidas);
        setSaldo(saldo); // Ajustar de acordo com a resposta da API
        setTransacoes(transacoesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false); // Desativar loader
      }
    };

    fetchData();
  }, []);

  // Mostrar loading enquanto carrega
  if (loading) {
    return <p style={{ textAlign: "center" }}>Carregando...</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Controle Financeiro</h1>
      <div style={styles.summary}>
        <div style={styles.card}>
          <h3>Entradas</h3>
          <p style={styles.value}>
            {Number(entradas).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
        <div style={styles.card}>
          <h3>Saídas</h3>
          <p style={styles.value}>
            {Number(saidas).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
        <div style={styles.card}>
          <h3>Saldo</h3>
          <p style={styles.value}>
            {Number(saldo).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Descrição</th>
            <th style={styles.th}>Valor</th>
            <th style={styles.th}>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((t) => (
            <tr key={t.id}>
              <td style={styles.td}>{t.descricao}</td>
              <td style={styles.td}>
                {Number(t.valor).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td style={styles.td}>
                {t.tipoDeTransacao === "ENTRADA" ? "✅ Entrada" : "❌ Saída"}
              </td>
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
    textAlign: "center" as "center",
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
    borderCollapse: "collapse" as "collapse",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#2c6e49",
    color: "#ffffff",
    padding: "10px",
  },
  td: {
    padding: "10px",
    textAlign: "center" as "center",
  },
};
