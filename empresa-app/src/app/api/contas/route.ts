import { NextResponse } from "next/server";
import prisma from "../../lib/PrismaClient";

/**
 * @swagger
 * tags:
 *   - name: Contas
 *     description: Operações relacionadas às contas
 */

// Helper para tratar erros e responder consistentemente
const handleError = (error: any, message: string, status = 500) => {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status });
};
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
 *               nomeInstituicao:
 *                 type: string
 *                 description: Nome da instituição bancária
 *                 example: "Banco do Brasil"
 *     responses:
 *       200:
 *         description: Conta criada com sucesso
 *       400:
 *         description: Dados incompletos para criar conta
 *       500:
 *         description: Erro ao criar conta
 */
export async function POST(request: Request) {
  try {
    const { usuarioId, tipoDeConta, saldo, nomeInstituicao } =
      await request.json();

    if (!usuarioId || !tipoDeConta || saldo === undefined || !nomeInstituicao) {
      return NextResponse.json(
        {
          error:
            "Todos os campos são obrigatórios: usuarioId, tipoDeConta, saldo, nomeInstituicao",
        },
        { status: 400 }
      );
    }

    const novaConta = await prisma.conta.create({
      data: { usuarioId, tipoDeConta, saldo, nomeInstituicao },
    });

    return NextResponse.json(novaConta, { status: 200 });
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/contas:
 *   get:
 *     summary: Lista todas as contas ou as contas de um usuário
 *     tags: [Contas]
 *     description: Obtém todas as contas ou filtra por usuário.
 *     parameters:
 *       - name: usuarioId
 *         in: query
 *         required: false
 *         description: ID do usuário para filtrar contas
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de contas retornada com sucesso
 *       500:
 *         description: Erro ao buscar contas
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get("usuarioId");

    const where = usuarioId ? { usuarioId: Number(usuarioId) } : undefined;

    const contas = await prisma.conta.findMany({ where });

    return NextResponse.json(contas, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar contas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar contas." },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/contas:
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
 *               saldo:
 *                 type: number
 *                 description: Saldo atualizado da conta
 *               nomeInstituicao:
 *                 type: string
 *                 description: Nome da instituição bancária
 *     responses:
 *       200:
 *         description: Conta atualizada com sucesso
 *       400:
 *         description: ID da conta não fornecido ou dados inválidos
 *       404:
 *         description: Conta não encontrada
 *       500:
 *         description: Erro ao atualizar conta
 */
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID da conta não fornecido" },
        { status: 400 }
      );
    }

    const { tipoDeConta, saldo, nomeInstituicao } = await request.json();

    if (!tipoDeConta && saldo === undefined && !nomeInstituicao) {
      return NextResponse.json(
        { error: "Nenhum campo foi fornecido para atualização." },
        { status: 400 }
      );
    }

    const contaAtualizada = await prisma.conta.update({
      where: { id: Number(id) },
      data: { tipoDeConta, saldo, nomeInstituicao },
    });

    return NextResponse.json(contaAtualizada, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar conta:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar conta." },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/contas:
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
 *       400:
 *         description: ID da conta não fornecido
 *       500:
 *         description: Erro ao remover conta
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID da conta não fornecido" },
        { status: 400 }
      );
    }

    await prisma.conta.delete({ where: { id: Number(id) } });

    return NextResponse.json(
      { message: "Conta excluída com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    return NextResponse.json(
      { error: "Erro ao excluir conta." },
      { status: 500 }
    );
  }
}

