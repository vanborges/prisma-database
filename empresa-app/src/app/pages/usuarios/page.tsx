"use client";

import { useState, useEffect } from "react";

export default function UsuariosPage() {
  interface Usuario {
    id: number;
    nomeDeUsuario: string;
    email: string;
  }

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nomeDeUsuario, setNomeDeUsuario] = useState("");
  const [email, setEmail] = useState("");

  // Carregar usuários ao carregar a página
  useEffect(() => {
    fetch("/api/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data));
  }, []);

  // Função para adicionar um novo usuário
  const handleAddUsuario = async () => {
    const response = await fetch("/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nomeDeUsuario, email }),
    });

    if (response.ok) {
      const newUser = await response.json();
      setUsuarios([...usuarios, newUser]);
      setNomeDeUsuario("");
      setEmail("");
    }
  };

  // Função para deletar um usuário
  const handleDeleteUsuario = async (id: number) => {
    const response = await fetch(`/api/usuarios?id=${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    }
  };

  return (
    <div>
      <h1>Gestão de Usuários</h1>

      <h2>Adicionar Usuário</h2>
      <input
        type="text"
        placeholder="Nome de Usuário"
        value={nomeDeUsuario}
        onChange={(e) => setNomeDeUsuario(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleAddUsuario}>Adicionar</button>

      <h2>Lista de Usuários</h2>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.nomeDeUsuario} - {usuario.email}
            <button onClick={() => handleDeleteUsuario(usuario.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
