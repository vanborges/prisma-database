import React from "react";

interface HeaderProps {
  contas: { id: number; nomeInstituicao: string; tipoDeConta: string }[];
  onSelectConta: (id: number) => void;
}

const Header: React.FC<HeaderProps> = ({ contas, onSelectConta }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value, 10);
    onSelectConta(selectedId);
  };

  return (
    <header style={styles.header}>
      <h1>Controle Financeiro</h1>
      <select onChange={handleChange} style={styles.select}>
        <option value="">Selecione uma Conta</option>
        {contas.map((conta) => (
          <option key={conta.id} value={conta.id}>
            {conta.nomeInstituicao} - {conta.tipoDeConta}
          </option>
        ))}
      </select>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#2c6e49",
    color: "#fff",
  },
  select: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
};

export default Header;
