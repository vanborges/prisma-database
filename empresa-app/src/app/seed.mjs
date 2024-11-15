import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criação de usuários
  await prisma.usuario.create({
    data: {
      nomeDeUsuario: 'johndoe',
      email: 'johndoe@example.com',
      perfilDeConfiguracao: {
        create: {
          notificacoesAtivadas: true,
          moedaPreferida: 'BRL',
        },
      },
      contas: {
        create: [
          {
            tipoDeConta: 'Corrente',
            saldo: 1000,
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
        ],
      },
    },
  });

  console.log('Dados financeiros inseridos com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
