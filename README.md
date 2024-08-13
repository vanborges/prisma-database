# API com Next.js 13 e Prisma

Este projeto configura uma API simples usando Next.js 13 e Prisma para gerenciar dados de funcionários, endereços, dependentes e projetos. A API permite operações CRUD para o modelo de dados fornecido

## Estrutura do Projeto

- **Next.js**: Framework para React.
- **Prisma**: ORM para acesso ao banco de dados.
- **PostgreSQL**: Banco de dados relacional.

## Instalação e Configuração
Instale as dependências do projeto:
### Passo 1: Instalar Dependências
```bash
npm install
```

### Passo 2: Configurar o Prisma
#### 2.1: Instale o Prisma ClIENT
```bash
npm install @prisma/client
npm install --save-dev prisma
```
#### 2.2: Inicialize o prisma
```bash
npx prisma init
```
#### 2.3: Configurar o Banco de Dados
No arquivo .env, defina a URL do banco de dados:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres?schema=public"
```
#### 2.4: Definir o Esquema Prisma
Atualize o arquivo prisma/schema.prisma com o seguinte conteúdo:
```bash
model Funcionario {
  id          Int               @id @default(autoincrement())
  nome        String
  salario     String            @default("0")
  endereco    Endereco?
  dependentes Dependente[]
  projetos    FuncioanrioProjeto[]
}

model Endereco {
  id            Int         @id @default(autoincrement())
  rua           String
  bairro        String?
  numero        Int
  funcionarioId Int         @unique
  funcionario   Funcionario @relation(fields: [funcionarioId], references: [id], onDelete: Cascade)
}

model Dependente {
  id            Int         @id @default(autoincrement())
  nome          String
  parentesco    String
  funcionarioId Int
  funcionario   Funcionario @relation(fields: [funcionarioId], references: [id], onDelete: Cascade)
}

model Projeto {
  id            Int               @id @default(autoincrement())
  nome          String
  funcionarios  FuncioanrioProjeto[]
}

model FuncioanrioProjeto {
  funcionarioId Int
  projetoId     Int
  funcionario   Funcionario @relation(fields: [funcionarioId], references: [id])
  projeto       Projeto     @relation(fields: [projetoId], references: [id])
  @@id([funcionarioId, projetoId])
}
```
#### 2.5: Executar a Migration
Gera e versiona o esquema do banco de dados:
```bash
npx prisma migrate dev --name init
```

### Passo 3: Criar o Seed do Banco de Dados

#### 3.1: Crie um arquivo prisma/seed.ts para popular o banco de dados com dados iniciais:
```bash
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criação de projetos
  await prisma.projeto.createMany({
    data: [
      { nome: 'Projeto Alpha' },
      { nome: 'Projeto Beta' },
      { nome: 'Projeto Gamma' }
    ]
  });

  // Criação de funcionários
  await prisma.funcionario.createMany({
    data: [
      {
        nome: 'João da Silva',
        salario: '3000',
        endereco: {
          create: {
            rua: 'Rua Exemplo',
            bairro: 'Bairro Exemplo',
            numero: 123
          }
        },
        dependentes: {
          create: [
            {
              nome: 'Maria Silva',
              parentesco: 'Esposa'
            }
          ]
        },
        projetos: {
          create: [
            { projetoId: 1 },
            { projetoId: 2 }
          ]
        }
      },
      {
        nome: 'Ana Pereira',
        salario: '2500',
        endereco: {
          create: {
            rua: 'Avenida Central',
            bairro: 'Centro',
            numero: 456
          }
        },
        dependentes: {
          create: [
            {
              nome: 'Pedro Pereira',
              parentesco: 'Filho'
            }
          ]
        },
        projetos: {
          create: [
            { projetoId: 2 },
            { projetoId: 3 }
          ]
        }
      }
    ]
  });

  console.log('Seed data inserted');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```
#### 3.2: Execute o seed com o comando:
```bash
npx ts-node prisma/seed.ts
```

### Passo 4: Criar a Rota da API
No diretório src/app/api/funcionarios/, crie o arquivo route.ts:
```bash
import { NextResponse } from 'next/server';
import prisma from '@/prismaClient';

export async function POST(request: Request) {
  try {
    const { nome, salario, endereco, dependentes, projetos } = await request.json();

    const newFuncionario = await prisma.funcionario.create({
      data: {
        nome,
        salario,
        endereco: endereco ? {
          create: endereco
        } : undefined,
        dependentes: dependentes ? {
          create: dependentes
        } : undefined,
        projetos: projetos ? {
          create: projetos.map(projetoId => ({ projetoId }))
        } : undefined
      }
    });

    return NextResponse.json(newFuncionario, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating funcionario' }, { status: 500 });
  }
}
```

### Passo 6: Iniciar o Servidor
Inicie o servidor de desenvolvimento Next.js:
```bash
npm run dev
```

### Passo 7: Testar a API
Para testar a rota POST /api/funcionarios, use cURL ou Insomnia:
```bash
curl -X POST http://localhost:3000/api/funcionarios \
-H "Content-Type: application/json" \
-d '{
  "nome": "Carlos Souza",
  "salario": "4000",
  "endereco": {
    "rua": "Rua Principal",
    "bairro": "Centro",
    "numero": 789
  },
  "dependentes": [
    {
      "nome": "Juliana Souza",
      "parentesco": "Esposa"
    }
  ],
  "projetos": [1, 3]
}'
```
