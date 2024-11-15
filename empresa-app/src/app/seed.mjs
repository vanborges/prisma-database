import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criação de um usuário e associando uma conta a ele
  const usuario = await prisma.usuario.upsert({
    where: { nomeDeUsuario: 'johndoe' },
    update: {},
    create: {
      nomeDeUsuario: 'johndoe',
      email: 'johndoe@example.com',
      perfilDeConfiguracao: {
        create: {
          notificacoesAtivadas: true,
          moedaPreferida: 'BRL',
        },
      },
    },
  });

  // Associando uma conta ao usuário criado
  const conta = await prisma.conta.create({
    data: {
      usuarioId: usuario.id, // Associando ao id do usuário criado
      tipoDeConta: 'Corrente',
      saldo: 1000,
      criadoEm: new Date(),
      transacoes: {
        create: [
          {
            valor: -100,
            dataTransacao: new Date(),
            descricao: 'Compra de supermercado',
            categorias: {
              create: [
                {
                  categoria: {
                    connectOrCreate: {
                      where: { nomeDaCategoria: 'Alimentação' },
                      create: { nomeDaCategoria: 'Alimentação' },
                    },
                  },
                },
              ],
            },
          },
          {
            valor: 500,
            dataTransacao: new Date(),
            descricao: 'Salário',
            categorias: {
              create: [
                {
                  categoria: {
                    connectOrCreate: {
                      where: { nomeDaCategoria: 'Renda' },
                      create: { nomeDaCategoria: 'Renda' },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Dados financeiros inseridos com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
