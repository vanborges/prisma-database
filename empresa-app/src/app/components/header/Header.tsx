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
      <div style={{ width: "300px" }}>
        <Select
          options={options}
          onChange={handleChange}
          placeholder="Selecione uma Conta"
          styles={customStyles}
          isClearable
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
};

const customStyles = {
  control: (base: any) => ({
    ...base,
    borderColor: "#ddd",
    borderRadius: "5px",
    padding: "5px",
    fontSize: "16px",
  }),
  option: (base: any, { isFocused }: { isFocused: boolean }) => ({
    ...base,
    backgroundColor: isFocused ? "#d5f5e3" : "#fff",
    color: "#000",
  }),
};

export default Header;
