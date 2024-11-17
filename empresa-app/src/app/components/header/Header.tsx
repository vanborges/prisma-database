import React from "react";
import Select from "react-select";

interface HeaderProps {
  contas: { id: number; nomeInstituicao: string; tipoDeConta: string }[];
  onSelectConta: (id: number) => void;
}

const Header: React.FC<HeaderProps> = ({ contas, onSelectConta }) => {
  const options = contas.map((conta) => ({
    value: conta.id,
    label: `${conta.nomeInstituicao} - ${conta.tipoDeConta}`,
  }));

  const handleChange = (selectedOption: { value: number; label: string } | null) => {
    if (selectedOption) {
      onSelectConta(selectedOption.value);
    }
  };

  return (
    <header style={styles.header}>
      <h1>Controle Financeiro</h1>
      <div style={styles.selectContainer}>
        <Select
          options={options}
          onChange={handleChange}
          placeholder="Selecione uma Conta"
          styles={customStyles}
        />
      </div>
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
  selectContainer: {
    width: "300px", // Ajuste o tamanho do select
  },
};

// Estilos personalizados para o react-select
const customStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "5px",
    fontSize: "16px",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#2c6e49" : "#fff",
    color: state.isFocused ? "#fff" : "#000",
  }),
};

export default Header;
