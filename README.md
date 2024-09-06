## Roteiro Completo para a Aula Prática

### Objetivo da Aula:

- Criar e configurar um modelo Prisma.
- Gerar migrações para o banco de dados.
- Testar as operações CRUD (criação, leitura, atualização e exclusão) via API.

### Pré-requisitos:

- Conhecimentos básicos de JavaScript/TypeScript.
- Node.js instalado.
- PostgreSQL ou outro banco de dados configurado.
- VS Code (ou qualquer outro editor de código).

### Estrutura do Projeto

- **Next.js**: Framework para React.
- **Prisma**: ORM para acesso ao banco de dados.
- **PostgreSQL**: Banco de dados relacional.

#### Passo 1: Clonar o Repositório
Inicie clonando o repositório do projeto que será a base para a aula.
```bash
git clone https://github.com/vanborges/prisma-database.git
```
```bash
cd empresa-app
```
```bash
npm install
```
#### Passo 2: Configuração Inicial

#### 2.1.	Configurar o Banco de Dados:
Abra o arquivo .env e defina a URL do banco de dados.
Exemplo:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
```
#### Passo 3: Inicializar o Prisma:
Certifique-se de que o Prisma está configurado corretamente.
```bash
npx prisma init
```
#### Passo 4: Criar os Modelos:
No arquivo prisma/schema.prisma, revise e crie novos modelos se necessário. 
```bash
model Funcionario {
  id          Int               @id @default(autoincrement())
  nome        String
  salario     String            @default("0")
  endereco    Endereco?
  dependentes Dependente[]
  projetos    FuncioanrioProjeto[]
}

// Relacionamento 1:1 - Funcionario:Endereco
model Endereco {
  id            Int         @id @default(autoincrement())
  rua           String
  bairro        String?
  numero        Int
  funcionarioId Int         @unique
  funcionario   Funcionario @relation(fields: [funcionarioId], references: [id], onDelete: Cascade)
}
// Relacionamento 1:n - Funcionario:Dependente
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

// Relacionamento n:n - Funcionario:Projeto
model FuncioanrioProjeto {
  funcionarioId Int
  projetoId     Int
  funcionario   Funcionario @relation(fields: [funcionarioId], references: [id])
  projeto       Projeto     @relation(fields: [projetoId], references: [id])
  @@id([funcionarioId, projetoId])
}
```
#### Passo 5: Gerar migration com base no modelo
Com o esquema do Prisma configurado, gere a migração e aplique-a ao banco de dados.
```bash
npx prisma migrate dev --name init
```
#### Passo 6: Popular o Banco de Dados com o Script de Seed
Para popular o banco de dados com dados iniciais, você pode utilizar o script de seed já configurado. O arquivo de seed está localizado em src/app/seed.mts e contém instruções para inserir dados no banco de dados.

Execute o seguinte comando no terminal para rodar o script de seed e popular o banco de dados:
```bash
npm run seed
```
O comando npm run seed executará o arquivo seed.mts e inserirá os dados iniciais no banco de dados conforme definido no script.

#### Passo 7: Iniciar o Servidor
Agora que o banco de dados e as migrações estão prontos, inicie o servidor Next.js para testar a API.
```bash
npm run dev
```
#### Passo 8: Testar a API
##### 8.1.	Criar Funcionario via API (POST /api/funcionarios):
Use Postman ou cURL para enviar uma requisição POST e criar um novo funcionário.
Exemplo de requisição cURL:
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
##### 8.2 Testar a Rota GET (Listar Funcionários)
```bash
curl -X GET http://localhost:3000/api/funcionarios
```
