import { NextResponse } from "next/server";
import prisma from "../../lib/PrismaClient";

/**
 * @swagger
 * tags:
 *   - name: Logs
 *     description: Operações relacionadas aos logs do sistema
 */

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Retorna os logs do sistema
 *     tags: [Logs]
 *     description: Obtém os registros de logs relacionados a alterações ou exclusões feitas no banco de dados.
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Limite de registros retornados
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         required: false
 *         description: Posição inicial para paginação
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de logs retornada com sucesso
 *       500:
 *         description: Erro ao buscar logs
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const logs = await prisma.transacaoLog.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        dataHora: "desc", // Ordenar do mais recente para o mais antigo
      },
    });

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    return NextResponse.json(
      { error: "Erro ao buscar logs" },
      { status: 500 }
    );
  }
}
