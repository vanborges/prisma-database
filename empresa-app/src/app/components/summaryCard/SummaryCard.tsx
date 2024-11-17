import styles from "./SummaryCard.module.css";

interface SummaryCardProps {
  title: string;
  value: string;
}

export default function SummaryCard({ title, value }: SummaryCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>{value}</p>
    </div>
  );
}
