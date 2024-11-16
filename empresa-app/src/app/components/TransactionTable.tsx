// components/TransactionTable.tsx
interface Transaction {
    id: number;
    descricao: string;
    valor: number;
    tipoDeTransacao: string;
  }
  
  interface TransactionTableProps {
    transactions: Transaction[];
  }
  
  export default function TransactionTable({ transactions }: TransactionTableProps) {
    return (
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Descrição</th>
            <th style={styles.th}>Valor</th>
            <th style={styles.th}>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
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
    );
  }
  
  const styles = {
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      marginTop: "20px",
    },
    th: {
      backgroundColor: "#2c6e49",
      color: "#ffffff",
      padding: "10px",
    },
    td: {
      padding: "10px",
      textAlign: "center" as const,
    },
  };
  