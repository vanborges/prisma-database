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
 *     tags: [Transações]
 *     description: Adiciona uma nova transação ao banco de dados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contaId:
 *                 type: integer
 *                 description: ID da conta relacionada
 *                 example: 3
 *               valor:
 *                 type: number
 *                 description: Valor da transação (positivo para crédito, negativo para débito)
 *                 example: 500.00
 *               dataTransacao:
 *                 type: string
 *                 format: date-time
 *                 description: Data da transação
 *                 example: "2024-11-15T18:12:33.655Z"
 *               descricao:
 *                 type: string
 *                 description: Descrição da transação
 *                 example: "Salário"
 *     responses:
 *       200:
 *         description: Transação criada com sucesso
 *       500:
 *         description: Erro ao criar transação
 */
export async function POST(request: Request) {
  try {
    const { contaId, valor, dataTransacao, descricao } = await request.json();

    if (!contaId || valor === undefined || !dataTransacao || !descricao) {
      return NextResponse.json(
        { error: "Dados incompletos para criar transação" },
        { status: 400 }
      );
    }

    const novaTransacao = await prisma.transacao.create({
      data: {
        contaId,
        valor,
        dataTransacao: new Date(dataTransacao),
        descricao,
        criadoEm: new Date(),
      },
    });

    return NextResponse.json(novaTransacao, { status: 200 });
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return NextResponse.json({ error: "Erro ao criar transação" }, { status: 500 });
  }
}

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
    const transacoes = await prisma.transacao.findMany({
      include: {
        conta: true,
      },
    });

    return NextResponse.json(transacoes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar transações" },
      { status: 500 }
    );
  }
}

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
    const { valor, dataTransacao, descricao } = await request.json();
    const transacaoAtualizada = await prisma.transacao.update({
      where: { id: Number(id) },
      data: { valor, dataTransacao: new Date(dataTransacao), descricao },
    });

    return NextResponse.json(transacaoAtualizada, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar transação" },
      { status: 500 }
    );
  }
}

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
 *       404:
 *         description: ID da transação não fornecido
 *       500:
 *         description: Erro ao remover transação
 */
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
    await prisma.transacao.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Transação removida com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao remover transação" },
      { status: 500 }
    );
  }
}
