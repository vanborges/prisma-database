import { useState, useEffect } from 'react';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nomeDeUsuario, setNomeDeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [usuarioId, setUsuarioId] = useState(null);

  // Função para listar todos os usuários
  const fetchUsuarios = async () => {
    const response = await fetch('/api/usuarios');
    const data = await response.json();
    setUsuarios(data);
  };

  // Função para criar ou atualizar um usuário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = usuarioId ? 'PUT' : 'POST';
    const url = usuarioId ? `/api/usuarios?id=${usuarioId}` : '/api/usuarios';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nomeDeUsuario, email }),
    });

    if (response.ok) {
      fetchUsuarios(); // Atualiza a lista
      setNomeDeUsuario('');
      setEmail('');
      setUsuarioId(null);
    }
  };

  // Função para excluir um usuário
  const handleDelete = async (id) => {
    await fetch(`/api/usuarios?id=${id}`, {
      method: 'DELETE',
    });
    fetchUsuarios();
  };

  // Carrega a lista de usuários ao montar o componente
  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div>
      <h1>Gerenciamento de Usuários</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">{usuarioId ? 'Atualizar' : 'Criar'}</button>
      </form>

      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.nomeDeUsuario} - {usuario.email}
            <button onClick={() => handleDelete(usuario.id)}>Excluir</button>
            <button
              onClick={() => {
                setNomeDeUsuario(usuario.nomeDeUsuario);
                setEmail(usuario.email);
                setUsuarioId(usuario.id);
              }}
            >
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Usuarios;
