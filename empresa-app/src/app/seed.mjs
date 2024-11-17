import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Populando banco de dados...");

  // Criptografando a senha para os usuários
  const senhaCriptografada = await bcrypt.hash("senha123", 10);

  // Criando usuários
  const usuarios = await prisma.usuario.createMany({
    data: [
      { nomeDeUsuario: "johndoe", email: "johndoe@example.com", senha: senhaCriptografada },
      { nomeDeUsuario: "janedoe", email: "janedoe@example.com", senha: senhaCriptografada },
    ],
  });
  console.log("Usuários criados:", usuarios);

  // Buscando os IDs dos usuários criados
  const usuario1 = await prisma.usuario.findUnique({ where: { email: "johndoe@example.com" } });
  const usuario2 = await prisma.usuario.findUnique({ where: { email: "janedoe@example.com" } });

  // Criando contas associadas aos usuários
  const contas = await prisma.conta.createMany({
    data: [
      { usuarioId: usuario1.id, tipoDeConta: "Corrente", nomeInstituicao: "Banco do Brasil", saldo: 1000 },
      { usuarioId: usuario2.id, tipoDeConta: "Poupança", nomeInstituicao: "Caixa Econômica", saldo: 500 },
    ],
  });
  console.log("Contas criadas:", contas);

  // Buscando as contas para associar transações
  const conta1 = await prisma.conta.findFirst({ where: { usuarioId: usuario1.id } });
  const conta2 = await prisma.conta.findFirst({ where: { usuarioId: usuario2.id } });

  // Criando transações para as contas
  const transacoes = await prisma.transacao.createMany({
    data: [
      { contaId: conta1.id, valor: -100, tipoDeTransacao: "SAIDA", descricao: "Compra no mercado", dataTransacao: new Date() },
      { contaId: conta1.id, valor: 500, tipoDeTransacao: "ENTRADA", descricao: "Depósito bancário", dataTransacao: new Date() },
      { contaId: conta2.id, valor: -50, tipoDeTransacao: "SAIDA", descricao: "Conta de luz", dataTransacao: new Date() },
      { contaId: conta2.id, valor: 100, tipoDeTransacao: "ENTRADA", descricao: "Transferência recebida", dataTransacao: new Date() },
    ],
  });
  console.log("Transações criadas:", transacoes);

  console.log("Seed finalizada com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
