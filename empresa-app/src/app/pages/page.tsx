import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Sistema de Controle Financeiro</h1>
      <nav>
        <ul>
          <li><Link href="/pages/usuarios">Usuários</Link></li>
          <li><Link href="/pages/contas">Contas</Link></li>
          <li><Link href="/pages/transacoes">Transações</Link></li>
          <li><Link href="/pages/categorias">Categorias de Transação</Link></li>
        </ul>
      </nav>
    </div>
  );
}
