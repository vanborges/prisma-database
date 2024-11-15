import { NextResponse } from "next/server";
import prisma from "../../lib/PrismaClient";

/**
 * @swagger
 * tags:
 *   - name: Contas
 *     description: Operações relacionadas às contas
 */

/**
 * @swagger
 * /api/contas:
 *   post:
 *     summary: Cria uma nova conta
 *     tags: [Contas]
 *     description: Adiciona uma nova conta ao banco de dados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *                 description: ID do usuário associado à conta
 *                 example: 1
 *               tipoDeConta:
 *                 type: string
 *                 description: Tipo da conta (ex: Corrente, Poupança)
 *                 example: "Corrente"
 *               saldo:
 *                 type: number
 *                 description: Saldo inicial da conta
 *                 example: 1000.00
 *     responses:
 *       200:
 *         description: Conta criada com sucesso
 *       500:
 *         description: Erro ao criar conta
 */
export async function POST(request: Request) {
  try {
    const { usuarioId, tipoDeConta, saldo } = await request.json();

    if (!usuarioId || !tipoDeConta || saldo === undefined) {
      return NextResponse.json(
        { error: "Dados incompletos para criar conta" },
        { status: 400 }
      );
    }

    const novaConta = await prisma.conta.create({
      data: {
        usuarioId,
        tipoDeConta,
        saldo,
        criadoEm: new Date(),
      },
    });

    return NextResponse.json(novaConta, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar conta" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/contas:
 *   get:
 *     summary: Lista todas as contas
 *     tags: [Contas]
 *     description: Obtém todas as contas do banco de dados.
 *     responses:
 *       200:
 *         description: Lista de contas retornada com sucesso
 *       500:
 *         description: Erro ao buscar contas
 */
export async function GET() {
  try {
    const contas = await prisma.conta.findMany({
      include: {
        usuario: true, // Inclui dados do usuário associado, caso necessário
      },
    });

    return NextResponse.json(contas, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar contas" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/contas?id={id}:
 *   put:
 *     summary: Atualiza uma conta
 *     tags: [Contas]
 *     description: Atualiza as informações de uma conta específica.
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: ID da conta a ser atualizada
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipoDeConta:
 *                 type: string
 *                 description: Tipo da conta
 *                 example: "Corrente"
 *               saldo:
 *                 type: number
 *                 description: Saldo atualizado da conta
 *                 example: 1200.00
 *     responses:
 *       200:
 *         description: Conta atualizada com sucesso
 *       400:
 *         description: ID da conta não fornecido
 *       404:
 *         description: Conta não encontrada
 *       500:
 *         description: Erro ao atualizar conta
 */
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID da conta não fornecido" },
      { status: 400 }
    );
  }

  try {
    const { tipoDeConta, saldo } = await request.json();
    const contaAtualizada = await prisma.conta.update({
      where: { id: Number(id) },
      data: { tipoDeConta, saldo },
    });

    return NextResponse.json(contaAtualizada, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar conta" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/contas?id={id}:
 *   delete:
 *     summary: Remove uma conta
 *     tags: [Contas]
 *     description: Remove uma conta específica do banco de dados.
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: ID da conta a ser removida
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Conta removida com sucesso
 *       404:
 *         description: ID da conta não fornecido
 *       500:
 *         description: Erro ao remover conta
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID da conta não fornecido" },
      { status: 400 }
    );
  }

  try {
    await prisma.conta.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Conta removida com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao remover conta" },
      { status: 500 }
    );
  }
}
