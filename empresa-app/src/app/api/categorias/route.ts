import { NextResponse } from 'next/server';
import prisma from '../../lib/PrismaClient';

/**
 * @swagger
 * tags:
 *   - name: Categorias
 *     description: Operações relacionadas às categorias de transações
 */

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Cria uma nova categoria de transação
 *     tags: [Categorias]
 *     description: Adiciona uma nova categoria de transação ao banco de dados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeDaCategoria:
 *                 type: string
 *                 description: Nome da categoria
 *                 example: "Alimentação"
 *     responses:
 *       200:
 *         description: Categoria criada com sucesso
 *       500:
 *         description: Erro ao criar categoria
 */
export async function POST(request: Request) {
  try {
    const { nomeDaCategoria } = await request.json();

    const novaCategoria = await prisma.categoriaDeTransacao.create({
      data: { nomeDaCategoria },
    });

    return NextResponse.json(novaCategoria, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Lista todas as categorias de transação
 *     tags: [Categorias]
 *     description: Obtém todas as categorias de transação do banco de dados.
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *       500:
 *         description: Erro ao buscar categorias
 */
export async function GET() {
  try {
    const categorias = await prisma.categoriaDeTransacao.findMany();
    return NextResponse.json(categorias, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 });
  }
}
