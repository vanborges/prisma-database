import { NextResponse } from "next/server";
import prisma from "../../lib/PrismaClient";

/**
 * @swagger
 * tags:
 *   - name: Transações
 *     description: Operações relacionadas às transações
 */

/**
 * @swagger
 * /api/transacoes:
 *   post:
 *     summary: Cria uma nova transação
 *     tags:
 *       - Transações
 *     description: Adiciona uma nova transação ao banco de dados e atualiza o saldo da conta vinculada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contaId:
 *                 type: integer
 *                 description: ID da conta vinculada
 *                 example: 3
 *               valor:
 *                 type: number
 *                 description: Valor da transação
 *                 example: 500.00
 *               tipoDeTransacao:
 *                 type: string
 *                 enum: [ENTRADA, SAIDA]
 *                 description: Tipo da transação (entrada ou saída)
 *                 example: "ENTRADA"
 *               dataTransacao:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora da transação
 *                 example: "2024-11-15T18:12:33.655Z"
 *               descricao:
 *                 type: string
 *                 description: Descrição detalhada da transação
 *                 example: "Salário recebido"
 *     responses:
 *       200:
 *         description: Transação criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da transação criada
 *                   example: 1
 *                 contaId:
 *                   type: integer
 *                   description: ID da conta vinculada
 *                   example: 3
 *                 valor:
 *                   type: number
 *                   description: Valor da transação
 *                   example: 500.00
 *                 tipoDeTransacao:
 *                   type: string
 *                   description: Tipo da transação
 *                   example: "ENTRADA"
 *                 descricao:
 *                   type: string
 *                   description: Descrição detalhada da transação
 *                   example: "Salário recebido"
 *                 dataTransacao:
 *                   type: string
 *                   format: date-time
 *                   description: Data e hora da transação
 *                   example: "2024-11-15T18:12:33.655Z"
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *                   description: Data e hora de criação da transação
 *                   example: "2024-11-15T19:00:00.000Z"
 *       400:
 *         description: Dados incompletos para criar transação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro.
 *                   example: "Dados incompletos para criar transação"
 *       500:
 *         description: Erro interno ao criar transação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro.
 *                   example: "Erro ao criar transação"
 */

export async function POST(request: Request) {
    try {
      const { contaId, valor, tipoDeTransacao, dataTransacao, descricao } =
        await request.json();
  
      // Validação de campos obrigatórios
      if (
        !contaId ||
        valor === undefined ||
        !tipoDeTransacao ||
        !dataTransacao ||
        !descricao
      ) {
        return NextResponse.json(
          { error: "Dados incompletos para criar transação" },
          { status: 400 }
        );
      }
  
      // Criação da nova transação
      const novaTransacao = await prisma.transacao.create({
        data: {
          contaId,
          valor,
          tipoDeTransacao,
          dataTransacao: new Date(dataTransacao),
          descricao,
          criadoEm: new Date(),
        },
      });
  
      // Ajuste no saldo da conta
      const ajusteSaldo = tipoDeTransacao === "ENTRADA" ? valor : -valor;
  
      await prisma.conta.update({
        where: { id: contaId },
        data: {
          saldo: { increment: ajusteSaldo }, // Incrementa ou decrementa o saldo
        },
      });
  
      return NextResponse.json(novaTransacao, { status: 200 });
    } catch (error: any) {
      console.error("Erro ao criar transação:", error);
  
      // Resposta detalhada com o erro
      return NextResponse.json(
        {
          error: "Erro ao criar transação",
          message: error.message, // Mensagem do erro para debug
          stack: error.stack, // Stack trace para depuração
        },
        { status: 500 }
      );
    }
  }

// Listagem de todas as transações
/**
 * @swagger
 * /api/transacoes:
 *   get:
 *     summary: Lista todas as transações
 *     tags: [Transações]
 *     description: Obtém todas as transações do banco de dados.
 *     responses:
 *       200:
 *         description: Lista de transações retornada com sucesso
 *       500:
 *         description: Erro ao buscar transações
 */
export async function GET() {
  try {
    // trazer ordernado por id
    const transacoes = await prisma.transacao.findMany({
        orderBy: { id: "asc" },
        });


    return NextResponse.json(transacoes, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar transações" },
      { status: 500 }
    );
  }
}

// Atualização de uma transação
/**
 * @swagger
 * /api/transacoes?id={id}:
 *   put:
 *     summary: Atualiza uma transação
 *     tags: [Transações]
 *     description: Atualiza as informações de uma transação específica.
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: ID da transação a ser atualizada
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor:
 *                 type: number
 *                 description: Valor atualizado da transação
 *                 example: 1200.00
 *               dataTransacao:
 *                 type: string
 *                 format: date-time
 *                 description: Data da transação
 *                 example: "2024-11-15T18:12:33.655Z"
 *               descricao:
 *                 type: string
 *                 description: Descrição da transação
 *                 example: "Compra no mercado"
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *       400:
 *         description: ID da transação não fornecido
 *       404:
 *         description: Transação não encontrada
 *       500:
 *         description: Erro ao atualizar transação
 */
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID da transação não fornecido" },
      { status: 400 }
    );
  }

  try {
    const { valor, tipoDeTransacao, dataTransacao, descricao } =
      await request.json();

    // Buscar transação antiga para ajustar saldo
    const transacaoAntiga = await prisma.transacao.findUnique({
      where: { id: Number(id) },
    });
    if (!transacaoAntiga) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    const ajusteSaldoAntigo =
      transacaoAntiga.tipoDeTransacao === "ENTRADA"
        ? -transacaoAntiga.valor
        : transacaoAntiga.valor;

    const ajusteSaldoNovo = tipoDeTransacao === "ENTRADA" ? valor : -valor;

    const transacaoAtualizada = await prisma.transacao.update({
      where: { id: Number(id) },
      data: {
        valor,
        tipoDeTransacao,
        dataTransacao: new Date(dataTransacao),
        descricao,
      },
    });

    // Atualizar saldo da conta
    await prisma.conta.update({
      where: { id: transacaoAntiga.contaId },
      data: { saldo: { increment: ajusteSaldoAntigo + ajusteSaldoNovo } },
    });

    return NextResponse.json(transacaoAtualizada, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar transação" },
      { status: 500 }
    );
  }
}

// Exclusão de uma transação
/**
 * @swagger
 * /api/transacoes?id={id}:
 *   delete:
 *     summary: Remove uma transação
 *     tags: [Transações]
 *     description: Remove uma transação específica do banco de dados.
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: ID da transação a ser removida
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transação removida com sucesso
 *       400:
 *         description: ID da transação não fornecido
 *       404:
 *         description: Transação não encontrada
 *       500:
 *         description: Erro ao remover transação
 */
// Exclusão de uma transação
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID da transação não fornecido" },
      { status: 400 }
    );
  }

  try {
    const transacao = await prisma.transacao.findUnique({
      where: { id: Number(id) },
    });
    if (!transacao) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    const ajusteSaldo =
      transacao.tipoDeTransacao === "ENTRADA"
        ? -transacao.valor
        : transacao.valor;

    await prisma.transacao.delete({
      where: { id: Number(id) },
    });

    // Atualizar saldo da conta
    await prisma.conta.update({
      where: { id: transacao.contaId },
      data: { saldo: { increment: ajusteSaldo } },
    });

    return NextResponse.json(
      { message: "Transação removida com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao remover transação:", error);
    return NextResponse.json(
      { error: "Erro ao remover transação" },
      { status: 500 }
    );
  }
}
