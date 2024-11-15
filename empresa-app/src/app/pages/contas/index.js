import { useState, useEffect } from 'react';

const Contas = () => {
  const [contas, setContas] = useState([]);
  const [tipoDeConta, setTipoDeConta] = useState('');
  const [saldo, setSaldo] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [contaId, setContaId] = useState(null);

  // Função para listar todas as contas
  const fetchContas = async () => {
    const response = await fetch('/api/contas');
    const data = await response.json();
    setContas(data);
  };

  // Função para criar ou atualizar uma conta
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = contaId ? 'PUT' : 'POST';
    const url = contaId ? `/api/contas?id=${contaId}` : '/api/contas';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tipoDeConta, saldo: parseFloat(saldo), usuarioId: parseInt(usuarioId) }),
    });

    if (response.ok) {
      fetchContas(); // Atualiza a lista
      setTipoDeConta('');
      setSaldo('');
      setUsuarioId('');
      setContaId(null);
    }
  };

  // Função para excluir uma conta
  const handleDelete = async (id) => {
    await fetch(`/api/contas?id=${id}`, {
      method: 'DELETE',
    });
    fetchContas();
  };

  // Carrega a lista de contas ao montar o componente
  useEffect(() => {
    fetchContas();
  }, []);

  return (
    <div>
      <h1>Gerenciamento de Contas</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tipo de Conta"
          value={tipoDeConta}
          onChange={(e) => setTipoDeConta(e.target.value)}
        />
        <input
          type="number"
          placeholder="Saldo"
          value={saldo}
          onChange={(e) => setSaldo(e.target.value)}
        />
        <input
          type="number"
          placeholder="ID do Usuário"
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
        />
        <button type="submit">{contaId ? 'Atualizar' : 'Criar'}</button>
      </form>

      <ul>
        {contas.map((conta) => (
          <li key={conta.id}>
            Tipo: {conta.tipoDeConta} - Saldo: {conta.saldo} - Usuário ID: {conta.usuarioId}
            <button onClick={() => handleDelete(conta.id)}>Excluir</button>
            <button
              onClick={() => {
                setTipoDeConta(conta.tipoDeConta);
                setSaldo(conta.saldo);
                setUsuarioId(conta.usuarioId);
                setContaId(conta.id);
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

export default Contas;
