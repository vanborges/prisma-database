import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criação de projetos
  await prisma.projeto.createMany({
    data: [
      { nome: 'Mickey e Amigos' },
      { nome: 'Disney Princesses' },
      { nome: 'Pixar Adventures' }
    ]
  });

  // Criação de funcionários
  await prisma.funcionario.create({
    data: {
      nome: 'Mickey Mouse',
      salario: 3000,
      endereco: {
        create: {
          rua: 'Rua da Diversão',
          bairro: 'Land of Magic',
          numero: 123
        }
      },
      dependentes: {
        create: [
          {
            nome: 'Minnie Mouse',
            parentesco: 'Namorada'
          }
        ]
      },
      projetos: {
        create: [
          { projeto: { connect: { id: 1 } } },
          { projeto: { connect: { id: 2 } } }
        ]
      }
    }
  });

  await prisma.funcionario.create({
    data: {
      nome: 'Donald Duck',
      salario: 2500,
      endereco: {
        create: {
          rua: 'Avenida Alegria',
          bairro: 'Happyland',
          numero: 456
        }
      },
      dependentes: {
        create: [
          {
            nome: 'Daisy Duck',
            parentesco: 'Namorada'
          }
        ]
      },
      projetos: {
        create: [
          { projeto: { connect: { id: 1 } } },
          { projeto: { connect: { id: 3 } } }
        ]
      }
    }
  });

  console.log('Dados inseridos com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });