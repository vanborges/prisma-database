import { NextResponse } from "next/server";
import prisma from "../../lib/PrismaClient";

/**
 * @swagger
 * tags:
 *   - name: Usuários
 *     description: Operações relacionadas aos usuários
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     description: Obtém todos os usuários do banco de dados, incluindo seu perfil de configuração e contas.
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *       500:
 *         description: Erro ao buscar usuários
 */
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        perfilDeConfiguracao: true,
        contas: true,
      },
    });

    return NextResponse.json(usuarios, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     description: Adiciona um novo usuário ao banco de dados, incluindo seu perfil de configuração e contas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeDeUsuario:
 *                 type: string
 *                 description: Nome de usuário
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *                 example: "johndoe@example.com"
 *               perfilDeConfiguracao:
 *                 type: object
 *                 properties:
 *                   notificacoesAtivadas:
 *                     type: boolean
 *                     description: Ativa ou desativa notificações
 *                     example: true
 *                   moedaPreferida:
 *                     type: string
 *                     description: Moeda preferida
 *                     example: "BRL"
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 *       500:
 *         description: Erro ao criar usuário
 */
export async function POST(request: Request) {
  try {
    const { nomeDeUsuario, email, perfilDeConfiguracao } = await request.json();

    const novoUsuario = await prisma.usuario.create({
      data: {
        nomeDeUsuario,
        email,
        perfilDeConfiguracao: perfilDeConfiguracao
          ? {
              create: perfilDeConfiguracao,
            }
          : undefined,
      },
    });

    return NextResponse.json(novoUsuario, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/usuarios?id={id}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Usuários]
 *     description: Atualiza as informações de um usuário específico.
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: ID do usuário a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeDeUsuario:
 *                 type: string
 *                 description: Nome de usuário
 *                 example: "johnupdated"
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *                 example: "johnupdated@example.com"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: ID do usuário não fornecido
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao atualizar usuário
 */
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID do usuário não fornecido" },
      { status: 400 }
    );
  }

  const { nomeDeUsuario, email } = await request.json();

  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { nomeDeUsuario, email },
    });

    return NextResponse.json(usuarioAtualizado, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/usuarios?id={id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags: [Usuários]
 *     description: Remove um usuário específico do banco de dados.
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: ID do usuário a ser removido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: ID do usuário não fornecido
 *       500:
 *         description: Erro ao remover usuário
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID do usuário não fornecido" },
      { status: 400 }
    );
  }

  try {
    await prisma.usuario.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Usuário removido com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao remover usuário" },
      { status: 500 }
    );
  }
}
