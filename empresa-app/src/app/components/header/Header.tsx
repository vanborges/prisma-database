"use client";

import { AppBar, Toolbar, Typography, Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";

interface HeaderProps {
  contas: { id: number; tipoDeConta: string }[];
  onSelectConta: (id: number) => void;
}

export default function Header({ contas, onSelectConta }: HeaderProps) {
  const [selectedConta, setSelectedConta] = useState<number | null>(null);

  useEffect(() => {
    if (contas.length > 0 && selectedConta === null) {
      setSelectedConta(contas[0].id);
      onSelectConta(contas[0].id);
    }
  }, [contas, selectedConta, onSelectConta]);

  const handleChange = (event: any) => {
    const contaId = event.target.value;
    setSelectedConta(contaId);
    onSelectConta(contaId);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#2c6e49" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Controle Financeiro</Typography>
        <div>
          <Typography variant="body1" style={{ marginRight: "10px", display: "inline" }}>
            Selecione a Conta:
          </Typography>
          <Select
            value={selectedConta || ""}
            onChange={handleChange}
            style={{ backgroundColor: "#fff", borderRadius: "5px", minWidth: "200px" }}
          >
            {contas.map((conta) => (
              <MenuItem key={conta.id} value={conta.id}>
                {conta.tipoDeConta} (ID: {conta.id})
              </MenuItem>
            ))}
          </Select>
        </div>
      </Toolbar>
    </AppBar>
  );
}
