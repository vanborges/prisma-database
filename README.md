# Projeto de Controle Financeiro com Prisma e Next.js

Este projeto visa criar um sistema de controle financeiro utilizando Next.js para o frontend e Prisma ORM para gerenciar o banco de dados relacional. O sistema inclui operações de CRUD para gerenciar usuários, contas, transações e categorias de transação, além de uma trigger para manter logs de transações.

## Índice

- **Objetivo**
- **Pré-requisitos**
- **Estrutura do Projeto**
- **Passo a Passo para Configuração**
  - 1. Clonar o Repositório
  - 2. Inicializar o Prisma
  - 3. Configurar o Banco de Dados
  - 4. Criar Modelos e Migrações
  - 5. Popular o Banco com Dados de Seed
  - 6. Iniciar o Servidor
- **Testando a API**
  - Swagger UI
  - Usando o Postman ou cURL

---

## Objetivo

- Criar um sistema de controle financeiro completo, permitindo a gestão de usuários, contas bancárias, transações financeiras e categorias de transação.
- Incluir uma trigger para registrar operações de modificação de transações no banco de dados.

## Pré-requisitos

- **Node.js** e **npm**
- **PostgreSQL** (ou outro banco de dados compatível)
- **Editor de código** como **VS Code**
- Conhecimentos básicos de **JavaScript/TypeScript**

## Estrutura do Projeto

- **Next.js**: Framework para frontend em React.
- **Prisma**: ORM para interagir com o banco de dados.
- **PostgreSQL**: Banco de dados relacional.

## Passo a Passo para Configuração

1. **Clonar o Repositório**

   - Clone o repositório do projeto para o seu ambiente de desenvolvimento local:
     ```bash
     git clone https://github.com/vanborges/prisma-database.git
     cd empresa-app
     npm install
     ```

2. **Inicializar o Prisma**

   - Inicialize o Prisma no projeto para configurar os arquivos básicos para gerenciamento do banco de dados:
     ```bash
     npx prisma init
     ```
   - Este comando cria:
     - `schema.prisma`: onde você define o modelo de dados e a configuração do Prisma.
     - `.env`: arquivo onde você define variáveis de ambiente, como a URL de conexão com o banco de dados.

3. **Configurar o Banco de Dados**

   - Abra o arquivo `.env` e configure a URL de conexão com o banco de dados. Exemplo:
     ```bash
     DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
     ```

4. **Criar Modelos e Migrações**

   - Defina os modelos de dados no arquivo `prisma/schema.prisma`.
   - Execute o comando para gerar as migrações e sincronizar o banco de dados com o esquema definido:
     ```bash
     npx prisma migrate dev --name init
     ```
   - Esse comando:
     - Compara o estado atual do banco com o esquema definido no Prisma.
     - Cria e aplica uma migração.
     - Atualiza o cliente do Prisma para o novo esquema.

5. **Popular o Banco com Dados de Seed**

   - Para adicionar dados iniciais ao banco, utilize o script de seed disponível:
     ```bash
     npm run seed
     ```

6. **Iniciar o Servidor**
   - Com o banco de dados configurado e populado, inicie o servidor de desenvolvimento do Next.js:
     ```bash
     npm run dev
     ```
   - O servidor estará acessível em `http://localhost:3000`.

---

## Testando a API

- A API está localizada em `src/app/api` e inclui rotas para **Usuários**, **Contas**, **Transações** e **Categorias de Transação**.

### Testar com Swagger UI

1. Acesse a interface Swagger UI no navegador:
   ```bash
   http://localhost:3000/api/swagger
   ```

### Trigger de Log para Transações

- Comando para criar a trigger

```
-- Criação da tabela de logs
CREATE TABLE IF NOT EXISTS transacao_logs (
   id SERIAL PRIMARY KEY,
   transacao_id INTEGER NOT NULL,
   usuario_id INTEGER,
   operacao VARCHAR(10) NOT NULL,
   data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   descricao TEXT,
   CONSTRAINT fk_transacao FOREIGN KEY (transacao_id) REFERENCES transacoes (id) ON DELETE CASCADE
);

-- Função para registrar logs de operações em transacoes
CREATE OR REPLACE FUNCTION log_transacao_operacao()
RETURNS TRIGGER AS $$
BEGIN
   IF (TG_OP = 'DELETE') THEN
       -- Log para exclusão
       INSERT INTO transacao_logs (transacao_id, usuario_id, operacao, descricao)
       VALUES (OLD.id, OLD.contaId, 'DELETE', OLD.descricao);
       RETURN OLD;
   ELSIF (TG_OP = 'UPDATE') THEN
       -- Log para atualização
       INSERT INTO transacao_logs (transacao_id, usuario_id, operacao, descricao)
       VALUES (OLD.id, OLD.contaId, 'UPDATE', OLD.descricao);
       RETURN NEW;
   END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger para chamar a função log_transacao_operacao em eventos de DELETE e UPDATE na tabela transacoes
CREATE TRIGGER transacao_log_trigger
AFTER DELETE OR UPDATE
ON transacoes
FOR EACH ROW
EXECUTE FUNCTION log_transacao_operacao();

```

- A trigger de log registra operações de atualização e exclusão em transações.
- Para testar a trigger:
  - Execute operações de UPDATE ou DELETE em transações.
  - Consulte o log na tabela transacao_logs para verificar os registros.
