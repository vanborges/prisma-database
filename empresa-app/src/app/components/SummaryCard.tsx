// components/SummaryCard.tsx
interface SummaryCardProps {
    title: string;
    value: string;
  }
  
  export default function SummaryCard({ title, value }: SummaryCardProps) {
    return (
      <div style={styles.card}>
        <h3>{title}</h3>
        <p style={styles.value}>{value}</p>
      </div>
    );
  }
  
  const styles = {
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
  };
  